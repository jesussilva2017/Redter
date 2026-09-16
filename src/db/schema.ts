import { mysqlTable, varchar, int, text, boolean, mysqlEnum, timestamp, json, index } from 'drizzle-orm/mysql-core';

// 1. Territorio / Puestos de Votación (Colombia)
export const puestosVotacion = mysqlTable('puestos_votacion', {
  id: varchar('id', { length: 36 }).primaryKey(),
  departamento: varchar('departamento', { length: 100 }).notNull(),
  municipio: varchar('municipio', { length: 100 }).notNull(),
  zona: varchar('zona', { length: 50 }),
  nombrePuesto: varchar('nombre_puesto', { length: 200 }).notNull(),
  direccion: varchar('direccion', { length: 200 }),
  mesasTotales: int('mesas_totales').default(1).notNull(),
}, (table) => ({
  geoIdx: index('idx_geo').on(table.departamento, table.municipio),
}));

// 2. Usuarios y Roles (RBAC / ABAC)
export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(),
  nombre: varchar('nombre', { length: 150 }).notNull(),
  email: varchar('email', { length: 150 }).notNull().unique(),
  cedula: varchar('cedula', { length: 20 }).unique(),
  telefono: varchar('telefono', { length: 20 }),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: mysqlEnum('role', [
    'SUPER_ADMIN',
    'ADMIN_CAMPANA',
    'COORDINADOR',
    'LIDER',
    'TESTIGO',
    'VOLUNTARIO'
  ]).notNull(),
  parentLeaderId: varchar('parent_leader_id', { length: 36 }),
  departamentoAsignado: varchar('departamento_asignado', { length: 100 }),
  municipioAsignado: varchar('municipio_asignado', { length: 100 }),
  puestoAsignadoId: varchar('puesto_asignado_id', { length: 36 }),
  mesaAsignada: int('mesa_asignada'),
  activo: boolean('activo').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  roleIdx: index('idx_user_role').on(table.role),
  parentIdx: index('idx_user_parent').on(table.parentLeaderId),
}));

// 3. CRM de Votantes
export const voters = mysqlTable('voters', {
  id: varchar('id', { length: 36 }).primaryKey(),
  cedula: varchar('cedula', { length: 20 }).notNull().unique(),
  nombres: varchar('nombres', { length: 100 }).notNull(),
  apellidos: varchar('apellidos', { length: 100 }).notNull(),
  telefono: varchar('telefono', { length: 20 }),
  whatsapp: varchar('whatsapp', { length: 20 }),
  email: varchar('email', { length: 150 }),
  direccion: varchar('direccion', { length: 200 }),
  barrioVereda: varchar('barrio_vereda', { length: 100 }),
  departamento: varchar('departamento', { length: 100 }).notNull(),
  municipio: varchar('municipio', { length: 100 }).notNull(),
  puestoVotacionId: varchar('puesto_votacion_id', { length: 36 }),
  mesa: int('mesa'),
  leaderId: varchar('leader_id', { length: 36 }).notNull(), // Asignado a un Líder o Coordinador
  nivelFidelizacion: mysqlEnum('nivel_fidelizacion', [
    'SEGURO',
    'SIMPATIZANTE',
    'INDECISO',
    'OPOSITOR'
  ]).default('INDECISO').notNull(),
  requiereTransporte: boolean('requiere_transporte').default(false).notNull(),
  votoAsistido: boolean('voto_asistido').default(false).notNull(),
  observaciones: text('observaciones'),
  votoConfirmadoDiaD: boolean('voto_confirmado_dia_d').default(false).notNull(),
  horaVotoDiaD: timestamp('hora_voto_dia_d'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  cedulaIdx: index('idx_voter_cedula').on(table.cedula),
  leaderIdx: index('idx_voter_leader').on(table.leaderId),
  puestoIdx: index('idx_voter_puesto').on(table.puestoVotacionId, table.mesa),
  fidelizacionIdx: index('idx_voter_fidelizacion').on(table.nivelFidelizacion),
}));

// 4. Segmentos Dinámicos
export const segments = mysqlTable('segments', {
  id: varchar('id', { length: 36 }).primaryKey(),
  nombre: varchar('nombre', { length: 150 }).notNull(),
  descripcion: text('descripcion'),
  filtrosJson: json('filtros_json').notNull(),
  createdByUserId: varchar('created_by_user_id', { length: 36 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 5. Agenda y Eventos Políticas
export const events = mysqlTable('events', {
  id: varchar('id', { length: 36 }).primaryKey(),
  titulo: varchar('titulo', { length: 200 }).notNull(),
  descripcion: text('descripcion'),
  tipo: mysqlEnum('tipo', [
    'REUNION_LIDERES',
    'EVENTO_BARRIAL',
    'MITIN_MASIVO',
    'CANVASSING',
    'CAPACITACION',
    'TAREA_LOGISTICA'
  ]).notNull(),
  estado: mysqlEnum('estado', [
    'PROGRAMADO',
    'EN_PROCESO',
    'COMPLETADO',
    'CANCELADO'
  ]).default('PROGRAMADO').notNull(),
  departamento: varchar('departamento', { length: 100 }).notNull(),
  municipio: varchar('municipio', { length: 100 }).notNull(),
  barrioVereda: varchar('barrio_vereda', { length: 100 }),
  direccion: varchar('direccion', { length: 200 }),
  latitude: varchar('latitude', { length: 50 }),
  longitude: varchar('longitude', { length: 50 }),
  fechaInicio: timestamp('fecha_inicio').notNull(),
  fechaFin: timestamp('fecha_fin').notNull(),
  organizadorUserId: varchar('organizador_user_id', { length: 36 }).notNull(),
  puestoVotacionRelacionadoId: varchar('puesto_votacion_relacionado_id', { length: 36 }),
  aforoEstimado: int('aforo_estimado').default(0).notNull(),
  asistenciaReal: int('asistencia_real').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  fechaIdx: index('idx_event_fecha').on(table.fechaInicio),
  lugarIdx: index('idx_event_lugar').on(table.municipio, table.barrioVereda),
}));

// 6. Asistentes a Eventos (Check-in / RSVP)
export const eventAttendees = mysqlTable('event_attendees', {
  id: varchar('id', { length: 36 }).primaryKey(),
  eventId: varchar('event_id', { length: 36 }).notNull(),
  voterId: varchar('voter_id', { length: 36 }).notNull(),
  confirmadoRsvp: boolean('confirmado_rsvp').default(false).notNull(),
  asistioCheckin: boolean('asistio_checkin').default(false).notNull(),
  horaCheckin: timestamp('hora_checkin'),
  registradoPorUserId: varchar('registrado_por_user_id', { length: 36 }),
}, (table) => ({
  eventVoterIdx: index('idx_event_voter').on(table.eventId, table.voterId),
}));

// 7. Tareas de Campaña
export const campaignTasks = mysqlTable('campaign_tasks', {
  id: varchar('id', { length: 36 }).primaryKey(),
  titulo: varchar('titulo', { length: 200 }).notNull(),
  descripcion: text('descripcion'),
  prioridad: mysqlEnum('prioridad', ['BAJA', 'MEDIA', 'ALTA', 'URGENTE']).default('MEDIA').notNull(),
  estado: mysqlEnum('estado', ['PENDIENTE', 'EN_PROCESO', 'COMPLETADA', 'CANCELADA']).default('PENDIENTE').notNull(),
  asignadoAUserId: varchar('asignado_a_user_id', { length: 36 }).notNull(),
  creadoPorUserId: varchar('creado_por_user_id', { length: 36 }).notNull(),
  fechaLimite: timestamp('fecha_limite'),
  eventId: varchar('event_id', { length: 36 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  asignadoIdx: index('idx_task_asignado').on(table.asignadoAUserId),
}));
