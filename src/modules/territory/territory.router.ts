import { Router } from 'express';
import { memoryStore } from '../../db/mockStore';

export const territoryRouter = Router();

// GET /api/v1/territory/puestos - Puestos de votación en Colombia
territoryRouter.get('/puestos', (req, res) => {
  const { departamento, municipio } = req.query;
  let puestos = memoryStore.getPuestos();

  if (departamento) {
    puestos = puestos.filter(p => p.departamento.toLowerCase() === String(departamento).toLowerCase());
  }

  if (municipio) {
    puestos = puestos.filter(p => p.municipio.toLowerCase() === String(municipio).toLowerCase());
  }

  return res.json({ puestos });
});
