export interface ZonaVotacionItem {
  id: number;
  numero: number;
  nombre: string;
  descripcion?: string;
  tipo: 'urbana' | 'rural' | 'especial';
}

export interface PuestoGarzonItem {
  id: string;
  numero: number;
  nombre: string;
  institucion: string;
  direccion: string;
  barrioVereda: string;
  idZona: number;
  numeroZona: number;
  totalMesas: number;
  capacidadVotantes: number;
  mesasTotales: number;
  departamento: string;
  municipio: string;
  zona: string;
}

export interface MesaGarzonItem {
  id: number;
  numero: number;
  puestoId: string;
  zonaId: number;
  codigo: string;
}

export const ZONAS_VOTACION_GARZON: ZonaVotacionItem[] = [
  {
    id: 1,
    numero: 1,
    nombre: 'Zona 1 - Centro Urbano',
    descripcion: 'Zona urbana central de Garzón',
    tipo: 'urbana'
  },
  {
    id: 2,
    numero: 2,
    nombre: 'Zona 2 - Suroriental',
    descripcion: 'Zona urbana suroriental de Garzón',
    tipo: 'urbana'
  },
  {
    id: 3,
    numero: 90,
    nombre: 'Zona 90 - Especial',
    descripcion: 'Centro especial de votación (Colegio Cooperativo)',
    tipo: 'especial'
  },
  {
    id: 4,
    numero: 98,
    nombre: 'Zona 98 - Especial Carcelaria',
    descripcion: 'Centro carcelario (Cárcel Las Mercedes)',
    tipo: 'especial'
  },
  {
    id: 5,
    numero: 99,
    nombre: 'Zona 99 - Rural',
    descripcion: 'Zonas rurales y veredas de Garzón',
    tipo: 'rural'
  }
];

export const PUESTOS_VOTACION_GARZON: PuestoGarzonItem[] = [
  {
    id: 'puesto-garzon-1',
    numero: 1,
    nombre: 'Puesto 1 - IE Jenario Díaz Jordán',
    institucion: 'Institución Educativa Jenario Díaz Jordán',
    direccion: 'Barrio Provivienda',
    barrioVereda: 'Provivienda',
    idZona: 1,
    numeroZona: 1,
    totalMesas: 27,
    capacidadVotantes: 2700,
    mesasTotales: 27,
    departamento: 'Huila',
    municipio: 'Garzón',
    zona: 'Zona 1 - Centro Urbano'
  },
  {
    id: 'puesto-garzon-2',
    numero: 2,
    nombre: 'Puesto 2 - Polideportivo Plaza de Mercado',
    institucion: 'Polideportivo Plaza de Mercado',
    direccion: 'Centro de Garzón',
    barrioVereda: 'Centro',
    idZona: 1,
    numeroZona: 1,
    totalMesas: 25,
    capacidadVotantes: 2500,
    mesasTotales: 25,
    departamento: 'Huila',
    municipio: 'Garzón',
    zona: 'Zona 1 - Centro Urbano'
  },
  {
    id: 'puesto-garzon-3',
    numero: 3,
    nombre: 'Puesto 3 - IE Barrios Unidos',
    institucion: 'Institución Educativa Barrios Unidos',
    direccion: 'Barrio Santa Teresa',
    barrioVereda: 'Santa Teresa',
    idZona: 1,
    numeroZona: 1,
    totalMesas: 24,
    capacidadVotantes: 2400,
    mesasTotales: 24,
    departamento: 'Huila',
    municipio: 'Garzón',
    zona: 'Zona 1 - Centro Urbano'
  },
  {
    id: 'puesto-garzon-4',
    numero: 4,
    nombre: 'Puesto 4 - UN Sur Colombiana',
    institucion: 'Universidad Surcolombiana (Vía Las Termitas)',
    direccion: 'Vía Las Termitas',
    barrioVereda: 'Vía Las Termitas',
    idZona: 2,
    numeroZona: 2,
    totalMesas: 20,
    capacidadVotantes: 2000,
    mesasTotales: 20,
    departamento: 'Huila',
    municipio: 'Garzón',
    zona: 'Zona 2 - Suroriental'
  },
  {
    id: 'puesto-garzon-5',
    numero: 5,
    nombre: 'Puesto 5 - IE Simón Bolívar',
    institucion: 'Institución Educativa Simón Bolívar',
    direccion: 'Barrio Nazareth',
    barrioVereda: 'Nazareth',
    idZona: 2,
    numeroZona: 2,
    totalMesas: 22,
    capacidadVotantes: 2200,
    mesasTotales: 22,
    departamento: 'Huila',
    municipio: 'Garzón',
    zona: 'Zona 2 - Suroriental'
  },
  {
    id: 'puesto-garzon-6',
    numero: 6,
    nombre: 'Puesto 6 - MEG Luis Calixto Leiva',
    institucion: 'Modelo Educativa Genio Luis Calixto Leiva',
    direccion: 'Sector Oriental',
    barrioVereda: 'Sector Oriental',
    idZona: 2,
    numeroZona: 2,
    totalMesas: 18,
    capacidadVotantes: 1800,
    mesasTotales: 18,
    departamento: 'Huila',
    municipio: 'Garzón',
    zona: 'Zona 2 - Suroriental'
  },
  {
    id: 'puesto-garzon-90',
    numero: 90,
    nombre: 'Puesto Rural 90 - El Recreo',
    institucion: 'Escuela Rural El Recreo',
    direccion: 'Vereda El Recreo',
    barrioVereda: 'El Recreo',
    idZona: 5,
    numeroZona: 99,
    totalMesas: 4,
    capacidadVotantes: 400,
    mesasTotales: 4,
    departamento: 'Huila',
    municipio: 'Garzón',
    zona: 'Zona 99 - Rural'
  },
  {
    id: 'puesto-garzon-91',
    numero: 91,
    nombre: 'Puesto Rural 91 - El Paraíso',
    institucion: 'Escuela Rural El Paraíso',
    direccion: 'Vereda El Paraíso',
    barrioVereda: 'El Paraíso',
    idZona: 5,
    numeroZona: 99,
    totalMesas: 3,
    capacidadVotantes: 300,
    mesasTotales: 3,
    departamento: 'Huila',
    municipio: 'Garzón',
    zona: 'Zona 99 - Rural'
  },
  {
    id: 'puesto-garzon-92',
    numero: 92,
    nombre: 'Puesto Rural 92 - Caguancito',
    institucion: 'Escuela Rural Caguancito',
    direccion: 'Vereda Caguancito',
    barrioVereda: 'Caguancito',
    idZona: 5,
    numeroZona: 99,
    totalMesas: 3,
    capacidadVotantes: 300,
    mesasTotales: 3,
    departamento: 'Huila',
    municipio: 'Garzón',
    zona: 'Zona 99 - Rural'
  },
  {
    id: 'puesto-garzon-93',
    numero: 93,
    nombre: 'Puesto Rural 93 - El Mesón',
    institucion: 'Escuela Rural El Mesón',
    direccion: 'Vereda El Mesón',
    barrioVereda: 'El Mesón',
    idZona: 5,
    numeroZona: 99,
    totalMesas: 2,
    capacidadVotantes: 200,
    mesasTotales: 2,
    departamento: 'Huila',
    municipio: 'Garzón',
    zona: 'Zona 99 - Rural'
  },
  {
    id: 'puesto-garzon-98',
    numero: 98,
    nombre: 'Puesto Especial 98 - Colegio Cooperativo',
    institucion: 'Colegio Cooperativo de Garzón',
    direccion: 'Sector Centro',
    barrioVereda: 'Centro',
    idZona: 3,
    numeroZona: 90,
    totalMesas: 8,
    capacidadVotantes: 800,
    mesasTotales: 8,
    departamento: 'Huila',
    municipio: 'Garzón',
    zona: 'Zona 90 - Especial'
  },
  {
    id: 'puesto-garzon-99',
    numero: 99,
    nombre: 'Puesto Especial 99 - Cárcel Las Mercedes',
    institucion: 'Establecimiento Penitenciario Las Mercedes',
    direccion: 'Sector Rural',
    barrioVereda: 'Rural',
    idZona: 4,
    numeroZona: 98,
    totalMesas: 5,
    capacidadVotantes: 500,
    mesasTotales: 5,
    departamento: 'Huila',
    municipio: 'Garzón',
    zona: 'Zona 98 - Especial Carcelaria'
  }
];

// Generar mesas para cada puesto
export const MESAS_VOTACION_GARZON: MesaGarzonItem[] = (() => {
  const mesas: MesaGarzonItem[] = [];
  let currentId = 1;
  for (const p of PUESTOS_VOTACION_GARZON) {
    for (let m = 1; m <= p.totalMesas; m++) {
      mesas.push({
        id: currentId++,
        numero: m,
        puestoId: p.id,
        zonaId: p.idZona,
        codigo: `G-${p.numero}-${String(m).padStart(3, '0')}`
      });
    }
  }
  return mesas;
})();
