-- Script de migración: Tablas barrios (urbana) y veredas (rural)
-- REDTER - Plataforma de Gestión Territorial

CREATE TABLE IF NOT EXISTS `barrios` (
  `id_barrio` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `municipio_id` int(5) unsigned NOT NULL,
  `codigo_postal` varchar(6),
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `latitud` decimal(10,8),
  `longitud` decimal(11,8),
  `estado` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id_barrio`),
  KEY `idx_municipio_id` (`municipio_id`),
  KEY `idx_codigo_postal` (`codigo_postal`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `veredas` (
  `id_vereda` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `municipio_id` int(5) unsigned NOT NULL,
  `codigo_dane` varchar(10),
  `area_km2` decimal(10,2),
  `poblacion` int(10),
  `latitud` decimal(10,8),
  `longitud` decimal(11,8),
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `estado` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id_vereda`),
  KEY `idx_municipio_id` (`municipio_id`),
  KEY `idx_codigo_dane` (`codigo_dane`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
