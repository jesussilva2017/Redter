-- Script de migración: Nuevos atributos para tabla 'voters' (Registro 360° con Stepper)
-- REDTER - Plataforma de Gestión Territorial

ALTER TABLE `voters`
  ADD COLUMN `tipo_documento` VARCHAR(10) NOT NULL DEFAULT 'CC' AFTER `id`,
  ADD COLUMN `fecha_nacimiento` DATE NULL AFTER `email`,
  ADD COLUMN `ciudad_nacimiento` VARCHAR(100) NULL AFTER `fecha_nacimiento`,
  ADD COLUMN `genero` VARCHAR(50) NULL AFTER `ciudad_nacimiento`,
  ADD COLUMN `zona` VARCHAR(50) NOT NULL DEFAULT 'Urbana' AFTER `genero`,
  ADD COLUMN `nivel_educativo` VARCHAR(100) NULL AFTER `barrio_vereda`,
  ADD COLUMN `ocupacion_actual` VARCHAR(100) NULL AFTER `nivel_educativo`,
  ADD COLUMN `profesion_oficio` VARCHAR(150) NULL AFTER `ocupacion_actual`,
  ADD COLUMN `empresa_lugar_trabajo` VARCHAR(150) NULL AFTER `profesion_oficio`,
  ADD COLUMN `zona_electoral` VARCHAR(100) NULL AFTER `municipio`;
