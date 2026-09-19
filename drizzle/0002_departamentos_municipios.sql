-- Script de migración: Tablas DANE departamentos, municipios y departamento_nacimiento en voters
-- Datos tomados del DANE (Rep: https://github.com/vafelu/departamentos-y-municipios-colombia-SQL)
-- REDTER - Plataforma de Gestión Territorial

CREATE TABLE IF NOT EXISTS `departamentos` (
  `id_departamento` int(2) unsigned NOT NULL AUTO_INCREMENT,
  `departamento` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id_departamento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `municipios` (
  `id_municipio` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `municipio` varchar(255) NOT NULL DEFAULT '',
  `estado` int(1) unsigned NOT NULL,
  `departamento_id` int(2) unsigned NOT NULL,
  PRIMARY KEY (`id_municipio`),
  KEY `departamento_id` (`departamento_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `voters`
  ADD COLUMN `departamento_nacimiento` VARCHAR(100) NULL AFTER `fecha_nacimiento`;
