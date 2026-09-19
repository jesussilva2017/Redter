import { mysqlTable, varchar, int, text, boolean, mysqlEnum, timestamp, json, index, date, decimal } from 'drizzle-orm/mysql-core';

// 0. Departamentos y Municipios DANE (Colombia - Repo vafelu)
export const departamentos = mysqlTable('departamentos', {
  idDepartamento: int('id_departamento').primaryKey(),
  departamento: varchar('departamento', { length: 255 }).notNull(),
});

export const municipios = mysqlTable('municipios', {
  idMunicipio: int('id_municipio').primaryKey(),
  municipio: varchar('municipio', { length: 255 }).notNull(),
  estado: int('estado').default(1).notNull(),
  departamentoId: int('departamento_id').notNull(),
}, (table) => ({
  departamentoIdx: index('idx_municipio_departamento').on(table.departamentoId),
}));

export const barrios = mysqlTable('barrios', {
  idBarrio: int('id_barrio').primaryKey().autoincrement(),
  nombre: varchar('nombre', { length: 100 }).notNull(),
  municipioId: int('municipio_id').notNull(),
  codigoPostal: varchar('codigo_postal', { length: 6 }),
  descripcion: text('descripcion'),
  latitud: decimal('latitud', { precision: 10, scale: 8 }),
  longitud: decimal('longitud', { precision: 11, scale: 8 }),
  estado: int('estado').default(1),
}, (table) => ({
  municipioIdx: index('idx_barrio_municipio_id').on(table.municipioId),
  codigoPostalIdx: index('idx_barrio_codigo_postal').on(table.codigoPostal),
}));

export const veredas = mysqlTable('veredas', {
  idVereda: int('id_vereda').primaryKey().autoincrement(),
  nombre: varchar('nombre', { length: 100 }).notNull(),
  municipioId: int('municipio_id').notNull(),
  codigoDane: varchar('codigo_dane', { length: 10 }),
  areaKm2: decimal('area_km2', { precision: 10, scale: 2 }),
  poblacion: int('poblacion'),
  latitud: decimal('latitud', { precision: 10, scale: 8 }),
  longitud: decimal('longitud', { precision: 11, scale: 8 }),
  descripcion: text('descripcion'),
  estado: int('estado').default(1),
}, (table) => ({
  municipioIdx: index('idx_vereda_municipio_id').on(table.municipioId),
  codigoDaneIdx: index('idx_vereda_codigo_dane').on(table.codigoDane),
}));

// 1. Territorio / Zonas, Puestos y Mesas de Votación (Colombia / Garzón)
export const zonasVotacion = mysqlTable('zonas_votacion', {
  idZona: int('id_zona').primaryKey().autoincrement(),
  numeroZona: int('numero_zona').notNull(),
  nombreZona: varchar('nombre_zona', { length: 100 }).notNull(),
  descripcion: text('descripcion'),
  tipoZona: mysqlEnum('tipo_zona', ['urbana', 'rural', 'especial']).default('urbana'),
  municipioId: int('municipio_id'),
  estado: int('estado').default(1),
}, (table) => ({
  municipioIdx: index('idx_zona_municipio').on(table.municipioId),
}));

export const puestosVotacion = mysqlTable('puestos_votacion', {
  id: varchar('id', { length: 36 }).primaryKey(),
  departamento: varchar('departamento', { length: 100 }).notNull(),
  municipio: varchar('municipio', { length: 100 }).notNull(),
  zona: varchar('zona', { length: 50 }),
  nombrePuesto: varchar('nombre_puesto', { length: 200 }).notNull(),
  direccion: varchar('direccion', { length: 200 }),
  mesasTotales: int('mesas_totales').default(1).notNull(),
  numeroPuesto: int('numero_puesto'),
  institucion: varchar('institucion', { length: 150 }),
  barrioVereda: varchar('barrio_vereda', { length: 100 }),
  idZona: int('id_zona'),
  municipioId: int('municipio_id'),
  latitud: decimal('latitud', { precision: 10, scale: 8 }),
  longitud: decimal('longitud', { precision: 11, scale: 8 }),
  telefono: varchar('telefono', { length: 20 }),
  responsable: varchar('responsable', { length: 100 }),
  totalMesas: int('total_mesas'),
  capacidadVotantes: int('capacidad_votantes'),
  estado: int('estado').default(1),
}, (table) => ({
  geoIdx: index('idx_geo').on(table.departamento, table.municipio),
  zonaIdx: index('idx_puesto_zona').on(table.idZona),
}));

export const mesasVotacion = mysqlTable('mesas_votacion', {
  idMesa: int('id_mesa').primaryKey().autoincrement(),
  numeroMesa: int('numero_mesa').notNull(),
  idPuesto: varchar('id_puesto', { length: 36 }).notNull(),
  idZona: int('id_zona').notNull(),
  municipioId: int('municipio_id'),
  codigoMesa: varchar('codigo_mesa', { length: 20 }),
  numeroPadron: int('numero_padron'),
  capacidadElectores: int('capacidad_electores'),
  juradoPrincipalNombre: varchar('jurado_principal_nombre', { length: 100 }),
  juradoPrincipalCedula: varchar('jurado_principal_cedula', { length: 20 }),
  juradoVicepresidenteNombre: varchar('jurado_vicepresidente_nombre', { length: 100 }),
  juradoVicepresidenteCedula: varchar('jurado_vicepresidente_cedula', { length: 20 }),
  vocal1Nombre: varchar('vocal_1_nombre', { length: 100 }),
  vocal1Cedula: varchar('vocal_1_cedula', { length: 20 }),
  vocal2Nombre: varchar('vocal_2_nombre', { length: 100 }),
  vocal2Cedula: varchar('vocal_2_cedula', { length: 20 }),
  vocal3Nombre: varchar('vocal_3_nombre', { length: 100 }),
  vocal3Cedula: varchar('vocal_3_cedula', { length: 20 }),
  vocal4Nombre: varchar('vocal_4_nombre', { length: 100 }),
  vocal4Cedula: varchar('vocal_4_cedula', { length: 20 }),
  estado: int('estado').default(1),
  fechaCreacion: timestamp('fecha_creacion').defaultNow(),
}, (table) => ({
  puestoIdx: index('idx_mesa_puesto').on(table.idPuesto),
  zonaIdx: index('idx_mesa_zona').on(table.idZona),
  codigoIdx: index('idx_codigo_mesa').on(table.codigoMesa),
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
  tipoDocumento: varchar('tipo_documento', { length: 10 }).default('CC').notNull(),
  cedula: varchar('cedula', { length: 20 }).notNull().unique(), // Número de documento
  nombres: varchar('nombres', { length: 100 }).notNull(),
  apellidos: varchar('apellidos', { length: 100 }).notNull(),
  telefono: varchar('telefono', { length: 20 }),
  whatsapp: varchar('whatsapp', { length: 20 }),
  email: varchar('email', { length: 150 }),
  fechaNacimiento: date('fecha_nacimiento'),
  departamentoNacimiento: varchar('departamento_nacimiento', { length: 100 }),
  ciudadNacimiento: varchar('ciudad_nacimiento', { length: 100 }),
  genero: varchar('genero', { length: 50 }),
  zona: varchar('zona', { length: 50 }).default('Urbana').notNull(), // Urbana / Rural
  direccion: varchar('direccion', { length: 200 }),
  barrioVereda: varchar('barrio_vereda', { length: 100 }),
  nivelEducativo: varchar('nivel_educativo', { length: 100 }),
  ocupacionActual: varchar('ocupacion_actual', { length: 100 }),
  profesionOficio: varchar('profesion_oficio', { length: 150 }),
  empresaLugarTrabajo: varchar('empresa_lugar_trabajo', { length: 150 }),
  departamento: varchar('departamento', { length: 100 }).notNull(),
  municipio: varchar('municipio', { length: 100 }).notNull(),
  zonaElectoral: varchar('zona_electoral', { length: 100 }),
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
  // Seguimiento del Votante
  estadoSeguimiento: mysqlEnum('estado_seguimiento', [
    'PENDIENTE',
    'EN_PROCESO',
    'COMPLETADO',
    'VENCIDO',
    'CANCELADO'
  ]).default('PENDIENTE').notNull(),
  fechaSeguimiento: date('fecha_seguimiento'),
  tipoSeguimiento: varchar('tipo_seguimiento', { length: 50 }).default('Llamada'),
  usuarioResponsableId: varchar('usuario_responsable_id', { length: 36 }),
  observacionesSeguimiento: text('observaciones_seguimiento'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  cedulaIdx: index('idx_voter_cedula').on(table.cedula),
  leaderIdx: index('idx_voter_leader').on(table.leaderId),
  puestoIdx: index('idx_voter_puesto').on(table.puestoVotacionId, table.mesa),
  fidelizacionIdx: index('idx_voter_fidelizacion').on(table.nivelFidelizacion),
  seguimientoIdx: index('idx_voter_seguimiento').on(table.estadoSeguimiento),
}));

// 3.1 Historial de Seguimientos de Votantes
export const voterSeguimientos = mysqlTable('voter_seguimientos', {
  id: varchar('id', { length: 36 }).primaryKey(),
  voterId: varchar('voter_id', { length: 36 }).notNull(),
  usuarioResponsableId: varchar('usuario_responsable_id', { length: 36 }).notNull(),
  tipoSeguimiento: varchar('tipo_seguimiento', { length: 50 }).notNull(),
  estado: mysqlEnum('estado', [
    'PENDIENTE',
    'EN_PROCESO',
    'COMPLETADO',
    'VENCIDO',
    'CANCELADO'
  ]).default('PENDIENTE').notNull(),
  fechaSeguimiento: date('fecha_seguimiento'),
  observaciones: text('observaciones'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  voterIdx: index('idx_seguimiento_voter').on(table.voterId),
  responsableIdx: index('idx_seguimiento_responsable').on(table.usuarioResponsableId),
  estadoIdx: index('idx_seguimiento_estado').on(table.estado),
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

// 4.1 Tabla de Segmentación de Votantes
export const segmentaciones = mysqlTable('segmentaciones', {
  id: varchar('id', { length: 36 }).primaryKey(),
  nombre: varchar('nombre', { length: 150 }).notNull(),
  tipoCriterio: varchar('tipo_criterio', { length: 100 }).default('DEMOGRAFICO'),
  descripcion: text('descripcion'),
  color: varchar('color', { length: 30 }).default('#1e3a8a'),
  filtrosJson: json('filtros_json'),
  createdByUserId: varchar('created_by_user_id', { length: 36 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  criterioIdx: index('idx_segmentacion_criterio').on(table.tipoCriterio),
}));

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
