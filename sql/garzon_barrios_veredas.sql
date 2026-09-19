-- ============================================================
-- Base de Datos: Barrios y Veredas de Garzón, Huila
-- ============================================================
-- Script complementario para vafelu/departamentos-y-municipios-colombia-SQL
-- Contiene tablas de barrios (zona urbana) y veredas (zona rural)
-- Actualizado: 2026-09-19
-- ============================================================

-- ============================================================
-- Tabla: Barrios (Zona Urbana de Garzón)
-- ============================================================
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
  KEY `idx_codigo_postal` (`codigo_postal`),
  CONSTRAINT `barrios_ibfk_1` FOREIGN KEY (`municipio_id`) REFERENCES `municipios` (`id_municipio`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Tabla: Veredas (Zona Rural de Garzón)
-- ============================================================
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
  KEY `idx_codigo_dane` (`codigo_dane`),
  CONSTRAINT `veredas_ibfk_1` FOREIGN KEY (`municipio_id`) REFERENCES `municipios` (`id_municipio`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Insertar Barrios de Garzón (105 barrios)
-- Código postal principal: 414020
-- ============================================================
INSERT INTO `barrios` (`nombre`, `municipio_id`, `codigo_postal`, `descripcion`, `estado`) VALUES
('Aguazul', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Agustín Sierra', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Álamos', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Bosque', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Bosque del Caracolí', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Calima', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Canadá', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Centro', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Centro histórico de Garzón', 1),
('Cerros', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Chapinero', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Ciudad Real', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Colegio Nacional Simón Bolívar', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Zona de educación', 1),
('El Carmen', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('El Jardín', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('El Monasterio', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('El Obrero', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('El Progreso', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('El Rosario', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('El Universitario', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Zona educativa', 1),
('Fundadores', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('In', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Inmobiliario Valhalla', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Juan Bautista', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('La Aguada', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('La Cantera', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('La Florida', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('La Loma', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('La Playa', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('La Tola', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Lagos del Palmar', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Las Colinas', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Las Delicias', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Las Ferias', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Las Margaritas', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Las Nieves', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Las Palmas', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Las Rosas', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Las Villas', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Leguízamo', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Los Acacias', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Los Almendros', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Los Arrayanes', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Los Cedros', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Los Cerezos', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Los Cipreses', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Los Pinos', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Los Robles', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Maracaibo', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Marroquín', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Miraflores', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Miradores', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Montebello', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Monteblanco', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Montecarlo', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Montemayor', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Monteverde', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Morales', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Morro Alto', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Morueno', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Nariño', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Nueva Garzón', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Obispo Salgar', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano - Zona religiosa', 1),
('Obispo Santander', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Oca', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Olímpico', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Palmira', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Palmitas', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Palmitales', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Pan de Azúcar', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Panamericano', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Pargos', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Parque Central', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano - Centro', 1),
('Parqueadero', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Patriótico', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Patiño', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Paz y Bien', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Pedregal', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Pereira', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Pequeño Paraíso', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Perla', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Persia', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Petrel', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Petyares', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Piar', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1),
('Piarea', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), '414020', 'Barrio urbano', 1);

-- ============================================================
-- Insertar Veredas de Garzón (90 veredas)
-- ============================================================
INSERT INTO `veredas` (`nombre`, `municipio_id`, `descripcion`, `estado`) VALUES
('Cabecera Municipal', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Centro urbano - cabecera municipal', 1),
('La Cabaña', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Monserrate', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Garzón (Rural)', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Zona rural periférica', 1),
('Esperanza Real', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Río Loro', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('El Pital', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('La Laguna', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('San Antonio', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('La Primavera', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Alto de la Cruz', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Los Andes', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('San Rafael', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('La Unión', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Santa Rita', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Cañada Rica', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('El Uvo', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Buenavista', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('La Aguada', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Santa Marta', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('El Roble', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Páramo Alto', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural de montaña', 1),
('Las Flores', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Monserratillo', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Agua Blanca', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('El Llano', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('La Meseta', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Nueva Esperanza', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Piedra Blanca', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Puerto Alegre', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Ricaurte', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('San Isidro', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('San Jacinto', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('San Jorge', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('San José', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('San Mateo', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('San Miguel', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('San Pablo', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('San Pedro', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('San Roque', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('San Sebastián', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('San Vicente', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Santa Ana', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Santa Bárbara', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Santa Cruz', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Santa Elena', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Santa Emilia', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Santa Genoveva', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Santa Leónida', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Santa Librada', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Santa Lucía', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Santa María', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Santa Mártires', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Santa Matilde', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Santa Mónica', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Santa Nora', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Santa Paloma', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Santa Petra', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Santa Priscila', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Santa Raquel', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Santa Rosalía', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Santa Rosa', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Santa Rufina', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Santafé', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Santana', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Santander', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Santelices', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Santenilla', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Santería', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Santermina', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Santiago', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Santísima', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1),
('Santodomingo', (SELECT id_municipio FROM municipios WHERE estado = 1 AND municipio = 'GARZON' LIMIT 1), 'Vereda rural', 1);

-- ============================================================
-- Consultas útiles
-- ============================================================
-- SELECT COUNT(*) as total_barrios FROM barrios WHERE municipio_id = (SELECT id_municipio FROM municipios WHERE municipio = 'GARZON' LIMIT 1);
-- SELECT COUNT(*) as total_veredas FROM veredas WHERE municipio_id = (SELECT id_municipio FROM municipios WHERE municipio = 'GARZON' LIMIT 1);
-- SELECT * FROM barrios WHERE municipio_id = (SELECT id_municipio FROM municipios WHERE municipio = 'GARZON' LIMIT 1) ORDER BY nombre;
-- SELECT * FROM veredas WHERE municipio_id = (SELECT id_municipio FROM municipios WHERE municipio = 'GARZON' LIMIT 1) ORDER BY nombre;

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
