import { v4 as uuidv4 } from 'uuid';

// Nota: usuarios y puestos de votación ya viven en MySQL/MariaDB vía Drizzle
// (ver src/db/schema.ts). Este store en memoria queda solo para los módulos
// que aún no se migran (votantes, agenda, tareas — sección 5 de REDTER.md),
// y referencia esos mismos IDs de usuario/puesto para mantener consistencia.

export interface MockVoter {
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

export interface MockEvent {
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

// Data Inicial de Prueba (Colombia) — referencia IDs de usuarios/puestos sembrados en la BD real
export const initialVoters: MockVoter[] = [
  {
    id: 'voter-1',
    cedula: '1019001122',
    nombres: 'Jorge Mario',
    apellidos: 'Valencia Morales',
    telefono: '3015556677',
    whatsapp: '3015556677',
    email: 'jorge.valencia@gmail.com',
    direccion: 'Calle 165 # 8-30',
    barrioVereda: 'Usaquén Centro',
    departamento: 'Cundinamarca',
    municipio: 'Bogotá D.C.',
    puestoVotacionId: 'puesto-1',
    mesa: 1,
    leaderId: 'user-lider-usaquen',
    nivelFidelizacion: 'SEGURO',
    requiereTransporte: true,
    votoAsistido: false,
    observaciones: 'Líder comunitaria del conjunto residencial. Apoya con 10 familiares.',
    votoConfirmadoDiaD: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'voter-2',
    cedula: '52444333',
    nombres: 'María Camila',
    apellidos: 'Torres Benítez',
    telefono: '3124445566',
    whatsapp: '3124445566',
    email: 'camila.torres@outlook.com',
    direccion: 'Cra 15 # 170-45',
    barrioVereda: 'Santa Bárbara',
    departamento: 'Cundinamarca',
    municipio: 'Bogotá D.C.',
    puestoVotacionId: 'puesto-1',
    mesa: 2,
    leaderId: 'user-lider-usaquen',
    nivelFidelizacion: 'SIMPATIZANTE',
    requiereTransporte: false,
    votoAsistido: false,
    observaciones: 'Interesada en propuestas de seguridad y emprendimiento.',
    votoConfirmadoDiaD: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'voter-3',
    cedula: '80123987',
    nombres: 'Hernán Darío',
    apellidos: 'Gómez Jaramillo',
    telefono: '3168889900',
    whatsapp: '3168889900',
    email: 'hernan.gomez@empresa.co',
    direccion: 'Calle 70 # 9-20',
    barrioVereda: 'Chapinero Alto',
    departamento: 'Cundinamarca',
    municipio: 'Bogotá D.C.',
    puestoVotacionId: 'puesto-2',
    mesa: 5,
    leaderId: 'user-coord-bogota',
    nivelFidelizacion: 'INDECISO',
    requiereTransporte: true,
    votoAsistido: true,
    observaciones: 'Adulto mayor. Requiere vehículo adaptado el Día D.',
    votoConfirmadoDiaD: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'voter-4',
    cedula: '1032998877',
    nombres: 'Luisa Fernanda',
    apellidos: 'Rodríguez Silva',
    telefono: '3042223344',
    whatsapp: '3042223344',
    email: 'luisa.rodriguez@gmail.com',
    direccion: 'Cra 43A # 5-10',
    barrioVereda: 'El Poblado',
    departamento: 'Antioquia',
    municipio: 'Medellín',
    puestoVotacionId: 'puesto-3',
    mesa: 12,
    leaderId: 'user-admin',
    nivelFidelizacion: 'SEGURO',
    requiereTransporte: false,
    votoAsistido: false,
    observaciones: 'Coordinadora de movimiento juvenil Medellín.',
    votoConfirmadoDiaD: false,
    createdAt: new Date().toISOString(),
  }
];

export const initialEvents: MockEvent[] = [
  {
    id: 'event-1',
    titulo: 'Gran Gran Encuentro de Líderes por Usaquén',
    descripcion: 'Reunión de alineación estratégica con líderes comunales y capitanes de puesto.',
    tipo: 'REUNION_LIDERES',
    estado: 'PROGRAMADO',
    departamento: 'Cundinamarca',
    municipio: 'Bogotá D.C.',
    barrioVereda: 'Usaquén',
    direccion: 'Salon Comunal Santa Bárbara - Cra 7 # 165',
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
    tipo: 'MITIN_MASIVO',
    estado: 'PROGRAMADO',
    departamento: 'Cundinamarca',
    municipio: 'Bogotá D.C.',
    barrioVereda: 'Usaquén Centro',
    direccion: 'Plaza Principal de Usaquén',
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

  addTask(task: Omit<MockTask, 'id' | 'createdAt'>) {
    const newTask: MockTask = {
      ...task,
      id: `task-${uuidv4().substring(0, 8)}`,
      createdAt: new Date().toISOString(),
    };
    this.tasks.push(newTask);
    return newTask;
  }
}

export const memoryStore = new MemoryStore();
