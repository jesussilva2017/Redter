import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { memoryStore } from '../../db/mockStore';
import { authenticate, AuthenticatedRequest } from '../../middlewares/auth';
import { db } from '../../db';
import { events as eventsTable, campaignTasks as tasksTable } from '../../db/schema';
import { eq } from 'drizzle-orm';

export const eventsRouter = Router();

eventsRouter.use(authenticate);

// Helper para convertir fecha a objeto Date respetando la zona horaria de Colombia (-05:00)
const parseDateToDb = (dateVal?: string | Date | null): Date | null => {
  if (!dateVal) return null;
  if (dateVal instanceof Date) return dateVal;
  if (typeof dateVal === 'string') {
    // Si viene en formato "YYYY-MM-DDTHH:mm" sin offset ni Z, asumir zona horaria de Colombia (-05:00)
    if (/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2})?$/.test(dateVal)) {
      return new Date(dateVal.replace(' ', 'T') + '-05:00');
    }
    return new Date(dateVal);
  }
  return new Date();
};

// GET /api/v1/events - Listar eventos de la campaña
eventsRouter.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    const dbEvents = await db.select().from(eventsTable);
    if (dbEvents && dbEvents.length > 0) {
      const formatted = dbEvents.map((e) => ({
        ...e,
        fechaInicio: e.fechaInicio ? new Date(e.fechaInicio).toISOString() : new Date().toISOString(),
        fechaFin: e.fechaFin ? new Date(e.fechaFin).toISOString() : new Date().toISOString(),
        createdAt: e.createdAt ? new Date(e.createdAt).toISOString() : new Date().toISOString(),
      }));
      return res.json({ events: formatted });
    }
  } catch (err) {
    // Si la DB falla o está vacía, usar store en memoria
  }

  const events = memoryStore.getEvents();
  return res.json({ events });
});

// POST /api/v1/events - Crear nuevo evento / reunión
eventsRouter.post('/', async (req: AuthenticatedRequest, res) => {
  const {
    titulo,
    descripcion,
    tipo,
    estado,
    departamento,
    municipio,
    barrioVereda,
    direccion,
    encargado,
    latitude,
    longitude,
    fechaInicio,
    fechaFin,
    observaciones,
    puestoVotacionRelacionadoId,
    aforoEstimado,
  } = req.body;

  if (!titulo || !tipo || !fechaInicio || !fechaFin) {
    return res.status(400).json({ error: 'Título, tipo, fecha de inicio y fecha fin son requeridos.' });
  }

  const newId = `event-${uuidv4().substring(0, 8)}`;
  const fechaInicioDate = parseDateToDb(fechaInicio) || new Date();
  const fechaFinDate = parseDateToDb(fechaFin) || new Date(fechaInicioDate.getTime() + 7200000);

  const eventPayload = {
    id: newId,
    titulo,
    descripcion: descripcion || '',
    tipo,
    estado: ((estado as any) || 'PROGRAMADO') as 'PROGRAMADO' | 'COMPLETADO' | 'CANCELADO',
    departamento: departamento || '',
    municipio: municipio || '',
    barrioVereda: barrioVereda || '',
    direccion: direccion || '',
    encargado: encargado || '',
    latitude: latitude || '',
    longitude: longitude || '',
    fechaInicio: fechaInicioDate,
    fechaFin: fechaFinDate,
    observaciones: observaciones || '',
    organizadorUserId: req.user!.userId,
    puestoVotacionRelacionadoId: puestoVotacionRelacionadoId || null,
    aforoEstimado: aforoEstimado ? Number(aforoEstimado) : 0,
    asistenciaReal: 0,
  };

  // Guardar en MySQL si está disponible
  try {
    await db.insert(eventsTable).values(eventPayload);
  } catch (err) {
    console.error('Error insertando evento en DB, guardando en memoria:', err);
  }

  // Guardar en store en memoria para sincronización
  const newEventMemory = memoryStore.addEvent({
    titulo,
    descripcion: descripcion || '',
    tipo,
    estado: (estado as any) || 'PROGRAMADO',
    departamento: departamento || '',
    municipio: municipio || '',
    barrioVereda: barrioVereda || '',
    direccion: direccion || '',
    encargado: encargado || '',
    latitude: latitude || '',
    longitude: longitude || '',
    fechaInicio: fechaInicioDate.toISOString(),
    fechaFin: fechaFinDate.toISOString(),
    observaciones: observaciones || '',
    organizadorUserId: req.user!.userId,
    puestoVotacionRelacionadoId,
    aforoEstimado: aforoEstimado ? Number(aforoEstimado) : 0,
  });

  return res.status(201).json({
    message: 'Evento agendado exitosamente',
    event: {
      ...eventPayload,
      fechaInicio: fechaInicioDate.toISOString(),
      fechaFin: fechaFinDate.toISOString(),
    },
  });
});

// PUT /api/v1/events/:id - Editar evento / reunión
eventsRouter.put('/:id', async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const {
    titulo,
    descripcion,
    tipo,
    estado,
    departamento,
    municipio,
    barrioVereda,
    direccion,
    encargado,
    latitude,
    longitude,
    fechaInicio,
    fechaFin,
    observaciones,
    aforoEstimado,
  } = req.body;

  const fechaInicioDate = fechaInicio ? parseDateToDb(fechaInicio) : undefined;
  const fechaFinDate = fechaFin ? parseDateToDb(fechaFin) : undefined;

  try {
    await db.update(eventsTable)
      .set({
        ...(titulo && { titulo }),
        ...(descripcion !== undefined && { descripcion }),
        ...(tipo && { tipo }),
        ...(estado && { estado: estado as any }),
        ...(departamento && { departamento }),
        ...(municipio && { municipio }),
        ...(barrioVereda !== undefined && { barrioVereda }),
        ...(direccion !== undefined && { direccion }),
        ...(encargado !== undefined && { encargado }),
        ...(latitude !== undefined && { latitude }),
        ...(longitude !== undefined && { longitude }),
        ...(fechaInicioDate && { fechaInicio: fechaInicioDate }),
        ...(fechaFinDate && { fechaFin: fechaFinDate }),
        ...(observaciones !== undefined && { observaciones }),
        ...(aforoEstimado !== undefined && { aforoEstimado: Number(aforoEstimado) }),
      })
      .where(eq(eventsTable.id, id));
  } catch (err) {
    console.error('Error actualizando evento en DB:', err);
  }

  try {
    const [updatedDb] = await db.select().from(eventsTable).where(eq(eventsTable.id, id)).limit(1);
    if (updatedDb) {
      const formatted = {
        ...updatedDb,
        fechaInicio: updatedDb.fechaInicio ? new Date(updatedDb.fechaInicio).toISOString() : '',
        fechaFin: updatedDb.fechaFin ? new Date(updatedDb.fechaFin).toISOString() : '',
      };
      memoryStore.updateEvent(id, formatted as any);
      return res.json({ message: 'Evento actualizado exitosamente', event: formatted });
    }
  } catch (err) {
    // fallback
  }

  const updated = memoryStore.updateEvent(id, req.body);
  return res.json({ message: 'Evento actualizado exitosamente', event: updated || req.body });
});

// DELETE /api/v1/events/:id - Eliminar evento / reunión (Solo Admin Campaña / Super Admin)
eventsRouter.delete('/:id', async (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  if (user.role !== 'ADMIN_CAMPANA' && user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Solo el usuario Admin Campaña tiene permiso para eliminar contenido de la agenda y eventos.' });
  }

  const { id } = req.params;

  try {
    await db.delete(eventsTable).where(eq(eventsTable.id, id));
  } catch (err) {
    console.error('Error eliminando evento en DB:', err);
  }

  memoryStore.deleteEvent(id);
  return res.json({ message: 'Evento eliminado exitosamente' });
});

// GET /api/v1/events/tasks/all - Listar tareas de campaña
eventsRouter.get('/tasks/all', async (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  try {
    const dbTasks = await db.select().from(tasksTable);
    if (dbTasks && dbTasks.length > 0) {
      let filtered = dbTasks.map(t => ({
        ...t,
        fechaLimite: t.fechaLimite ? new Date(t.fechaLimite).toISOString() : undefined,
        createdAt: t.createdAt ? new Date(t.createdAt).toISOString() : new Date().toISOString(),
      }));
      if (user.role === 'VOLUNTARIO') {
        filtered = filtered.filter(t => t.asignadoAUserId === user.userId);
      }
      return res.json({ tasks: filtered });
    }
  } catch (err) {
    // Usar store en memoria si la DB no responde
  }

  let tasks = memoryStore.getTasks();
  if (user.role === 'VOLUNTARIO') {
    tasks = tasks.filter(t => t.asignadoAUserId === user.userId);
  }

  return res.json({ tasks });
});

// POST /api/v1/events/tasks/all - Crear tarea logística
eventsRouter.post('/tasks/all', async (req: AuthenticatedRequest, res) => {
  const { titulo, descripcion, prioridad, asignadoAUserId, fechaLimite, eventId } = req.body;

  if (!titulo || !asignadoAUserId) {
    return res.status(400).json({ error: 'Título y usuario asignado son obligatorios.' });
  }

  const newTaskId = `task-${uuidv4().substring(0, 8)}`;
  const taskPayload = {
    id: newTaskId,
    titulo,
    descripcion: descripcion || '',
    prioridad: (prioridad || 'MEDIA') as 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE',
    estado: 'PENDIENTE' as const,
    asignadoAUserId,
    creadoPorUserId: req.user!.userId,
    fechaLimite: fechaLimite ? parseDateToDb(fechaLimite) : null,
    eventId: eventId || null,
  };

  try {
    await db.insert(tasksTable).values(taskPayload);
  } catch (err) {
    console.error('Error insertando tarea en DB:', err);
  }

  const newTask = memoryStore.addTask({
    titulo,
    descripcion: descripcion || '',
    prioridad: prioridad || 'MEDIA',
    estado: 'PENDIENTE',
    asignadoAUserId,
    creadoPorUserId: req.user!.userId,
    fechaLimite,
    eventId,
  });

  return res.status(201).json({ message: 'Tarea creada exitosamente', task: newTask });
});

// PATCH /api/v1/events/tasks/all/:id - Cambiar estado de tarea
eventsRouter.patch('/tasks/all/:id', async (req: AuthenticatedRequest, res) => {
  const { estado } = req.body;
  const { id } = req.params;

  try {
    await db.update(tasksTable)
      .set({ estado })
      .where(eq(tasksTable.id, id));
  } catch (err) {
    console.error('Error actualizando estado de tarea en DB:', err);
  }

  const task = memoryStore.getTasks().find(t => t.id === id);
  if (task && estado) {
    task.estado = estado;
  }

  return res.json({ message: 'Tarea actualizada exitosamente', task });
});

// PUT /api/v1/events/tasks/all/:id - Editar tarea logística
eventsRouter.put('/tasks/all/:id', async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { titulo, descripcion, prioridad, asignadoAUserId, fechaLimite, estado, eventId } = req.body;

  try {
    await db.update(tasksTable)
      .set({
        ...(titulo && { titulo }),
        ...(descripcion !== undefined && { descripcion }),
        ...(prioridad && { prioridad }),
        ...(estado && { estado }),
        ...(asignadoAUserId && { asignadoAUserId }),
        ...(fechaLimite !== undefined && { fechaLimite: fechaLimite ? parseDateToDb(fechaLimite) : null }),
        ...(eventId !== undefined && { eventId: eventId || null }),
      })
      .where(eq(tasksTable.id, id));
  } catch (err) {
    console.error('Error actualizando tarea en DB:', err);
  }

  const updated = memoryStore.updateTask(id, req.body);
  return res.json({ message: 'Tarea actualizada exitosamente', task: updated || req.body });
});

// DELETE /api/v1/events/tasks/all/:id - Eliminar tarea logística (Solo Admin Campaña / Super Admin)
eventsRouter.delete('/tasks/all/:id', async (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  if (user.role !== 'ADMIN_CAMPANA' && user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Solo el usuario Admin Campaña tiene permiso para eliminar tareas logísticas.' });
  }

  const { id } = req.params;

  try {
    await db.delete(tasksTable).where(eq(tasksTable.id, id));
  } catch (err) {
    console.error('Error eliminando tarea en DB:', err);
  }

  memoryStore.deleteTask(id);
  return res.json({ message: 'Tarea eliminada exitosamente' });
});
