import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { users } from '../../db/schema';
import { authenticate, AuthenticatedRequest } from '../../middlewares/auth';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'redter_sige_electoral_super_secret_key_2026_colombia';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const authRouter = Router();

// POST /api/v1/auth/login — usuario: cédula, contraseña: password
authRouter.post('/login', async (req, res) => {
  const { cedula, password } = req.body;

  if (!cedula || !password) {
    return res.status(400).json({ error: 'La cédula y la contraseña son requeridas.' });
  }

  // Buscar usuario por cédula (usuario de login)
  const [user] = await db.select().from(users).where(eq(users.cedula, String(cedula).trim())).limit(1);

  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas.' });
  }

  if (!user.activo) {
    return res.status(403).json({ error: 'Cuenta inactiva. Contacte al Administrador de Campaña.' });
  }

  const passwordValida = await bcrypt.compare(password, user.passwordHash);
  if (!passwordValida) {
    return res.status(401).json({ error: 'Credenciales inválidas.' });
  }

  const tokenPayload = {
    userId: user.id,
    nombre: user.nombre,
    email: user.email,
    cedula: user.cedula,
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
authRouter.get('/me', authenticate, async (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  const [user] = await db.select().from(users).where(eq(users.id, req.user.userId)).limit(1);
  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  const { passwordHash, ...safeUser } = user;
  return res.json({ user: safeUser });
});
