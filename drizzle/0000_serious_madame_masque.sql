CREATE TABLE `campaign_tasks` (
	`id` varchar(36) NOT NULL,
	`titulo` varchar(200) NOT NULL,
	`descripcion` text,
	`prioridad` enum('BAJA','MEDIA','ALTA','URGENTE') NOT NULL DEFAULT 'MEDIA',
	`estado` enum('PENDIENTE','EN_PROCESO','COMPLETADA','CANCELADA') NOT NULL DEFAULT 'PENDIENTE',
	`asignado_a_user_id` varchar(36) NOT NULL,
	`creado_por_user_id` varchar(36) NOT NULL,
	`fecha_limite` timestamp,
	`event_id` varchar(36),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `campaign_tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `event_attendees` (
	`id` varchar(36) NOT NULL,
	`event_id` varchar(36) NOT NULL,
	`voter_id` varchar(36) NOT NULL,
	`confirmado_rsvp` boolean NOT NULL DEFAULT false,
	`asistio_checkin` boolean NOT NULL DEFAULT false,
	`hora_checkin` timestamp,
	`registrado_por_user_id` varchar(36),
	CONSTRAINT `event_attendees_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` varchar(36) NOT NULL,
	`titulo` varchar(200) NOT NULL,
	`descripcion` text,
	`tipo` enum('REUNION_LIDERES','EVENTO_BARRIAL','MITIN_MASIVO','CANVASSING','CAPACITACION','TAREA_LOGISTICA') NOT NULL,
	`estado` enum('PROGRAMADO','EN_PROCESO','COMPLETADO','CANCELADO') NOT NULL DEFAULT 'PROGRAMADO',
	`departamento` varchar(100) NOT NULL,
	`municipio` varchar(100) NOT NULL,
	`barrio_vereda` varchar(100),
	`direccion` varchar(200),
	`latitude` varchar(50),
	`longitude` varchar(50),
	`fecha_inicio` timestamp NOT NULL,
	`fecha_fin` timestamp NOT NULL,
	`organizador_user_id` varchar(36) NOT NULL,
	`puesto_votacion_relacionado_id` varchar(36),
	`aforo_estimado` int NOT NULL DEFAULT 0,
	`asistencia_real` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `puestos_votacion` (
	`id` varchar(36) NOT NULL,
	`departamento` varchar(100) NOT NULL,
	`municipio` varchar(100) NOT NULL,
	`zona` varchar(50),
	`nombre_puesto` varchar(200) NOT NULL,
	`direccion` varchar(200),
	`mesas_totales` int NOT NULL DEFAULT 1,
	CONSTRAINT `puestos_votacion_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `segments` (
	`id` varchar(36) NOT NULL,
	`nombre` varchar(150) NOT NULL,
	`descripcion` text,
	`filtros_json` json NOT NULL,
	`created_by_user_id` varchar(36) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `segments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`nombre` varchar(150) NOT NULL,
	`email` varchar(150) NOT NULL,
	`cedula` varchar(20),
	`telefono` varchar(20),
	`password_hash` varchar(255) NOT NULL,
	`role` enum('SUPER_ADMIN','ADMIN_CAMPANA','COORDINADOR','LIDER','TESTIGO','VOLUNTARIO') NOT NULL,
	`parent_leader_id` varchar(36),
	`departamento_asignado` varchar(100),
	`municipio_asignado` varchar(100),
	`puesto_asignado_id` varchar(36),
	`mesa_asignada` int,
	`activo` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `users_cedula_unique` UNIQUE(`cedula`)
);
--> statement-breakpoint
CREATE TABLE `voters` (
	`id` varchar(36) NOT NULL,
	`cedula` varchar(20) NOT NULL,
	`nombres` varchar(100) NOT NULL,
	`apellidos` varchar(100) NOT NULL,
	`telefono` varchar(20),
	`whatsapp` varchar(20),
	`email` varchar(150),
	`direccion` varchar(200),
	`barrio_vereda` varchar(100),
	`departamento` varchar(100) NOT NULL,
	`municipio` varchar(100) NOT NULL,
	`puesto_votacion_id` varchar(36),
	`mesa` int,
	`leader_id` varchar(36) NOT NULL,
	`nivel_fidelizacion` enum('SEGURO','SIMPATIZANTE','INDECISO','OPOSITOR') NOT NULL DEFAULT 'INDECISO',
	`requiere_transporte` boolean NOT NULL DEFAULT false,
	`voto_asistido` boolean NOT NULL DEFAULT false,
	`observaciones` text,
	`voto_confirmado_dia_d` boolean NOT NULL DEFAULT false,
	`hora_voto_dia_d` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `voters_id` PRIMARY KEY(`id`),
	CONSTRAINT `voters_cedula_unique` UNIQUE(`cedula`)
);
--> statement-breakpoint
CREATE INDEX `idx_task_asignado` ON `campaign_tasks` (`asignado_a_user_id`);--> statement-breakpoint
CREATE INDEX `idx_event_voter` ON `event_attendees` (`event_id`,`voter_id`);--> statement-breakpoint
CREATE INDEX `idx_event_fecha` ON `events` (`fecha_inicio`);--> statement-breakpoint
CREATE INDEX `idx_event_lugar` ON `events` (`municipio`,`barrio_vereda`);--> statement-breakpoint
CREATE INDEX `idx_geo` ON `puestos_votacion` (`departamento`,`municipio`);--> statement-breakpoint
CREATE INDEX `idx_user_role` ON `users` (`role`);--> statement-breakpoint
CREATE INDEX `idx_user_parent` ON `users` (`parent_leader_id`);--> statement-breakpoint
CREATE INDEX `idx_voter_cedula` ON `voters` (`cedula`);--> statement-breakpoint
CREATE INDEX `idx_voter_leader` ON `voters` (`leader_id`);--> statement-breakpoint
CREATE INDEX `idx_voter_puesto` ON `voters` (`puesto_votacion_id`,`mesa`);--> statement-breakpoint
CREATE INDEX `idx_voter_fidelizacion` ON `voters` (`nivel_fidelizacion`);