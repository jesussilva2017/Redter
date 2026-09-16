import { Router } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { memoryStore } from '../../db/mockStore';
import { authenticate, AuthenticatedRequest } from '../../middlewares/auth';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'redter_sige_electoral_super_secret_key_2026_colombia';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const authRouter = Router();

// POST /api/v1/auth/login
authRouter.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'El correo electrónico es requerido.' });
  }

  // Buscar usuario en el store
  const user = memoryStore.getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas. Usuario no encontrado.' });
  }

  if (!user.activo) {
    return res.status(403).json({ error: 'Cuenta inactiva. Contacte al Administrador de Campaña.' });
  }

  // En demo aceptamos cualquier password o redter123
  const tokenPayload = {
    userId: user.id,
    nombre: user.nombre,
    email: user.email,
    role: user.role,
    departamentoAsignado: user.departamentoAsignado,
    municipioAsignado: user.municipioAsignado,
    puestoAsignadoId: user.puestoAsignadoId,
    mesaAsignada: user.mesaAsignada,
  };

  const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });

  return res.json({
    message: 'Inicio de sesión exitoso',
    token,
    user: tokenPayload,
  });
});

// GET /api/v1/auth/me
authRouter.get('/me', authenticate, (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  const user = memoryStore.getUsers().find((u) => u.id === req.user?.userId);
  if (!user) {
    return res.status(444).json({ error: 'Usuario no encontrado' });
  }

  return res.json({ user });
});
