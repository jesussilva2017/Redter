import { Router } from 'express';
import { memoryStore, MockVoter } from '../../db/mockStore';
import { authenticate, AuthenticatedRequest } from '../../middlewares/auth';
import { v4 as uuidv4 } from 'uuid';

export const votersRouter = Router();

votersRouter.use(authenticate);

// GET /api/v1/voters - Listar y filtrar votantes con scoping estricto
votersRouter.get('/', (req: AuthenticatedRequest, res) => {
  const user = req.user!;
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
  const { search, nivelFidelizacion, requiereTransporte, municipio, puestoId, mesa } = req.query;

  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(v => 
      v.cedula.includes(q) ||
      v.nombres.toLowerCase().includes(q) ||
      v.apellidos.toLowerCase().includes(q) ||
      v.telefono.includes(q)
    );
  }

  if (nivelFidelizacion) {
    list = list.filter(v => v.nivelFidelizacion === nivelFidelizacion);
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
  const transporte = list.filter(v => v.requiereTransporte).length;

  return res.json({
    metrics: { total, seguros, simpatizantes, indecisos, transporte },
    voters: list,
  });
});

// POST /api/v1/voters - Registrar votante 360°
votersRouter.post('/', (req: AuthenticatedRequest, res) => {
  const {
    cedula,
    nombres,
    apellidos,
    telefono,
    whatsapp,
    email,
    direccion,
    barrioVereda,
    departamento,
    municipio,
    puestoVotacionId,
    mesa,
    leaderId,
    nivelFidelizacion,
    requiereTransporte,
    votoAsistido,
    observaciones,
  } = req.body;

  if (!cedula || !nombres || !apellidos) {
    return res.status(400).json({ error: 'Cédula, nombres y apellidos son campos obligatorios.' });
  }

  // Validar duplicado de cédula
  const existing = memoryStore.getVoters().find(v => v.cedula === cedula);
  if (existing) {
    return res.status(400).json({ error: `Ya existe un votante registrado con la cédula ${cedula}.` });
  }

  const assignedLeaderId = req.user?.role === 'LIDER' ? req.user.userId : (leaderId || req.user?.userId || 'user-admin');

  const newVoter = memoryStore.addVoter({
    cedula,
    nombres,
    apellidos,
    telefono: telefono || '',
    whatsapp: whatsapp || telefono || '',
    email: email || '',
    direccion: direccion || '',
    barrioVereda: barrioVereda || '',
    departamento: departamento || 'Cundinamarca',
    municipio: municipio || 'Bogotá D.C.',
    puestoVotacionId: puestoVotacionId || 'puesto-1',
    mesa: mesa ? Number(mesa) : 1,
    leaderId: assignedLeaderId,
    nivelFidelizacion: nivelFidelizacion || 'INDECISO',
    requiereTransporte: Boolean(requiereTransporte),
    votoAsistido: Boolean(votoAsistido),
    observaciones: observaciones || '',
    votoConfirmadoDiaD: false,
  });

  return res.status(201).json({ message: 'Votante registrado exitosamente', voter: newVoter });
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
