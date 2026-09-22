import { v4 as uuidv4 } from 'uuid';

// Nota: usuarios y puestos de votación ya viven en MySQL/MariaDB vía Drizzle
// (ver src/db/schema.ts). Este store en memoria queda solo para los módulos
// que aún no se migran (votantes, agenda, tareas — sección 5 de REDTER.md),
// y referencia esos mismos IDs de usuario/puesto para mantener consistencia.

export interface MockVoter {
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
  estadoSeguimiento?: 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADO' | 'VENCIDO' | 'CANCELADO';
  fechaSeguimiento?: string | null;
  tipoSeguimiento?: string;
  usuarioResponsableId?: string | null;
  observacionesSeguimiento?: string | null;
  createdAt: string;
}

export interface MockEvent {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: string;
  estado: 'PROGRAMADO' | 'COMPLETADO' | 'CANCELADO';
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

export interface MockTask {
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

// Data de votantes sincronizada directamente desde la base de datos MySQL (voters)
export const initialVoters: MockVoter[] = [];

export const initialEvents: MockEvent[] = [
  {
    id: 'event-1',
    titulo: 'Gran Gran Encuentro de Líderes por Usaquén',
    descripcion: 'Reunión de alineación estratégica con líderes comunales y capitanes de puesto.',
    tipo: 'REUNION',
    estado: 'PROGRAMADO',
    departamento: '',
    municipio: '',
    barrioVereda: '',
    direccion: 'Salon Comunal Santa Bárbara - Cra 7 # 165',
    encargado: 'Carlos Rodríguez',
    observaciones: 'Coordinar transporte para líderes de la zona alta de Usaquén.',
    latitude: '4.7456',
    longitude: '-74.0289',
    fechaInicio: new Date(Date.now() + 86400000 * 2).toISOString(), // En 2 días
    fechaFin: new Date(Date.now() + 86400000 * 2 + 7200000).toISOString(),
    organizadorUserId: 'user-lider-usaquen',
    puestoVotacionRelacionadoId: 'puesto-1',
    aforoEstimado: 50,
    asistenciaReal: 38,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'event-2',
    titulo: 'Mitin de Cierre de Campaña Local - Usaquén',
    descripcion: 'Presentación de propuestas del candidato con la comunidad.',
    tipo: 'EVENTO',
    estado: 'PROGRAMADO',
    departamento: '',
    municipio: '',
    barrioVereda: '',
    direccion: 'Plaza Principal de Usaquén',
    encargado: 'María Fernanda Gómez',
    observaciones: 'Requerido permiso de la alcaldía local y sonido profesional.',
    latitude: '4.6978',
    longitude: '-74.0312',
    fechaInicio: new Date(Date.now() + 86400000 * 7).toISOString(),
    fechaFin: new Date(Date.now() + 86400000 * 7 + 10800000).toISOString(),
    organizadorUserId: 'user-admin',
    puestoVotacionRelacionadoId: 'puesto-1',
    aforoEstimado: 300,
    asistenciaReal: 0,
    createdAt: new Date().toISOString(),
  },
];

export const initialTasks: MockTask[] = [
  {
    id: 'task-1',
    titulo: 'Verificar kits de acreditación para Testigos de Mesa 1 a 10',
    descripcion: 'Revisar formularios E-14 de entrenamiento y credenciales firmadas por la Registraduría.',
    prioridad: 'ALTA',
    estado: 'EN_PROCESO',
    asignadoAUserId: 'user-voluntario-1',
    creadoPorUserId: 'user-admin',
    fechaLimite: new Date(Date.now() + 86400000 * 3).toISOString(),
    eventId: 'event-1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    titulo: 'Llamar a votantes que requieren transporte en Usaquén',
    descripcion: 'Confirmar hora de recogida y punto de encuentro con conductores asignados.',
    prioridad: 'URGENTE',
    estado: 'PENDIENTE',
    asignadoAUserId: 'user-lider-usaquen',
    creadoPorUserId: 'user-coord-bogota',
    fechaLimite: new Date(Date.now() + 86400000 * 5).toISOString(),
    createdAt: new Date().toISOString(),
  }
];

// Estado en Memoria
class MemoryStore {
  voters: MockVoter[] = [...initialVoters];
  events: MockEvent[] = [...initialEvents];
  tasks: MockTask[] = [...initialTasks];

  getVoters() { return this.voters; }
  getEvents() { return this.events; }
  getTasks() { return this.tasks; }

  addVoter(voter: Omit<MockVoter, 'id' | 'createdAt'>) {
    const newVoter: MockVoter = {
      ...voter,
      id: `voter-${uuidv4().substring(0, 8)}`,
      createdAt: new Date().toISOString(),
    };
    this.voters.push(newVoter);
    return newVoter;
  }

  updateVoter(id: string, updates: Partial<MockVoter>) {
    const idx = this.voters.findIndex(v => v.id === id);
    if (idx === -1) return null;
    this.voters[idx] = { ...this.voters[idx], ...updates };
    return this.voters[idx];
  }

  addEvent(event: Omit<MockEvent, 'id' | 'createdAt' | 'asistenciaReal'>) {
    const newEvent: MockEvent = {
      ...event,
      id: `event-${uuidv4().substring(0, 8)}`,
      asistenciaReal: 0,
      createdAt: new Date().toISOString(),
    };
    this.events.push(newEvent);
    return newEvent;
  }

  updateEvent(id: string, updates: Partial<MockEvent>) {
    const idx = this.events.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    this.events[idx] = { ...this.events[idx], ...updates };
    return this.events[idx];
  }

  deleteEvent(id: string) {
    const idx = this.events.findIndex((e) => e.id === id);
    if (idx === -1) return false;
    this.events.splice(idx, 1);
    return true;
  }

  addTask(task: Omit<MockTask, 'id' | 'createdAt'>) {
    const newTask: MockTask = {
      ...task,
      id: `task-${uuidv4().substring(0, 8)}`,
      createdAt: new Date().toISOString(),
    };
    this.tasks.push(newTask);
    return newTask;
  }

  updateTask(id: string, updates: Partial<MockTask>) {
    const idx = this.tasks.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    this.tasks[idx] = { ...this.tasks[idx], ...updates };
    return this.tasks[idx];
  }

  deleteTask(id: string) {
    const idx = this.tasks.findIndex((t) => t.id === id);
    if (idx === -1) return false;
    this.tasks.splice(idx, 1);
    return true;
  }
}

export const memoryStore = new MemoryStore();
