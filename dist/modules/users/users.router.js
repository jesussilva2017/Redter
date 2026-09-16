"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = require("express");
const mockStore_1 = require("../../db/mockStore");
const auth_1 = require("../../middlewares/auth");
exports.usersRouter = (0, express_1.Router)();
// Middleware obligatorio de Auth
exports.usersRouter.use(auth_1.authenticate);
// GET /api/v1/users - Listar usuarios según jerarquía/scoping
exports.usersRouter.get('/', (0, auth_1.authorizeRoles)('SUPER_ADMIN', 'ADMIN_CAMPANA', 'COORDINADOR', 'LIDER'), (req, res) => {
    const user = req.user;
    let allUsers = mockStore_1.memoryStore.getUsers();
    // Filtrado por scoping ABAC
    if (user.role === 'COORDINADOR') {
        allUsers = allUsers.filter(u => u.id === user.userId ||
            u.parentLeaderId === user.userId ||
            (user.municipioAsignado && u.municipioAsignado === user.municipioAsignado));
    }
    else if (user.role === 'LIDER') {
        allUsers = allUsers.filter(u => u.id === user.userId || u.parentLeaderId === user.userId);
    }
    return res.json({ users: allUsers });
});
// POST /api/v1/users - Crear nuevo usuario (Admin/Coordinador)
exports.usersRouter.post('/', (0, auth_1.authorizeRoles)('SUPER_ADMIN', 'ADMIN_CAMPANA', 'COORDINADOR'), (req, res) => {
    const { nombre, email, cedula, telefono, role, parentLeaderId, departamentoAsignado, municipioAsignado, puestoAsignadoId, mesaAsignada, } = req.body;
    if (!nombre || !email || !role) {
        return res.status(400).json({ error: 'Nombre, email y rol son requeridos.' });
    }
    // Verificar duplicados de email
    const existing = mockStore_1.memoryStore.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
        return res.status(400).json({ error: 'Ya existe un usuario registrado con este correo electrónico.' });
    }
    const newUser = mockStore_1.memoryStore.addUser({
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
exports.usersRouter.get('/:id', (req, res) => {
    const user = mockStore_1.memoryStore.getUsers().find(u => u.id === req.params.id);
    if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    return res.json({ user });
});
