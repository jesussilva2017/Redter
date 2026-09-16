import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'redter_sige_electoral_super_secret_key_2026_colombia';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN_CAMPANA' | 'COORDINADOR' | 'LIDER' | 'TESTIGO' | 'VOLUNTARIO';

export interface TokenPayload {
  userId: string;
  nombre: string;
  email: string;
  cedula: string;
  role: UserRole;
  departamentoAsignado?: string | null;
  municipioAsignado?: string | null;
  puestoAsignadoId?: string | null;
  mesaAsignada?: number | null;
}

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
  scopeFilter?: {
    userRole: UserRole;
    userId: string;
    departamento?: string | null;
    municipio?: string | null;
    puestoId?: string | null;
    mesa?: number | null;
  };
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso no autorizado: Token JWT no proporcionado' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    req.user = decoded;
    
    // Inyectar filtro de ámbito / scoping
    req.scopeFilter = {
      userRole: decoded.role,
      userId: decoded.userId,
      departamento: decoded.departamentoAsignado,
      municipio: decoded.municipioAsignado,
      puestoId: decoded.puestoAsignadoId,
      mesa: decoded.mesaAsignada,
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Acceso no autorizado: Token inválido o expirado' });
  }
};

export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Acceso denegado: El rol '${req.user.role}' no tiene permiso para acceder a este módulo.`
      });
    }

    next();
  };
};
