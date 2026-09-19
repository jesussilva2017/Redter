import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbPort = Number(process.env.DB_PORT) || 3306;
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbName = process.env.DB_NAME || 'u395420986_redter';

export async function seedGarzonVotacion() {
  console.log('Iniciando migración y sembrado de Zonas, Puestos y Mesas de Garzón...');
  const conn = await mysql.createConnection({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: dbName,
    multipleStatements: true,
  });

  try {
    // 1. Crear tabla zonas_votacion
    console.log('1. Creando tabla zonas_votacion...');
    await conn.query(`
      CREATE TABLE IF NOT EXISTS \`zonas_votacion\` (
        \`id_zona\` INT(3) UNSIGNED NOT NULL AUTO_INCREMENT,
        \`numero_zona\` INT(3) NOT NULL,
        \`nombre_zona\` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        \`descripcion\` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        \`tipo_zona\` ENUM('urbana', 'rural', 'especial') DEFAULT 'urbana',
        \`municipio_id\` INT(5) UNSIGNED,
        \`estado\` TINYINT(1) DEFAULT 1,
        PRIMARY KEY (\`id_zona\`),
        UNIQUE KEY \`uq_numero_zona_municipio\` (\`numero_zona\`, \`municipio_id\`),
        KEY \`idx_municipio_id\` (\`municipio_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Insertar zonas de Garzón (municipio_id = 368)
    const zonas = [
      { numero: 1, nombre: 'Zona 1 - Centro Urbano', desc: 'Zona urbana central de Garzón', tipo: 'urbana' },
      { numero: 2, nombre: 'Zona 2 - Suroriental', desc: 'Zona urbana suroriental de Garzón', tipo: 'urbana' },
      { numero: 90, nombre: 'Zona 90 - Especial', desc: 'Centro especial de votación (Colegio Cooperativo)', tipo: 'especial' },
      { numero: 98, nombre: 'Zona 98 - Especial Carcelaria', desc: 'Centro carcelario (Cárcel Las Mercedes)', tipo: 'especial' },
      { numero: 99, nombre: 'Zona 99 - Rural', desc: 'Zonas rurales y veredas de Garzón', tipo: 'rural' },
    ];

    for (const z of zonas) {
      await conn.query(`
        INSERT INTO \`zonas_votacion\` (\`numero_zona\`, \`nombre_zona\`, \`descripcion\`, \`tipo_zona\`, \`municipio_id\`, \`estado\`)
        VALUES (?, ?, ?, ?, 368, 1)
        ON DUPLICATE KEY UPDATE
          \`nombre_zona\` = VALUES(\`nombre_zona\`),
          \`descripcion\` = VALUES(\`descripcion\`),
          \`tipo_zona\` = VALUES(\`tipo_zona\`),
          \`estado\` = 1
      `, [z.numero, z.nombre, z.desc, z.tipo]);
    }
    console.log('Zonas de votación sembradas.');

    // 2. Modificar tabla puestos_votacion agregando columnas de garzon_votacion
    console.log('2. Ajustando columnas en puestos_votacion...');
    const [cols]: any = await conn.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'puestos_votacion'
    `, [dbName]);
    const existingCols = new Set(cols.map((c: any) => c.COLUMN_NAME));

    const columnsToAdd = [
      { name: 'numero_puesto', type: 'INT(3) NULL' },
      { name: 'institucion', type: 'VARCHAR(150) NULL' },
      { name: 'barrio_vereda', type: 'VARCHAR(100) NULL' },
      { name: 'id_zona', type: 'INT(3) UNSIGNED NULL' },
      { name: 'municipio_id', type: 'INT(5) UNSIGNED NULL' },
      { name: 'latitud', type: 'DECIMAL(10,8) NULL' },
      { name: 'longitud', type: 'DECIMAL(11,8) NULL' },
      { name: 'telefono', type: 'VARCHAR(20) NULL' },
      { name: 'responsable', type: 'VARCHAR(100) NULL' },
      { name: 'total_mesas', type: 'INT(3) NULL' },
      { name: 'capacidad_votantes', type: 'INT(10) NULL' },
      { name: 'estado', type: 'TINYINT(1) DEFAULT 1' },
    ];

    for (const col of columnsToAdd) {
      if (!existingCols.has(col.name)) {
        console.log(`Agregando columna ${col.name} a puestos_votacion...`);
        await conn.query(`ALTER TABLE \`puestos_votacion\` ADD COLUMN \`${col.name}\` ${col.type}`);
      }
    }

    // 3. Insertar / Actualizar puestos de votación de Garzón
    console.log('3. Sembrando puestos de votación de Garzón...');
    const puestosGarzon = [
      {
        id: 'puesto-garzon-1',
        numero: 1,
        nombre: 'Puesto 1 - IE Jenario Díaz Jordán',
        institucion: 'Institución Educativa Jenario Díaz Jordán',
        direccion: 'Barrio Provivienda',
        barrio_vereda: 'Provivienda',
        numero_zona: 1,
        total_mesas: 27,
        capacidad: 2700,
      },
      {
        id: 'puesto-garzon-2',
        numero: 2,
        nombre: 'Puesto 2 - Polideportivo Plaza de Mercado',
        institucion: 'Polideportivo Plaza de Mercado',
        direccion: 'Centro de Garzón',
        barrio_vereda: 'Centro',
        numero_zona: 1,
        total_mesas: 25,
        capacidad: 2500,
      },
      {
        id: 'puesto-garzon-3',
        numero: 3,
        nombre: 'Puesto 3 - IE Barrios Unidos',
        institucion: 'Institución Educativa Barrios Unidos',
        direccion: 'Barrio Santa Teresa',
        barrio_vereda: 'Santa Teresa',
        numero_zona: 1,
        total_mesas: 24,
        capacidad: 2400,
      },
      {
        id: 'puesto-garzon-4',
        numero: 4,
        nombre: 'Puesto 4 - UN Sur Colombiana',
        institucion: 'Universidad Surcolombiana (Vía Las Termitas)',
        direccion: 'Vía Las Termitas',
        barrio_vereda: 'Vía Las Termitas',
        numero_zona: 2,
        total_mesas: 20,
        capacidad: 2000,
      },
      {
        id: 'puesto-garzon-5',
        numero: 5,
        nombre: 'Puesto 5 - IE Simón Bolívar',
        institucion: 'Institución Educativa Simón Bolívar',
        direccion: 'Barrio Nazareth',
        barrio_vereda: 'Nazareth',
        numero_zona: 2,
        total_mesas: 22,
        capacidad: 2200,
      },
      {
        id: 'puesto-garzon-6',
        numero: 6,
        nombre: 'Puesto 6 - MEG Luis Calixto Leiva',
        institucion: 'Modelo Educativa Genio Luis Calixto Leiva',
        direccion: 'Sector Oriental',
        barrio_vereda: 'Sector Oriental',
        numero_zona: 2,
        total_mesas: 18,
        capacidad: 1800,
      },
      {
        id: 'puesto-garzon-90',
        numero: 90,
        nombre: 'Puesto Rural 90 - El Recreo',
        institucion: 'Escuela Rural El Recreo',
        direccion: 'Vereda El Recreo',
        barrio_vereda: 'El Recreo',
        numero_zona: 99,
        total_mesas: 4,
        capacidad: 400,
      },
      {
        id: 'puesto-garzon-91',
        numero: 91,
        nombre: 'Puesto Rural 91 - El Paraíso',
        institucion: 'Escuela Rural El Paraíso',
        direccion: 'Vereda El Paraíso',
        barrio_vereda: 'El Paraíso',
        numero_zona: 99,
        total_mesas: 3,
        capacidad: 300,
      },
      {
        id: 'puesto-garzon-92',
        numero: 92,
        nombre: 'Puesto Rural 92 - Caguancito',
        institucion: 'Escuela Rural Caguancito',
        direccion: 'Vereda Caguancito',
        barrio_vereda: 'Caguancito',
        numero_zona: 99,
        total_mesas: 3,
        capacidad: 300,
      },
      {
        id: 'puesto-garzon-93',
        numero: 93,
        nombre: 'Puesto Rural 93 - El Mesón',
        institucion: 'Escuela Rural El Mesón',
        direccion: 'Vereda El Mesón',
        barrio_vereda: 'El Mesón',
        numero_zona: 99,
        total_mesas: 2,
        capacidad: 200,
      },
      {
        id: 'puesto-garzon-98',
        numero: 98,
        nombre: 'Puesto Especial 98 - Colegio Cooperativo',
        institucion: 'Colegio Cooperativo de Garzón',
        direccion: 'Sector Centro',
        barrio_vereda: 'Centro',
        numero_zona: 90,
        total_mesas: 8,
        capacidad: 800,
      },
      {
        id: 'puesto-garzon-99',
        numero: 99,
        nombre: 'Puesto Especial 99 - Cárcel Las Mercedes',
        institucion: 'Establecimiento Penitenciario Las Mercedes',
        direccion: 'Sector Rural',
        barrio_vereda: 'Rural',
        numero_zona: 98,
        total_mesas: 5,
        capacidad: 500,
      },
    ];

    for (const p of puestosGarzon) {
      const zonaFound = zonas.find(z => z.numero === p.numero_zona);
      const zonaStr = zonaFound ? zonaFound.nombre : `Zona ${p.numero_zona}`;
      await conn.query(`
        INSERT INTO \`puestos_votacion\` (
          \`id\`, \`departamento\`, \`municipio\`, \`zona\`, \`nombre_puesto\`, \`direccion\`, \`mesas_totales\`,
          \`numero_puesto\`, \`institucion\`, \`barrio_vereda\`, \`id_zona\`, \`municipio_id\`, \`total_mesas\`, \`capacidad_votantes\`, \`estado\`
        ) VALUES (
          ?, 'Huila', 'Garzón', ?, ?, ?, ?,
          ?, ?, ?, (SELECT id_zona FROM zonas_votacion WHERE numero_zona = ? LIMIT 1), 368, ?, ?, 1
        )
        ON DUPLICATE KEY UPDATE
          \`departamento\` = 'Huila',
          \`municipio\` = 'Garzón',
          \`zona\` = VALUES(\`zona\`),
          \`nombre_puesto\` = VALUES(\`nombre_puesto\`),
          \`direccion\` = VALUES(\`direccion\`),
          \`mesas_totales\` = VALUES(\`mesas_totales\`),
          \`numero_puesto\` = VALUES(\`numero_puesto\`),
          \`institucion\` = VALUES(\`institucion\`),
          \`barrio_vereda\` = VALUES(\`barrio_vereda\`),
          \`id_zona\` = VALUES(\`id_zona\`),
          \`municipio_id\` = 368,
          \`total_mesas\` = VALUES(\`total_mesas\`),
          \`capacidad_votantes\` = VALUES(\`capacidad_votantes\`),
          \`estado\` = 1
      `, [
        p.id, zonaStr, p.nombre, p.direccion, p.total_mesas,
        p.numero, p.institucion, p.barrio_vereda, p.numero_zona, p.total_mesas, p.capacidad
      ]);
    }
    console.log('Puestos de Garzón sembrados con éxito.');

    // 4. Crear tabla mesas_votacion
    console.log('4. Creando tabla mesas_votacion...');
    await conn.query(`
      CREATE TABLE IF NOT EXISTS \`mesas_votacion\` (
        \`id_mesa\` INT(8) UNSIGNED NOT NULL AUTO_INCREMENT,
        \`numero_mesa\` INT(4) NOT NULL,
        \`id_puesto\` VARCHAR(36) NOT NULL,
        \`id_zona\` INT(3) UNSIGNED NOT NULL,
        \`municipio_id\` INT(5) UNSIGNED,
        \`codigo_mesa\` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        \`numero_padron\` INT(4),
        \`capacidad_electores\` INT(5),
        \`jurado_principal_nombre\` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        \`jurado_principal_cedula\` VARCHAR(20),
        \`jurado_vicepresidente_nombre\` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        \`jurado_vicepresidente_cedula\` VARCHAR(20),
        \`vocal_1_nombre\` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        \`vocal_1_cedula\` VARCHAR(20),
        \`vocal_2_nombre\` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        \`vocal_2_cedula\` VARCHAR(20),
        \`vocal_3_nombre\` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        \`vocal_3_cedula\` VARCHAR(20),
        \`vocal_4_nombre\` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        \`vocal_4_cedula\` VARCHAR(20),
        \`estado\` TINYINT(1) DEFAULT 1,
        \`fecha_creacion\` DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id_mesa\`),
        UNIQUE KEY \`uq_numero_mesa_puesto\` (\`numero_mesa\`, \`id_puesto\`),
        KEY \`idx_puesto\` (\`id_puesto\`),
        KEY \`idx_zona\` (\`id_zona\`),
        KEY \`idx_municipio_id\` (\`municipio_id\`),
        KEY \`idx_codigo_mesa\` (\`codigo_mesa\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Sembrar mesas para cada puesto según su total_mesas
    console.log('5. Sembrando mesas para todos los puestos de Garzón...');
    for (const p of puestosGarzon) {
      for (let m = 1; m <= p.total_mesas; m++) {
        const codigoMesa = `G-${p.numero}-${String(m).padStart(3, '0')}`;
        await conn.query(`
          INSERT INTO \`mesas_votacion\` (
            \`numero_mesa\`, \`id_puesto\`, \`id_zona\`, \`municipio_id\`, \`codigo_mesa\`, \`numero_padron\`, \`capacidad_electores\`, \`estado\`
          ) VALUES (
            ?, ?, (SELECT id_zona FROM zonas_votacion WHERE numero_zona = ? LIMIT 1), 368, ?, ?, 100, 1
          )
          ON DUPLICATE KEY UPDATE
            \`codigo_mesa\` = VALUES(\`codigo_mesa\`),
            \`capacidad_electores\` = 100,
            \`estado\` = 1
        `, [m, p.id, p.numero_zona, codigoMesa, m]);
      }
    }
    console.log('Mesas sembradas para todos los puestos.');

    console.log('¡Migración y sembrado electoral de Garzón finalizado con éxito!');
  } finally {
    await conn.end();
  }
}

if (require.main === module) {
  seedGarzonVotacion()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Error durante migración de votación:', err);
      process.exit(1);
    });
}
