"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || 'redter_sige_electoral_super_secret_key_2026_colombia';
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acceso no autorizado: Token JWT no proporcionado' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
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
    }
    catch (err) {
        return res.status(401).json({ error: 'Acceso no autorizado: Token inválido o expirado' });
    }
};
exports.authenticate = authenticate;
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
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
exports.authorizeRoles = authorizeRoles;
