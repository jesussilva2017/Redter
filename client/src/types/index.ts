export type UserRole = 'SUPER_ADMIN' | 'ADMIN_CAMPANA' | 'COORDINADOR' | 'LIDER' | 'TESTIGO' | 'VOLUNTARIO';

export interface User {
  id: string;
  nombre: string;
  email: string;
  cedula: string;
  telefono?: string;
  role: UserRole;
  parentLeaderId?: string | null;
  departamentoAsignado?: string | null;
  municipioAsignado?: string | null;
  puestoAsignadoId?: string | null;
  mesaAsignada?: number | null;
  activo: boolean;
  createdAt: string;
}

export interface Voter {
  id: string;
  cedula: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  whatsapp: string;
  email: string;
  direccion: string;
  barrioVereda: string;
  departamento: string;
  municipio: string;
  puestoVotacionId: string;
  mesa: number;
  leaderId: string;
  nivelFidelizacion: 'SEGURO' | 'SIMPATIZANTE' | 'INDECISO' | 'OPOSITOR';
  requiereTransporte: boolean;
  votoAsistido: boolean;
  observaciones: string;
  votoConfirmadoDiaD: boolean;
  horaVotoDiaD?: string | null;
  createdAt: string;
}

export interface Puesto {
  id: string;
  departamento: string;
  municipio: string;
  zona: string;
  nombrePuesto: string;
  direccion: string;
  mesasTotales: number;
}

export interface CampaignEvent {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: 'REUNION_LIDERES' | 'EVENTO_BARRIAL' | 'MITIN_MASIVO' | 'CANVASSING' | 'CAPACITACION' | 'TAREA_LOGISTICA';
  estado: 'PROGRAMADO' | 'EN_PROCESO' | 'COMPLETADO' | 'CANCELADO';
  departamento: string;
  municipio: string;
  barrioVereda: string;
  direccion: string;
  latitude?: string;
  longitude?: string;
  fechaInicio: string;
  fechaFin: string;
  organizadorUserId: string;
  puestoVotacionRelacionadoId?: string;
  aforoEstimado: number;
  asistenciaReal: number;
  createdAt: string;
}

export interface CampaignTask {
  id: string;
  titulo: string;
  descripcion: string;
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';
  estado: 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADA' | 'CANCELADA';
  asignadoAUserId: string;
  creadoPorUserId: string;
  fechaLimite?: string;
  eventId?: string;
  createdAt: string;
}
