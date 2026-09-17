import { Router } from 'express';
import { and, eq } from 'drizzle-orm';
import { db } from '../../db';
import { puestosVotacion } from '../../db/schema';
import { asyncHandler } from '../../middlewares/asyncHandler';

export const territoryRouter = Router();

// GET /api/v1/territory/puestos - Puestos de votación en Colombia
territoryRouter.get('/puestos', asyncHandler(async (req, res) => {
  const { departamento, municipio } = req.query;

  const conditions = [];
  if (departamento) {
    conditions.push(eq(puestosVotacion.departamento, String(departamento)));
  }
  if (municipio) {
    conditions.push(eq(puestosVotacion.municipio, String(municipio)));
  }

  const puestos = conditions.length
    ? await db.select().from(puestosVotacion).where(and(...conditions))
    : await db.select().from(puestosVotacion);

  return res.json({ puestos });
}));
