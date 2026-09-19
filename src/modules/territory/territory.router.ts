import { Router } from 'express';
import { and, eq } from 'drizzle-orm';
import { db } from '../../db';
import { puestosVotacion, departamentos, municipios, barrios, veredas, zonasVotacion, mesasVotacion } from '../../db/schema';
import { asyncHandler } from '../../middlewares/asyncHandler';
import { DEPARTAMENTOS_COLOMBIA, MUNICIPIOS_COLOMBIA } from '../../data/colombiaData';
import { BARRIOS_GARZON, VEREDAS_GARZON } from '../../data/garzonData';
import { ZONAS_VOTACION_GARZON, PUESTOS_VOTACION_GARZON, MESAS_VOTACION_GARZON } from '../../data/garzonVotacionData';

export const territoryRouter = Router();

// GET /api/v1/territory/departamentos - Lista de departamentos de Colombia (DANE)
territoryRouter.get('/departamentos', asyncHandler(async (_req, res) => {
  try {
    const list = await db.select().from(departamentos).orderBy(departamentos.departamento);
    if (list && list.length > 0) {
      return res.json({
        departamentos: list.map(d => ({
          id: d.idDepartamento,
          nombre: d.departamento,
        })),
      });
    }
  } catch (err) {
    console.warn('Fallback a datos estáticos DANE para departamentos:', err);
  }

  return res.json({
    departamentos: DEPARTAMENTOS_COLOMBIA.map(d => ({
      id: d.id,
      nombre: d.nombre,
    })),
  });
}));

// GET /api/v1/territory/municipios - Lista de municipios de Colombia (DANE)
territoryRouter.get('/municipios', asyncHandler(async (req, res) => {
  const { departamentoId, departamento, q } = req.query;

  try {
    let queryConditions = [];
    if (departamentoId) {
      queryConditions.push(eq(municipios.departamentoId, Number(departamentoId)));
    } else if (departamento) {
      // Buscar el departamento por nombre primero
      const deptoFound = DEPARTAMENTOS_COLOMBIA.find(
        d => d.nombre.toUpperCase() === String(departamento).toUpperCase()
      );
      if (deptoFound) {
        queryConditions.push(eq(municipios.departamentoId, deptoFound.id));
      }
    }

    const list = queryConditions.length
      ? await db.select().from(municipios).where(and(...queryConditions)).orderBy(municipios.municipio)
      : await db.select().from(municipios).orderBy(municipios.municipio);

    if (list && list.length > 0) {
      let filtered = list.map(m => ({
        id: m.idMunicipio,
        nombre: m.municipio,
        estado: m.estado,
        departamentoId: m.departamentoId,
      }));

      if (q) {
        const term = String(q).toLowerCase();
        filtered = filtered.filter(m => m.nombre.toLowerCase().includes(term));
      }

      return res.json({ municipios: filtered });
    }
  } catch (err) {
    console.warn('Fallback a datos estáticos DANE para municipios:', err);
  }

  let filtered = [...MUNICIPIOS_COLOMBIA];
  if (departamentoId) {
    filtered = filtered.filter(m => m.departamentoId === Number(departamentoId));
  } else if (departamento) {
    const deptoFound = DEPARTAMENTOS_COLOMBIA.find(
      d => d.nombre.toUpperCase() === String(departamento).toUpperCase()
    );
    if (deptoFound) {
      filtered = filtered.filter(m => m.departamentoId === deptoFound.id);
    }
  }

  if (q) {
    const term = String(q).toLowerCase();
    filtered = filtered.filter(m => m.nombre.toLowerCase().includes(term));
  }

  return res.json({
    municipios: filtered.map(m => ({
      id: m.id,
      nombre: m.nombre,
      estado: m.estado,
      departamentoId: m.departamentoId,
    })),
  });
}));

// GET /api/v1/territory/zonas - Zonas de votación (Garzón y general)
territoryRouter.get('/zonas', asyncHandler(async (req, res) => {
  const { municipioId, q } = req.query;
  try {
    const list = await db.select().from(zonasVotacion).orderBy(zonasVotacion.numeroZona);
    if (list && list.length > 0) {
      let filtered = list.map(z => ({
        id: z.idZona,
        numero: z.numeroZona,
        nombre: z.nombreZona,
        descripcion: z.descripcion,
        tipo: z.tipoZona,
        municipioId: z.municipioId,
      }));
      if (municipioId) {
        filtered = filtered.filter(z => z.municipioId === Number(municipioId));
      }
      if (q) {
        const term = String(q).toLowerCase();
        filtered = filtered.filter(z => z.nombre.toLowerCase().includes(term));
      }
      return res.json({ zonas: filtered });
    }
  } catch (err) {
    console.warn('Fallback a datos estáticos para zonas_votacion:', err);
  }

  let filtered = [...ZONAS_VOTACION_GARZON];
  if (q) {
    const term = String(q).toLowerCase();
    filtered = filtered.filter(z => z.nombre.toLowerCase().includes(term));
  }
  return res.json({ zonas: filtered });
}));

// GET /api/v1/territory/puestos - Puestos de votación en Colombia
territoryRouter.get('/puestos', asyncHandler(async (req, res) => {
  const { departamento, municipio, idZona, zona, q } = req.query;

  try {
    const conditions = [];
    if (departamento) {
      conditions.push(eq(puestosVotacion.departamento, String(departamento)));
    }
    if (municipio) {
      conditions.push(eq(puestosVotacion.municipio, String(municipio)));
    }
    if (idZona) {
      conditions.push(eq(puestosVotacion.idZona, Number(idZona)));
    }

    const puestos = conditions.length
      ? await db.select().from(puestosVotacion).where(and(...conditions))
      : await db.select().from(puestosVotacion);

    if (puestos && puestos.length > 0) {
      let result = puestos;
      if (zona) {
        const zTerm = String(zona).toLowerCase();
        const zNum = zTerm.match(/zona\s*(\d+)/i)?.[1];
        result = result.filter(p => {
          if (!p.zona) return false;
          const pz = p.zona.toLowerCase();
          const pzNum = pz.match(/zona\s*(\d+)/i)?.[1];
          if (zNum && pzNum && zNum === pzNum) return true;
          return pz.includes(zTerm) || zTerm.includes(pz);
        });
      }
      if (q) {
        const term = String(q).toLowerCase();
        result = result.filter(p =>
          p.nombrePuesto.toLowerCase().includes(term) ||
          (p.institucion && p.institucion.toLowerCase().includes(term)) ||
          (p.barrioVereda && p.barrioVereda.toLowerCase().includes(term))
        );
      }
      return res.json({ puestos: result });
    }
  } catch (err) {
    console.warn('Fallback a datos estáticos para puestos_votacion:', err);
  }

  // Fallback si es Garzón o búsqueda
  let result = [...PUESTOS_VOTACION_GARZON];
  if (idZona) {
    result = result.filter(p => p.idZona === Number(idZona));
  }
  if (zona) {
    const zTerm = String(zona).toLowerCase();
    const zNum = zTerm.match(/zona\s*(\d+)/i)?.[1];
    result = result.filter(p => {
      if (!p.zona) return false;
      const pz = p.zona.toLowerCase();
      const pzNum = pz.match(/zona\s*(\d+)/i)?.[1];
      if (zNum && pzNum && zNum === pzNum) return true;
      return pz.includes(zTerm) || zTerm.includes(pz);
    });
  }
  if (q) {
    const term = String(q).toLowerCase();
    result = result.filter(p =>
      p.nombre.toLowerCase().includes(term) ||
      p.institucion.toLowerCase().includes(term) ||
      p.barrioVereda.toLowerCase().includes(term)
    );
  }
  return res.json({ puestos: result });
}));

// GET /api/v1/territory/mesas - Mesas de votación
territoryRouter.get('/mesas', asyncHandler(async (req, res) => {
  const { puestoId, zonaId, q } = req.query;

  try {
    const conditions = [];
    if (puestoId) {
      conditions.push(eq(mesasVotacion.idPuesto, String(puestoId)));
    }
    if (zonaId) {
      conditions.push(eq(mesasVotacion.idZona, Number(zonaId)));
    }

    const mesas = conditions.length
      ? await db.select().from(mesasVotacion).where(and(...conditions)).orderBy(mesasVotacion.numeroMesa)
      : await db.select().from(mesasVotacion).orderBy(mesasVotacion.numeroMesa);

    if (mesas && mesas.length > 0) {
      let result = mesas.map(m => ({
        id: m.idMesa,
        numero: m.numeroMesa,
        puestoId: m.idPuesto,
        zonaId: m.idZona,
        codigo: m.codigoMesa,
        numeroPadron: m.numeroPadron,
        capacidadElectores: m.capacidadElectores,
      }));
      if (q) {
        const term = String(q).toLowerCase();
        result = result.filter(m => (m.codigo && m.codigo.toLowerCase().includes(term)) || String(m.numero) === term);
      }
      return res.json({ mesas: result });
    }
  } catch (err) {
    console.warn('Fallback a datos estáticos para mesas_votacion:', err);
  }

  let result = [...MESAS_VOTACION_GARZON];
  if (puestoId) {
    result = result.filter(m => m.puestoId === String(puestoId));
  }
  if (zonaId) {
    result = result.filter(m => m.zonaId === Number(zonaId));
  }
  if (q) {
    const term = String(q).toLowerCase();
    result = result.filter(m => (m.codigo && m.codigo.toLowerCase().includes(term)) || String(m.numero) === term);
  }
  return res.json({ mesas: result });
}));

// GET /api/v1/territory/barrios - Barrios de Garzón (Zona Urbana)
territoryRouter.get('/barrios', asyncHandler(async (req, res) => {
  const { q } = req.query;
  try {
    const list = await db.select().from(barrios).orderBy(barrios.nombre);
    if (list && list.length > 0) {
      let filtered = list.map(b => ({
        id: b.idBarrio,
        nombre: b.nombre,
        codigoPostal: b.codigoPostal,
        descripcion: b.descripcion,
      }));
      if (q) {
        const term = String(q).toLowerCase();
        filtered = filtered.filter(b => b.nombre.toLowerCase().includes(term));
      }
      return res.json({ barrios: filtered });
    }
  } catch (err) {
    console.warn('Fallback a datos estáticos para barrios:', err);
  }

  let filtered = [...BARRIOS_GARZON];
  if (q) {
    const term = String(q).toLowerCase();
    filtered = filtered.filter(b => b.nombre.toLowerCase().includes(term));
  }
  return res.json({ barrios: filtered });
}));

// GET /api/v1/territory/veredas - Veredas de Garzón (Zona Rural)
territoryRouter.get('/veredas', asyncHandler(async (req, res) => {
  const { q } = req.query;
  try {
    const list = await db.select().from(veredas).orderBy(veredas.nombre);
    if (list && list.length > 0) {
      let filtered = list.map(v => ({
        id: v.idVereda,
        nombre: v.nombre,
        descripcion: v.descripcion,
      }));
      if (q) {
        const term = String(q).toLowerCase();
        filtered = filtered.filter(v => v.nombre.toLowerCase().includes(term));
      }
      return res.json({ veredas: filtered });
    }
  } catch (err) {
    console.warn('Fallback a datos estáticos para veredas:', err);
  }

  let filtered = [...VEREDAS_GARZON];
  if (q) {
    const term = String(q).toLowerCase();
    filtered = filtered.filter(v => v.nombre.toLowerCase().includes(term));
  }
  return res.json({ veredas: filtered });
}));
