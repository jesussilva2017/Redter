import { Router } from 'express';
import { memoryStore, MockVoter } from '../../db/mockStore';
import { authenticate, AuthenticatedRequest } from '../../middlewares/auth';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../db';
import { voters, voterSeguimientos, segmentaciones } from '../../db/schema';
import { eq, desc } from 'drizzle-orm';

export const votersRouter = Router();

votersRouter.use(authenticate);

const safeParseDate = (d: any): string | undefined => {
  if (!d) return undefined;
  if (d instanceof Date) {
    if (isNaN(d.getTime())) return undefined;
    try {
      return d.toISOString().split('T')[0];
    } catch {
      return undefined;
    }
  }
  const str = String(d).trim();
  if (str === 'Invalid Date' || str === 'null' || str === 'undefined' || str === '') return undefined;
  if (str.includes('T')) return str.split('T')[0];
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) return str.substring(0, 10);
  return undefined;
};

// GET /api/v1/voters - Listar y filtrar votantes con scoping estricto
votersRouter.get('/', async (req: AuthenticatedRequest, res) => {
  const user = req.user!;

  try {
    const dbVoters = await db.select().from(voters);
    const mapped: MockVoter[] = dbVoters.map(dv => ({
      id: dv.id,
      tipoDocumento: dv.tipoDocumento || 'CC',
      cedula: dv.cedula,
      nombres: dv.nombres,
      apellidos: dv.apellidos,
      telefono: dv.telefono || '',
      whatsapp: dv.whatsapp || '',
      email: dv.email || '',
      fechaNacimiento: safeParseDate(dv.fechaNacimiento),
      departamentoNacimiento: dv.departamentoNacimiento || '',
      ciudadNacimiento: dv.ciudadNacimiento || '',
      genero: dv.genero || '',
      zona: dv.zona || 'Urbana',
      direccion: dv.direccion || '',
      barrioVereda: dv.barrioVereda || '',
      nivelEducativo: dv.nivelEducativo || '',
      ocupacionActual: dv.ocupacionActual || '',
      profesionOficio: dv.profesionOficio || '',
      empresaLugarTrabajo: dv.empresaLugarTrabajo || '',
      departamento: dv.departamento || 'Huila',
      municipio: dv.municipio || 'Garzón',
      zonaElectoral: dv.zonaElectoral || '',
      puestoVotacionId: dv.puestoVotacionId || '',
      mesa: dv.mesa || 1,
      leaderId: dv.leaderId,
      nivelFidelizacion: (dv.nivelFidelizacion as any) || 'SIMPATIZANTE',
      requiereTransporte: Boolean(dv.requiereTransporte),
      votoAsistido: Boolean(dv.votoAsistido),
      observaciones: dv.observaciones || '',
      votoConfirmadoDiaD: Boolean(dv.votoConfirmadoDiaD),
      horaVotoDiaD: dv.horaVotoDiaD ? String(dv.horaVotoDiaD) : null,
      estadoSeguimiento: (dv.estadoSeguimiento as any) || 'PENDIENTE',
      fechaSeguimiento: safeParseDate(dv.fechaSeguimiento) || null,
      tipoSeguimiento: dv.tipoSeguimiento || 'Llamada',
      usuarioResponsableId: dv.usuarioResponsableId,
      observacionesSeguimiento: dv.observacionesSeguimiento,
      createdAt: safeParseDate(dv.createdAt) || new Date().toISOString(),
    }));
    memoryStore.voters = mapped;
  } catch (err) {
    console.error('Error al sincronizar votantes de MySQL:', err);
  }

  let list = memoryStore.getVoters();

  // 1. Scoping por Rol (ABAC)
  if (user.role === 'LIDER') {
    list = list.filter(v => v.leaderId === user.userId);
  } else if (user.role === 'TESTIGO') {
    // Testigo solo ve votantes de su puesto y mesa asignada
    list = list.filter(v => 
      v.puestoVotacionId === user.puestoAsignadoId && 
      (!user.mesaAsignada || v.mesa === user.mesaAsignada)
    );
  } else if (user.role === 'COORDINADOR') {
    // Coordinador ve los votantes de su municipio asignado o creados por sus líderes subordinados
    if (user.municipioAsignado) {
      list = list.filter(v => v.municipio === user.municipioAsignado);
    }
  }

  // 2. Filtros de búsqueda (Query Params)
  const { search, nivelFidelizacion, estadoSeguimiento, requiereTransporte, municipio, puestoId, mesa } = req.query;

  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(v => 
      v.cedula.includes(q) ||
      v.nombres.toLowerCase().includes(q) ||
      v.apellidos.toLowerCase().includes(q) ||
      v.telefono.includes(q) ||
      (v.profesionOficio && v.profesionOficio.toLowerCase().includes(q)) ||
      (v.ocupacionActual && v.ocupacionActual.toLowerCase().includes(q))
    );
  }

  if (nivelFidelizacion) {
    list = list.filter(v => v.nivelFidelizacion === nivelFidelizacion);
  }

  if (estadoSeguimiento) {
    list = list.filter(v => (v.estadoSeguimiento || 'PENDIENTE') === estadoSeguimiento);
  }

  if (requiereTransporte === 'true') {
    list = list.filter(v => v.requiereTransporte === true);
  }

  if (municipio) {
    list = list.filter(v => v.municipio === municipio);
  }

  if (puestoId) {
    list = list.filter(v => v.puestoVotacionId === puestoId);
  }

  if (mesa) {
    list = list.filter(v => v.mesa === Number(mesa));
  }

  // Métricas agregadas para el resumen ejecutivo
  const total = list.length;
  const seguros = list.filter(v => v.nivelFidelizacion === 'SEGURO').length;
  const simpatizantes = list.filter(v => v.nivelFidelizacion === 'SIMPATIZANTE').length;
  const indecisos = list.filter(v => v.nivelFidelizacion === 'INDECISO').length;
  const pendientes = list.filter(v => (v.estadoSeguimiento || 'PENDIENTE') === 'PENDIENTE').length;
  const enProceso = list.filter(v => v.estadoSeguimiento === 'EN_PROCESO').length;
  const completados = list.filter(v => v.estadoSeguimiento === 'COMPLETADO').length;

  return res.json({
    metrics: { total, seguros, simpatizantes, indecisos, pendientes, enProceso, completados },
    voters: list,
  });
});

// POST /api/v1/voters - Registrar votante 360°
votersRouter.post('/', async (req: AuthenticatedRequest, res) => {
  const {
    tipoDocumento,
    cedula,
    nombres,
    apellidos,
    telefono,
    whatsapp,
    email,
    fechaNacimiento,
    departamentoNacimiento,
    ciudadNacimiento,
    genero,
    zona,
    direccion,
    barrioVereda,
    nivelEducativo,
    ocupacionActual,
    profesionOficio,
    empresaLugarTrabajo,
    departamento,
    municipio,
    zonaElectoral,
    puestoVotacionId,
    mesa,
    leaderId,
    nivelFidelizacion,
    requiereTransporte,
    votoAsistido,
    observaciones,
  } = req.body;

  if (!cedula || !nombres || !apellidos) {
    return res.status(400).json({ error: 'Número de documento, nombres y apellidos son campos obligatorios.' });
  }

  // Validar duplicado de cédula
  const existing = memoryStore.getVoters().find(v => v.cedula === cedula);
  if (existing) {
    return res.status(400).json({ error: `Ya existe un votante registrado con el documento ${cedula}.` });
  }

  // Asignar automáticamente el usuario que está registrando el votante
  const assignedLeaderId = req.user?.userId || leaderId || 'user-admin';

  const newVoter = memoryStore.addVoter({
    tipoDocumento: tipoDocumento || 'CC',
    cedula,
    nombres,
    apellidos,
    telefono: telefono || '',
    whatsapp: whatsapp || telefono || '',
    email: email || '',
    fechaNacimiento: fechaNacimiento || undefined,
    departamentoNacimiento: departamentoNacimiento || '',
    ciudadNacimiento: ciudadNacimiento || '',
    genero: genero || '',
    zona: zona || 'Urbana',
    direccion: direccion || '',
    barrioVereda: barrioVereda || '',
    nivelEducativo: nivelEducativo || '',
    ocupacionActual: ocupacionActual || '',
    profesionOficio: profesionOficio || '',
    empresaLugarTrabajo: empresaLugarTrabajo || '',
    departamento: departamento || 'Cundinamarca',
    municipio: municipio || 'Bogotá D.C.',
    zonaElectoral: zonaElectoral || '',
    puestoVotacionId: puestoVotacionId || 'puesto-1',
    mesa: mesa ? Number(mesa) : 1,
    leaderId: assignedLeaderId,
    nivelFidelizacion: nivelFidelizacion || 'INDECISO',
    requiereTransporte: false,
    votoAsistido: Boolean(votoAsistido),
    observaciones: observaciones || '',
    votoConfirmadoDiaD: false,
  });

  // Guardar de forma sincronizada en la base de datos MySQL
  try {
    await db.insert(voters).values({
      id: newVoter.id,
      tipoDocumento: newVoter.tipoDocumento || 'CC',
      cedula: newVoter.cedula,
      nombres: newVoter.nombres,
      apellidos: newVoter.apellidos,
      telefono: newVoter.telefono,
      whatsapp: newVoter.whatsapp,
      email: newVoter.email,
      fechaNacimiento: newVoter.fechaNacimiento ? (newVoter.fechaNacimiento as any) : null,
      departamentoNacimiento: newVoter.departamentoNacimiento || null,
      ciudadNacimiento: newVoter.ciudadNacimiento || null,
      genero: newVoter.genero || null,
      zona: newVoter.zona || 'Urbana',
      direccion: newVoter.direccion || null,
      barrioVereda: newVoter.barrioVereda || null,
      nivelEducativo: newVoter.nivelEducativo || null,
      ocupacionActual: newVoter.ocupacionActual || null,
      profesionOficio: newVoter.profesionOficio || null,
      empresaLugarTrabajo: newVoter.empresaLugarTrabajo || null,
      departamento: newVoter.departamento || 'Cundinamarca',
      municipio: newVoter.municipio || 'Bogotá D.C.',
      zonaElectoral: newVoter.zonaElectoral || null,
      puestoVotacionId: newVoter.puestoVotacionId || null,
      mesa: newVoter.mesa || 1,
      leaderId: assignedLeaderId,
      nivelFidelizacion: newVoter.nivelFidelizacion || 'INDECISO',
      requiereTransporte: false,
      votoAsistido: false,
      observaciones: newVoter.observaciones || null,
      votoConfirmadoDiaD: false,
    });
  } catch (dbErr) {
    console.warn('Registro en mockStore completado, aviso de sincronización MySQL:', dbErr);
  }

  return res.status(201).json({ message: 'Votante registrado exitosamente', voter: newVoter });
});

// PUT /api/v1/voters/:id - Actualizar votante 360°
votersRouter.put('/:id', async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const {
    tipoDocumento,
    cedula,
    nombres,
    apellidos,
    telefono,
    whatsapp,
    email,
    fechaNacimiento,
    departamentoNacimiento,
    ciudadNacimiento,
    genero,
    zona,
    direccion,
    barrioVereda,
    nivelEducativo,
    ocupacionActual,
    profesionOficio,
    empresaLugarTrabajo,
    departamento,
    municipio,
    zonaElectoral,
    puestoVotacionId,
    mesa,
    leaderId,
    nivelFidelizacion,
    votoAsistido,
    observaciones,
  } = req.body;

  if (!cedula || !nombres || !apellidos) {
    return res.status(400).json({ error: 'Número de documento, nombres y apellidos son campos obligatorios.' });
  }

  // Validar si la cédula ya pertenece a otro votante distinto
  const existingWithSameCedula = memoryStore.getVoters().find(v => v.cedula === cedula && v.id !== id);
  if (existingWithSameCedula) {
    return res.status(400).json({ error: `Ya existe otro votante registrado con el documento ${cedula}.` });
  }

  const updates: Partial<MockVoter> = {
    tipoDocumento: tipoDocumento || 'CC',
    cedula,
    nombres,
    apellidos,
    telefono: telefono || '',
    whatsapp: whatsapp || telefono || '',
    email: email || '',
    fechaNacimiento: fechaNacimiento || undefined,
    departamentoNacimiento: departamentoNacimiento || '',
    ciudadNacimiento: ciudadNacimiento || '',
    genero: genero || '',
    zona: zona || 'Urbana',
    direccion: direccion || '',
    barrioVereda: barrioVereda || '',
    nivelEducativo: nivelEducativo || '',
    ocupacionActual: ocupacionActual || '',
    profesionOficio: profesionOficio || '',
    empresaLugarTrabajo: empresaLugarTrabajo || '',
    departamento: departamento || 'Huila',
    municipio: municipio || 'Garzón',
    zonaElectoral: zonaElectoral || '',
    puestoVotacionId: puestoVotacionId || '',
    mesa: mesa ? Number(mesa) : 1,
    leaderId: leaderId || req.user?.userId || 'user-admin',
    nivelFidelizacion: nivelFidelizacion || 'SIMPATIZANTE',
    votoAsistido: Boolean(votoAsistido),
    observaciones: observaciones || '',
  };

  const updatedInStore = memoryStore.updateVoter(id, updates);

  // Sincronizar en base de datos MySQL
  try {
    await db.update(voters).set({
      tipoDocumento: updates.tipoDocumento,
      cedula: updates.cedula,
      nombres: updates.nombres,
      apellidos: updates.apellidos,
      telefono: updates.telefono,
      whatsapp: updates.whatsapp,
      email: updates.email,
      fechaNacimiento: updates.fechaNacimiento ? (updates.fechaNacimiento as any) : null,
      departamentoNacimiento: updates.departamentoNacimiento || null,
      ciudadNacimiento: updates.ciudadNacimiento || null,
      genero: updates.genero || null,
      zona: updates.zona || 'Urbana',
      direccion: updates.direccion || null,
      barrioVereda: updates.barrioVereda || null,
      nivelEducativo: updates.nivelEducativo || null,
      ocupacionActual: updates.ocupacionActual || null,
      profesionOficio: updates.profesionOficio || null,
      empresaLugarTrabajo: updates.empresaLugarTrabajo || null,
      departamento: updates.departamento || 'Huila',
      municipio: updates.municipio || 'Garzón',
      zonaElectoral: updates.zonaElectoral || null,
      puestoVotacionId: updates.puestoVotacionId || null,
      mesa: updates.mesa || 1,
      leaderId: updates.leaderId,
      nivelFidelizacion: updates.nivelFidelizacion,
      votoAsistido: updates.votoAsistido,
      observaciones: updates.observaciones || null,
    }).where(eq(voters.id, id));
  } catch (dbErr) {
    console.warn('Actualización en mockStore completada, aviso de sincronización MySQL:', dbErr);
  }

  return res.json({ message: 'Votante actualizado exitosamente', voter: updatedInStore });
});

// PATCH /api/v1/voters/:id/confirm-vote - Marcar voto confirmado en el Día D
votersRouter.patch('/:id/confirm-vote', (req: AuthenticatedRequest, res) => {
  const voter = memoryStore.getVoters().find(v => v.id === req.params.id);
  if (!voter) {
    return res.status(404).json({ error: 'Votante no encontrado' });
  }

  voter.votoConfirmadoDiaD = true;
  voter.horaVotoDiaD = new Date().toISOString();

  return res.json({ message: 'Voto confirmado exitosamente en el Día D', voter });
});

// POST /api/v1/voters/:id/seguimiento - Registrar acción de seguimiento
votersRouter.post('/:id/seguimiento', async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { usuarioResponsableId, fechaSeguimiento, tipoSeguimiento, estado, observaciones } = req.body;

  const responsableId = usuarioResponsableId || req.user!.userId;
  const estadoVal = estado || 'PENDIENTE';
  const tipoVal = tipoSeguimiento || 'Llamada';
  const fechaVal = fechaSeguimiento || null;
  const obsVal = observaciones || '';

  const seguimientoId = uuidv4();

  // 1. Guardar en memoria (mockStore)
  const voter = memoryStore.getVoters().find(v => v.id === id);
  if (voter) {
    voter.estadoSeguimiento = estadoVal;
    voter.fechaSeguimiento = fechaVal;
    voter.tipoSeguimiento = tipoVal;
    voter.usuarioResponsableId = responsableId;
    voter.observacionesSeguimiento = obsVal;
  }

  // 2. Guardar en MySQL de forma persistente
  try {
    await db.insert(voterSeguimientos).values({
      id: seguimientoId,
      voterId: id,
      usuarioResponsableId: responsableId,
      tipoSeguimiento: tipoVal,
      estado: estadoVal as any,
      fechaSeguimiento: fechaVal ? (fechaVal as any) : null,
      observaciones: obsVal,
    });

    await db.update(voters).set({
      estadoSeguimiento: estadoVal as any,
      fechaSeguimiento: fechaVal ? (fechaVal as any) : null,
      tipoSeguimiento: tipoVal,
      usuarioResponsableId: responsableId,
      observacionesSeguimiento: obsVal,
    }).where(eq(voters.id, id));
  } catch (err) {
    console.warn('Advertencia al persistir seguimiento en MySQL:', err);
  }

  return res.json({
    message: 'Seguimiento registrado exitosamente',
    seguimiento: {
      id: seguimientoId,
      voterId: id,
      usuarioResponsableId: responsableId,
      tipoSeguimiento: tipoVal,
      estado: estadoVal,
      fechaSeguimiento: fechaVal,
      observaciones: obsVal,
      createdAt: new Date().toISOString(),
    },
    voter,
  });
});

// GET /api/v1/voters/:id/seguimientos - Listar historial de seguimientos
votersRouter.get('/:id/seguimientos', async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  try {
    const list = await db
      .select()
      .from(voterSeguimientos)
      .where(eq(voterSeguimientos.voterId, id))
      .orderBy(desc(voterSeguimientos.createdAt));

    return res.json({ seguimientos: list });
  } catch (err) {
    console.warn('Fallback de historial de seguimientos:', err);
    return res.json({ seguimientos: [] });
  }
});
