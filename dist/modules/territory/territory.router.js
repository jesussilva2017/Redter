"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.territoryRouter = void 0;
const express_1 = require("express");
const mockStore_1 = require("../../db/mockStore");
exports.territoryRouter = (0, express_1.Router)();
// GET /api/v1/territory/puestos - Puestos de votación en Colombia
exports.territoryRouter.get('/puestos', (req, res) => {
    const { departamento, municipio } = req.query;
    let puestos = mockStore_1.memoryStore.getPuestos();
    if (departamento) {
        puestos = puestos.filter(p => p.departamento.toLowerCase() === String(departamento).toLowerCase());
    }
    if (municipio) {
        puestos = puestos.filter(p => p.municipio.toLowerCase() === String(municipio).toLowerCase());
    }
    return res.json({ puestos });
});
