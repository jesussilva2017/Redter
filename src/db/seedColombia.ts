import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import { DEPARTAMENTOS_COLOMBIA, MUNICIPIOS_COLOMBIA } from '../data/colombiaData';

dotenv.config();

const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbPort = Number(process.env.DB_PORT) || 3306;
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbName = process.env.DB_NAME || 'u395420986_redter';

export async function seedColombiaDatabase() {
  console.log('Conectando a MySQL para sembrar departamentos y municipios de Colombia (DANE)...');
  const connection = await mysql.createConnection({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: dbName,
  });

  try {
    console.log('1. Creando tabla departamentos (DANE)...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`departamentos\` (
        \`id_departamento\` int(2) unsigned NOT NULL,
        \`departamento\` varchar(255) NOT NULL DEFAULT '',
        PRIMARY KEY (\`id_departamento\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log('2. Sembrando departamentos...');
    for (const d of DEPARTAMENTOS_COLOMBIA) {
      await connection.query(
        `INSERT INTO \`departamentos\` (\`id_departamento\`, \`departamento\`)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE \`departamento\` = VALUES(\`departamento\`)`,
        [d.id, d.nombre]
      );
    }
    console.log(`Departamentos procesados: ${DEPARTAMENTOS_COLOMBIA.length}`);

    console.log('3. Creando tabla municipios (DANE)...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`municipios\` (
        \`id_municipio\` int(6) unsigned NOT NULL,
        \`municipio\` varchar(255) NOT NULL DEFAULT '',
        \`estado\` int(1) unsigned NOT NULL DEFAULT 1,
        \`departamento_id\` int(2) unsigned NOT NULL,
        PRIMARY KEY (\`id_municipio\`),
        KEY \`departamento_id\` (\`departamento_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log('4. Sembrando municipios en lotes...');
    const chunkSize = 100;
    for (let i = 0; i < MUNICIPIOS_COLOMBIA.length; i += chunkSize) {
      const chunk = MUNICIPIOS_COLOMBIA.slice(i, i + chunkSize);
      const placeholders = chunk.map(() => '(?, ?, ?, ?)').join(', ');
      const values: any[] = [];
      for (const m of chunk) {
        values.push(m.id, m.nombre, m.estado, m.departamentoId);
      }
      await connection.query(
        `INSERT INTO \`municipios\` (\`id_municipio\`, \`municipio\`, \`estado\`, \`departamento_id\`)
         VALUES ${placeholders}
         ON DUPLICATE KEY UPDATE
           \`municipio\` = VALUES(\`municipio\`),
           \`estado\` = VALUES(\`estado\`),
           \`departamento_id\` = VALUES(\`departamento_id\`)`,
        values
      );
    }
    console.log(`Municipios procesados: ${MUNICIPIOS_COLOMBIA.length}`);

    console.log('5. Verificando columna departamento_nacimiento en tabla voters...');
    const [cols]: any = await connection.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'voters' AND COLUMN_NAME = 'departamento_nacimiento'
    `, [dbName]);

    if (!cols || cols.length === 0) {
      console.log('Agregando columna departamento_nacimiento a tabla voters...');
      await connection.query(`
        ALTER TABLE \`voters\`
        ADD COLUMN \`departamento_nacimiento\` VARCHAR(100) NULL AFTER \`fecha_nacimiento\`
      `);
      console.log('Columna departamento_nacimiento agregada.');
    } else {
      console.log('La columna departamento_nacimiento ya existe en tabla voters.');
    }

    console.log('¡Base de datos actualizada con éxito con departamentos y municipios de Colombia!');
  } finally {
    await connection.end();
  }
}

if (require.main === module) {
  seedColombiaDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Error al sembrar base de datos:', err);
      process.exit(1);
    });
}
