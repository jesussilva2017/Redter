export interface DepartamentoItem {
  id: number;
  nombre: string;
}

export interface MunicipioItem {
  id: number;
  nombre: string;
  estado: number;
  departamentoId: number;
}

export const DEPARTAMENTOS_COLOMBIA: DepartamentoItem[] = [
  {
    "id": 5,
    "nombre": "ANTIOQUIA"
  },
  {
    "id": 8,
    "nombre": "ATLÁNTICO"
  },
  {
    "id": 11,
    "nombre": "BOGOTÁ, D.C."
  },
  {
    "id": 13,
    "nombre": "BOLÍVAR"
  },
  {
    "id": 15,
    "nombre": "BOYACÁ"
  },
  {
    "id": 17,
    "nombre": "CALDAS"
  },
  {
    "id": 18,
    "nombre": "CAQUETÁ"
  },
  {
    "id": 19,
    "nombre": "CAUCA"
  },
  {
    "id": 20,
    "nombre": "CESAR"
  },
  {
    "id": 23,
    "nombre": "CÓRDOBA"
  },
  {
    "id": 25,
    "nombre": "CUNDINAMARCA"
  },
  {
    "id": 27,
    "nombre": "CHOCÓ"
  },
  {
    "id": 41,
    "nombre": "HUILA"
  },
  {
    "id": 44,
    "nombre": "LA GUAJIRA"
  },
  {
    "id": 47,
    "nombre": "MAGDALENA"
  },
  {
    "id": 50,
    "nombre": "META"
  },
  {
    "id": 52,
    "nombre": "NARIÑO"
  },
  {
    "id": 54,
    "nombre": "NORTE DE SANTANDER"
  },
  {
    "id": 63,
    "nombre": "QUINDIO"
  },
  {
    "id": 66,
    "nombre": "RISARALDA"
  },
  {
    "id": 68,
    "nombre": "SANTANDER"
  },
  {
    "id": 70,
    "nombre": "SUCRE"
  },
  {
    "id": 73,
    "nombre": "TOLIMA"
  },
  {
    "id": 76,
    "nombre": "VALLE DEL CAUCA"
  },
  {
    "id": 81,
    "nombre": "ARAUCA"
  },
  {
    "id": 85,
    "nombre": "CASANARE"
  },
  {
    "id": 86,
    "nombre": "PUTUMAYO"
  },
  {
    "id": 88,
    "nombre": "ARCHIPIÉLAGO DE SAN ANDRÉS, PROVIDENCIA Y SANTA CATALINA"
  },
  {
    "id": 91,
    "nombre": "AMAZONAS"
  },
  {
    "id": 94,
    "nombre": "GUAINÍA"
  },
  {
    "id": 95,
    "nombre": "GUAVIARE"
  },
  {
    "id": 97,
    "nombre": "VAUPÉS"
  },
  {
    "id": 99,
    "nombre": "VICHADA"
  }
];

export const MUNICIPIOS_COLOMBIA: MunicipioItem[] = [
  {
    "id": 1,
    "nombre": "Abriaquí",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 2,
    "nombre": "Acacías",
    "estado": 1,
    "departamentoId": 50
  },
  {
    "id": 3,
    "nombre": "Acandí",
    "estado": 1,
    "departamentoId": 27
  },
  {
    "id": 4,
    "nombre": "Acevedo",
    "estado": 1,
    "departamentoId": 41
  },
  {
    "id": 5,
    "nombre": "Achí",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 6,
    "nombre": "Agrado",
    "estado": 1,
    "departamentoId": 41
  },
  {
    "id": 7,
    "nombre": "Agua de Dios",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 8,
    "nombre": "Aguachica",
    "estado": 1,
    "departamentoId": 20
  },
  {
    "id": 9,
    "nombre": "Aguada",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 10,
    "nombre": "Aguadas",
    "estado": 1,
    "departamentoId": 17
  },
  {
    "id": 11,
    "nombre": "Aguazul",
    "estado": 1,
    "departamentoId": 85
  },
  {
    "id": 12,
    "nombre": "Agustín Codazzi",
    "estado": 1,
    "departamentoId": 20
  },
  {
    "id": 13,
    "nombre": "Aipe",
    "estado": 1,
    "departamentoId": 41
  },
  {
    "id": 14,
    "nombre": "Albania",
    "estado": 1,
    "departamentoId": 18
  },
  {
    "id": 15,
    "nombre": "Albania",
    "estado": 1,
    "departamentoId": 44
  },
  {
    "id": 16,
    "nombre": "Albania",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 17,
    "nombre": "Albán",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 18,
    "nombre": "Albán (San José)",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 19,
    "nombre": "Alcalá",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 20,
    "nombre": "Alejandria",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 21,
    "nombre": "Algarrobo",
    "estado": 1,
    "departamentoId": 47
  },
  {
    "id": 22,
    "nombre": "Algeciras",
    "estado": 1,
    "departamentoId": 41
  },
  {
    "id": 23,
    "nombre": "Almaguer",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 24,
    "nombre": "Almeida",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 25,
    "nombre": "Alpujarra",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 26,
    "nombre": "Altamira",
    "estado": 1,
    "departamentoId": 41
  },
  {
    "id": 27,
    "nombre": "Alto Baudó (Pie de Pato)",
    "estado": 1,
    "departamentoId": 27
  },
  {
    "id": 28,
    "nombre": "Altos del Rosario",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 29,
    "nombre": "Alvarado",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 30,
    "nombre": "Amagá",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 31,
    "nombre": "Amalfi",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 32,
    "nombre": "Ambalema",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 33,
    "nombre": "Anapoima",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 34,
    "nombre": "Ancuya",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 35,
    "nombre": "Andalucía",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 36,
    "nombre": "Andes",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 37,
    "nombre": "Angelópolis",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 38,
    "nombre": "Angostura",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 39,
    "nombre": "Anolaima",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 40,
    "nombre": "Anorí",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 41,
    "nombre": "Anserma",
    "estado": 1,
    "departamentoId": 17
  },
  {
    "id": 42,
    "nombre": "Ansermanuevo",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 43,
    "nombre": "Anzoátegui",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 44,
    "nombre": "Anzá",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 45,
    "nombre": "Apartadó",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 46,
    "nombre": "Apulo",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 47,
    "nombre": "Apía",
    "estado": 1,
    "departamentoId": 66
  },
  {
    "id": 48,
    "nombre": "Aquitania",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 49,
    "nombre": "Aracataca",
    "estado": 1,
    "departamentoId": 47
  },
  {
    "id": 50,
    "nombre": "Aranzazu",
    "estado": 1,
    "departamentoId": 17
  },
  {
    "id": 51,
    "nombre": "Aratoca",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 52,
    "nombre": "Arauca",
    "estado": 1,
    "departamentoId": 81
  },
  {
    "id": 53,
    "nombre": "Arauquita",
    "estado": 1,
    "departamentoId": 81
  },
  {
    "id": 54,
    "nombre": "Arbeláez",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 55,
    "nombre": "Arboleda (Berruecos)",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 56,
    "nombre": "Arboledas",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 57,
    "nombre": "Arboletes",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 58,
    "nombre": "Arcabuco",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 59,
    "nombre": "Arenal",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 60,
    "nombre": "Argelia",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 61,
    "nombre": "Argelia",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 62,
    "nombre": "Argelia",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 63,
    "nombre": "Ariguaní (El Difícil)",
    "estado": 1,
    "departamentoId": 47
  },
  {
    "id": 64,
    "nombre": "Arjona",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 65,
    "nombre": "Armenia",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 66,
    "nombre": "Armenia",
    "estado": 1,
    "departamentoId": 63
  },
  {
    "id": 67,
    "nombre": "Armero (Guayabal)",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 68,
    "nombre": "Arroyohondo",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 69,
    "nombre": "Astrea",
    "estado": 1,
    "departamentoId": 20
  },
  {
    "id": 70,
    "nombre": "Ataco",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 71,
    "nombre": "Atrato (Yuto)",
    "estado": 1,
    "departamentoId": 27
  },
  {
    "id": 72,
    "nombre": "Ayapel",
    "estado": 1,
    "departamentoId": 23
  },
  {
    "id": 73,
    "nombre": "Bagadó",
    "estado": 1,
    "departamentoId": 27
  },
  {
    "id": 74,
    "nombre": "Bahía Solano (Mútis)",
    "estado": 1,
    "departamentoId": 27
  },
  {
    "id": 75,
    "nombre": "Bajo Baudó (Pizarro)",
    "estado": 1,
    "departamentoId": 27
  },
  {
    "id": 76,
    "nombre": "Balboa",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 77,
    "nombre": "Balboa",
    "estado": 1,
    "departamentoId": 66
  },
  {
    "id": 78,
    "nombre": "Baranoa",
    "estado": 1,
    "departamentoId": 8
  },
  {
    "id": 79,
    "nombre": "Baraya",
    "estado": 1,
    "departamentoId": 41
  },
  {
    "id": 80,
    "nombre": "Barbacoas",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 81,
    "nombre": "Barbosa",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 82,
    "nombre": "Barbosa",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 83,
    "nombre": "Barichara",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 84,
    "nombre": "Barranca de Upía",
    "estado": 1,
    "departamentoId": 50
  },
  {
    "id": 85,
    "nombre": "Barrancabermeja",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 86,
    "nombre": "Barrancas",
    "estado": 1,
    "departamentoId": 44
  },
  {
    "id": 87,
    "nombre": "Barranco de Loba",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 88,
    "nombre": "Barranquilla",
    "estado": 1,
    "departamentoId": 8
  },
  {
    "id": 89,
    "nombre": "Becerríl",
    "estado": 1,
    "departamentoId": 20
  },
  {
    "id": 90,
    "nombre": "Belalcázar",
    "estado": 1,
    "departamentoId": 17
  },
  {
    "id": 91,
    "nombre": "Bello",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 92,
    "nombre": "Belmira",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 93,
    "nombre": "Beltrán",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 94,
    "nombre": "Belén",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 95,
    "nombre": "Belén",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 96,
    "nombre": "Belén de Bajirá",
    "estado": 1,
    "departamentoId": 27
  },
  {
    "id": 97,
    "nombre": "Belén de Umbría",
    "estado": 1,
    "departamentoId": 66
  },
  {
    "id": 98,
    "nombre": "Belén de los Andaquíes",
    "estado": 1,
    "departamentoId": 18
  },
  {
    "id": 99,
    "nombre": "Berbeo",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 100,
    "nombre": "Betania",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 101,
    "nombre": "Beteitiva",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 102,
    "nombre": "Betulia",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 103,
    "nombre": "Betulia",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 104,
    "nombre": "Bituima",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 105,
    "nombre": "Boavita",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 106,
    "nombre": "Bochalema",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 107,
    "nombre": "Bogotá D.C.",
    "estado": 1,
    "departamentoId": 11
  },
  {
    "id": 108,
    "nombre": "Bojacá",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 109,
    "nombre": "Bojayá (Bellavista)",
    "estado": 1,
    "departamentoId": 27
  },
  {
    "id": 110,
    "nombre": "Bolívar",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 111,
    "nombre": "Bolívar",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 112,
    "nombre": "Bolívar",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 113,
    "nombre": "Bolívar",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 114,
    "nombre": "Bosconia",
    "estado": 1,
    "departamentoId": 20
  },
  {
    "id": 115,
    "nombre": "Boyacá",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 116,
    "nombre": "Briceño",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 117,
    "nombre": "Briceño",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 118,
    "nombre": "Bucaramanga",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 119,
    "nombre": "Bucarasica",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 120,
    "nombre": "Buenaventura",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 121,
    "nombre": "Buenavista",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 122,
    "nombre": "Buenavista",
    "estado": 1,
    "departamentoId": 23
  },
  {
    "id": 123,
    "nombre": "Buenavista",
    "estado": 1,
    "departamentoId": 63
  },
  {
    "id": 124,
    "nombre": "Buenavista",
    "estado": 1,
    "departamentoId": 70
  },
  {
    "id": 125,
    "nombre": "Buenos Aires",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 126,
    "nombre": "Buesaco",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 127,
    "nombre": "Buga",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 128,
    "nombre": "Bugalagrande",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 129,
    "nombre": "Burítica",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 130,
    "nombre": "Busbanza",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 131,
    "nombre": "Cabrera",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 132,
    "nombre": "Cabrera",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 133,
    "nombre": "Cabuyaro",
    "estado": 1,
    "departamentoId": 50
  },
  {
    "id": 134,
    "nombre": "Cachipay",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 135,
    "nombre": "Caicedo",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 136,
    "nombre": "Caicedonia",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 137,
    "nombre": "Caimito",
    "estado": 1,
    "departamentoId": 70
  },
  {
    "id": 138,
    "nombre": "Cajamarca",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 139,
    "nombre": "Cajibío",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 140,
    "nombre": "Cajicá",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 141,
    "nombre": "Calamar",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 142,
    "nombre": "Calamar",
    "estado": 1,
    "departamentoId": 95
  },
  {
    "id": 143,
    "nombre": "Calarcá",
    "estado": 1,
    "departamentoId": 63
  },
  {
    "id": 144,
    "nombre": "Caldas",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 145,
    "nombre": "Caldas",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 146,
    "nombre": "Caldono",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 147,
    "nombre": "California",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 148,
    "nombre": "Calima (Darién)",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 149,
    "nombre": "Caloto",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 150,
    "nombre": "Calí",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 151,
    "nombre": "Campamento",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 152,
    "nombre": "Campo de la Cruz",
    "estado": 1,
    "departamentoId": 8
  },
  {
    "id": 153,
    "nombre": "Campoalegre",
    "estado": 1,
    "departamentoId": 41
  },
  {
    "id": 154,
    "nombre": "Campohermoso",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 155,
    "nombre": "Canalete",
    "estado": 1,
    "departamentoId": 23
  },
  {
    "id": 156,
    "nombre": "Candelaria",
    "estado": 1,
    "departamentoId": 8
  },
  {
    "id": 157,
    "nombre": "Candelaria",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 158,
    "nombre": "Cantagallo",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 159,
    "nombre": "Cantón de San Pablo",
    "estado": 1,
    "departamentoId": 27
  },
  {
    "id": 160,
    "nombre": "Caparrapí",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 161,
    "nombre": "Capitanejo",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 162,
    "nombre": "Caracolí",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 163,
    "nombre": "Caramanta",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 164,
    "nombre": "Carcasí",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 165,
    "nombre": "Carepa",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 166,
    "nombre": "Carmen de Apicalá",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 167,
    "nombre": "Carmen de Carupa",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 168,
    "nombre": "Carmen de Viboral",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 169,
    "nombre": "Carmen del Darién (CURBARADÓ)",
    "estado": 1,
    "departamentoId": 27
  },
  {
    "id": 170,
    "nombre": "Carolina",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 171,
    "nombre": "Cartagena",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 172,
    "nombre": "Cartagena del Chairá",
    "estado": 1,
    "departamentoId": 18
  },
  {
    "id": 173,
    "nombre": "Cartago",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 174,
    "nombre": "Carurú",
    "estado": 1,
    "departamentoId": 97
  },
  {
    "id": 175,
    "nombre": "Casabianca",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 176,
    "nombre": "Castilla la Nueva",
    "estado": 1,
    "departamentoId": 50
  },
  {
    "id": 177,
    "nombre": "Caucasia",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 178,
    "nombre": "Cañasgordas",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 179,
    "nombre": "Cepita",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 180,
    "nombre": "Cereté",
    "estado": 1,
    "departamentoId": 23
  },
  {
    "id": 181,
    "nombre": "Cerinza",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 182,
    "nombre": "Cerrito",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 183,
    "nombre": "Cerro San Antonio",
    "estado": 1,
    "departamentoId": 47
  },
  {
    "id": 184,
    "nombre": "Chachaguí",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 185,
    "nombre": "Chaguaní",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 186,
    "nombre": "Chalán",
    "estado": 1,
    "departamentoId": 70
  },
  {
    "id": 187,
    "nombre": "Chaparral",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 188,
    "nombre": "Charalá",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 189,
    "nombre": "Charta",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 190,
    "nombre": "Chigorodó",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 191,
    "nombre": "Chima",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 192,
    "nombre": "Chimichagua",
    "estado": 1,
    "departamentoId": 20
  },
  {
    "id": 193,
    "nombre": "Chimá",
    "estado": 1,
    "departamentoId": 23
  },
  {
    "id": 194,
    "nombre": "Chinavita",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 195,
    "nombre": "Chinchiná",
    "estado": 1,
    "departamentoId": 17
  },
  {
    "id": 196,
    "nombre": "Chinácota",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 197,
    "nombre": "Chinú",
    "estado": 1,
    "departamentoId": 23
  },
  {
    "id": 198,
    "nombre": "Chipaque",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 199,
    "nombre": "Chipatá",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 200,
    "nombre": "Chiquinquirá",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 201,
    "nombre": "Chiriguaná",
    "estado": 1,
    "departamentoId": 20
  },
  {
    "id": 202,
    "nombre": "Chiscas",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 203,
    "nombre": "Chita",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 204,
    "nombre": "Chitagá",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 205,
    "nombre": "Chitaraque",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 206,
    "nombre": "Chivatá",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 207,
    "nombre": "Chivolo",
    "estado": 1,
    "departamentoId": 47
  },
  {
    "id": 208,
    "nombre": "Choachí",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 209,
    "nombre": "Chocontá",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 210,
    "nombre": "Chámeza",
    "estado": 1,
    "departamentoId": 85
  },
  {
    "id": 211,
    "nombre": "Chía",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 212,
    "nombre": "Chíquiza",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 213,
    "nombre": "Chívor",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 214,
    "nombre": "Cicuco",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 215,
    "nombre": "Cimitarra",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 216,
    "nombre": "Circasia",
    "estado": 1,
    "departamentoId": 63
  },
  {
    "id": 217,
    "nombre": "Cisneros",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 218,
    "nombre": "Ciénaga",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 219,
    "nombre": "Ciénaga",
    "estado": 1,
    "departamentoId": 47
  },
  {
    "id": 220,
    "nombre": "Ciénaga de Oro",
    "estado": 1,
    "departamentoId": 23
  },
  {
    "id": 221,
    "nombre": "Clemencia",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 222,
    "nombre": "Cocorná",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 223,
    "nombre": "Coello",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 224,
    "nombre": "Cogua",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 225,
    "nombre": "Colombia",
    "estado": 1,
    "departamentoId": 41
  },
  {
    "id": 226,
    "nombre": "Colosó (Ricaurte)",
    "estado": 1,
    "departamentoId": 70
  },
  {
    "id": 227,
    "nombre": "Colón",
    "estado": 1,
    "departamentoId": 86
  },
  {
    "id": 228,
    "nombre": "Colón (Génova)",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 229,
    "nombre": "Concepción",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 230,
    "nombre": "Concepción",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 231,
    "nombre": "Concordia",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 232,
    "nombre": "Concordia",
    "estado": 1,
    "departamentoId": 47
  },
  {
    "id": 233,
    "nombre": "Condoto",
    "estado": 1,
    "departamentoId": 27
  },
  {
    "id": 234,
    "nombre": "Confines",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 235,
    "nombre": "Consaca",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 236,
    "nombre": "Contadero",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 237,
    "nombre": "Contratación",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 238,
    "nombre": "Convención",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 239,
    "nombre": "Copacabana",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 240,
    "nombre": "Coper",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 241,
    "nombre": "Cordobá",
    "estado": 1,
    "departamentoId": 63
  },
  {
    "id": 242,
    "nombre": "Corinto",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 243,
    "nombre": "Coromoro",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 244,
    "nombre": "Corozal",
    "estado": 1,
    "departamentoId": 70
  },
  {
    "id": 245,
    "nombre": "Corrales",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 246,
    "nombre": "Cota",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 247,
    "nombre": "Cotorra",
    "estado": 1,
    "departamentoId": 23
  },
  {
    "id": 248,
    "nombre": "Covarachía",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 249,
    "nombre": "Coveñas",
    "estado": 1,
    "departamentoId": 70
  },
  {
    "id": 250,
    "nombre": "Coyaima",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 251,
    "nombre": "Cravo Norte",
    "estado": 1,
    "departamentoId": 81
  },
  {
    "id": 252,
    "nombre": "Cuaspud (Carlosama)",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 253,
    "nombre": "Cubarral",
    "estado": 1,
    "departamentoId": 50
  },
  {
    "id": 254,
    "nombre": "Cubará",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 255,
    "nombre": "Cucaita",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 256,
    "nombre": "Cucunubá",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 257,
    "nombre": "Cucutilla",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 258,
    "nombre": "Cuitiva",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 259,
    "nombre": "Cumaral",
    "estado": 1,
    "departamentoId": 50
  },
  {
    "id": 260,
    "nombre": "Cumaribo",
    "estado": 1,
    "departamentoId": 99
  },
  {
    "id": 261,
    "nombre": "Cumbal",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 262,
    "nombre": "Cumbitara",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 263,
    "nombre": "Cunday",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 264,
    "nombre": "Curillo",
    "estado": 1,
    "departamentoId": 18
  },
  {
    "id": 265,
    "nombre": "Curití",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 266,
    "nombre": "Curumaní",
    "estado": 1,
    "departamentoId": 20
  },
  {
    "id": 267,
    "nombre": "Cáceres",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 268,
    "nombre": "Cáchira",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 269,
    "nombre": "Cácota",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 270,
    "nombre": "Cáqueza",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 271,
    "nombre": "Cértegui",
    "estado": 1,
    "departamentoId": 27
  },
  {
    "id": 272,
    "nombre": "Cómbita",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 273,
    "nombre": "Córdoba",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 274,
    "nombre": "Córdoba",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 275,
    "nombre": "Cúcuta",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 276,
    "nombre": "Dabeiba",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 277,
    "nombre": "Dagua",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 278,
    "nombre": "Dibulla",
    "estado": 1,
    "departamentoId": 44
  },
  {
    "id": 279,
    "nombre": "Distracción",
    "estado": 1,
    "departamentoId": 44
  },
  {
    "id": 280,
    "nombre": "Dolores",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 281,
    "nombre": "Don Matías",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 282,
    "nombre": "Dos Quebradas",
    "estado": 1,
    "departamentoId": 66
  },
  {
    "id": 283,
    "nombre": "Duitama",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 284,
    "nombre": "Durania",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 285,
    "nombre": "Ebéjico",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 286,
    "nombre": "El Bagre",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 287,
    "nombre": "El Banco",
    "estado": 1,
    "departamentoId": 47
  },
  {
    "id": 288,
    "nombre": "El Cairo",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 289,
    "nombre": "El Calvario",
    "estado": 1,
    "departamentoId": 50
  },
  {
    "id": 290,
    "nombre": "El Carmen",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 291,
    "nombre": "El Carmen",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 292,
    "nombre": "El Carmen de Atrato",
    "estado": 1,
    "departamentoId": 27
  },
  {
    "id": 293,
    "nombre": "El Carmen de Bolívar",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 294,
    "nombre": "El Castillo",
    "estado": 1,
    "departamentoId": 50
  },
  {
    "id": 295,
    "nombre": "El Cerrito",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 296,
    "nombre": "El Charco",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 297,
    "nombre": "El Cocuy",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 298,
    "nombre": "El Colegio",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 299,
    "nombre": "El Copey",
    "estado": 1,
    "departamentoId": 20
  },
  {
    "id": 300,
    "nombre": "El Doncello",
    "estado": 1,
    "departamentoId": 18
  },
  {
    "id": 301,
    "nombre": "El Dorado",
    "estado": 1,
    "departamentoId": 50
  },
  {
    "id": 302,
    "nombre": "El Dovio",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 303,
    "nombre": "El Espino",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 304,
    "nombre": "El Guacamayo",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 305,
    "nombre": "El Guamo",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 306,
    "nombre": "El Molino",
    "estado": 1,
    "departamentoId": 44
  },
  {
    "id": 307,
    "nombre": "El Paso",
    "estado": 1,
    "departamentoId": 20
  },
  {
    "id": 308,
    "nombre": "El Paujil",
    "estado": 1,
    "departamentoId": 18
  },
  {
    "id": 309,
    "nombre": "El Peñol",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 310,
    "nombre": "El Peñon",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 311,
    "nombre": "El Peñon",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 312,
    "nombre": "El Peñón",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 313,
    "nombre": "El Piñon",
    "estado": 1,
    "departamentoId": 47
  },
  {
    "id": 314,
    "nombre": "El Playón",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 315,
    "nombre": "El Retorno",
    "estado": 1,
    "departamentoId": 95
  },
  {
    "id": 316,
    "nombre": "El Retén",
    "estado": 1,
    "departamentoId": 47
  },
  {
    "id": 317,
    "nombre": "El Roble",
    "estado": 1,
    "departamentoId": 70
  },
  {
    "id": 318,
    "nombre": "El Rosal",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 319,
    "nombre": "El Rosario",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 320,
    "nombre": "El Tablón de Gómez",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 321,
    "nombre": "El Tambo",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 322,
    "nombre": "El Tambo",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 323,
    "nombre": "El Tarra",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 324,
    "nombre": "El Zulia",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 325,
    "nombre": "El Águila",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 326,
    "nombre": "Elías",
    "estado": 1,
    "departamentoId": 41
  },
  {
    "id": 327,
    "nombre": "Encino",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 328,
    "nombre": "Enciso",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 329,
    "nombre": "Entrerríos",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 330,
    "nombre": "Envigado",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 331,
    "nombre": "Espinal",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 332,
    "nombre": "Facatativá",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 333,
    "nombre": "Falan",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 334,
    "nombre": "Filadelfia",
    "estado": 1,
    "departamentoId": 17
  },
  {
    "id": 335,
    "nombre": "Filandia",
    "estado": 1,
    "departamentoId": 63
  },
  {
    "id": 336,
    "nombre": "Firavitoba",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 337,
    "nombre": "Flandes",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 338,
    "nombre": "Florencia",
    "estado": 1,
    "departamentoId": 18
  },
  {
    "id": 339,
    "nombre": "Florencia",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 340,
    "nombre": "Floresta",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 341,
    "nombre": "Florida",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 342,
    "nombre": "Floridablanca",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 343,
    "nombre": "Florián",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 344,
    "nombre": "Fonseca",
    "estado": 1,
    "departamentoId": 44
  },
  {
    "id": 345,
    "nombre": "Fortúl",
    "estado": 1,
    "departamentoId": 81
  },
  {
    "id": 346,
    "nombre": "Fosca",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 347,
    "nombre": "Francisco Pizarro",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 348,
    "nombre": "Fredonia",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 349,
    "nombre": "Fresno",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 350,
    "nombre": "Frontino",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 351,
    "nombre": "Fuente de Oro",
    "estado": 1,
    "departamentoId": 50
  },
  {
    "id": 352,
    "nombre": "Fundación",
    "estado": 1,
    "departamentoId": 47
  },
  {
    "id": 353,
    "nombre": "Funes",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 354,
    "nombre": "Funza",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 355,
    "nombre": "Fusagasugá",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 356,
    "nombre": "Fómeque",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 357,
    "nombre": "Fúquene",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 358,
    "nombre": "Gachalá",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 359,
    "nombre": "Gachancipá",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 360,
    "nombre": "Gachantivá",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 361,
    "nombre": "Gachetá",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 362,
    "nombre": "Galapa",
    "estado": 1,
    "departamentoId": 8
  },
  {
    "id": 363,
    "nombre": "Galeras (Nueva Granada)",
    "estado": 1,
    "departamentoId": 70
  },
  {
    "id": 364,
    "nombre": "Galán",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 365,
    "nombre": "Gama",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 366,
    "nombre": "Gamarra",
    "estado": 1,
    "departamentoId": 20
  },
  {
    "id": 367,
    "nombre": "Garagoa",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 368,
    "nombre": "Garzón",
    "estado": 1,
    "departamentoId": 41
  },
  {
    "id": 369,
    "nombre": "Gigante",
    "estado": 1,
    "departamentoId": 41
  },
  {
    "id": 370,
    "nombre": "Ginebra",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 371,
    "nombre": "Giraldo",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 372,
    "nombre": "Girardot",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 373,
    "nombre": "Girardota",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 374,
    "nombre": "Girón",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 375,
    "nombre": "Gonzalez",
    "estado": 1,
    "departamentoId": 20
  },
  {
    "id": 376,
    "nombre": "Gramalote",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 377,
    "nombre": "Granada",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 378,
    "nombre": "Granada",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 379,
    "nombre": "Granada",
    "estado": 1,
    "departamentoId": 50
  },
  {
    "id": 380,
    "nombre": "Guaca",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 381,
    "nombre": "Guacamayas",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 382,
    "nombre": "Guacarí",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 383,
    "nombre": "Guachavés",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 384,
    "nombre": "Guachené",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 385,
    "nombre": "Guachetá",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 386,
    "nombre": "Guachucal",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 387,
    "nombre": "Guadalupe",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 388,
    "nombre": "Guadalupe",
    "estado": 1,
    "departamentoId": 41
  },
  {
    "id": 389,
    "nombre": "Guadalupe",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 390,
    "nombre": "Guaduas",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 391,
    "nombre": "Guaitarilla",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 392,
    "nombre": "Gualmatán",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 393,
    "nombre": "Guamal",
    "estado": 1,
    "departamentoId": 47
  },
  {
    "id": 394,
    "nombre": "Guamal",
    "estado": 1,
    "departamentoId": 50
  },
  {
    "id": 395,
    "nombre": "Guamo",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 396,
    "nombre": "Guapota",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 397,
    "nombre": "Guapí",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 398,
    "nombre": "Guaranda",
    "estado": 1,
    "departamentoId": 70
  },
  {
    "id": 399,
    "nombre": "Guarne",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 400,
    "nombre": "Guasca",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 401,
    "nombre": "Guatapé",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 402,
    "nombre": "Guataquí",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 403,
    "nombre": "Guatavita",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 404,
    "nombre": "Guateque",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 405,
    "nombre": "Guavatá",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 406,
    "nombre": "Guayabal de Siquima",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 407,
    "nombre": "Guayabetal",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 408,
    "nombre": "Guayatá",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 409,
    "nombre": "Guepsa",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 410,
    "nombre": "Guicán",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 411,
    "nombre": "Gutiérrez",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 412,
    "nombre": "Guática",
    "estado": 1,
    "departamentoId": 66
  },
  {
    "id": 413,
    "nombre": "Gámbita",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 414,
    "nombre": "Gámeza",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 415,
    "nombre": "Génova",
    "estado": 1,
    "departamentoId": 63
  },
  {
    "id": 416,
    "nombre": "Gómez Plata",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 417,
    "nombre": "Hacarí",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 418,
    "nombre": "Hatillo de Loba",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 419,
    "nombre": "Hato",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 420,
    "nombre": "Hato Corozal",
    "estado": 1,
    "departamentoId": 85
  },
  {
    "id": 421,
    "nombre": "Hatonuevo",
    "estado": 1,
    "departamentoId": 44
  },
  {
    "id": 422,
    "nombre": "Heliconia",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 423,
    "nombre": "Herrán",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 424,
    "nombre": "Herveo",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 425,
    "nombre": "Hispania",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 426,
    "nombre": "Hobo",
    "estado": 1,
    "departamentoId": 41
  },
  {
    "id": 427,
    "nombre": "Honda",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 428,
    "nombre": "Ibagué",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 429,
    "nombre": "Icononzo",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 430,
    "nombre": "Iles",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 431,
    "nombre": "Imúes",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 432,
    "nombre": "Inzá",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 433,
    "nombre": "Inírida",
    "estado": 1,
    "departamentoId": 94
  },
  {
    "id": 434,
    "nombre": "Ipiales",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 435,
    "nombre": "Isnos",
    "estado": 1,
    "departamentoId": 41
  },
  {
    "id": 436,
    "nombre": "Istmina",
    "estado": 1,
    "departamentoId": 27
  },
  {
    "id": 437,
    "nombre": "Itagüí",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 438,
    "nombre": "Ituango",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 439,
    "nombre": "Izá",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 440,
    "nombre": "Jambaló",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 441,
    "nombre": "Jamundí",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 442,
    "nombre": "Jardín",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 443,
    "nombre": "Jenesano",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 444,
    "nombre": "Jericó",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 445,
    "nombre": "Jericó",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 446,
    "nombre": "Jerusalén",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 447,
    "nombre": "Jesús María",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 448,
    "nombre": "Jordán",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 449,
    "nombre": "Juan de Acosta",
    "estado": 1,
    "departamentoId": 8
  },
  {
    "id": 450,
    "nombre": "Junín",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 451,
    "nombre": "Juradó",
    "estado": 1,
    "departamentoId": 27
  },
  {
    "id": 452,
    "nombre": "La Apartada y La Frontera",
    "estado": 1,
    "departamentoId": 23
  },
  {
    "id": 453,
    "nombre": "La Argentina",
    "estado": 1,
    "departamentoId": 41
  },
  {
    "id": 454,
    "nombre": "La Belleza",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 455,
    "nombre": "La Calera",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 456,
    "nombre": "La Capilla",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 457,
    "nombre": "La Ceja",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 458,
    "nombre": "La Celia",
    "estado": 1,
    "departamentoId": 66
  },
  {
    "id": 459,
    "nombre": "La Cruz",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 460,
    "nombre": "La Cumbre",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 461,
    "nombre": "La Dorada",
    "estado": 1,
    "departamentoId": 17
  },
  {
    "id": 462,
    "nombre": "La Esperanza",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 463,
    "nombre": "La Estrella",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 464,
    "nombre": "La Florida",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 465,
    "nombre": "La Gloria",
    "estado": 1,
    "departamentoId": 20
  },
  {
    "id": 466,
    "nombre": "La Jagua de Ibirico",
    "estado": 1,
    "departamentoId": 20
  },
  {
    "id": 467,
    "nombre": "La Jagua del Pilar",
    "estado": 1,
    "departamentoId": 44
  },
  {
    "id": 468,
    "nombre": "La Llanada",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 469,
    "nombre": "La Macarena",
    "estado": 1,
    "departamentoId": 50
  },
  {
    "id": 470,
    "nombre": "La Merced",
    "estado": 1,
    "departamentoId": 17
  },
  {
    "id": 471,
    "nombre": "La Mesa",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 472,
    "nombre": "La Montañita",
    "estado": 1,
    "departamentoId": 18
  },
  {
    "id": 473,
    "nombre": "La Palma",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 474,
    "nombre": "La Paz",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 475,
    "nombre": "La Paz (Robles)",
    "estado": 1,
    "departamentoId": 20
  },
  {
    "id": 476,
    "nombre": "La Peña",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 477,
    "nombre": "La Pintada",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 478,
    "nombre": "La Plata",
    "estado": 1,
    "departamentoId": 41
  },
  {
    "id": 479,
    "nombre": "La Playa",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 480,
    "nombre": "La Primavera",
    "estado": 1,
    "departamentoId": 99
  },
  {
    "id": 481,
    "nombre": "La Salina",
    "estado": 1,
    "departamentoId": 85
  },
  {
    "id": 482,
    "nombre": "La Sierra",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 483,
    "nombre": "La Tebaida",
    "estado": 1,
    "departamentoId": 63
  },
  {
    "id": 484,
    "nombre": "La Tola",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 485,
    "nombre": "La Unión",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 486,
    "nombre": "La Unión",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 487,
    "nombre": "La Unión",
    "estado": 1,
    "departamentoId": 70
  },
  {
    "id": 488,
    "nombre": "La Unión",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 489,
    "nombre": "La Uvita",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 490,
    "nombre": "La Vega",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 491,
    "nombre": "La Vega",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 492,
    "nombre": "La Victoria",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 493,
    "nombre": "La Victoria",
    "estado": 1,
    "departamentoId": 17
  },
  {
    "id": 494,
    "nombre": "La Victoria",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 495,
    "nombre": "La Virginia",
    "estado": 1,
    "departamentoId": 66
  },
  {
    "id": 496,
    "nombre": "Labateca",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 497,
    "nombre": "Labranzagrande",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 498,
    "nombre": "Landázuri",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 499,
    "nombre": "Lebrija",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 500,
    "nombre": "Leiva",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 501,
    "nombre": "Lejanías",
    "estado": 1,
    "departamentoId": 50
  },
  {
    "id": 502,
    "nombre": "Lenguazaque",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 503,
    "nombre": "Leticia",
    "estado": 1,
    "departamentoId": 91
  },
  {
    "id": 504,
    "nombre": "Liborina",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 505,
    "nombre": "Linares",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 506,
    "nombre": "Lloró",
    "estado": 1,
    "departamentoId": 27
  },
  {
    "id": 507,
    "nombre": "Lorica",
    "estado": 1,
    "departamentoId": 23
  },
  {
    "id": 508,
    "nombre": "Los Córdobas",
    "estado": 1,
    "departamentoId": 23
  },
  {
    "id": 509,
    "nombre": "Los Palmitos",
    "estado": 1,
    "departamentoId": 70
  },
  {
    "id": 510,
    "nombre": "Los Patios",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 511,
    "nombre": "Los Santos",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 512,
    "nombre": "Lourdes",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 513,
    "nombre": "Luruaco",
    "estado": 1,
    "departamentoId": 8
  },
  {
    "id": 514,
    "nombre": "Lérida",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 515,
    "nombre": "Líbano",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 516,
    "nombre": "López (Micay)",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 517,
    "nombre": "Macanal",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 518,
    "nombre": "Macaravita",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 519,
    "nombre": "Maceo",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 520,
    "nombre": "Machetá",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 521,
    "nombre": "Madrid",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 522,
    "nombre": "Magangué",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 523,
    "nombre": "Magüi (Payán)",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 524,
    "nombre": "Mahates",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 525,
    "nombre": "Maicao",
    "estado": 1,
    "departamentoId": 44
  },
  {
    "id": 526,
    "nombre": "Majagual",
    "estado": 1,
    "departamentoId": 70
  },
  {
    "id": 527,
    "nombre": "Malambo",
    "estado": 1,
    "departamentoId": 8
  },
  {
    "id": 528,
    "nombre": "Mallama (Piedrancha)",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 529,
    "nombre": "Manatí",
    "estado": 1,
    "departamentoId": 8
  },
  {
    "id": 530,
    "nombre": "Manaure",
    "estado": 1,
    "departamentoId": 44
  },
  {
    "id": 531,
    "nombre": "Manaure Balcón del Cesar",
    "estado": 1,
    "departamentoId": 20
  },
  {
    "id": 532,
    "nombre": "Manizales",
    "estado": 1,
    "departamentoId": 17
  },
  {
    "id": 533,
    "nombre": "Manta",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 534,
    "nombre": "Manzanares",
    "estado": 1,
    "departamentoId": 17
  },
  {
    "id": 535,
    "nombre": "Maní",
    "estado": 1,
    "departamentoId": 85
  },
  {
    "id": 536,
    "nombre": "Mapiripan",
    "estado": 1,
    "departamentoId": 50
  },
  {
    "id": 537,
    "nombre": "Margarita",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 538,
    "nombre": "Marinilla",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 539,
    "nombre": "Maripí",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 540,
    "nombre": "Mariquita",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 541,
    "nombre": "Marmato",
    "estado": 1,
    "departamentoId": 17
  },
  {
    "id": 542,
    "nombre": "Marquetalia",
    "estado": 1,
    "departamentoId": 17
  },
  {
    "id": 543,
    "nombre": "Marsella",
    "estado": 1,
    "departamentoId": 66
  },
  {
    "id": 544,
    "nombre": "Marulanda",
    "estado": 1,
    "departamentoId": 17
  },
  {
    "id": 545,
    "nombre": "María la Baja",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 546,
    "nombre": "Matanza",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 547,
    "nombre": "Medellín",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 548,
    "nombre": "Medina",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 549,
    "nombre": "Medio Atrato",
    "estado": 1,
    "departamentoId": 27
  },
  {
    "id": 550,
    "nombre": "Medio Baudó",
    "estado": 1,
    "departamentoId": 27
  },
  {
    "id": 551,
    "nombre": "Medio San Juan (ANDAGOYA)",
    "estado": 1,
    "departamentoId": 27
  },
  {
    "id": 552,
    "nombre": "Melgar",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 553,
    "nombre": "Mercaderes",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 554,
    "nombre": "Mesetas",
    "estado": 1,
    "departamentoId": 50
  },
  {
    "id": 555,
    "nombre": "Milán",
    "estado": 1,
    "departamentoId": 18
  },
  {
    "id": 556,
    "nombre": "Miraflores",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 557,
    "nombre": "Miraflores",
    "estado": 1,
    "departamentoId": 95
  },
  {
    "id": 558,
    "nombre": "Miranda",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 559,
    "nombre": "Mistrató",
    "estado": 1,
    "departamentoId": 66
  },
  {
    "id": 560,
    "nombre": "Mitú",
    "estado": 1,
    "departamentoId": 97
  },
  {
    "id": 561,
    "nombre": "Mocoa",
    "estado": 1,
    "departamentoId": 86
  },
  {
    "id": 562,
    "nombre": "Mogotes",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 563,
    "nombre": "Molagavita",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 564,
    "nombre": "Momil",
    "estado": 1,
    "departamentoId": 23
  },
  {
    "id": 565,
    "nombre": "Mompós",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 566,
    "nombre": "Mongua",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 567,
    "nombre": "Monguí",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 568,
    "nombre": "Moniquirá",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 569,
    "nombre": "Montebello",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 570,
    "nombre": "Montecristo",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 571,
    "nombre": "Montelíbano",
    "estado": 1,
    "departamentoId": 23
  },
  {
    "id": 572,
    "nombre": "Montenegro",
    "estado": 1,
    "departamentoId": 63
  },
  {
    "id": 573,
    "nombre": "Monteria",
    "estado": 1,
    "departamentoId": 23
  },
  {
    "id": 574,
    "nombre": "Monterrey",
    "estado": 1,
    "departamentoId": 85
  },
  {
    "id": 575,
    "nombre": "Morales",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 576,
    "nombre": "Morales",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 577,
    "nombre": "Morelia",
    "estado": 1,
    "departamentoId": 18
  },
  {
    "id": 578,
    "nombre": "Morroa",
    "estado": 1,
    "departamentoId": 70
  },
  {
    "id": 579,
    "nombre": "Mosquera",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 580,
    "nombre": "Mosquera",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 581,
    "nombre": "Motavita",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 582,
    "nombre": "Moñitos",
    "estado": 1,
    "departamentoId": 23
  },
  {
    "id": 583,
    "nombre": "Murillo",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 584,
    "nombre": "Murindó",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 585,
    "nombre": "Mutatá",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 586,
    "nombre": "Mutiscua",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 587,
    "nombre": "Muzo",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 588,
    "nombre": "Málaga",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 589,
    "nombre": "Nariño",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 590,
    "nombre": "Nariño",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 591,
    "nombre": "Nariño",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 592,
    "nombre": "Natagaima",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 593,
    "nombre": "Nechí",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 594,
    "nombre": "Necoclí",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 595,
    "nombre": "Neira",
    "estado": 1,
    "departamentoId": 17
  },
  {
    "id": 596,
    "nombre": "Neiva",
    "estado": 1,
    "departamentoId": 41
  },
  {
    "id": 597,
    "nombre": "Nemocón",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 598,
    "nombre": "Nilo",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 599,
    "nombre": "Nimaima",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 600,
    "nombre": "Nobsa",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 601,
    "nombre": "Nocaima",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 602,
    "nombre": "Norcasia",
    "estado": 1,
    "departamentoId": 17
  },
  {
    "id": 603,
    "nombre": "Norosí",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 604,
    "nombre": "Novita",
    "estado": 1,
    "departamentoId": 27
  },
  {
    "id": 605,
    "nombre": "Nueva Granada",
    "estado": 1,
    "departamentoId": 47
  },
  {
    "id": 606,
    "nombre": "Nuevo Colón",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 607,
    "nombre": "Nunchía",
    "estado": 1,
    "departamentoId": 85
  },
  {
    "id": 608,
    "nombre": "Nuquí",
    "estado": 1,
    "departamentoId": 27
  },
  {
    "id": 609,
    "nombre": "Nátaga",
    "estado": 1,
    "departamentoId": 41
  },
  {
    "id": 610,
    "nombre": "Obando",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 611,
    "nombre": "Ocamonte",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 612,
    "nombre": "Ocaña",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 613,
    "nombre": "Oiba",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 614,
    "nombre": "Oicatá",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 615,
    "nombre": "Olaya",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 616,
    "nombre": "Olaya Herrera",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 617,
    "nombre": "Onzaga",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 618,
    "nombre": "Oporapa",
    "estado": 1,
    "departamentoId": 41
  },
  {
    "id": 619,
    "nombre": "Orito",
    "estado": 1,
    "departamentoId": 86
  },
  {
    "id": 620,
    "nombre": "Orocué",
    "estado": 1,
    "departamentoId": 85
  },
  {
    "id": 621,
    "nombre": "Ortega",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 622,
    "nombre": "Ospina",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 623,
    "nombre": "Otanche",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 624,
    "nombre": "Ovejas",
    "estado": 1,
    "departamentoId": 70
  },
  {
    "id": 625,
    "nombre": "Pachavita",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 626,
    "nombre": "Pacho",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 627,
    "nombre": "Padilla",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 628,
    "nombre": "Paicol",
    "estado": 1,
    "departamentoId": 41
  },
  {
    "id": 629,
    "nombre": "Pailitas",
    "estado": 1,
    "departamentoId": 20
  },
  {
    "id": 630,
    "nombre": "Paime",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 631,
    "nombre": "Paipa",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 632,
    "nombre": "Pajarito",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 633,
    "nombre": "Palermo",
    "estado": 1,
    "departamentoId": 41
  },
  {
    "id": 634,
    "nombre": "Palestina",
    "estado": 1,
    "departamentoId": 17
  },
  {
    "id": 635,
    "nombre": "Palestina",
    "estado": 1,
    "departamentoId": 41
  },
  {
    "id": 636,
    "nombre": "Palmar",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 637,
    "nombre": "Palmar de Varela",
    "estado": 1,
    "departamentoId": 8
  },
  {
    "id": 638,
    "nombre": "Palmas del Socorro",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 639,
    "nombre": "Palmira",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 640,
    "nombre": "Palmito",
    "estado": 1,
    "departamentoId": 70
  },
  {
    "id": 641,
    "nombre": "Palocabildo",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 642,
    "nombre": "Pamplona",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 643,
    "nombre": "Pamplonita",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 644,
    "nombre": "Pandi",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 645,
    "nombre": "Panqueba",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 646,
    "nombre": "Paratebueno",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 647,
    "nombre": "Pasca",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 648,
    "nombre": "Patía (El Bordo)",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 649,
    "nombre": "Pauna",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 650,
    "nombre": "Paya",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 651,
    "nombre": "Paz de Ariporo",
    "estado": 1,
    "departamentoId": 85
  },
  {
    "id": 652,
    "nombre": "Paz de Río",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 653,
    "nombre": "Pedraza",
    "estado": 1,
    "departamentoId": 47
  },
  {
    "id": 654,
    "nombre": "Pelaya",
    "estado": 1,
    "departamentoId": 20
  },
  {
    "id": 655,
    "nombre": "Pensilvania",
    "estado": 1,
    "departamentoId": 17
  },
  {
    "id": 656,
    "nombre": "Peque",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 657,
    "nombre": "Pereira",
    "estado": 1,
    "departamentoId": 66
  },
  {
    "id": 658,
    "nombre": "Pesca",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 659,
    "nombre": "Peñol",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 660,
    "nombre": "Piamonte",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 661,
    "nombre": "Pie de Cuesta",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 662,
    "nombre": "Piedras",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 663,
    "nombre": "Piendamó",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 664,
    "nombre": "Pijao",
    "estado": 1,
    "departamentoId": 63
  },
  {
    "id": 665,
    "nombre": "Pijiño",
    "estado": 1,
    "departamentoId": 47
  },
  {
    "id": 666,
    "nombre": "Pinchote",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 667,
    "nombre": "Pinillos",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 668,
    "nombre": "Piojo",
    "estado": 1,
    "departamentoId": 8
  },
  {
    "id": 669,
    "nombre": "Pisva",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 670,
    "nombre": "Pital",
    "estado": 1,
    "departamentoId": 41
  },
  {
    "id": 671,
    "nombre": "Pitalito",
    "estado": 1,
    "departamentoId": 41
  },
  {
    "id": 672,
    "nombre": "Pivijay",
    "estado": 1,
    "departamentoId": 47
  },
  {
    "id": 673,
    "nombre": "Planadas",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 674,
    "nombre": "Planeta Rica",
    "estado": 1,
    "departamentoId": 23
  },
  {
    "id": 675,
    "nombre": "Plato",
    "estado": 1,
    "departamentoId": 47
  },
  {
    "id": 676,
    "nombre": "Policarpa",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 677,
    "nombre": "Polonuevo",
    "estado": 1,
    "departamentoId": 8
  },
  {
    "id": 678,
    "nombre": "Ponedera",
    "estado": 1,
    "departamentoId": 8
  },
  {
    "id": 679,
    "nombre": "Popayán",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 680,
    "nombre": "Pore",
    "estado": 1,
    "departamentoId": 85
  },
  {
    "id": 681,
    "nombre": "Potosí",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 682,
    "nombre": "Pradera",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 683,
    "nombre": "Prado",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 684,
    "nombre": "Providencia",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 685,
    "nombre": "Providencia",
    "estado": 1,
    "departamentoId": 88
  },
  {
    "id": 686,
    "nombre": "Pueblo Bello",
    "estado": 1,
    "departamentoId": 20
  },
  {
    "id": 687,
    "nombre": "Pueblo Nuevo",
    "estado": 1,
    "departamentoId": 23
  },
  {
    "id": 688,
    "nombre": "Pueblo Rico",
    "estado": 1,
    "departamentoId": 66
  },
  {
    "id": 689,
    "nombre": "Pueblorrico",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 690,
    "nombre": "Puebloviejo",
    "estado": 1,
    "departamentoId": 47
  },
  {
    "id": 691,
    "nombre": "Puente Nacional",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 692,
    "nombre": "Puerres",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 693,
    "nombre": "Puerto Asís",
    "estado": 1,
    "departamentoId": 86
  },
  {
    "id": 694,
    "nombre": "Puerto Berrío",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 695,
    "nombre": "Puerto Boyacá",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 696,
    "nombre": "Puerto Caicedo",
    "estado": 1,
    "departamentoId": 86
  },
  {
    "id": 697,
    "nombre": "Puerto Carreño",
    "estado": 1,
    "departamentoId": 99
  },
  {
    "id": 698,
    "nombre": "Puerto Colombia",
    "estado": 1,
    "departamentoId": 8
  },
  {
    "id": 699,
    "nombre": "Puerto Concordia",
    "estado": 1,
    "departamentoId": 50
  },
  {
    "id": 700,
    "nombre": "Puerto Escondido",
    "estado": 1,
    "departamentoId": 23
  },
  {
    "id": 701,
    "nombre": "Puerto Gaitán",
    "estado": 1,
    "departamentoId": 50
  },
  {
    "id": 702,
    "nombre": "Puerto Guzmán",
    "estado": 1,
    "departamentoId": 86
  },
  {
    "id": 703,
    "nombre": "Puerto Leguízamo",
    "estado": 1,
    "departamentoId": 86
  },
  {
    "id": 704,
    "nombre": "Puerto Libertador",
    "estado": 1,
    "departamentoId": 23
  },
  {
    "id": 705,
    "nombre": "Puerto Lleras",
    "estado": 1,
    "departamentoId": 50
  },
  {
    "id": 706,
    "nombre": "Puerto López",
    "estado": 1,
    "departamentoId": 50
  },
  {
    "id": 707,
    "nombre": "Puerto Nare",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 708,
    "nombre": "Puerto Nariño",
    "estado": 1,
    "departamentoId": 91
  },
  {
    "id": 709,
    "nombre": "Puerto Parra",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 710,
    "nombre": "Puerto Rico",
    "estado": 1,
    "departamentoId": 18
  },
  {
    "id": 711,
    "nombre": "Puerto Rico",
    "estado": 1,
    "departamentoId": 50
  },
  {
    "id": 712,
    "nombre": "Puerto Rondón",
    "estado": 1,
    "departamentoId": 81
  },
  {
    "id": 713,
    "nombre": "Puerto Salgar",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 714,
    "nombre": "Puerto Santander",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 715,
    "nombre": "Puerto Tejada",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 716,
    "nombre": "Puerto Triunfo",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 717,
    "nombre": "Puerto Wilches",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 718,
    "nombre": "Pulí",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 719,
    "nombre": "Pupiales",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 720,
    "nombre": "Puracé (Coconuco)",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 721,
    "nombre": "Purificación",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 722,
    "nombre": "Purísima",
    "estado": 1,
    "departamentoId": 23
  },
  {
    "id": 723,
    "nombre": "Pácora",
    "estado": 1,
    "departamentoId": 17
  },
  {
    "id": 724,
    "nombre": "Páez",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 725,
    "nombre": "Páez (Belalcazar)",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 726,
    "nombre": "Páramo",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 727,
    "nombre": "Quebradanegra",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 728,
    "nombre": "Quetame",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 729,
    "nombre": "Quibdó",
    "estado": 1,
    "departamentoId": 27
  },
  {
    "id": 730,
    "nombre": "Quimbaya",
    "estado": 1,
    "departamentoId": 63
  },
  {
    "id": 731,
    "nombre": "Quinchía",
    "estado": 1,
    "departamentoId": 66
  },
  {
    "id": 732,
    "nombre": "Quipama",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 733,
    "nombre": "Quipile",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 734,
    "nombre": "Ragonvalia",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 735,
    "nombre": "Ramiriquí",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 736,
    "nombre": "Recetor",
    "estado": 1,
    "departamentoId": 85
  },
  {
    "id": 737,
    "nombre": "Regidor",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 738,
    "nombre": "Remedios",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 739,
    "nombre": "Remolino",
    "estado": 1,
    "departamentoId": 47
  },
  {
    "id": 740,
    "nombre": "Repelón",
    "estado": 1,
    "departamentoId": 8
  },
  {
    "id": 741,
    "nombre": "Restrepo",
    "estado": 1,
    "departamentoId": 50
  },
  {
    "id": 742,
    "nombre": "Restrepo",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 743,
    "nombre": "Retiro",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 744,
    "nombre": "Ricaurte",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 745,
    "nombre": "Ricaurte",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 746,
    "nombre": "Rio Negro",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 747,
    "nombre": "Rioblanco",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 748,
    "nombre": "Riofrío",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 749,
    "nombre": "Riohacha",
    "estado": 1,
    "departamentoId": 44
  },
  {
    "id": 750,
    "nombre": "Risaralda",
    "estado": 1,
    "departamentoId": 17
  },
  {
    "id": 751,
    "nombre": "Rivera",
    "estado": 1,
    "departamentoId": 41
  },
  {
    "id": 752,
    "nombre": "Roberto Payán (San José)",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 753,
    "nombre": "Roldanillo",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 754,
    "nombre": "Roncesvalles",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 755,
    "nombre": "Rondón",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 756,
    "nombre": "Rosas",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 757,
    "nombre": "Rovira",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 758,
    "nombre": "Ráquira",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 759,
    "nombre": "Río Iró",
    "estado": 1,
    "departamentoId": 27
  },
  {
    "id": 760,
    "nombre": "Río Quito",
    "estado": 1,
    "departamentoId": 27
  },
  {
    "id": 761,
    "nombre": "Río Sucio",
    "estado": 1,
    "departamentoId": 17
  },
  {
    "id": 762,
    "nombre": "Río Viejo",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 763,
    "nombre": "Río de oro",
    "estado": 1,
    "departamentoId": 20
  },
  {
    "id": 764,
    "nombre": "Ríonegro",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 765,
    "nombre": "Ríosucio",
    "estado": 1,
    "departamentoId": 27
  },
  {
    "id": 766,
    "nombre": "Sabana de Torres",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 767,
    "nombre": "Sabanagrande",
    "estado": 1,
    "departamentoId": 8
  },
  {
    "id": 768,
    "nombre": "Sabanalarga",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 769,
    "nombre": "Sabanalarga",
    "estado": 1,
    "departamentoId": 8
  },
  {
    "id": 770,
    "nombre": "Sabanalarga",
    "estado": 1,
    "departamentoId": 85
  },
  {
    "id": 771,
    "nombre": "Sabanas de San Angel (SAN ANGEL)",
    "estado": 1,
    "departamentoId": 47
  },
  {
    "id": 772,
    "nombre": "Sabaneta",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 773,
    "nombre": "Saboyá",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 774,
    "nombre": "Sahagún",
    "estado": 1,
    "departamentoId": 23
  },
  {
    "id": 775,
    "nombre": "Saladoblanco",
    "estado": 1,
    "departamentoId": 41
  },
  {
    "id": 776,
    "nombre": "Salamina",
    "estado": 1,
    "departamentoId": 17
  },
  {
    "id": 777,
    "nombre": "Salamina",
    "estado": 1,
    "departamentoId": 47
  },
  {
    "id": 778,
    "nombre": "Salazar",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 779,
    "nombre": "Saldaña",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 780,
    "nombre": "Salento",
    "estado": 1,
    "departamentoId": 63
  },
  {
    "id": 781,
    "nombre": "Salgar",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 782,
    "nombre": "Samacá",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 783,
    "nombre": "Samaniego",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 784,
    "nombre": "Samaná",
    "estado": 1,
    "departamentoId": 17
  },
  {
    "id": 785,
    "nombre": "Sampués",
    "estado": 1,
    "departamentoId": 70
  },
  {
    "id": 786,
    "nombre": "San Agustín",
    "estado": 1,
    "departamentoId": 41
  },
  {
    "id": 787,
    "nombre": "San Alberto",
    "estado": 1,
    "departamentoId": 20
  },
  {
    "id": 788,
    "nombre": "San Andrés",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 789,
    "nombre": "San Andrés Sotavento",
    "estado": 1,
    "departamentoId": 23
  },
  {
    "id": 790,
    "nombre": "San Andrés de Cuerquía",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 791,
    "nombre": "San Antero",
    "estado": 1,
    "departamentoId": 23
  },
  {
    "id": 792,
    "nombre": "San Antonio",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 793,
    "nombre": "San Antonio de Tequendama",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 794,
    "nombre": "San Benito",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 795,
    "nombre": "San Benito Abad",
    "estado": 1,
    "departamentoId": 70
  },
  {
    "id": 796,
    "nombre": "San Bernardo",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 797,
    "nombre": "San Bernardo",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 798,
    "nombre": "San Bernardo del Viento",
    "estado": 1,
    "departamentoId": 23
  },
  {
    "id": 799,
    "nombre": "San Calixto",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 800,
    "nombre": "San Carlos",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 801,
    "nombre": "San Carlos",
    "estado": 1,
    "departamentoId": 23
  },
  {
    "id": 802,
    "nombre": "San Carlos de Guaroa",
    "estado": 1,
    "departamentoId": 50
  },
  {
    "id": 803,
    "nombre": "San Cayetano",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 804,
    "nombre": "San Cayetano",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 805,
    "nombre": "San Cristobal",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 806,
    "nombre": "San Diego",
    "estado": 1,
    "departamentoId": 20
  },
  {
    "id": 807,
    "nombre": "San Eduardo",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 808,
    "nombre": "San Estanislao",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 809,
    "nombre": "San Fernando",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 810,
    "nombre": "San Francisco",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 811,
    "nombre": "San Francisco",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 812,
    "nombre": "San Francisco",
    "estado": 1,
    "departamentoId": 86
  },
  {
    "id": 813,
    "nombre": "San Gíl",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 814,
    "nombre": "San Jacinto",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 815,
    "nombre": "San Jacinto del Cauca",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 816,
    "nombre": "San Jerónimo",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 817,
    "nombre": "San Joaquín",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 818,
    "nombre": "San José",
    "estado": 1,
    "departamentoId": 17
  },
  {
    "id": 819,
    "nombre": "San José de Miranda",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 820,
    "nombre": "San José de Montaña",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 821,
    "nombre": "San José de Pare",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 822,
    "nombre": "San José de Uré",
    "estado": 1,
    "departamentoId": 23
  },
  {
    "id": 823,
    "nombre": "San José del Fragua",
    "estado": 1,
    "departamentoId": 18
  },
  {
    "id": 824,
    "nombre": "San José del Guaviare",
    "estado": 1,
    "departamentoId": 95
  },
  {
    "id": 825,
    "nombre": "San José del Palmar",
    "estado": 1,
    "departamentoId": 27
  },
  {
    "id": 826,
    "nombre": "San Juan de Arama",
    "estado": 1,
    "departamentoId": 50
  },
  {
    "id": 827,
    "nombre": "San Juan de Betulia",
    "estado": 1,
    "departamentoId": 70
  },
  {
    "id": 828,
    "nombre": "San Juan de Nepomuceno",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 829,
    "nombre": "San Juan de Pasto",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 830,
    "nombre": "San Juan de Río Seco",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 831,
    "nombre": "San Juan de Urabá",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 832,
    "nombre": "San Juan del Cesar",
    "estado": 1,
    "departamentoId": 44
  },
  {
    "id": 833,
    "nombre": "San Juanito",
    "estado": 1,
    "departamentoId": 50
  },
  {
    "id": 834,
    "nombre": "San Lorenzo",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 835,
    "nombre": "San Luis",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 836,
    "nombre": "San Luís",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 837,
    "nombre": "San Luís de Gaceno",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 838,
    "nombre": "San Luís de Palenque",
    "estado": 1,
    "departamentoId": 85
  },
  {
    "id": 839,
    "nombre": "San Marcos",
    "estado": 1,
    "departamentoId": 70
  },
  {
    "id": 840,
    "nombre": "San Martín",
    "estado": 1,
    "departamentoId": 20
  },
  {
    "id": 841,
    "nombre": "San Martín",
    "estado": 1,
    "departamentoId": 50
  },
  {
    "id": 842,
    "nombre": "San Martín de Loba",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 843,
    "nombre": "San Mateo",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 844,
    "nombre": "San Miguel",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 845,
    "nombre": "San Miguel",
    "estado": 1,
    "departamentoId": 86
  },
  {
    "id": 846,
    "nombre": "San Miguel de Sema",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 847,
    "nombre": "San Onofre",
    "estado": 1,
    "departamentoId": 70
  },
  {
    "id": 848,
    "nombre": "San Pablo",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 849,
    "nombre": "San Pablo",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 850,
    "nombre": "San Pablo de Borbur",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 851,
    "nombre": "San Pedro",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 852,
    "nombre": "San Pedro",
    "estado": 1,
    "departamentoId": 70
  },
  {
    "id": 853,
    "nombre": "San Pedro",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 854,
    "nombre": "San Pedro de Cartago",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 855,
    "nombre": "San Pedro de Urabá",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 856,
    "nombre": "San Pelayo",
    "estado": 1,
    "departamentoId": 23
  },
  {
    "id": 857,
    "nombre": "San Rafael",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 858,
    "nombre": "San Roque",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 859,
    "nombre": "San Sebastián",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 860,
    "nombre": "San Sebastián de Buenavista",
    "estado": 1,
    "departamentoId": 47
  },
  {
    "id": 861,
    "nombre": "San Vicente",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 862,
    "nombre": "San Vicente del Caguán",
    "estado": 1,
    "departamentoId": 18
  },
  {
    "id": 863,
    "nombre": "San Vicente del Chucurí",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 864,
    "nombre": "San Zenón",
    "estado": 1,
    "departamentoId": 47
  },
  {
    "id": 865,
    "nombre": "Sandoná",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 866,
    "nombre": "Santa Ana",
    "estado": 1,
    "departamentoId": 47
  },
  {
    "id": 867,
    "nombre": "Santa Bárbara",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 868,
    "nombre": "Santa Bárbara",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 869,
    "nombre": "Santa Bárbara (Iscuandé)",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 870,
    "nombre": "Santa Bárbara de Pinto",
    "estado": 1,
    "departamentoId": 47
  },
  {
    "id": 871,
    "nombre": "Santa Catalina",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 872,
    "nombre": "Santa Fé de Antioquia",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 873,
    "nombre": "Santa Genoveva de Docorodó",
    "estado": 1,
    "departamentoId": 27
  },
  {
    "id": 874,
    "nombre": "Santa Helena del Opón",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 875,
    "nombre": "Santa Isabel",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 876,
    "nombre": "Santa Lucía",
    "estado": 1,
    "departamentoId": 8
  },
  {
    "id": 877,
    "nombre": "Santa Marta",
    "estado": 1,
    "departamentoId": 47
  },
  {
    "id": 878,
    "nombre": "Santa María",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 879,
    "nombre": "Santa María",
    "estado": 1,
    "departamentoId": 41
  },
  {
    "id": 880,
    "nombre": "Santa Rosa",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 881,
    "nombre": "Santa Rosa",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 882,
    "nombre": "Santa Rosa de Cabal",
    "estado": 1,
    "departamentoId": 66
  },
  {
    "id": 883,
    "nombre": "Santa Rosa de Osos",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 884,
    "nombre": "Santa Rosa de Viterbo",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 885,
    "nombre": "Santa Rosa del Sur",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 886,
    "nombre": "Santa Rosalía",
    "estado": 1,
    "departamentoId": 99
  },
  {
    "id": 887,
    "nombre": "Santa Sofía",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 888,
    "nombre": "Santana",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 889,
    "nombre": "Santander de Quilichao",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 890,
    "nombre": "Santiago",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 891,
    "nombre": "Santiago",
    "estado": 1,
    "departamentoId": 86
  },
  {
    "id": 892,
    "nombre": "Santo Domingo",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 893,
    "nombre": "Santo Tomás",
    "estado": 1,
    "departamentoId": 8
  },
  {
    "id": 894,
    "nombre": "Santuario",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 895,
    "nombre": "Santuario",
    "estado": 1,
    "departamentoId": 66
  },
  {
    "id": 896,
    "nombre": "Sapuyes",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 897,
    "nombre": "Saravena",
    "estado": 1,
    "departamentoId": 81
  },
  {
    "id": 898,
    "nombre": "Sardinata",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 899,
    "nombre": "Sasaima",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 900,
    "nombre": "Sativanorte",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 901,
    "nombre": "Sativasur",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 902,
    "nombre": "Segovia",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 903,
    "nombre": "Sesquilé",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 904,
    "nombre": "Sevilla",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 905,
    "nombre": "Siachoque",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 906,
    "nombre": "Sibaté",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 907,
    "nombre": "Sibundoy",
    "estado": 1,
    "departamentoId": 86
  },
  {
    "id": 908,
    "nombre": "Silos",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 909,
    "nombre": "Silvania",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 910,
    "nombre": "Silvia",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 911,
    "nombre": "Simacota",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 912,
    "nombre": "Simijaca",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 913,
    "nombre": "Simití",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 914,
    "nombre": "Sincelejo",
    "estado": 1,
    "departamentoId": 70
  },
  {
    "id": 915,
    "nombre": "Sincé",
    "estado": 1,
    "departamentoId": 70
  },
  {
    "id": 916,
    "nombre": "Sipí",
    "estado": 1,
    "departamentoId": 27
  },
  {
    "id": 917,
    "nombre": "Sitionuevo",
    "estado": 1,
    "departamentoId": 47
  },
  {
    "id": 918,
    "nombre": "Soacha",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 919,
    "nombre": "Soatá",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 920,
    "nombre": "Socha",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 921,
    "nombre": "Socorro",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 922,
    "nombre": "Socotá",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 923,
    "nombre": "Sogamoso",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 924,
    "nombre": "Solano",
    "estado": 1,
    "departamentoId": 18
  },
  {
    "id": 925,
    "nombre": "Soledad",
    "estado": 1,
    "departamentoId": 8
  },
  {
    "id": 926,
    "nombre": "Solita",
    "estado": 1,
    "departamentoId": 18
  },
  {
    "id": 927,
    "nombre": "Somondoco",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 928,
    "nombre": "Sonsón",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 929,
    "nombre": "Sopetrán",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 930,
    "nombre": "Soplaviento",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 931,
    "nombre": "Sopó",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 932,
    "nombre": "Sora",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 933,
    "nombre": "Soracá",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 934,
    "nombre": "Sotaquirá",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 935,
    "nombre": "Sotara (Paispamba)",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 936,
    "nombre": "Sotomayor (Los Andes)",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 937,
    "nombre": "Suaita",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 938,
    "nombre": "Suan",
    "estado": 1,
    "departamentoId": 8
  },
  {
    "id": 939,
    "nombre": "Suaza",
    "estado": 1,
    "departamentoId": 41
  },
  {
    "id": 940,
    "nombre": "Subachoque",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 941,
    "nombre": "Sucre",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 942,
    "nombre": "Sucre",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 943,
    "nombre": "Sucre",
    "estado": 1,
    "departamentoId": 70
  },
  {
    "id": 944,
    "nombre": "Suesca",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 945,
    "nombre": "Supatá",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 946,
    "nombre": "Supía",
    "estado": 1,
    "departamentoId": 17
  },
  {
    "id": 947,
    "nombre": "Suratá",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 948,
    "nombre": "Susa",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 949,
    "nombre": "Susacón",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 950,
    "nombre": "Sutamarchán",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 951,
    "nombre": "Sutatausa",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 952,
    "nombre": "Sutatenza",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 953,
    "nombre": "Suárez",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 954,
    "nombre": "Suárez",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 955,
    "nombre": "Sácama",
    "estado": 1,
    "departamentoId": 85
  },
  {
    "id": 956,
    "nombre": "Sáchica",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 957,
    "nombre": "Tabio",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 958,
    "nombre": "Tadó",
    "estado": 1,
    "departamentoId": 27
  },
  {
    "id": 959,
    "nombre": "Talaigua Nuevo",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 960,
    "nombre": "Tamalameque",
    "estado": 1,
    "departamentoId": 20
  },
  {
    "id": 961,
    "nombre": "Tame",
    "estado": 1,
    "departamentoId": 81
  },
  {
    "id": 962,
    "nombre": "Taminango",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 963,
    "nombre": "Tangua",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 964,
    "nombre": "Taraira",
    "estado": 1,
    "departamentoId": 97
  },
  {
    "id": 965,
    "nombre": "Tarazá",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 966,
    "nombre": "Tarqui",
    "estado": 1,
    "departamentoId": 41
  },
  {
    "id": 967,
    "nombre": "Tarso",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 968,
    "nombre": "Tasco",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 969,
    "nombre": "Tauramena",
    "estado": 1,
    "departamentoId": 85
  },
  {
    "id": 970,
    "nombre": "Tausa",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 971,
    "nombre": "Tello",
    "estado": 1,
    "departamentoId": 41
  },
  {
    "id": 972,
    "nombre": "Tena",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 973,
    "nombre": "Tenerife",
    "estado": 1,
    "departamentoId": 47
  },
  {
    "id": 974,
    "nombre": "Tenjo",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 975,
    "nombre": "Tenza",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 976,
    "nombre": "Teorama",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 977,
    "nombre": "Teruel",
    "estado": 1,
    "departamentoId": 41
  },
  {
    "id": 978,
    "nombre": "Tesalia",
    "estado": 1,
    "departamentoId": 41
  },
  {
    "id": 979,
    "nombre": "Tibacuy",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 980,
    "nombre": "Tibaná",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 981,
    "nombre": "Tibasosa",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 982,
    "nombre": "Tibirita",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 983,
    "nombre": "Tibú",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 984,
    "nombre": "Tierralta",
    "estado": 1,
    "departamentoId": 23
  },
  {
    "id": 985,
    "nombre": "Timaná",
    "estado": 1,
    "departamentoId": 41
  },
  {
    "id": 986,
    "nombre": "Timbiquí",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 987,
    "nombre": "Timbío",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 988,
    "nombre": "Tinjacá",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 989,
    "nombre": "Tipacoque",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 990,
    "nombre": "Tiquisio (Puerto Rico)",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 991,
    "nombre": "Titiribí",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 992,
    "nombre": "Toca",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 993,
    "nombre": "Tocaima",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 994,
    "nombre": "Tocancipá",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 995,
    "nombre": "Toguí",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 996,
    "nombre": "Toledo",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 997,
    "nombre": "Toledo",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 998,
    "nombre": "Tolú",
    "estado": 1,
    "departamentoId": 70
  },
  {
    "id": 999,
    "nombre": "Tolú Viejo",
    "estado": 1,
    "departamentoId": 70
  },
  {
    "id": 1000,
    "nombre": "Tona",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 1001,
    "nombre": "Topagá",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 1002,
    "nombre": "Topaipí",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 1003,
    "nombre": "Toribío",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 1004,
    "nombre": "Toro",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 1005,
    "nombre": "Tota",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 1006,
    "nombre": "Totoró",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 1007,
    "nombre": "Trinidad",
    "estado": 1,
    "departamentoId": 85
  },
  {
    "id": 1008,
    "nombre": "Trujillo",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 1009,
    "nombre": "Tubará",
    "estado": 1,
    "departamentoId": 8
  },
  {
    "id": 1010,
    "nombre": "Tuchín",
    "estado": 1,
    "departamentoId": 23
  },
  {
    "id": 1011,
    "nombre": "Tulúa",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 1012,
    "nombre": "Tumaco",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 1013,
    "nombre": "Tunja",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 1014,
    "nombre": "Tunungua",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 1015,
    "nombre": "Turbaco",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 1016,
    "nombre": "Turbaná",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 1017,
    "nombre": "Turbo",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 1018,
    "nombre": "Turmequé",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 1019,
    "nombre": "Tuta",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 1020,
    "nombre": "Tutasá",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 1021,
    "nombre": "Támara",
    "estado": 1,
    "departamentoId": 85
  },
  {
    "id": 1022,
    "nombre": "Támesis",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 1023,
    "nombre": "Túquerres",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 1024,
    "nombre": "Ubalá",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 1025,
    "nombre": "Ubaque",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 1026,
    "nombre": "Ubaté",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 1027,
    "nombre": "Ulloa",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 1028,
    "nombre": "Une",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 1029,
    "nombre": "Unguía",
    "estado": 1,
    "departamentoId": 27
  },
  {
    "id": 1030,
    "nombre": "Unión Panamericana (ÁNIMAS)",
    "estado": 1,
    "departamentoId": 27
  },
  {
    "id": 1031,
    "nombre": "Uramita",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 1032,
    "nombre": "Uribe",
    "estado": 1,
    "departamentoId": 50
  },
  {
    "id": 1033,
    "nombre": "Uribia",
    "estado": 1,
    "departamentoId": 44
  },
  {
    "id": 1034,
    "nombre": "Urrao",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 1035,
    "nombre": "Urumita",
    "estado": 1,
    "departamentoId": 44
  },
  {
    "id": 1036,
    "nombre": "Usiacuri",
    "estado": 1,
    "departamentoId": 8
  },
  {
    "id": 1037,
    "nombre": "Valdivia",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 1038,
    "nombre": "Valencia",
    "estado": 1,
    "departamentoId": 23
  },
  {
    "id": 1039,
    "nombre": "Valle de San José",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 1040,
    "nombre": "Valle de San Juan",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 1041,
    "nombre": "Valle del Guamuez",
    "estado": 1,
    "departamentoId": 86
  },
  {
    "id": 1042,
    "nombre": "Valledupar",
    "estado": 1,
    "departamentoId": 20
  },
  {
    "id": 1043,
    "nombre": "Valparaiso",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 1044,
    "nombre": "Valparaiso",
    "estado": 1,
    "departamentoId": 18
  },
  {
    "id": 1045,
    "nombre": "Vegachí",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 1046,
    "nombre": "Venadillo",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 1047,
    "nombre": "Venecia",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 1048,
    "nombre": "Venecia (Ospina Pérez)",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 1049,
    "nombre": "Ventaquemada",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 1050,
    "nombre": "Vergara",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 1051,
    "nombre": "Versalles",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 1052,
    "nombre": "Vetas",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 1053,
    "nombre": "Viani",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 1054,
    "nombre": "Vigía del Fuerte",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 1055,
    "nombre": "Vijes",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 1056,
    "nombre": "Villa Caro",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 1057,
    "nombre": "Villa Rica",
    "estado": 1,
    "departamentoId": 19
  },
  {
    "id": 1058,
    "nombre": "Villa de Leiva",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 1059,
    "nombre": "Villa del Rosario",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 1060,
    "nombre": "Villagarzón",
    "estado": 1,
    "departamentoId": 86
  },
  {
    "id": 1061,
    "nombre": "Villagómez",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 1062,
    "nombre": "Villahermosa",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 1063,
    "nombre": "Villamaría",
    "estado": 1,
    "departamentoId": 17
  },
  {
    "id": 1064,
    "nombre": "Villanueva",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 1065,
    "nombre": "Villanueva",
    "estado": 1,
    "departamentoId": 44
  },
  {
    "id": 1066,
    "nombre": "Villanueva",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 1067,
    "nombre": "Villanueva",
    "estado": 1,
    "departamentoId": 85
  },
  {
    "id": 1068,
    "nombre": "Villapinzón",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 1069,
    "nombre": "Villarrica",
    "estado": 1,
    "departamentoId": 73
  },
  {
    "id": 1070,
    "nombre": "Villavicencio",
    "estado": 1,
    "departamentoId": 50
  },
  {
    "id": 1071,
    "nombre": "Villavieja",
    "estado": 1,
    "departamentoId": 41
  },
  {
    "id": 1072,
    "nombre": "Villeta",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 1073,
    "nombre": "Viotá",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 1074,
    "nombre": "Viracachá",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 1075,
    "nombre": "Vista Hermosa",
    "estado": 1,
    "departamentoId": 50
  },
  {
    "id": 1076,
    "nombre": "Viterbo",
    "estado": 1,
    "departamentoId": 17
  },
  {
    "id": 1077,
    "nombre": "Vélez",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 1078,
    "nombre": "Yacopí",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 1079,
    "nombre": "Yacuanquer",
    "estado": 1,
    "departamentoId": 52
  },
  {
    "id": 1080,
    "nombre": "Yaguará",
    "estado": 1,
    "departamentoId": 41
  },
  {
    "id": 1081,
    "nombre": "Yalí",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 1082,
    "nombre": "Yarumal",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 1083,
    "nombre": "Yolombó",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 1084,
    "nombre": "Yondó (Casabe)",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 1085,
    "nombre": "Yopal",
    "estado": 1,
    "departamentoId": 85
  },
  {
    "id": 1086,
    "nombre": "Yotoco",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 1087,
    "nombre": "Yumbo",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 1088,
    "nombre": "Zambrano",
    "estado": 1,
    "departamentoId": 13
  },
  {
    "id": 1089,
    "nombre": "Zapatoca",
    "estado": 1,
    "departamentoId": 68
  },
  {
    "id": 1090,
    "nombre": "Zapayán (PUNTA DE PIEDRAS)",
    "estado": 1,
    "departamentoId": 47
  },
  {
    "id": 1091,
    "nombre": "Zaragoza",
    "estado": 1,
    "departamentoId": 5
  },
  {
    "id": 1092,
    "nombre": "Zarzal",
    "estado": 1,
    "departamentoId": 76
  },
  {
    "id": 1093,
    "nombre": "Zetaquirá",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 1094,
    "nombre": "Zipacón",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 1095,
    "nombre": "Zipaquirá",
    "estado": 1,
    "departamentoId": 25
  },
  {
    "id": 1096,
    "nombre": "Zona Bananera (PRADO - SEVILLA)",
    "estado": 1,
    "departamentoId": 47
  },
  {
    "id": 1097,
    "nombre": "Ábrego",
    "estado": 1,
    "departamentoId": 54
  },
  {
    "id": 1098,
    "nombre": "Íquira",
    "estado": 1,
    "departamentoId": 41
  },
  {
    "id": 1099,
    "nombre": "Úmbita",
    "estado": 1,
    "departamentoId": 15
  },
  {
    "id": 1100,
    "nombre": "Útica",
    "estado": 1,
    "departamentoId": 25
  }
];
