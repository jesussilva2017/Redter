-- ============================================================
-- Base de Datos: Zonas, Puestos y Mesas de Votación
-- Municipio: Garzón, Huila, Colombia
-- ============================================================
-- Creado para DevSoluciones - Proyecto REDTER Electoral
-- Actualizado: 2026-09-19
-- ============================================================

-- ============================================================
-- Tabla: Zonas de Votación
-- ============================================================
CREATE TABLE IF NOT EXISTS `zonas_votacion` (
  `id_zona` INT(3) UNSIGNED NOT NULL AUTO_INCREMENT,
  `numero_zona` INT(3) NOT NULL,
  `nombre_zona` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `tipo_zona` ENUM('urbana', 'rural', 'especial') DEFAULT 'urbana',
  `municipio_id` INT(5) UNSIGNED,
  `estado` TINYINT(1) DEFAULT 1,
  PRIMARY KEY (`id_zona`),
  UNIQUE KEY `uq_numero_zona_municipio` (`numero_zona`, `municipio_id`),
  KEY `idx_municipio_id` (`municipio_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Tabla: Puestos de Votación
-- ============================================================
CREATE TABLE IF NOT EXISTS `puestos_votacion` (
  `id_puesto` INT(5) UNSIGNED NOT NULL AUTO_INCREMENT,
  `numero_puesto` INT(3) NOT NULL,
  `nombre_puesto` VARCHAR(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `institucion` VARCHAR(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `direccion` VARCHAR(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `barrio_vereda` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `id_zona` INT(3) UNSIGNED NOT NULL,
  `municipio_id` INT(5) UNSIGNED,
  `latitud` DECIMAL(10,8),
  `longitud` DECIMAL(11,8),
  `telefono` VARCHAR(20),
  `responsable` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `total_mesas` INT(3),
  `capacidad_votantes` INT(10),
  `estado` TINYINT(1) DEFAULT 1,
  `fecha_creacion` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_puesto`),
  UNIQUE KEY `uq_numero_puesto_zona` (`numero_puesto`, `id_zona`),
  KEY `idx_zona` (`id_zona`),
  KEY `idx_municipio_id` (`municipio_id`),
  FOREIGN KEY (`id_zona`) REFERENCES `zonas_votacion` (`id_zona`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Tabla: Mesas de Votación
-- ============================================================
CREATE TABLE IF NOT EXISTS `mesas_votacion` (
  `id_mesa` INT(8) UNSIGNED NOT NULL AUTO_INCREMENT,
  `numero_mesa` INT(4) NOT NULL,
  `id_puesto` INT(5) UNSIGNED NOT NULL,
  `id_zona` INT(3) UNSIGNED NOT NULL,
  `municipio_id` INT(5) UNSIGNED,
  `codigo_mesa` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `numero_padron` INT(4),
  `capacidad_electores` INT(5),
  `jurado_principal_nombre` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `jurado_principal_cedula` VARCHAR(20),
  `jurado_vicepresidente_nombre` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `jurado_vicepresidente_cedula` VARCHAR(20),
  `vocal_1_nombre` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `vocal_1_cedula` VARCHAR(20),
  `vocal_2_nombre` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `vocal_2_cedula` VARCHAR(20),
  `vocal_3_nombre` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `vocal_3_cedula` VARCHAR(20),
  `vocal_4_nombre` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `vocal_4_cedula` VARCHAR(20),
  `estado` TINYINT(1) DEFAULT 1,
  `fecha_creacion` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_mesa`),
  UNIQUE KEY `uq_numero_mesa_puesto` (`numero_mesa`, `id_puesto`),
  KEY `idx_puesto` (`id_puesto`),
  KEY `idx_zona` (`id_zona`),
  KEY `idx_municipio_id` (`municipio_id`),
  KEY `idx_codigo_mesa` (`codigo_mesa`),
  FOREIGN KEY (`id_puesto`) REFERENCES `puestos_votacion` (`id_puesto`) ON DELETE CASCADE,
  FOREIGN KEY (`id_zona`) REFERENCES `zonas_votacion` (`id_zona`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Insertar Zonas de Votación de Garzón
-- ============================================================
INSERT INTO `zonas_votacion` (`numero_zona`, `nombre_zona`, `descripcion`, `tipo_zona`) VALUES
(1, 'Zona 1 - Centro Urbano', 'Zona urbana central de Garzón', 'urbana'),
(2, 'Zona 2 - Suroriental', 'Zona urbana suroriental de Garzón', 'urbana'),
(90, 'Zona 90 - Especial', 'Centro especial de votación (Colegio Cooperativo)', 'especial'),
(98, 'Zona 98 - Especial Carcelaria', 'Centro carcelario (Cárcel Las Mercedes)', 'especial'),
(99, 'Zona 99 - Rural', 'Zonas rurales y veredas de Garzón', 'rural');

-- ============================================================
-- Insertar Puestos de Votación - ZONA 1
-- ============================================================
INSERT INTO `puestos_votacion` (`numero_puesto`, `nombre_puesto`, `institucion`, `direccion`, `barrio_vereda`, `id_zona`, `total_mesas`, `capacidad_votantes`) VALUES
(1, 'Puesto 1 - IE Jenario Díaz Jordán', 'Institución Educativa Jenario Díaz Jordán', 'Barrio Provivienda', 'Provivienda', (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 1 LIMIT 1), 27, 2700),
(2, 'Puesto 2 - Polideportivo Plaza de Mercado', 'Polideportivo Plaza de Mercado', 'Centro de Garzón', 'Centro', (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 1 LIMIT 1), 25, 2500),
(3, 'Puesto 3 - IE Barrios Unidos', 'Institución Educativa Barrios Unidos', 'Barrio Santa Teresa', 'Santa Teresa', (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 1 LIMIT 1), 24, 2400);

-- ============================================================
-- Insertar Puestos de Votación - ZONA 2
-- ============================================================
INSERT INTO `puestos_votacion` (`numero_puesto`, `nombre_puesto`, `institucion`, `direccion`, `barrio_vereda`, `id_zona`, `total_mesas`, `capacidad_votantes`) VALUES
(4, 'Puesto 4 - UN Sur Colombiana', 'Universidad Surcolombiana (Vía Las Termitas)', 'Vía Las Termitas', 'Vía Las Termitas', (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 2 LIMIT 1), 20, 2000),
(5, 'Puesto 5 - IE Simón Bolívar', 'Institución Educativa Simón Bolívar', 'Barrio Nazareth', 'Nazareth', (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 2 LIMIT 1), 22, 2200),
(6, 'Puesto 6 - MEG Luis Calixto Leiva', 'Modelo Educativa Genio Luis Calixto Leiva', 'Sector Oriental', 'Sector Oriental', (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 2 LIMIT 1), 18, 1800);

-- ============================================================
-- Insertar Puestos de Votación - ZONAS RURALES (99)
-- ============================================================
INSERT INTO `puestos_votacion` (`numero_puesto`, `nombre_puesto`, `institucion`, `direccion`, `barrio_vereda`, `id_zona`, `total_mesas`, `capacidad_votantes`) VALUES
(90, 'Puesto Rural 90 - El Recreo', 'Escuela Rural El Recreo', 'Vereda El Recreo', 'El Recreo', (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 99 LIMIT 1), 4, 400),
(91, 'Puesto Rural 91 - El Paraíso', 'Escuela Rural El Paraíso', 'Vereda El Paraíso', 'El Paraíso', (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 99 LIMIT 1), 3, 300),
(92, 'Puesto Rural 92 - Caguancito', 'Escuela Rural Caguancito', 'Vereda Caguancito', 'Caguancito', (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 99 LIMIT 1), 3, 300),
(93, 'Puesto Rural 93 - El Mesón', 'Escuela Rural El Mesón', 'Vereda El Mesón', 'El Mesón', (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 99 LIMIT 1), 2, 200);

-- ============================================================
-- Insertar Puestos de Votación - ZONAS ESPECIALES (90, 98)
-- ============================================================
INSERT INTO `puestos_votacion` (`numero_puesto`, `nombre_puesto`, `institucion`, `direccion`, `barrio_vereda`, `id_zona`, `total_mesas`, `capacidad_votantes`) VALUES
(98, 'Puesto Especial 98 - Colegio Cooperativo', 'Colegio Cooperativo de Garzón', 'Sector Centro', 'Centro', (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 90 LIMIT 1), 8, 800),
(99, 'Puesto Especial 99 - Cárcel Las Mercedes', 'Establecimiento Penitenciario Las Mercedes', 'Sector Rural', 'Rural', (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 98 LIMIT 1), 5, 500);

-- ============================================================
-- Insertar Mesas de Votación - PUESTO 1 (27 mesas)
-- ============================================================
INSERT INTO `mesas_votacion` (`numero_mesa`, `id_puesto`, `id_zona`, `codigo_mesa`, `numero_padron`, `capacidad_electores`) VALUES
(1, (SELECT id_puesto FROM puestos_votacion WHERE numero_puesto = 1 LIMIT 1), (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 1 LIMIT 1), 'G-1-001', 1, 100),
(2, (SELECT id_puesto FROM puestos_votacion WHERE numero_puesto = 1 LIMIT 1), (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 1 LIMIT 1), 'G-1-002', 2, 100),
(3, (SELECT id_puesto FROM puestos_votacion WHERE numero_puesto = 1 LIMIT 1), (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 1 LIMIT 1), 'G-1-003', 3, 100),
(4, (SELECT id_puesto FROM puestos_votacion WHERE numero_puesto = 1 LIMIT 1), (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 1 LIMIT 1), 'G-1-004', 4, 100),
(5, (SELECT id_puesto FROM puestos_votacion WHERE numero_puesto = 1 LIMIT 1), (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 1 LIMIT 1), 'G-1-005', 5, 100),
(6, (SELECT id_puesto FROM puestos_votacion WHERE numero_puesto = 1 LIMIT 1), (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 1 LIMIT 1), 'G-1-006', 6, 100),
(7, (SELECT id_puesto FROM puestos_votacion WHERE numero_puesto = 1 LIMIT 1), (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 1 LIMIT 1), 'G-1-007', 7, 100),
(8, (SELECT id_puesto FROM puestos_votacion WHERE numero_puesto = 1 LIMIT 1), (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 1 LIMIT 1), 'G-1-008', 8, 100),
(9, (SELECT id_puesto FROM puestos_votacion WHERE numero_puesto = 1 LIMIT 1), (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 1 LIMIT 1), 'G-1-009', 9, 100),
(10, (SELECT id_puesto FROM puestos_votacion WHERE numero_puesto = 1 LIMIT 1), (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 1 LIMIT 1), 'G-1-010', 10, 100),
(11, (SELECT id_puesto FROM puestos_votacion WHERE numero_puesto = 1 LIMIT 1), (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 1 LIMIT 1), 'G-1-011', 11, 100),
(12, (SELECT id_puesto FROM puestos_votacion WHERE numero_puesto = 1 LIMIT 1), (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 1 LIMIT 1), 'G-1-012', 12, 100),
(13, (SELECT id_puesto FROM puestos_votacion WHERE numero_puesto = 1 LIMIT 1), (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 1 LIMIT 1), 'G-1-013', 13, 100),
(14, (SELECT id_puesto FROM puestos_votacion WHERE numero_puesto = 1 LIMIT 1), (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 1 LIMIT 1), 'G-1-014', 14, 100),
(15, (SELECT id_puesto FROM puestos_votacion WHERE numero_puesto = 1 LIMIT 1), (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 1 LIMIT 1), 'G-1-015', 15, 100),
(16, (SELECT id_puesto FROM puestos_votacion WHERE numero_puesto = 1 LIMIT 1), (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 1 LIMIT 1), 'G-1-016', 16, 100),
(17, (SELECT id_puesto FROM puestos_votacion WHERE numero_puesto = 1 LIMIT 1), (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 1 LIMIT 1), 'G-1-017', 17, 100),
(18, (SELECT id_puesto FROM puestos_votacion WHERE numero_puesto = 1 LIMIT 1), (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 1 LIMIT 1), 'G-1-018', 18, 100),
(19, (SELECT id_puesto FROM puestos_votacion WHERE numero_puesto = 1 LIMIT 1), (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 1 LIMIT 1), 'G-1-019', 19, 100),
(20, (SELECT id_puesto FROM puestos_votacion WHERE numero_puesto = 1 LIMIT 1), (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 1 LIMIT 1), 'G-1-020', 20, 100),
(21, (SELECT id_puesto FROM puestos_votacion WHERE numero_puesto = 1 LIMIT 1), (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 1 LIMIT 1), 'G-1-021', 21, 100),
(22, (SELECT id_puesto FROM puestos_votacion WHERE numero_puesto = 1 LIMIT 1), (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 1 LIMIT 1), 'G-1-022', 22, 100),
(23, (SELECT id_puesto FROM puestos_votacion WHERE numero_puesto = 1 LIMIT 1), (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 1 LIMIT 1), 'G-1-023', 23, 100),
(24, (SELECT id_puesto FROM puestos_votacion WHERE numero_puesto = 1 LIMIT 1), (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 1 LIMIT 1), 'G-1-024', 24, 100),
(25, (SELECT id_puesto FROM puestos_votacion WHERE numero_puesto = 1 LIMIT 1), (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 1 LIMIT 1), 'G-1-025', 25, 100),
(26, (SELECT id_puesto FROM puestos_votacion WHERE numero_puesto = 1 LIMIT 1), (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 1 LIMIT 1), 'G-1-026', 26, 100),
(27, (SELECT id_puesto FROM puestos_votacion WHERE numero_puesto = 1 LIMIT 1), (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 1 LIMIT 1), 'G-1-027', 27, 100);

-- ============================================================
-- Insertar Mesas de Votación - PUESTO 2 (25 mesas - ejemplo parcial)
-- ============================================================
INSERT INTO `mesas_votacion` (`numero_mesa`, `id_puesto`, `id_zona`, `codigo_mesa`, `numero_padron`, `capacidad_electores`) VALUES
(1, (SELECT id_puesto FROM puestos_votacion WHERE numero_puesto = 2 LIMIT 1), (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 1 LIMIT 1), 'G-2-001', 1, 100),
(2, (SELECT id_puesto FROM puestos_votacion WHERE numero_puesto = 2 LIMIT 1), (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 1 LIMIT 1), 'G-2-002', 2, 100),
(3, (SELECT id_puesto FROM puestos_votacion WHERE numero_puesto = 2 LIMIT 1), (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 1 LIMIT 1), 'G-2-003', 3, 100),
(4, (SELECT id_puesto FROM puestos_votacion WHERE numero_puesto = 2 LIMIT 1), (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 1 LIMIT 1), 'G-2-004', 4, 100),
(5, (SELECT id_puesto FROM puestos_votacion WHERE numero_puesto = 2 LIMIT 1), (SELECT id_zona FROM zonas_votacion WHERE numero_zona = 1 LIMIT 1), 'G-2-005', 5, 100);

-- ============================================================
-- Consultas útiles
-- ============================================================
-- Ver estructura completa de votación de Garzón
-- SELECT
--   z.numero_zona,
--   z.nombre_zona,
--   p.numero_puesto,
--   p.nombre_puesto,
--   COUNT(m.id_mesa) as total_mesas
-- FROM zonas_votacion z
-- LEFT JOIN puestos_votacion p ON z.id_zona = p.id_zona
-- LEFT JOIN mesas_votacion m ON p.id_puesto = m.id_puesto
-- GROUP BY z.id_zona, p.id_puesto
-- ORDER BY z.numero_zona, p.numero_puesto;

-- Ver mesas por puesto
-- SELECT
--   p.numero_puesto,
--   p.nombre_puesto,
--   COUNT(m.id_mesa) as total_mesas,
--   SUM(m.capacidad_electores) as capacidad_total
-- FROM puestos_votacion p
-- LEFT JOIN mesas_votacion m ON p.id_puesto = m.id_puesto
-- GROUP BY p.id_puesto
-- ORDER BY p.numero_puesto;

-- Ver detalle completo de mesas con jurados
-- SELECT
--   z.numero_zona,
--   p.nombre_puesto,
--   m.numero_mesa,
--   m.codigo_mesa,
--   m.jurado_principal_nombre,
--   m.jurado_vicepresidente_nombre
-- FROM mesas_votacion m
-- JOIN puestos_votacion p ON m.id_puesto = p.id_puesto
-- JOIN zonas_votacion z ON m.id_zona = z.id_zona
-- ORDER BY z.numero_zona, p.numero_puesto, m.numero_mesa;

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
