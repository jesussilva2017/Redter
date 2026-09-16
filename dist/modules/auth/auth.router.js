"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const mockStore_1 = require("../../db/mockStore");
const auth_1 = require("../../middlewares/auth");
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || 'redter_sige_electoral_super_secret_key_2026_colombia';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
exports.authRouter = (0, express_1.Router)();
// POST /api/v1/auth/login
exports.authRouter.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'El correo electrónico es requerido.' });
    }
    // Buscar usuario en el store
    const user = mockStore_1.memoryStore.getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
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
    const token = jsonwebtoken_1.default.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return res.json({
        message: 'Inicio de sesión exitoso',
        token,
        user: tokenPayload,
    });
});
// GET /api/v1/auth/me
exports.authRouter.get('/me', auth_1.authenticate, (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'No autenticado' });
    }
    const user = mockStore_1.memoryStore.getUsers().find((u) => u.id === req.user?.userId);
    if (!user) {
        return res.status(444).json({ error: 'Usuario no encontrado' });
    }
    return res.json({ user });
});
