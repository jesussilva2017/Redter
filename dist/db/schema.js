"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.campaignTasks = exports.eventAttendees = exports.events = exports.segments = exports.voters = exports.users = exports.puestosVotacion = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
// 1. Territorio / Puestos de Votación (Colombia)
exports.puestosVotacion = (0, mysql_core_1.mysqlTable)('puestos_votacion', {
    id: (0, mysql_core_1.varchar)('id', { length: 36 }).primaryKey(),
    departamento: (0, mysql_core_1.varchar)('departamento', { length: 100 }).notNull(),
    municipio: (0, mysql_core_1.varchar)('municipio', { length: 100 }).notNull(),
    zona: (0, mysql_core_1.varchar)('zona', { length: 50 }),
    nombrePuesto: (0, mysql_core_1.varchar)('nombre_puesto', { length: 200 }).notNull(),
    direccion: (0, mysql_core_1.varchar)('direccion', { length: 200 }),
    mesasTotales: (0, mysql_core_1.int)('mesas_totales').default(1).notNull(),
}, (table) => ({
    geoIdx: (0, mysql_core_1.index)('idx_geo').on(table.departamento, table.municipio),
}));
// 2. Usuarios y Roles (RBAC / ABAC)
exports.users = (0, mysql_core_1.mysqlTable)('users', {
    id: (0, mysql_core_1.varchar)('id', { length: 36 }).primaryKey(),
    nombre: (0, mysql_core_1.varchar)('nombre', { length: 150 }).notNull(),
    email: (0, mysql_core_1.varchar)('email', { length: 150 }).notNull().unique(),
    cedula: (0, mysql_core_1.varchar)('cedula', { length: 20 }).unique(),
    telefono: (0, mysql_core_1.varchar)('telefono', { length: 20 }),
    passwordHash: (0, mysql_core_1.varchar)('password_hash', { length: 255 }).notNull(),
    role: (0, mysql_core_1.mysqlEnum)('role', [
        'SUPER_ADMIN',
        'ADMIN_CAMPANA',
        'COORDINADOR',
        'LIDER',
        'TESTIGO',
        'VOLUNTARIO'
    ]).notNull(),
    parentLeaderId: (0, mysql_core_1.varchar)('parent_leader_id', { length: 36 }),
    departamentoAsignado: (0, mysql_core_1.varchar)('departamento_asignado', { length: 100 }),
    municipioAsignado: (0, mysql_core_1.varchar)('municipio_asignado', { length: 100 }),
    puestoAsignadoId: (0, mysql_core_1.varchar)('puesto_asignado_id', { length: 36 }),
    mesaAsignada: (0, mysql_core_1.int)('mesa_asignada'),
    activo: (0, mysql_core_1.boolean)('activo').default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)('created_at').defaultNow().notNull(),
}, (table) => ({
    roleIdx: (0, mysql_core_1.index)('idx_user_role').on(table.role),
    parentIdx: (0, mysql_core_1.index)('idx_user_parent').on(table.parentLeaderId),
}));
// 3. CRM de Votantes
exports.voters = (0, mysql_core_1.mysqlTable)('voters', {
    id: (0, mysql_core_1.varchar)('id', { length: 36 }).primaryKey(),
    cedula: (0, mysql_core_1.varchar)('cedula', { length: 20 }).notNull().unique(),
    nombres: (0, mysql_core_1.varchar)('nombres', { length: 100 }).notNull(),
    apellidos: (0, mysql_core_1.varchar)('apellidos', { length: 100 }).notNull(),
    telefono: (0, mysql_core_1.varchar)('telefono', { length: 20 }),
    whatsapp: (0, mysql_core_1.varchar)('whatsapp', { length: 20 }),
    email: (0, mysql_core_1.varchar)('email', { length: 150 }),
    direccion: (0, mysql_core_1.varchar)('direccion', { length: 200 }),
    barrioVereda: (0, mysql_core_1.varchar)('barrio_vereda', { length: 100 }),
    departamento: (0, mysql_core_1.varchar)('departamento', { length: 100 }).notNull(),
    municipio: (0, mysql_core_1.varchar)('municipio', { length: 100 }).notNull(),
    puestoVotacionId: (0, mysql_core_1.varchar)('puesto_votacion_id', { length: 36 }),
    mesa: (0, mysql_core_1.int)('mesa'),
    leaderId: (0, mysql_core_1.varchar)('leader_id', { length: 36 }).notNull(), // Asignado a un Líder o Coordinador
    nivelFidelizacion: (0, mysql_core_1.mysqlEnum)('nivel_fidelizacion', [
        'SEGURO',
        'SIMPATIZANTE',
        'INDECISO',
        'OPOSITOR'
    ]).default('INDECISO').notNull(),
    requiereTransporte: (0, mysql_core_1.boolean)('requiere_transporte').default(false).notNull(),
    votoAsistido: (0, mysql_core_1.boolean)('voto_asistido').default(false).notNull(),
    observaciones: (0, mysql_core_1.text)('observaciones'),
    votoConfirmadoDiaD: (0, mysql_core_1.boolean)('voto_confirmado_dia_d').default(false).notNull(),
    horaVotoDiaD: (0, mysql_core_1.timestamp)('hora_voto_dia_d'),
    createdAt: (0, mysql_core_1.timestamp)('created_at').defaultNow().notNull(),
}, (table) => ({
    cedulaIdx: (0, mysql_core_1.index)('idx_voter_cedula').on(table.cedula),
    leaderIdx: (0, mysql_core_1.index)('idx_voter_leader').on(table.leaderId),
    puestoIdx: (0, mysql_core_1.index)('idx_voter_puesto').on(table.puestoVotacionId, table.mesa),
    fidelizacionIdx: (0, mysql_core_1.index)('idx_voter_fidelizacion').on(table.nivelFidelizacion),
}));
// 4. Segmentos Dinámicos
exports.segments = (0, mysql_core_1.mysqlTable)('segments', {
    id: (0, mysql_core_1.varchar)('id', { length: 36 }).primaryKey(),
    nombre: (0, mysql_core_1.varchar)('nombre', { length: 150 }).notNull(),
    descripcion: (0, mysql_core_1.text)('descripcion'),
    filtrosJson: (0, mysql_core_1.json)('filtros_json').notNull(),
    createdByUserId: (0, mysql_core_1.varchar)('created_by_user_id', { length: 36 }).notNull(),
    createdAt: (0, mysql_core_1.timestamp)('created_at').defaultNow().notNull(),
});
// 5. Agenda y Eventos Políticas
exports.events = (0, mysql_core_1.mysqlTable)('events', {
    id: (0, mysql_core_1.varchar)('id', { length: 36 }).primaryKey(),
    titulo: (0, mysql_core_1.varchar)('titulo', { length: 200 }).notNull(),
    descripcion: (0, mysql_core_1.text)('descripcion'),
    tipo: (0, mysql_core_1.mysqlEnum)('tipo', [
        'REUNION_LIDERES',
        'EVENTO_BARRIAL',
        'MITIN_MASIVO',
        'CANVASSING',
        'CAPACITACION',
        'TAREA_LOGISTICA'
    ]).notNull(),
    estado: (0, mysql_core_1.mysqlEnum)('estado', [
        'PROGRAMADO',
        'EN_PROCESO',
        'COMPLETADO',
        'CANCELADO'
    ]).default('PROGRAMADO').notNull(),
    departamento: (0, mysql_core_1.varchar)('departamento', { length: 100 }).notNull(),
    municipio: (0, mysql_core_1.varchar)('municipio', { length: 100 }).notNull(),
    barrioVereda: (0, mysql_core_1.varchar)('barrio_vereda', { length: 100 }),
    direccion: (0, mysql_core_1.varchar)('direccion', { length: 200 }),
    latitude: (0, mysql_core_1.varchar)('latitude', { length: 50 }),
    longitude: (0, mysql_core_1.varchar)('longitude', { length: 50 }),
    fechaInicio: (0, mysql_core_1.timestamp)('fecha_inicio').notNull(),
    fechaFin: (0, mysql_core_1.timestamp)('fecha_fin').notNull(),
    organizadorUserId: (0, mysql_core_1.varchar)('organizador_user_id', { length: 36 }).notNull(),
    puestoVotacionRelacionadoId: (0, mysql_core_1.varchar)('puesto_votacion_relacionado_id', { length: 36 }),
    aforoEstimado: (0, mysql_core_1.int)('aforo_estimado').default(0).notNull(),
    asistenciaReal: (0, mysql_core_1.int)('asistencia_real').default(0).notNull(),
    createdAt: (0, mysql_core_1.timestamp)('created_at').defaultNow().notNull(),
}, (table) => ({
    fechaIdx: (0, mysql_core_1.index)('idx_event_fecha').on(table.fechaInicio),
    lugarIdx: (0, mysql_core_1.index)('idx_event_lugar').on(table.municipio, table.barrioVereda),
}));
// 6. Asistentes a Eventos (Check-in / RSVP)
exports.eventAttendees = (0, mysql_core_1.mysqlTable)('event_attendees', {
    id: (0, mysql_core_1.varchar)('id', { length: 36 }).primaryKey(),
    eventId: (0, mysql_core_1.varchar)('event_id', { length: 36 }).notNull(),
    voterId: (0, mysql_core_1.varchar)('voter_id', { length: 36 }).notNull(),
    confirmadoRsvp: (0, mysql_core_1.boolean)('confirmado_rsvp').default(false).notNull(),
    asistioCheckin: (0, mysql_core_1.boolean)('asistio_checkin').default(false).notNull(),
    horaCheckin: (0, mysql_core_1.timestamp)('hora_checkin'),
    registradoPorUserId: (0, mysql_core_1.varchar)('registrado_por_user_id', { length: 36 }),
}, (table) => ({
    eventVoterIdx: (0, mysql_core_1.index)('idx_event_voter').on(table.eventId, table.voterId),
}));
// 7. Tareas de Campaña
exports.campaignTasks = (0, mysql_core_1.mysqlTable)('campaign_tasks', {
    id: (0, mysql_core_1.varchar)('id', { length: 36 }).primaryKey(),
    titulo: (0, mysql_core_1.varchar)('titulo', { length: 200 }).notNull(),
    descripcion: (0, mysql_core_1.text)('descripcion'),
    prioridad: (0, mysql_core_1.mysqlEnum)('prioridad', ['BAJA', 'MEDIA', 'ALTA', 'URGENTE']).default('MEDIA').notNull(),
    estado: (0, mysql_core_1.mysqlEnum)('estado', ['PENDIENTE', 'EN_PROCESO', 'COMPLETADA', 'CANCELADA']).default('PENDIENTE').notNull(),
    asignadoAUserId: (0, mysql_core_1.varchar)('asignado_a_user_id', { length: 36 }).notNull(),
    creadoPorUserId: (0, mysql_core_1.varchar)('creado_por_user_id', { length: 36 }).notNull(),
    fechaLimite: (0, mysql_core_1.timestamp)('fecha_limite'),
    eventId: (0, mysql_core_1.varchar)('event_id', { length: 36 }),
    createdAt: (0, mysql_core_1.timestamp)('created_at').defaultNow().notNull(),
}, (table) => ({
    asignadoIdx: (0, mysql_core_1.index)('idx_task_asignado').on(table.asignadoAUserId),
}));
