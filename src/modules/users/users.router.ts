import { Router } from 'express';
import { memoryStore, MockUser } from '../../db/mockStore';
import { authenticate, authorizeRoles, AuthenticatedRequest } from '../../middlewares/auth';

export const usersRouter = Router();

// Middleware obligatorio de Auth
usersRouter.use(authenticate);

// GET /api/v1/users - Listar usuarios según jerarquía/scoping
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

  return res.json({ users: allUsers });
});

// POST /api/v1/users - Crear nuevo usuario (Admin/Coordinador)
usersRouter.post('/', authorizeRoles('SUPER_ADMIN', 'ADMIN_CAMPANA', 'COORDINADOR'), (req: AuthenticatedRequest, res) => {
  const {
    nombre,
    email,
    cedula,
    telefono,
    role,
    parentLeaderId,
    departamentoAsignado,
    municipioAsignado,
    puestoAsignadoId,
    mesaAsignada,
  } = req.body;

  if (!nombre || !email || !role) {
    return res.status(400).json({ error: 'Nombre, email y rol son requeridos.' });
  }

  // Verificar duplicados de email
  const existing = memoryStore.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'Ya existe un usuario registrado con este correo electrónico.' });
  }

  const newUser = memoryStore.addUser({
    nombre,
    email,
    cedula: cedula || '',
    telefono: telefono || '',
    role,
    parentLeaderId: parentLeaderId || req.user?.userId,
    departamentoAsignado: departamentoAsignado || 'Cundinamarca',
    municipioAsignado: municipioAsignado || 'Bogotá D.C.',
    puestoAsignadoId,
    mesaAsignada: mesaAsignada ? Number(mesaAsignada) : null,
    activo: true,
  });

  return res.status(201).json({ message: 'Usuario creado exitosamente', user: newUser });
});

// GET /api/v1/users/:id
usersRouter.get('/:id', (req: AuthenticatedRequest, res) => {
  const user = memoryStore.getUsers().find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  return res.json({ user });
});
