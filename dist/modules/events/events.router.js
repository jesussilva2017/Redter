"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventsRouter = void 0;
const express_1 = require("express");
const mockStore_1 = require("../../db/mockStore");
const auth_1 = require("../../middlewares/auth");
exports.eventsRouter = (0, express_1.Router)();
exports.eventsRouter.use(auth_1.authenticate);
// GET /api/v1/events - Listar eventos de la campaña
exports.eventsRouter.get('/', (req, res) => {
    const events = mockStore_1.memoryStore.getEvents();
    return res.json({ events });
});
// POST /api/v1/events - Crear nuevo evento / reunión
exports.eventsRouter.post('/', (req, res) => {
    const { titulo, descripcion, tipo, departamento, municipio, barrioVereda, direccion, latitude, longitude, fechaInicio, fechaFin, puestoVotacionRelacionadoId, aforoEstimado, } = req.body;
    if (!titulo || !tipo || !fechaInicio || !fechaFin) {
        return res.status(400).json({ error: 'Título, tipo, fecha de inicio y fecha fin son requeridos.' });
    }
    const newEvent = mockStore_1.memoryStore.addEvent({
        titulo,
        descripcion: descripcion || '',
        tipo,
        estado: 'PROGRAMADO',
        departamento: departamento || 'Cundinamarca',
        municipio: municipio || 'Bogotá D.C.',
        barrioVereda: barrioVereda || '',
        direccion: direccion || '',
        latitude: latitude || '',
        longitude: longitude || '',
        fechaInicio,
        fechaFin,
        organizadorUserId: req.user.userId,
        puestoVotacionRelacionadoId,
        aforoEstimado: aforoEstimado ? Number(aforoEstimado) : 0,
    });
    return res.status(201).json({ message: 'Evento agendado exitosamente', event: newEvent });
});
// GET /api/v1/events/tasks - Listar tareas de campaña
exports.eventsRouter.get('/tasks/all', (req, res) => {
    const user = req.user;
    let tasks = mockStore_1.memoryStore.getTasks();
    if (user.role === 'VOLUNTARIO') {
        tasks = tasks.filter(t => t.asignadoAUserId === user.userId);
    }
    return res.json({ tasks });
});
// POST /api/v1/events/tasks - Crear tarea logística
exports.eventsRouter.post('/tasks/all', (req, res) => {
    const { titulo, descripcion, prioridad, asignadoAUserId, fechaLimite, eventId } = req.body;
    if (!titulo || !asignadoAUserId) {
        return res.status(400).json({ error: 'Título y usuario asignado son obligatorios.' });
    }
    const newTask = mockStore_1.memoryStore.addTask({
        titulo,
        descripcion: descripcion || '',
        prioridad: prioridad || 'MEDIA',
        estado: 'PENDIENTE',
        asignadoAUserId,
        creadoPorUserId: req.user.userId,
        fechaLimite,
        eventId,
    });
    return res.status(201).json({ message: 'Tarea creada exitosamente', task: newTask });
});
// PATCH /api/v1/events/tasks/:id - Cambiar estado de tarea
exports.eventsRouter.patch('/tasks/all/:id', (req, res) => {
    const { estado } = req.body;
    const task = mockStore_1.memoryStore.getTasks().find(t => t.id === req.params.id);
    if (!task) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    if (estado) {
        task.estado = estado;
    }
    return res.json({ message: 'Tarea actualizada exitosamente', task });
});
