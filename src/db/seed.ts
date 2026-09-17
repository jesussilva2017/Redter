import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { db, poolConnection } from './index';
import { puestosVotacion, users } from './schema';

dotenv.config();

const seedPuestos = [
  { id: 'puesto-1', departamento: 'Cundinamarca', municipio: 'Bogotá D.C.', zona: 'Zona 1 - Usaquén', nombrePuesto: 'Colegio Claustro Moderno', direccion: 'Cra 7 # 170-20', mesasTotales: 25 },
  { id: 'puesto-2', departamento: 'Cundinamarca', municipio: 'Bogotá D.C.', zona: 'Zona 2 - Chapinero', nombrePuesto: 'Universidad Pedagógica Nacional', direccion: 'Calle 72 # 11-86', mesasTotales: 30 },
  { id: 'puesto-3', departamento: 'Antioquia', municipio: 'Medellín', zona: 'Zona 3 - El Poblado', nombrePuesto: 'I.E. INEM José Félix de Restrepo', direccion: 'Cra 48 # 1-125', mesasTotales: 40 },
  { id: 'puesto-4', departamento: 'Valle del Cauca', municipio: 'Cali', zona: 'Zona 1 - Comuna 2', nombrePuesto: 'Colegio Santa Librada', direccion: 'Calle 5 # 14-00', mesasTotales: 35 },
  { id: 'puesto-5', departamento: 'Atlántico', municipio: 'Barranquilla', zona: 'Zona 2 - Norte', nombrePuesto: 'Universidad del Norte', direccion: 'Km 5 Vía Puerto Colombia', mesasTotales: 45 },
];

async function seed() {
  const defaultPasswordHash = await bcrypt.hash('redter123', 10);

  console.log('Sembrando puestos de votación...');
  for (const puesto of seedPuestos) {
    await db.insert(puestosVotacion).values(puesto).onDuplicateKeyUpdate({ set: puesto });
  }

  console.log('Sembrando usuarios de demostración...');
  const seedUsers = [
    {
      id: 'user-admin',
      nombre: 'Carlos Mendoza (Gerente Campaña)',
      email: 'admin@redter.co',
      cedula: '1018234567',
      passwordHash: defaultPasswordHash,
      telefono: '3001234567',
      role: 'ADMIN_CAMPANA' as const,
      activo: true,
    },
    {
      id: 'user-coord-bogota',
      nombre: 'Dra. Patricia Gómez',
      email: 'coord.bogota@redter.co',
      cedula: '52890123',
      passwordHash: defaultPasswordHash,
      telefono: '3109876543',
      role: 'COORDINADOR' as const,
      departamentoAsignado: 'Cundinamarca',
      municipioAsignado: 'Bogotá D.C.',
      activo: true,
    },
    {
      id: 'user-lider-usaquen',
      nombre: 'Andrés Felipe Restrepo',
      email: 'lider.usaquen@redter.co',
      cedula: '79876543',
      passwordHash: defaultPasswordHash,
      telefono: '3156549870',
      role: 'LIDER' as const,
      parentLeaderId: 'user-coord-bogota',
      departamentoAsignado: 'Cundinamarca',
      municipioAsignado: 'Bogotá D.C.',
      puestoAsignadoId: 'puesto-1',
      activo: true,
    },
    {
      id: 'user-testigo-mesa1',
      nombre: 'Valeria Ríos (Testigo Mesa 1)',
      email: 'testigo.mesa1@redter.co',
      cedula: '1020304050',
      passwordHash: defaultPasswordHash,
      telefono: '3201112233',
      role: 'TESTIGO' as const,
      puestoAsignadoId: 'puesto-1',
      mesaAsignada: 1,
      activo: true,
    },
    {
      id: 'user-voluntario-1',
      nombre: 'Mateo Osorio (Voluntario Jóvenes)',
      email: 'voluntario.mateo@redter.co',
      cedula: '1035444555',
      passwordHash: defaultPasswordHash,
      telefono: '3187778899',
      role: 'VOLUNTARIO' as const,
      departamentoAsignado: 'Cundinamarca',
      municipioAsignado: 'Bogotá D.C.',
      activo: true,
    },
  ];

  for (const user of seedUsers) {
    await db.insert(users).values(user).onDuplicateKeyUpdate({ set: user });
  }

  console.log('Seed completado. Usuarios y puestos de votación listos (contraseña de todos: redter123).');
  await poolConnection.end();
}

seed().catch((err) => {
  console.error('Error al ejecutar el seed:', err);
  process.exit(1);
});
