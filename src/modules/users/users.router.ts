import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { and, eq, like, or } from 'drizzle-orm';
import { db } from '../../db';
import { users } from '../../db/schema';
import { authenticate, authorizeRoles, AuthenticatedRequest } from '../../middlewares/auth';
import { asyncHandler } from '../../middlewares/asyncHandler';

export const usersRouter = Router();

type UserRow = typeof users.$inferSelect;

const sanitize = (user: UserRow) => {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
};

// Middleware obligatorio de Auth
usersRouter.use(authenticate);

// GET /api/v1/users - Listar usuarios según jerarquía/scoping, con buscador y filtro de rol
usersRouter.get('/', authorizeRoles('SUPER_ADMIN', 'ADMIN_CAMPANA', 'COORDINADOR', 'LIDER'), asyncHandler(async (req: AuthenticatedRequest, res) => {
  const currentUser = req.user!;
  const { role, q } = req.query;

  const conditions = [];
  if (role) {
    conditions.push(eq(users.role, role as UserRow['role']));
  }
  if (q) {
    const term = `%${String(q)}%`;
    conditions.push(or(like(users.nombre, term), like(users.email, term), like(users.cedula, term)));
  }

  let allUsers = conditions.length
    ? await db.select().from(users).where(and(...conditions))
    : await db.select().from(users);

  // Filtrado por scoping ABAC
  if (currentUser.role === 'COORDINADOR') {
    allUsers = allUsers.filter(u =>
      u.id === currentUser.userId ||
      u.parentLeaderId === currentUser.userId ||
      (currentUser.municipioAsignado && u.municipioAsignado === currentUser.municipioAsignado)
    );
  } else if (currentUser.role === 'LIDER') {
    allUsers = allUsers.filter(u => u.id === currentUser.userId || u.parentLeaderId === currentUser.userId);
  }

  return res.json({ users: allUsers.map(sanitize) });
}));

// POST /api/v1/users - Crear nuevo usuario (Admin/Coordinador)
usersRouter.post('/', authorizeRoles('SUPER_ADMIN', 'ADMIN_CAMPANA', 'COORDINADOR'), asyncHandler(async (req: AuthenticatedRequest, res) => {
  const {
    nombre,
    email,
    cedula,
    password,
    telefono,
    role,
    parentLeaderId,
    departamentoAsignado,
    municipioAsignado,
    puestoAsignadoId,
    mesaAsignada,
  } = req.body;

  if (!nombre || !email || !cedula || !password || !role) {
    return res.status(400).json({ error: 'Nombre, email, cédula, contraseña y rol son requeridos.' });
  }

  const cedulaLimpia = String(cedula).trim();

  const [existingEmail] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existingEmail) {
    return res.status(400).json({ error: 'Ya existe un usuario registrado con este correo electrónico.' });
  }
  const [existingCedula] = await db.select().from(users).where(eq(users.cedula, cedulaLimpia)).limit(1);
  if (existingCedula) {
    return res.status(400).json({ error: 'Ya existe un usuario registrado con esta cédula.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser: UserRow = {
    id: `user-${uuidv4().substring(0, 8)}`,
    nombre,
    email,
    cedula: cedulaLimpia,
    passwordHash,
    telefono: telefono || '',
    role,
    parentLeaderId: parentLeaderId || req.user?.userId || null,
    departamentoAsignado: departamentoAsignado || 'Cundinamarca',
    municipioAsignado: municipioAsignado || 'Bogotá D.C.',
    puestoAsignadoId: puestoAsignadoId || null,
    mesaAsignada: mesaAsignada ? Number(mesaAsignada) : null,
    activo: true,
    createdAt: new Date(),
  };

  await db.insert(users).values(newUser);

  return res.status(201).json({ message: 'Usuario creado exitosamente', user: sanitize(newUser) });
}));

// GET /api/v1/users/:id
usersRouter.get('/:id', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const [user] = await db.select().from(users).where(eq(users.id, req.params.id)).limit(1);
  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  return res.json({ user: sanitize(user) });
}));

// PUT /api/v1/users/:id - Editar usuario existente (recarga en el mismo modal en el cliente)
usersRouter.put('/:id', authorizeRoles('SUPER_ADMIN', 'ADMIN_CAMPANA', 'COORDINADOR'), asyncHandler(async (req: AuthenticatedRequest, res) => {
  const [existing] = await db.select().from(users).where(eq(users.id, req.params.id)).limit(1);
  if (!existing) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  const {
    nombre,
    email,
    cedula,
    password,
    telefono,
    role,
    departamentoAsignado,
    municipioAsignado,
    puestoAsignadoId,
    mesaAsignada,
  } = req.body;

  if (!nombre || !email || !cedula || !role) {
    return res.status(400).json({ error: 'Nombre, email, cédula y rol son requeridos.' });
  }

  const cedulaLimpia = String(cedula).trim();

  const [duplicateEmail] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (duplicateEmail && duplicateEmail.id !== existing.id) {
    return res.status(400).json({ error: 'Ya existe otro usuario con este correo electrónico.' });
  }
  const [duplicateCedula] = await db.select().from(users).where(eq(users.cedula, cedulaLimpia)).limit(1);
  if (duplicateCedula && duplicateCedula.id !== existing.id) {
    return res.status(400).json({ error: 'Ya existe otro usuario con esta cédula.' });
  }

  const changes: Partial<UserRow> = {
    nombre,
    email,
    cedula: cedulaLimpia,
    telefono: telefono || '',
    role,
    departamentoAsignado,
    municipioAsignado,
    puestoAsignadoId,
    mesaAsignada: mesaAsignada ? Number(mesaAsignada) : null,
  };

  // La contraseña solo se actualiza si el usuario escribió una nueva
  if (password) {
    changes.passwordHash = await bcrypt.hash(password, 10);
  }

  await db.update(users).set(changes).where(eq(users.id, existing.id));
  const [updated] = await db.select().from(users).where(eq(users.id, existing.id)).limit(1);

  return res.json({ message: 'Usuario actualizado exitosamente', user: sanitize(updated) });
}));

// PATCH /api/v1/users/:id/activo - Alternar estado activo/inactivo
usersRouter.patch('/:id/activo', authorizeRoles('SUPER_ADMIN', 'ADMIN_CAMPANA', 'COORDINADOR'), asyncHandler(async (req: AuthenticatedRequest, res) => {
  const [existing] = await db.select().from(users).where(eq(users.id, req.params.id)).limit(1);
  if (!existing) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  await db.update(users).set({ activo: !existing.activo }).where(eq(users.id, existing.id));
  const [updated] = await db.select().from(users).where(eq(users.id, existing.id)).limit(1);

  return res.json({ message: 'Estado actualizado', user: sanitize(updated) });
}));

// DELETE /api/v1/users/:id - Eliminar usuario (confirmado previamente en el cliente)
usersRouter.delete('/:id', authorizeRoles('SUPER_ADMIN', 'ADMIN_CAMPANA', 'COORDINADOR'), asyncHandler(async (req: AuthenticatedRequest, res) => {
  const [existing] = await db.select().from(users).where(eq(users.id, req.params.id)).limit(1);
  if (!existing) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  if (existing.id === req.user?.userId) {
    return res.status(400).json({ error: 'No puedes eliminar tu propio usuario.' });
  }

  await db.delete(users).where(eq(users.id, existing.id));
  return res.json({ message: 'Usuario eliminado exitosamente' });
}));
