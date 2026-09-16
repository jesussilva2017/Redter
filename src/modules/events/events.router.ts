import { Router } from 'express';
import { memoryStore } from '../../db/mockStore';
import { authenticate, AuthenticatedRequest } from '../../middlewares/auth';

export const eventsRouter = Router();

eventsRouter.use(authenticate);

// GET /api/v1/events - Listar eventos de la campaña
eventsRouter.get('/', (req: AuthenticatedRequest, res) => {
  const events = memoryStore.getEvents();
  return res.json({ events });
});

// POST /api/v1/events - Crear nuevo evento / reunión
eventsRouter.post('/', (req: AuthenticatedRequest, res) => {
  const {
    titulo,
    descripcion,
    tipo,
    departamento,
    municipio,
    barrioVereda,
    direccion,
    latitude,
    longitude,
    fechaInicio,
    fechaFin,
    puestoVotacionRelacionadoId,
    aforoEstimado,
  } = req.body;

  if (!titulo || !tipo || !fechaInicio || !fechaFin) {
    return res.status(400).json({ error: 'Título, tipo, fecha de inicio y fecha fin son requeridos.' });
  }

  const newEvent = memoryStore.addEvent({
    titulo,
    descripcion: descripcion || '',
    tipo,
    estado: 'PROGRAMADO',
    departamento: departamento || 'Cundinamarca',
    municipio: municipio || 'Bogotá D.C.',
    barrioVereda: barrioVereda || '',
    direccion: direccion || '',
    latitude: latitude || '',
    longitude: longitude || '',
    fechaInicio,
    fechaFin,
    organizadorUserId: req.user!.userId,
    puestoVotacionRelacionadoId,
    aforoEstimado: aforoEstimado ? Number(aforoEstimado) : 0,
  });

  return res.status(201).json({ message: 'Evento agendado exitosamente', event: newEvent });
});

// GET /api/v1/events/tasks - Listar tareas de campaña
eventsRouter.get('/tasks/all', (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  let tasks = memoryStore.getTasks();

  if (user.role === 'VOLUNTARIO') {
    tasks = tasks.filter(t => t.asignadoAUserId === user.userId);
  }

  return res.json({ tasks });
});

// POST /api/v1/events/tasks - Crear tarea logística
eventsRouter.post('/tasks/all', (req: AuthenticatedRequest, res) => {
  const { titulo, descripcion, prioridad, asignadoAUserId, fechaLimite, eventId } = req.body;

  if (!titulo || !asignadoAUserId) {
    return res.status(400).json({ error: 'Título y usuario asignado son obligatorios.' });
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

// PATCH /api/v1/events/tasks/:id - Cambiar estado de tarea
eventsRouter.patch('/tasks/all/:id', (req: AuthenticatedRequest, res) => {
  const { estado } = req.body;
  const task = memoryStore.getTasks().find(t => t.id === req.params.id);

  if (!task) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }

  if (estado) {
    task.estado = estado;
  }

  return res.json({ message: 'Tarea actualizada exitosamente', task });
});
