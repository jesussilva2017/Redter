import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { memoryStore, MockUser } from '../../db/mockStore';
import { authenticate, authorizeRoles, AuthenticatedRequest } from '../../middlewares/auth';

export const usersRouter = Router();

const sanitize = (user: MockUser) => {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
};

// Middleware obligatorio de Auth
usersRouter.use(authenticate);

// GET /api/v1/users - Listar usuarios según jerarquía/scoping, con buscador y filtro de rol
usersRouter.get('/', authorizeRoles('SUPER_ADMIN', 'ADMIN_CAMPANA', 'COORDINADOR', 'LIDER'), (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  let allUsers = memoryStore.getUsers();

  // Filtrado por scoping ABAC
  if (user.role === 'COORDINADOR') {
    allUsers = allUsers.filter(u =>
      u.id === user.userId ||
      u.parentLeaderId === user.userId ||
      (user.municipioAsignado && u.municipioAsignado === user.municipioAsignado)
    );
  } else if (user.role === 'LIDER') {
    allUsers = allUsers.filter(u => u.id === user.userId || u.parentLeaderId === user.userId);
  }

  // Filtro por rol
  const { role, q } = req.query;
  if (role) {
    allUsers = allUsers.filter(u => u.role === role);
  }

  // Buscador libre (nombre, email, cédula)
  if (q) {
    const term = String(q).toLowerCase();
    allUsers = allUsers.filter(u =>
      u.nombre.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.cedula.toLowerCase().includes(term)
    );
  }

  return res.json({ users: allUsers.map(sanitize) });
});

// POST /api/v1/users - Crear nuevo usuario (Admin/Coordinador)
usersRouter.post('/', authorizeRoles('SUPER_ADMIN', 'ADMIN_CAMPANA', 'COORDINADOR'), async (req: AuthenticatedRequest, res) => {
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

  // Verificar duplicados de email y cédula (cédula es el usuario de login)
  const existingEmail = memoryStore.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingEmail) {
    return res.status(400).json({ error: 'Ya existe un usuario registrado con este correo electrónico.' });
  }
  const existingCedula = memoryStore.findUserByCedula(String(cedula).trim());
  if (existingCedula) {
    return res.status(400).json({ error: 'Ya existe un usuario registrado con esta cédula.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = memoryStore.addUser({
    nombre,
    email,
    cedula: String(cedula).trim(),
    passwordHash,
    telefono: telefono || '',
    role,
    parentLeaderId: parentLeaderId || req.user?.userId,
    departamentoAsignado: departamentoAsignado || 'Cundinamarca',
    municipioAsignado: municipioAsignado || 'Bogotá D.C.',
    puestoAsignadoId,
    mesaAsignada: mesaAsignada ? Number(mesaAsignada) : null,
    activo: true,
  });

  return res.status(201).json({ message: 'Usuario creado exitosamente', user: sanitize(newUser) });
});

// GET /api/v1/users/:id
usersRouter.get('/:id', (req: AuthenticatedRequest, res) => {
  const user = memoryStore.getUsers().find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  return res.json({ user: sanitize(user) });
});

// PUT /api/v1/users/:id - Editar usuario existente (recarga en el mismo modal en el cliente)
usersRouter.put('/:id', authorizeRoles('SUPER_ADMIN', 'ADMIN_CAMPANA', 'COORDINADOR'), async (req: AuthenticatedRequest, res) => {
  const existing = memoryStore.getUsers().find(u => u.id === req.params.id);
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

  const duplicateEmail = memoryStore.getUsers().find(
    u => u.id !== existing.id && u.email.toLowerCase() === email.toLowerCase()
  );
  if (duplicateEmail) {
    return res.status(400).json({ error: 'Ya existe otro usuario con este correo electrónico.' });
  }
  const duplicateCedula = memoryStore.getUsers().find(
    u => u.id !== existing.id && u.cedula === String(cedula).trim()
  );
  if (duplicateCedula) {
    return res.status(400).json({ error: 'Ya existe otro usuario con esta cédula.' });
  }

  const changes: Partial<MockUser> = {
    nombre,
    email,
    cedula: String(cedula).trim(),
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

  const updated = memoryStore.updateUser(existing.id, changes);
  return res.json({ message: 'Usuario actualizado exitosamente', user: sanitize(updated!) });
});

// PATCH /api/v1/users/:id/activo - Alternar estado activo/inactivo
usersRouter.patch('/:id/activo', authorizeRoles('SUPER_ADMIN', 'ADMIN_CAMPANA', 'COORDINADOR'), (req: AuthenticatedRequest, res) => {
  const existing = memoryStore.getUsers().find(u => u.id === req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  const updated = memoryStore.updateUser(existing.id, { activo: !existing.activo });
  return res.json({ message: 'Estado actualizado', user: sanitize(updated!) });
});

// DELETE /api/v1/users/:id - Eliminar usuario (confirmado previamente en el cliente)
usersRouter.delete('/:id', authorizeRoles('SUPER_ADMIN', 'ADMIN_CAMPANA', 'COORDINADOR'), (req: AuthenticatedRequest, res) => {
  const existing = memoryStore.getUsers().find(u => u.id === req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  if (existing.id === req.user?.userId) {
    return res.status(400).json({ error: 'No puedes eliminar tu propio usuario.' });
  }

  memoryStore.deleteUser(existing.id);
  return res.json({ message: 'Usuario eliminado exitosamente' });
});
