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

export type EstadoSeguimiento = 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADO' | 'VENCIDO' | 'CANCELADO';
export type TipoSeguimiento = 'Llamada' | 'WhatsApp' | 'Visita' | 'Reunión' | 'Evento' | 'Correo';

export interface Voter {
  id: string;
  tipoDocumento?: string;
  cedula: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  whatsapp: string;
  email: string;
  fechaNacimiento?: string;
  departamentoNacimiento?: string;
  ciudadNacimiento?: string;
  genero?: string;
  zona?: string;
  direccion: string;
  barrioVereda: string;
  nivelEducativo?: string;
  ocupacionActual?: string;
  profesionOficio?: string;
  empresaLugarTrabajo?: string;
  departamento: string;
  municipio: string;
  zonaElectoral?: string;
  puestoVotacionId: string;
  mesa: number;
  leaderId: string;
  nivelFidelizacion: 'SEGURO' | 'SIMPATIZANTE' | 'INDECISO' | 'OPOSITOR';
  requiereTransporte: boolean;
  votoAsistido: boolean;
  observaciones: string;
  votoConfirmadoDiaD: boolean;
  horaVotoDiaD?: string | null;
  // Seguimiento
  estadoSeguimiento?: EstadoSeguimiento;
  fechaSeguimiento?: string | null;
  tipoSeguimiento?: TipoSeguimiento | string;
  usuarioResponsableId?: string | null;
  observacionesSeguimiento?: string | null;
  createdAt: string;
}

export interface VoterSeguimiento {
  id: string;
  voterId: string;
  usuarioResponsableId: string;
  tipoSeguimiento: TipoSeguimiento | string;
  estado: EstadoSeguimiento;
  fechaSeguimiento?: string | null;
  observaciones?: string | null;
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
  numeroPuesto?: number;
  institucion?: string;
  barrioVereda?: string;
  idZona?: number;
  municipioId?: number;
  latitud?: string | number;
  longitud?: string | number;
  telefono?: string;
  responsable?: string;
  totalMesas?: number;
  capacidadVotantes?: number;
}

export interface ZonaVotacion {
  id: number;
  numero: number;
  nombre: string;
  descripcion?: string;
  tipo?: 'urbana' | 'rural' | 'especial';
}

export interface MesaVotacion {
  id: number;
  numero: number;
  puestoId: string;
  zonaId: number;
  codigo: string;
  numeroPadron?: number;
  capacidadElectores?: number;
}

export interface CampaignEvent {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: string;
  estado: 'PROGRAMADO' | 'EN_PROCESO' | 'COMPLETADO' | 'CANCELADO';
  departamento: string;
  municipio: string;
  barrioVereda: string;
  direccion: string;
  encargado?: string;
  latitude?: string;
  longitude?: string;
  fechaInicio: string;
  fechaFin: string;
  observaciones?: string;
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
