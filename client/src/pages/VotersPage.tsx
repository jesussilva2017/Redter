import React, { useEffect, useState } from 'react';
import { 
  UserCheck, 
  Plus, 
  Search, 
  CheckCircle2, 
  MapPin, 
  X, 
  Phone,
  Vote,
  ChevronRight,
  ChevronLeft,
  Check,
  AlertCircle,
  Loader2,
  User,
  Briefcase,
  Building2,
  Trees,
  Calendar,
  Clock,
  MessageSquare,
  PhoneCall,
  Send,
  FileText,
  Pencil,
  Cake,
  Eye,
} from 'lucide-react';
import axios from 'axios';
import { Voter, Puesto, User as UserModel, EstadoSeguimiento, TipoSeguimiento, VoterSeguimiento } from '../types';
import { useAuth } from '../context/AuthContext';
import { DEPARTAMENTOS_COLOMBIA, MUNICIPIOS_COLOMBIA } from '../data/colombiaData';
import { BARRIOS_GARZON, VEREDAS_GARZON } from '../data/garzonData';
import { ZONAS_VOTACION_GARZON, PUESTOS_VOTACION_GARZON, MESAS_VOTACION_GARZON } from '../data/garzonVotacionData';
import { SearchableSelect } from '../components/SearchableSelect';

const DOCUMENT_TYPES = [
  { value: 'CC', label: 'Cédula de Ciudadanía (CC)' },
  { value: 'TI', label: 'Tarjeta de Identidad (TI)' },
  { value: 'CE', label: 'Cédula de Extranjería (CE)' },
  { value: 'PP', label: 'Pasaporte (PP)' },
  { value: 'PEP', label: 'Permiso Especial de Permanencia (PEP)' },
];

const GENDER_OPTIONS = [
  'Masculino',
  'Femenino',
  'No binario / Otro',
  'Prefiero no decir'
];

const ZONE_OPTIONS = [
  'Urbana',
  'Rural'
];

const EDUCATION_LEVELS = [
  'Sin estudios',
  'Primaria',
  'Secundaria',
  'Bachillerato',
  'Técnico',
  'Tecnólogo',
  'Profesional universitario',
  'Especialización',
  'Maestría',
  'Doctorado'
];

const OCCUPATIONS = [
  'Empleado',
  'Desempleado',
  'Independiente',
  'Comerciante',
  'Empresario',
  'Emprendedor',
  'Agricultor',
  'Ganadero',
  'Profesional independiente',
  'Funcionario/empleado público',
  'Docente',
  'Estudiante',
  'Ama/o de casa',
  'Pensionado'
];

const initialVoterForm = {
  // Paso 1: Datos personales
  tipoDocumento: 'CC',
  cedula: '',
  nombres: '',
  apellidos: '',
  telefono: '',
  whatsapp: '',
  email: '',
  fechaNacimiento: '',
  departamentoNacimiento: '',
  ciudadNacimiento: '',
  genero: 'Masculino',
  zona: 'Urbana',
  direccion: '',
  barrioVereda: '',
  // Paso 2: Ocupación
  nivelEducativo: 'Bachillerato',
  ocupacionActual: 'Empleado',
  profesionOficio: '',
  empresaLugarTrabajo: '',
  // Paso 3: Información electoral
  departamento: 'Huila',
  municipio: 'Garzón',
  zonaElectoral: 'Zona 1 - Centro Urbano',
  puestoVotacionId: 'puesto-garzon-1',
  mesa: 1,
  leaderId: 'user-admin',
  nivelFidelizacion: 'SIMPATIZANTE' as const,
  requiereTransporte: false,
  votoAsistido: false,
  observaciones: '',
};

export const VotersPage: React.FC = () => {
  const { user } = useAuth();
  const [voters, setVoters] = useState<Voter[]>([]);
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [leaders, setLeaders] = useState<UserModel[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [search, setSearch] = useState('');
  const [nivelFilter, setNivelFilter] = useState('');
  const [seguimientoFilter, setSeguimientoFilter] = useState('');

  // Paginación (10 por defecto, filtros 10, 50, 100 y 1000)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Modal Seguimiento Votante
  const [isSeguimientoModalOpen, setIsSeguimientoModalOpen] = useState(false);
  const [selectedVoterForSeguimiento, setSelectedVoterForSeguimiento] = useState<Voter | null>(null);
  const [seguimientoForm, setSeguimientoForm] = useState<{
    usuarioResponsableId: string;
    fechaSeguimiento: string;
    tipoSeguimiento: TipoSeguimiento | string;
    estado: EstadoSeguimiento;
    observaciones: string;
  }>({
    usuarioResponsableId: '',
    fechaSeguimiento: '',
    tipoSeguimiento: 'Llamada',
    estado: 'PENDIENTE',
    observaciones: '',
  });
  const [savingSeguimiento, setSavingSeguimiento] = useState(false);
  const [historialSeguimientos, setHistorialSeguimientos] = useState<VoterSeguimiento[]>([]);
  const [loadingHistorial, setLoadingHistorial] = useState(false);

  // Modal Registro & Edición Stepper
  const [editingVoterId, setEditingVoterId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [stepError, setStepError] = useState('');
  const [touchedStep1, setTouchedStep1] = useState(false);
  const [savingVoter, setSavingVoter] = useState(false);
  const [sectorType, setSectorType] = useState<'Barrio' | 'Vereda'>('Barrio');
  const [newVoter, setNewVoter] = useState({
    ...initialVoterForm,
    leaderId: user?.id || 'user-admin',
  });

  const departamentosOptions = React.useMemo(() => {
    return DEPARTAMENTOS_COLOMBIA.map(d => ({
      id: d.id,
      label: d.nombre,
    }));
  }, []);

  const selectedDeptObj = React.useMemo(() => {
    if (!newVoter.departamentoNacimiento) return null;
    return DEPARTAMENTOS_COLOMBIA.find(
      d => d.nombre.toUpperCase() === newVoter.departamentoNacimiento.toUpperCase()
    );
  }, [newVoter.departamentoNacimiento]);

  const municipiosOptions = React.useMemo(() => {
    if (!selectedDeptObj) return [];
    return MUNICIPIOS_COLOMBIA
      .filter(m => m.departamentoId === selectedDeptObj.id)
      .map(m => ({
        id: m.id,
        label: m.nombre,
      }));
  }, [selectedDeptObj]);

  // Opciones electorales para el Paso 3
  const selectedElectoralDeptObj = React.useMemo(() => {
    if (!newVoter.departamento) return null;
    return DEPARTAMENTOS_COLOMBIA.find(
      d => d.nombre.toUpperCase() === newVoter.departamento.toUpperCase()
    );
  }, [newVoter.departamento]);

  const electoralMunicipiosOptions = React.useMemo(() => {
    if (!selectedElectoralDeptObj) return [];
    return MUNICIPIOS_COLOMBIA
      .filter(m => m.departamentoId === selectedElectoralDeptObj.id)
      .map(m => ({
        id: m.id,
        label: m.nombre,
      }));
  }, [selectedElectoralDeptObj]);

  // Zonas electorales para el Paso 3
  const zonasElectoralesOptions = React.useMemo(() => {
    const isGarzon = !newVoter.municipio || newVoter.municipio.toLowerCase().includes('garz');
    if (isGarzon) {
      return ZONAS_VOTACION_GARZON.map(z => ({
        id: z.id,
        label: z.nombre,
        subtitle: z.descripcion || `Tipo: ${z.tipo}`,
      }));
    }
    const distinctZonas = Array.from(new Set(puestos.map(p => p.zona).filter(Boolean)));
    return distinctZonas.map((z, idx) => ({
      id: idx + 1,
      label: z,
      subtitle: 'Zona electoral',
    }));
  }, [newVoter.municipio, puestos]);

  // Lista combinada de puestos con fallback seguro a PUESTOS_VOTACION_GARZON
  const allAvailablePuestos = React.useMemo(() => {
    const list = [...puestos];
    for (const pg of PUESTOS_VOTACION_GARZON) {
      if (!list.some(p => p.id === pg.id)) {
        list.push({
          id: pg.id,
          nombrePuesto: pg.nombre,
          departamento: pg.departamento,
          municipio: pg.municipio,
          zona: pg.zona,
          direccion: pg.direccion,
          mesasTotales: pg.mesasTotales,
          numeroPuesto: pg.numero,
          institucion: pg.institucion,
          barrioVereda: pg.barrioVereda,
          idZona: pg.idZona,
          totalMesas: pg.totalMesas,
          capacidadVotantes: pg.capacidadVotantes,
        });
      }
    }
    return list;
  }, [puestos]);

  const filteredPuestos = React.useMemo(() => {
    const norm = (s?: string | null) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();

    return allAvailablePuestos.filter((p) => {
      const matchDepto = !newVoter.departamento || norm(p.departamento) === norm(newVoter.departamento);
      const matchMun = !newVoter.municipio || norm(p.municipio) === norm(newVoter.municipio);

      let matchZona = true;
      if (newVoter.zonaElectoral) {
        const selNorm = norm(newVoter.zonaElectoral);
        const pzNorm = norm(p.zona);
        const selNum = selNorm.match(/zona\s*(\d+)/i)?.[1];
        const pzNum = pzNorm.match(/zona\s*(\d+)/i)?.[1];

        if (selNum && pzNum && selNum === pzNum) {
          matchZona = true;
        } else if (selNorm && pzNorm && (pzNorm.includes(selNorm) || selNorm.includes(pzNorm))) {
          matchZona = true;
        } else {
          matchZona = false;
        }
      }

      return matchDepto && matchMun && matchZona;
    });
  }, [allAvailablePuestos, newVoter.departamento, newVoter.municipio, newVoter.zonaElectoral]);

  const puestosOptions = React.useMemo(() => {
    return filteredPuestos.map((p) => ({
      id: p.id,
      label: p.nombrePuesto,
      subtitle: `${p.zona || ''} • ${p.direccion || ''} ${p.barrioVereda ? '(' + p.barrioVereda + ')' : ''} • ${p.totalMesas || p.mesasTotales || 1} mesas`,
    }));
  }, [filteredPuestos]);

  const selectedPuestoObj = React.useMemo(() => {
    if (!newVoter.puestoVotacionId) return null;
    return allAvailablePuestos.find(p => p.id === newVoter.puestoVotacionId) || null;
  }, [newVoter.puestoVotacionId, allAvailablePuestos]);

  const mesasOptions = React.useMemo(() => {
    if (!selectedPuestoObj) return [];
    const garzonMesas = MESAS_VOTACION_GARZON.filter(m => m.puestoId === selectedPuestoObj.id);
    if (garzonMesas.length > 0) {
      return garzonMesas.map(m => ({
        id: m.numero,
        label: `Mesa ${m.numero}`,
        subtitle: `Código ${m.codigo}`,
      }));
    }
    const total = selectedPuestoObj.totalMesas || selectedPuestoObj.mesasTotales || 1;
    const items = [];
    for (let i = 1; i <= total; i++) {
      items.push({
        id: i,
        label: `Mesa ${i}`,
        subtitle: `Mesa N° ${i}`,
      });
    }
    return items;
  }, [selectedPuestoObj]);

  // Opciones de Barrios y Veredas de Garzón (Huila)
  const barriosOptions = React.useMemo(() => {
    return BARRIOS_GARZON.map(b => ({
      id: b.id,
      label: b.nombre,
      subtitle: b.codigoPostal ? `C.P. ${b.codigoPostal}` : 'Zona urbana de Garzón',
    }));
  }, []);

  const veredasOptions = React.useMemo(() => {
    return VEREDAS_GARZON.map(v => ({
      id: v.id,
      label: v.nombre,
      subtitle: v.descripcion || 'Zona rural de Garzón',
    }));
  }, []);

  useEffect(() => {
    fetchVoters();
    fetchAuxiliaryData();
  }, [search, nivelFilter, seguimientoFilter]);

  const fetchVoters = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (search) params.search = search;
      if (nivelFilter) params.nivelFidelizacion = nivelFilter;
      if (seguimientoFilter) params.estadoSeguimiento = seguimientoFilter;

      const res = await axios.get('/api/v1/voters', { params });
      setVoters(res.data.voters || []);
    } catch (err) {
      console.error('Error al obtener votantes:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuxiliaryData = async () => {
    try {
      const [puestosRes, usersRes] = await Promise.all([
        axios.get('/api/v1/territory/puestos'),
        axios.get('/api/v1/users'),
      ]);
      setPuestos(puestosRes.data.puestos || []);
      setLeaders(usersRes.data.users || []);
    } catch (err) {
      console.error('Error al cargar datos auxiliares:', err);
    }
  };

  const openModal = () => {
    setEditingVoterId(null);
    setCurrentStep(1);
    setStepError('');
    setTouchedStep1(false);
    setSectorType('Barrio');
    setNewVoter({
      ...initialVoterForm,
      leaderId: user?.id || 'user-admin',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingVoterId(null);
    setStepError('');
    setTouchedStep1(false);
    setSectorType('Barrio');
  };

  const openEditVoterModal = (voter: Voter) => {
    setEditingVoterId(voter.id);
    setCurrentStep(1);
    setStepError('');
    setTouchedStep1(false);
    setSectorType(voter.zona === 'Rural' ? 'Vereda' : 'Barrio');
    setNewVoter({
      tipoDocumento: voter.tipoDocumento || 'CC',
      cedula: voter.cedula || '',
      nombres: voter.nombres || '',
      apellidos: voter.apellidos || '',
      telefono: voter.telefono || '',
      whatsapp: voter.whatsapp || voter.telefono || '',
      email: voter.email || '',
      fechaNacimiento: voter.fechaNacimiento ? String(voter.fechaNacimiento).substring(0, 10) : '',
      departamentoNacimiento: voter.departamentoNacimiento || '',
      ciudadNacimiento: voter.ciudadNacimiento || '',
      genero: voter.genero || 'Masculino',
      zona: voter.zona || 'Urbana',
      direccion: voter.direccion || '',
      barrioVereda: voter.barrioVereda || '',
      nivelEducativo: voter.nivelEducativo || 'Bachillerato',
      ocupacionActual: voter.ocupacionActual || 'Empleado',
      profesionOficio: voter.profesionOficio || '',
      empresaLugarTrabajo: voter.empresaLugarTrabajo || '',
      departamento: voter.departamento || 'Huila',
      municipio: voter.municipio || 'Garzón',
      zonaElectoral: voter.zonaElectoral || '',
      puestoVotacionId: voter.puestoVotacionId || '',
      mesa: voter.mesa || 1,
      leaderId: voter.leaderId || user?.id || 'user-admin',
      nivelFidelizacion: (voter.nivelFidelizacion as any) || 'SIMPATIZANTE',
      requiereTransporte: false,
      votoAsistido: Boolean(voter.votoAsistido),
      observaciones: voter.observaciones || '',
    });
    setIsModalOpen(true);
  };

  const getStep1Errors = () => {
    const errs: Record<string, string> = {};
    if (!newVoter.tipoDocumento?.trim()) errs.tipoDocumento = 'Seleccione el tipo de documento.';
    if (!newVoter.cedula?.trim()) errs.cedula = 'El número de documento es obligatorio.';
    if (!newVoter.nombres?.trim()) errs.nombres = 'Los nombres son obligatorios.';
    if (!newVoter.apellidos?.trim()) errs.apellidos = 'Los apellidos son obligatorios.';

    // Validación de celular (solo números, 10 dígitos)
    if (!newVoter.telefono?.trim()) {
      errs.telefono = 'El número de celular es obligatorio.';
    } else if (!/^\d+$/.test(newVoter.telefono)) {
      errs.telefono = 'El celular solo debe contener números.';
    } else if (newVoter.telefono.length < 10) {
      errs.telefono = 'El celular debe tener 10 dígitos (ej: 3001234567).';
    }

    // Validación de correo electrónico (tipo EMAIL con formato válido)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newVoter.email?.trim()) {
      errs.email = 'El correo electrónico es obligatorio.';
    } else if (!emailRegex.test(newVoter.email.trim())) {
      errs.email = 'Ingrese un correo electrónico válido (ej: usuario@correo.com).';
    }

    if (!newVoter.fechaNacimiento?.trim()) errs.fechaNacimiento = 'La fecha de nacimiento es obligatoria.';
    if (!newVoter.departamentoNacimiento?.trim()) errs.departamentoNacimiento = 'Seleccione el departamento de nacimiento.';
    if (!newVoter.ciudadNacimiento?.trim()) errs.ciudadNacimiento = 'Seleccione el municipio de nacimiento.';
    if (!newVoter.genero?.trim()) errs.genero = 'Seleccione el género.';
    if (!newVoter.zona?.trim()) errs.zona = 'Seleccione la zona (Urbana o Rural).';
    if (!newVoter.direccion?.trim()) errs.direccion = 'La dirección de residencia es obligatoria.';
    if (!newVoter.barrioVereda?.trim()) {
      errs.barrioVereda = sectorType === 'Vereda' ? 'Seleccione o ingrese la vereda.' : 'Seleccione o ingrese el barrio.';
    }
    return errs;
  };

  const step1Errors = touchedStep1 ? getStep1Errors() : {};

  const validateStep1 = () => {
    setTouchedStep1(true);
    const errs = getStep1Errors();
    const count = Object.keys(errs).length;
    if (count > 0) {
      setStepError(`Por favor complete todos los campos obligatorios del Paso 1 (${count} campo${count > 1 ? 's' : ''} pendiente${count > 1 ? 's' : ''} en rojo).`);
      return false;
    }
    setStepError('');
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setStepError('');
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    setStepError('');
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleCreateVoter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }

    setSavingVoter(true);
    setStepError('');
    try {
      if (editingVoterId) {
        await axios.put(`/api/v1/voters/${editingVoterId}`, {
          ...newVoter,
        });
      } else {
        await axios.post('/api/v1/voters', {
          ...newVoter,
          leaderId: user?.id || 'user-admin',
        });
      }
      closeModal();
      fetchVoters();
    } catch (err: any) {
      setStepError(err.response?.data?.error || (editingVoterId ? 'Error al actualizar el votante. Verifique los datos.' : 'Error al registrar el votante. Verifique los datos.'));
    } finally {
      setSavingVoter(false);
    }
  };

  const handleConfirmVote = async (voterId: string) => {
    try {
      await axios.patch(`/api/v1/voters/${voterId}/confirm-vote`);
      fetchVoters();
    } catch (err) {
      alert('Error al marcar voto confirmado');
    }
  };

  const getFidelizacionBadge = (nivel?: string) => {
    const n = (nivel || '').toUpperCase();
    if (n === 'SEGURO' || n.includes('SEGURO')) {
      return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">🟢 Voto Seguro</span>;
    }
    if (n === 'SIMPATIZANTE' || n.includes('SIMPATIZANTE')) {
      return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">🔵 Simpatizante</span>;
    }
    if (n === 'INDECISO' || n.includes('INDECISO')) {
      return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">🟡 Indeciso</span>;
    }
    if (n === 'OPOSITOR' || n.includes('OPOSITOR')) {
      return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">🔴 Opositor</span>;
    }
    return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">🔵 Simpatizante</span>;
  };

  const getSeguimientoBadge = (estado?: string, fecha?: string | null) => {
    const est = estado || 'PENDIENTE';
    let badgeStyle = '';
    let label = '';

    switch (est) {
      case 'EN_PROCESO':
        badgeStyle = 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100';
        label = '🔵 En proceso';
        break;
      case 'COMPLETADO':
        badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100';
        label = '🟢 Completado';
        break;
      case 'VENCIDO':
        badgeStyle = 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100';
        label = '🔴 Vencido';
        break;
      case 'CANCELADO':
        badgeStyle = 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200';
        label = '⚪ Cancelado';
        break;
      case 'PENDIENTE':
      default:
        badgeStyle = 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100';
        label = '🟡 Pendiente';
        break;
    }

    const fechaFormatted = fecha ? new Date(fecha).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' }) : null;

    return (
      <div className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex flex-col items-start gap-0.5 transition shadow-2xs ${badgeStyle}`}>
        <span className="flex items-center gap-1.5">{label}</span>
        <span className="text-[10px] opacity-80 font-normal flex items-center gap-1">
          <Calendar className="w-2.5 h-2.5" /> {fechaFormatted || 'Sin fecha'}
        </span>
      </div>
    );
  };

  const getCumpleanosInfo = (fechaNacimiento?: string | null) => {
    if (!fechaNacimiento) return null;

    try {
      const rawDateStr = String(fechaNacimiento).split('T')[0];
      const parts = rawDateStr.split('-');
      if (parts.length < 3) return null;

      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);

      if (isNaN(year) || isNaN(month) || isNaN(day)) return null;

      const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];
      const diaMes = `${day} de ${meses[month]}`;

      const today = new Date();
      let edad = today.getFullYear() - year;
      const m = today.getMonth() - month;
      if (m < 0 || (m === 0 && today.getDate() < day)) {
        edad--;
      }

      const thisYearBirthday = new Date(today.getFullYear(), month, day);
      const diffTime = thisYearBirthday.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const esHoy = today.getDate() === day && today.getMonth() === month;
      const proximoCumple = !esHoy && diffDays > 0 && diffDays <= 7;

      return {
        diaMes,
        edad: edad > 0 && edad < 125 ? edad : null,
        esHoy,
        proximoCumple,
        fechaExacta: `${day.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year}`,
      };
    } catch (err) {
      return null;
    }
  };

  // Paginación y Filtrado Dinámico
  useEffect(() => {
    setCurrentPage(1);
  }, [search, nivelFilter, seguimientoFilter, pageSize]);

  const totalRecords = voters.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedVoters = voters.slice(startIndex, startIndex + pageSize);
  const startRecord = totalRecords === 0 ? 0 : startIndex + 1;
  const endRecord = Math.min(startIndex + pageSize, totalRecords);

  const openSeguimientoModal = async (voter: Voter) => {
    setSelectedVoterForSeguimiento(voter);
    setSeguimientoForm({
      usuarioResponsableId: voter.usuarioResponsableId || voter.leaderId || user?.id || '',
      fechaSeguimiento: voter.fechaSeguimiento ? voter.fechaSeguimiento.substring(0, 10) : '',
      tipoSeguimiento: (voter.tipoSeguimiento as any) || 'Llamada',
      estado: voter.estadoSeguimiento || 'PENDIENTE',
      observaciones: voter.observacionesSeguimiento || '',
    });
    setIsSeguimientoModalOpen(true);
    setLoadingHistorial(true);
    try {
      const res = await axios.get(`/api/v1/voters/${voter.id}/seguimientos`);
      setHistorialSeguimientos(res.data.seguimientos || []);
    } catch (err) {
      console.warn('Error al cargar historial de seguimientos:', err);
      setHistorialSeguimientos([]);
    } finally {
      setLoadingHistorial(false);
    }
  };

  const closeSeguimientoModal = () => {
    setIsSeguimientoModalOpen(false);
    setSelectedVoterForSeguimiento(null);
  };

  const handleSaveSeguimiento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVoterForSeguimiento) return;
    setSavingSeguimiento(true);
    try {
      await axios.post(`/api/v1/voters/${selectedVoterForSeguimiento.id}/seguimiento`, seguimientoForm);
      
      // Actualizar votante en el estado local de la tabla
      setVoters(prev => prev.map(v => {
        if (v.id === selectedVoterForSeguimiento.id) {
          return {
            ...v,
            estadoSeguimiento: seguimientoForm.estado,
            fechaSeguimiento: seguimientoForm.fechaSeguimiento || null,
            tipoSeguimiento: seguimientoForm.tipoSeguimiento,
            usuarioResponsableId: seguimientoForm.usuarioResponsableId,
            observacionesSeguimiento: seguimientoForm.observaciones,
          };
        }
        return v;
      }));

      closeSeguimientoModal();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error al guardar el seguimiento');
    } finally {
      setSavingSeguimiento(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-gray-800 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-navy" /> CRM Votantes & Segmentación
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Gestión 360° de simpatizantes, asignación por puestos de votación e intención de voto.
          </p>
        </div>
        <button
          onClick={openModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy hover:bg-navy-deep text-white font-semibold text-sm rounded-xl shadow-md transition"
        >
          <Plus className="w-4 h-4" /> Registrar Nuevo Votante
        </button>
      </div>

      {/* Buscador y filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por cédula, nombre, teléfono, profesión..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-line-strong rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={nivelFilter}
            onChange={(e) => setNivelFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-white border border-line-strong rounded-xl text-sm text-gray-700 min-w-[170px] focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
          >
            <option value="">Todas las intenciones</option>
            <option value="SEGURO">🟢 Voto Seguro</option>
            <option value="SIMPATIZANTE">🔵 Simpatizante</option>
            <option value="INDECISO">🟡 Indeciso</option>
            <option value="OPOSITOR">🔴 Opositor</option>
          </select>

          <select
            value={seguimientoFilter}
            onChange={(e) => setSeguimientoFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-white border border-line-strong rounded-xl text-sm text-gray-700 min-w-[180px] focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
          >
            <option value="">Todos los seguimientos</option>
            <option value="PENDIENTE">🟡 Pendientes</option>
            <option value="EN_PROCESO">🔵 En proceso</option>
            <option value="COMPLETADO">🟢 Completados</option>
            <option value="VENCIDO">🔴 Vencidos</option>
            <option value="CANCELADO">⚪ Cancelados</option>
          </select>
        </div>
      </div>

      {/* Voters Table */}
      <div className="bg-white rounded-2xl border border-line overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-surface-subtle text-gray-500 uppercase tracking-wider font-semibold border-b border-line">
              <tr>
                <th className="py-4 px-5 w-[20%] min-w-[220px]">Votante / Documento</th>
                <th className="py-4 px-5 w-[18%] min-w-[210px]">Profesión u Oficio</th>
                <th className="py-4 px-5 w-[14%] min-w-[165px]">Cumpleaños</th>
                <th className="py-4 px-5 w-[18%] min-w-[210px]">Ubicación</th>
                <th className="py-4 px-5 w-[11%] min-w-[140px]">Contacto</th>
                <th className="py-4 px-5 w-[9%] min-w-[125px]">Fidelización</th>
                <th className="py-4 px-5 w-[12%] min-w-[145px]">Seguimiento</th>
                <th className="py-4 px-5 w-[8%] min-w-[95px] text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-400">
                    Cargando censo electoral...
                  </td>
                </tr>
              ) : paginatedVoters.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-400">
                    No se encontraron votantes registrados en la base de datos.
                  </td>
                </tr>
              ) : (
                paginatedVoters.map((voter) => {
                  return (
                    <tr key={voter.id} className="hover:bg-surface-subtle/80 transition group">
                      {/* Votante / Documento */}
                      <td className="py-4 px-5">
                        <div className="font-semibold text-gray-800 text-sm flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-navy/10 text-navy font-bold flex items-center justify-center text-xs shrink-0 ring-2 ring-navy/5">
                            {voter.nombres.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <span className="font-semibold text-gray-800 text-sm block leading-tight">{voter.nombres} {voter.apellidos}</span>
                            <span className="text-gray-400 text-[11px] block mt-0.5 font-medium">
                              {voter.tipoDocumento || 'CC'}: {voter.cedula}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Profesión u Oficio */}
                      <td className="py-4 px-5">
                        <div className="font-medium text-gray-800 text-xs flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-navy shrink-0" />
                          <span className="font-semibold text-gray-800 text-xs" title={voter.profesionOficio || voter.ocupacionActual || 'Sin profesión registrada'}>
                            {voter.profesionOficio || voter.ocupacionActual || 'Sin profesión'}
                          </span>
                        </div>
                        {(voter.ocupacionActual || voter.nivelEducativo) && (
                          <div className="text-gray-400 text-[11px] ml-5 mt-0.5">
                            {voter.ocupacionActual} {voter.nivelEducativo ? `• ${voter.nivelEducativo}` : ''}
                          </div>
                        )}
                      </td>

                      {/* Cumpleaños */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        {(() => {
                          const info = getCumpleanosInfo(voter.fechaNacimiento);
                          if (!info) {
                            return (
                              <div className="text-gray-400 text-xs italic flex items-center gap-1.5">
                                <Cake className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                                <span>Sin fecha</span>
                              </div>
                            );
                          }
                          return (
                            <div>
                              <div className="font-semibold text-gray-800 text-xs flex items-center gap-1.5">
                                <Cake className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                                <span>{info.diaMes}</span>
                                {info.esHoy && (
                                  <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold rounded-full animate-pulse border border-rose-200">
                                    ¡Hoy! 🎉
                                  </span>
                                )}
                                {info.proximoCumple && (
                                  <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-medium rounded-full border border-amber-200">
                                    Próximo
                                  </span>
                                )}
                              </div>
                              <div className="text-gray-400 text-[11px] ml-5 mt-0.5">
                                {info.edad !== null ? `${info.edad} años • ` : ''}{info.fechaExacta}
                              </div>
                            </div>
                          );
                        })()}
                      </td>

                      {/* Ubicación: Dirección primero, abajo el barrio o vereda, sin ciudad */}
                      <td className="py-4 px-5">
                        <div className="text-gray-800 font-medium flex items-center gap-1.5 text-xs">
                          <MapPin className="w-3.5 h-3.5 text-navy shrink-0" />
                          <span className="font-medium text-gray-800" title={voter.direccion || 'Sin dirección'}>
                            {voter.direccion || 'Sin dirección'}
                          </span>
                        </div>
                        <div className="text-gray-500 text-[11px] ml-5 mt-0.5">
                          {voter.barrioVereda ? (
                            <span className="inline-flex items-center gap-1 font-medium text-slate-600">
                              🏘️ {voter.barrioVereda}
                            </span>
                          ) : (
                            <span className="text-gray-400 italic">Sin barrio / vereda</span>
                          )}
                        </div>
                      </td>

                      {/* Contacto: Número de teléfono y botón de WhatsApp */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-800 text-xs tracking-tight">
                            {voter.telefono || voter.whatsapp || <span className="text-gray-400 font-normal italic">Sin número</span>}
                          </span>
                          {(voter.telefono || voter.whatsapp) && (
                            <a
                              href={`https://wa.me/57${(voter.whatsapp || voter.telefono).replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={`Enviar WhatsApp a ${voter.nombres} (${voter.whatsapp || voter.telefono})`}
                              className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xs hover:scale-110 transition-all duration-150 shrink-0"
                            >
                              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.97.53 1.769.782 2.8.782h.005c3.181 0 5.768-2.587 5.768-5.767.001-3.182-2.585-5.767-5.769-5.767zm7.568 5.767c0 4.156-3.38 7.536-7.569 7.536-1.325 0-2.58-.344-3.679-.948l-4.351 1.141 1.161-4.243c-.672-1.144-1.026-2.455-1.026-3.486 0-4.156 3.38-7.536 7.57-7.536 4.157 0 7.57 3.38 7.57 7.536zm-3.896 2.373c-.22-.11-1.3-.642-1.502-.715-.202-.074-.35-.11-.497.11s-.572.715-.701.862c-.128.147-.257.165-.477.055s-.93-.343-1.771-1.093c-.655-.584-1.097-1.306-1.226-1.526-.128-.22-.014-.339.096-.448.1-.099.22-.257.33-.385.11-.129.147-.22.22-.367.074-.147.037-.275-.018-.385-.055-.11-.497-1.199-.68-1.642-.179-.432-.36-.373-.497-.38-.128-.007-.275-.008-.422-.008s-.385.055-.587.275c-.202.22-.77.752-.77 1.834 0 1.082.788 2.127.898 2.274.11.147 1.55 2.366 3.754 3.318.524.227.934.362 1.253.464.527.168 1.006.144 1.385.088.423-.063 1.3-.532 1.484-1.045.183-.513.183-.953.128-1.045-.055-.092-.202-.147-.422-.257z" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Fidelización */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        {getFidelizacionBadge(voter.nivelFidelizacion)}
                      </td>

                      {/* Seguimiento: Botón de estado interactivo */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => openSeguimientoModal(voter)}
                          title="Clic para gestionar seguimiento"
                          className="hover:scale-105 transition-transform focus:outline-none"
                        >
                          {getSeguimientoBadge(voter.estadoSeguimiento, voter.fechaSeguimiento)}
                        </button>
                      </td>

                      {/* Acción: Botón Ver que carga la modal con datos del votante */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => openEditVoterModal(voter)}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-navy hover:text-white text-gray-700 text-xs font-semibold border border-slate-200 hover:border-navy transition inline-flex items-center gap-1.5 shadow-2xs group"
                          title="Ver información del votante"
                        >
                          <Eye className="w-3.5 h-3.5 text-gray-500 group-hover:text-white transition" />
                          <span>Ver</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación y Selector de Tamaño de Registros */}
      <div className="bg-white border border-line rounded-2xl p-4 mt-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600 shadow-sm">
        {/* Información y Selector de registros (10, 50, 100, 1000) */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <span className="text-gray-500 font-medium">
            Mostrando <span className="font-semibold text-gray-800">{startRecord}</span> a{' '}
            <span className="font-semibold text-gray-800">{endRecord}</span> de{' '}
            <span className="font-semibold text-gray-800">{totalRecords}</span> registros
          </span>

          <div className="flex items-center gap-1.5 pl-0 sm:pl-3 sm:border-l sm:border-line">
            <span className="text-gray-500 text-[11px]">Mostrar:</span>
            {[10, 50, 100, 1000].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  pageSize === size
                    ? 'bg-navy text-white shadow-2xs'
                    : 'bg-surface-subtle hover:bg-gray-200 text-gray-700'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Controles de Navegación */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto justify-center sm:justify-end">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={validCurrentPage <= 1}
            className="px-3 py-1.5 rounded-xl border border-line bg-white hover:bg-surface-subtle text-gray-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition shadow-2xs"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Anterior</span>
          </button>

          <div className="flex items-center gap-1 px-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                if (totalPages <= 7) return true;
                if (page === 1 || page === totalPages) return true;
                return Math.abs(page - validCurrentPage) <= 1;
              })
              .map((page, index, array) => {
                const prevPage = array[index - 1];
                const showEllipsis = prevPage && page - prevPage > 1;
                return (
                  <React.Fragment key={page}>
                    {showEllipsis && <span className="px-1 text-gray-400 text-xs">...</span>}
                    <button
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 rounded-xl font-semibold text-xs transition flex items-center justify-center ${
                        validCurrentPage === page
                          ? 'bg-navy text-white shadow-2xs'
                          : 'bg-white hover:bg-surface-subtle text-gray-700 border border-line'
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                );
              })}
          </div>

          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={validCurrentPage >= totalPages}
            className="px-3 py-1.5 rounded-xl border border-line bg-white hover:bg-surface-subtle text-gray-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition shadow-2xs"
          >
            <span>Siguiente</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Modal Registrar Votante con Stepper de 3 Pasos (Ampliado y Responsive) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white border border-line rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
            
            {/* Header Modal */}
            <div className="px-5 sm:px-6 py-4 border-b border-line flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-navy/10 text-navy flex items-center justify-center font-bold">
                  {editingVoterId ? <Pencil className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-gray-800">
                    {editingVoterId
                      ? `Editar Votante: ${newVoter.nombres} ${newVoter.apellidos}`
                      : 'Registro 360° de Votante'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {editingVoterId
                      ? 'Actualice los datos personales, ocupación o ubicación electoral del votante'
                      : 'Organización comunitaria, datos personales, ocupación y asignación electoral'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-surface-subtle transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper / Indicador de Pasos */}
            <div className="px-4 sm:px-8 py-3.5 bg-surface-subtle border-b border-line shrink-0">
              <div className="flex items-center justify-between max-w-2xl mx-auto">
                {/* Paso 1 */}
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center gap-2.5 group focus:outline-none"
                >
                  <div
                    className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                      currentStep === 1
                        ? 'bg-navy text-white shadow-md shadow-navy/20 ring-4 ring-navy/10'
                        : currentStep > 1
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white border border-line-strong text-gray-400'
                    }`}
                  >
                    {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className={`text-xs font-bold leading-tight ${currentStep === 1 ? 'text-navy' : 'text-gray-700'}`}>
                      Datos Personales
                    </p>
                    <p className="text-[10px] text-gray-400">Identificación y residencia</p>
                  </div>
                </button>

                <div className={`flex-1 h-0.5 mx-2 sm:mx-4 transition-colors ${currentStep > 1 ? 'bg-emerald-500' : 'bg-line-strong'}`} />

                {/* Paso 2 */}
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep1()) setCurrentStep(2);
                  }}
                  className="flex items-center gap-2.5 group focus:outline-none"
                >
                  <div
                    className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                      currentStep === 2
                        ? 'bg-navy text-white shadow-md shadow-navy/20 ring-4 ring-navy/10'
                        : currentStep > 2
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white border border-line-strong text-gray-400'
                    }`}
                  >
                    {currentStep > 2 ? <Check className="w-4 h-4" /> : '2'}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className={`text-xs font-bold leading-tight ${currentStep === 2 ? 'text-navy' : 'text-gray-700'}`}>
                      Ocupación
                    </p>
                    <p className="text-[10px] text-gray-400">Educación y actividad</p>
                  </div>
                </button>

                <div className={`flex-1 h-0.5 mx-2 sm:mx-4 transition-colors ${currentStep > 2 ? 'bg-emerald-500' : 'bg-line-strong'}`} />

                {/* Paso 3 */}
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep1()) setCurrentStep(3);
                  }}
                  className="flex items-center gap-2.5 group focus:outline-none"
                >
                  <div
                    className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                      currentStep === 3
                        ? 'bg-navy text-white shadow-md shadow-navy/20 ring-4 ring-navy/10'
                        : 'bg-white border border-line-strong text-gray-400'
                    }`}
                  >
                    3
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className={`text-xs font-bold leading-tight ${currentStep === 3 ? 'text-navy' : 'text-gray-700'}`}>
                      Información Electoral
                    </p>
                    <p className="text-[10px] text-gray-400">Puesto, mesa y Día D</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {stepError && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>{stepError}</span>
              </div>
            )}

            {/* Form Body (Scrollable) */}
            <form onSubmit={handleCreateVoter} className="flex-1 overflow-y-auto p-5 sm:p-6 text-xs">
              
              {/* ================= PASO 1: DATOS PERSONALES ================= */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="border-b border-line pb-2 mb-4">
                    <h4 className="font-heading font-bold text-sm text-gray-800 flex items-center gap-2">
                      <User className="w-4 h-4 text-navy" /> Paso 1: Datos Personales
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Información de identidad y ubicación del ciudadano. Todos los campos de este paso son obligatorios.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block font-semibold mb-1 transition-colors ${step1Errors.tipoDocumento ? 'text-red-600' : 'text-gray-700'}`}>
                        Tipo de documento *
                      </label>
                      <select
                        value={newVoter.tipoDocumento}
                        onChange={(e) => {
                          setNewVoter({ ...newVoter, tipoDocumento: e.target.value });
                          if (stepError) setStepError('');
                        }}
                        className={`w-full bg-white border rounded-xl px-3 py-2 text-xs sm:text-sm transition focus:outline-none ${
                          step1Errors.tipoDocumento
                            ? 'border-red-500 bg-red-50/20 text-red-900 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                            : 'border-line-strong text-gray-800 focus:border-navy focus:ring-1 focus:ring-navy'
                        }`}
                      >
                        {DOCUMENT_TYPES.map((dt) => (
                          <option key={dt.value} value={dt.value}>{dt.label}</option>
                        ))}
                      </select>
                      {step1Errors.tipoDocumento && (
                        <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1 font-medium animate-in fade-in">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          <span>{step1Errors.tipoDocumento}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={`block font-semibold mb-1 transition-colors ${step1Errors.cedula ? 'text-red-600' : 'text-gray-700'}`}>
                        Número de documento *
                      </label>
                      <input
                        type="text"
                        value={newVoter.cedula}
                        onChange={(e) => {
                          setNewVoter({ ...newVoter, cedula: e.target.value.replace(/\D/g, '') });
                          if (stepError) setStepError('');
                        }}
                        placeholder="Ej: 1019001122"
                        className={`w-full bg-white border rounded-xl px-3 py-2 text-xs sm:text-sm placeholder-gray-400 transition focus:outline-none ${
                          step1Errors.cedula
                            ? 'border-red-500 bg-red-50/20 text-red-900 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                            : 'border-line-strong text-gray-800 focus:border-navy focus:ring-1 focus:ring-navy'
                        }`}
                      />
                      {step1Errors.cedula && (
                        <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1 font-medium animate-in fade-in">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          <span>{step1Errors.cedula}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block font-semibold mb-1 transition-colors ${step1Errors.nombres ? 'text-red-600' : 'text-gray-700'}`}>
                        Nombres *
                      </label>
                      <input
                        type="text"
                        value={newVoter.nombres}
                        onChange={(e) => {
                          setNewVoter({ ...newVoter, nombres: e.target.value });
                          if (stepError) setStepError('');
                        }}
                        placeholder="Juan Carlos"
                        className={`w-full bg-white border rounded-xl px-3 py-2 text-xs sm:text-sm placeholder-gray-400 transition focus:outline-none ${
                          step1Errors.nombres
                            ? 'border-red-500 bg-red-50/20 text-red-900 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                            : 'border-line-strong text-gray-800 focus:border-navy focus:ring-1 focus:ring-navy'
                        }`}
                      />
                      {step1Errors.nombres && (
                        <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1 font-medium animate-in fade-in">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          <span>{step1Errors.nombres}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={`block font-semibold mb-1 transition-colors ${step1Errors.apellidos ? 'text-red-600' : 'text-gray-700'}`}>
                        Apellidos *
                      </label>
                      <input
                        type="text"
                        value={newVoter.apellidos}
                        onChange={(e) => {
                          setNewVoter({ ...newVoter, apellidos: e.target.value });
                          if (stepError) setStepError('');
                        }}
                        placeholder="Pérez Gómez"
                        className={`w-full bg-white border rounded-xl px-3 py-2 text-xs sm:text-sm placeholder-gray-400 transition focus:outline-none ${
                          step1Errors.apellidos
                            ? 'border-red-500 bg-red-50/20 text-red-900 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                            : 'border-line-strong text-gray-800 focus:border-navy focus:ring-1 focus:ring-navy'
                        }`}
                      />
                      {step1Errors.apellidos && (
                        <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1 font-medium animate-in fade-in">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          <span>{step1Errors.apellidos}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block font-semibold mb-1 transition-colors ${step1Errors.telefono ? 'text-red-600' : 'text-gray-700'}`}>
                        Celular *
                      </label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={10}
                        value={newVoter.telefono}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setNewVoter({ ...newVoter, telefono: val, whatsapp: val });
                          if (stepError) setStepError('');
                        }}
                        placeholder="3001234567"
                        className={`w-full bg-white border rounded-xl px-3 py-2 text-xs sm:text-sm placeholder-gray-400 transition focus:outline-none ${
                          step1Errors.telefono
                            ? 'border-red-500 bg-red-50/20 text-red-900 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                            : 'border-line-strong text-gray-800 focus:border-navy focus:ring-1 focus:ring-navy'
                        }`}
                      />
                      {step1Errors.telefono && (
                        <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1 font-medium animate-in fade-in">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          <span>{step1Errors.telefono}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={`block font-semibold mb-1 transition-colors ${step1Errors.email ? 'text-red-600' : 'text-gray-700'}`}>
                        Correo electrónico *
                      </label>
                      <input
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        autoCapitalize="none"
                        spellCheck={false}
                        value={newVoter.email}
                        onChange={(e) => {
                          setNewVoter({ ...newVoter, email: e.target.value });
                          if (stepError) setStepError('');
                        }}
                        placeholder="ejemplo@correo.com"
                        className={`w-full bg-white border rounded-xl px-3 py-2 text-xs sm:text-sm placeholder-gray-400 transition focus:outline-none ${
                          step1Errors.email
                            ? 'border-red-500 bg-red-50/20 text-red-900 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                            : 'border-line-strong text-gray-800 focus:border-navy focus:ring-1 focus:ring-navy'
                        }`}
                      />
                      {step1Errors.email && (
                        <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1 font-medium animate-in fade-in">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          <span>{step1Errors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block font-semibold mb-1 transition-colors ${step1Errors.fechaNacimiento ? 'text-red-600' : 'text-gray-700'}`}>
                        Fecha de nacimiento *
                      </label>
                      <input
                        type="date"
                        value={newVoter.fechaNacimiento}
                        onChange={(e) => {
                          setNewVoter({ ...newVoter, fechaNacimiento: e.target.value });
                          if (stepError) setStepError('');
                        }}
                        className={`w-full bg-white border rounded-xl px-3 py-2 text-xs sm:text-sm transition focus:outline-none ${
                          step1Errors.fechaNacimiento
                            ? 'border-red-500 bg-red-50/20 text-red-900 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                            : 'border-line-strong text-gray-800 focus:border-navy focus:ring-1 focus:ring-navy'
                        }`}
                      />
                      {step1Errors.fechaNacimiento && (
                        <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1 font-medium animate-in fade-in">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          <span>{step1Errors.fechaNacimiento}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={`block font-semibold mb-1 transition-colors ${step1Errors.genero ? 'text-red-600' : 'text-gray-700'}`}>
                        Género *
                      </label>
                      <select
                        value={newVoter.genero}
                        onChange={(e) => {
                          setNewVoter({ ...newVoter, genero: e.target.value });
                          if (stepError) setStepError('');
                        }}
                        className={`w-full bg-white border rounded-xl px-3 py-2 text-xs sm:text-sm transition focus:outline-none ${
                          step1Errors.genero
                            ? 'border-red-500 bg-red-50/20 text-red-900 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                            : 'border-line-strong text-gray-800 focus:border-navy focus:ring-1 focus:ring-navy'
                        }`}
                      >
                        {GENDER_OPTIONS.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                      {step1Errors.genero && (
                        <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1 font-medium animate-in fade-in">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          <span>{step1Errors.genero}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Departamento y Municipio de nacimiento con Buscador (DANE) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <SearchableSelect
                        label="Departamento de nacimiento"
                        required
                        value={newVoter.departamentoNacimiento}
                        options={departamentosOptions}
                        placeholder="Buscar o seleccionar departamento..."
                        searchPlaceholder="Escriba para filtrar departamento..."
                        hasError={!!step1Errors.departamentoNacimiento}
                        errorMessage={step1Errors.departamentoNacimiento}
                        onChange={(nombre) => {
                          setNewVoter({
                            ...newVoter,
                            departamentoNacimiento: nombre,
                            ciudadNacimiento: '', // Limpiar municipio al cambiar de departamento
                          });
                          if (stepError) setStepError('');
                        }}
                      />
                    </div>

                    <div>
                      <SearchableSelect
                        label="Municipio de nacimiento"
                        required
                        disabled={!newVoter.departamentoNacimiento}
                        disabledHint="Primero seleccione departamento"
                        value={newVoter.ciudadNacimiento}
                        options={municipiosOptions}
                        placeholder="Buscar o seleccionar municipio..."
                        searchPlaceholder="Escriba para filtrar municipio..."
                        hasError={!!step1Errors.ciudadNacimiento}
                        errorMessage={step1Errors.ciudadNacimiento}
                        onChange={(nombre) => {
                          setNewVoter({
                            ...newVoter,
                            ciudadNacimiento: nombre,
                          });
                          if (stepError) setStepError('');
                        }}
                      />
                    </div>
                  </div>

                  {/* Selector de Opción: Barrio o Vereda, y Campo Buscador Automático */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold mb-1 text-gray-700 text-xs sm:text-sm">
                        ¿Es Barrio o Vereda? *
                      </label>
                      <div className="grid grid-cols-2 gap-2 p-1 bg-surface-subtle border border-line-strong rounded-xl">
                        <button
                          type="button"
                          onClick={() => {
                            setSectorType('Barrio');
                            setNewVoter({ ...newVoter, zona: 'Urbana', barrioVereda: '' });
                            if (stepError) setStepError('');
                          }}
                          className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                            sectorType === 'Barrio'
                              ? 'bg-white text-navy shadow-sm border border-line ring-2 ring-navy/10'
                              : 'text-gray-500 hover:text-gray-800'
                          }`}
                        >
                          <Building2 className="w-3.5 h-3.5 text-navy" /> Barrio (Urbano)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSectorType('Vereda');
                            setNewVoter({ ...newVoter, zona: 'Rural', barrioVereda: '' });
                            if (stepError) setStepError('');
                          }}
                          className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                            sectorType === 'Vereda'
                              ? 'bg-white text-navy shadow-sm border border-line ring-2 ring-navy/10'
                              : 'text-gray-500 hover:text-gray-800'
                          }`}
                        >
                          <Trees className="w-3.5 h-3.5 text-emerald-600" /> Vereda (Rural)
                        </button>
                      </div>
                    </div>

                    <div>
                      {sectorType === 'Barrio' ? (
                        <SearchableSelect
                          label="Barrio (Garzón)"
                          required
                          value={newVoter.barrioVereda}
                          options={barriosOptions}
                          allowCustomValue
                          placeholder="Buscar o escribir barrio..."
                          searchPlaceholder="Escriba para filtrar barrio de Garzón..."
                          hasError={!!step1Errors.barrioVereda}
                          errorMessage={step1Errors.barrioVereda}
                          onChange={(nombre) => {
                            setNewVoter({ ...newVoter, barrioVereda: nombre });
                            if (stepError) setStepError('');
                          }}
                        />
                      ) : (
                        <SearchableSelect
                          label="Vereda (Garzón)"
                          required
                          value={newVoter.barrioVereda}
                          options={veredasOptions}
                          allowCustomValue
                          placeholder="Buscar o escribir vereda..."
                          searchPlaceholder="Escriba para filtrar vereda de Garzón..."
                          hasError={!!step1Errors.barrioVereda}
                          errorMessage={step1Errors.barrioVereda}
                          onChange={(nombre) => {
                            setNewVoter({ ...newVoter, barrioVereda: nombre });
                            if (stepError) setStepError('');
                          }}
                        />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block font-semibold mb-1 transition-colors ${step1Errors.zona ? 'text-red-600' : 'text-gray-700'}`}>
                        Zona *
                      </label>
                      <select
                        value={newVoter.zona}
                        onChange={(e) => {
                          const nuevaZona = e.target.value;
                          setNewVoter({ ...newVoter, zona: nuevaZona });
                          if (nuevaZona === 'Urbana' && sectorType !== 'Barrio') setSectorType('Barrio');
                          if (nuevaZona === 'Rural' && sectorType !== 'Vereda') setSectorType('Vereda');
                          if (stepError) setStepError('');
                        }}
                        className={`w-full bg-white border rounded-xl px-3 py-2 text-xs sm:text-sm transition focus:outline-none ${
                          step1Errors.zona
                            ? 'border-red-500 bg-red-50/20 text-red-900 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                            : 'border-line-strong text-gray-800 focus:border-navy focus:ring-1 focus:ring-navy'
                        }`}
                      >
                        {ZONE_OPTIONS.map((z) => (
                          <option key={z} value={z}>{z}</option>
                        ))}
                      </select>
                      {step1Errors.zona && (
                        <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1 font-medium animate-in fade-in">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          <span>{step1Errors.zona}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={`block font-semibold mb-1 transition-colors ${step1Errors.direccion ? 'text-red-600' : 'text-gray-700'}`}>
                        Dirección *
                      </label>
                      <input
                        type="text"
                        value={newVoter.direccion}
                        onChange={(e) => {
                          setNewVoter({ ...newVoter, direccion: e.target.value });
                          if (stepError) setStepError('');
                        }}
                        placeholder="Calle 123 # 45-67 o Finca / Sector"
                        className={`w-full bg-white border rounded-xl px-3 py-2 text-xs sm:text-sm placeholder-gray-400 transition focus:outline-none ${
                          step1Errors.direccion
                            ? 'border-red-500 bg-red-50/20 text-red-900 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                            : 'border-line-strong text-gray-800 focus:border-navy focus:ring-1 focus:ring-navy'
                        }`}
                      />
                      {step1Errors.direccion && (
                        <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1 font-medium animate-in fade-in">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          <span>{step1Errors.direccion}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ================= PASO 2: OCUPACIÓN ================= */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="border-b border-line pb-2 mb-4">
                    <h4 className="font-heading font-bold text-sm text-gray-800 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-navy" /> Paso 2: Ocupación y Educación
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Perfil socioeconómico y profesional del votante para segmentación de propuestas.
                    </p>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Nivel educativo *
                    </label>
                    <select
                      value={newVoter.nivelEducativo}
                      onChange={(e) => setNewVoter({ ...newVoter, nivelEducativo: e.target.value })}
                      className="w-full bg-white border border-line-strong rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                    >
                      {EDUCATION_LEVELS.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Ocupación actual *
                    </label>
                    <select
                      value={newVoter.ocupacionActual}
                      onChange={(e) => setNewVoter({ ...newVoter, ocupacionActual: e.target.value })}
                      className="w-full bg-white border border-line-strong rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                    >
                      {OCCUPATIONS.map((occ) => (
                        <option key={occ} value={occ}>{occ}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">
                        Profesión u oficio
                      </label>
                      <input
                        type="text"
                        value={newVoter.profesionOficio}
                        onChange={(e) => setNewVoter({ ...newVoter, profesionOficio: e.target.value })}
                        placeholder="Ej: Contador, Mecánico, Docente..."
                        className="w-full bg-white border border-line-strong rounded-xl px-3 py-2 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-gray-700 font-semibold">
                          Empresa o lugar de trabajo
                        </label>
                        <span className="text-[11px] text-gray-400 font-normal">Opcional</span>
                      </div>
                      <input
                        type="text"
                        value={newVoter.empresaLugarTrabajo}
                        onChange={(e) => setNewVoter({ ...newVoter, empresaLugarTrabajo: e.target.value })}
                        placeholder="Nombre de la empresa o negocio"
                        className="w-full bg-white border border-line-strong rounded-xl px-3 py-2 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ================= PASO 3: INFORMACIÓN ELECTORAL ================= */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="border-b border-line pb-2 mb-4">
                    <h4 className="font-heading font-bold text-sm text-gray-800 flex items-center gap-2">
                      <Vote className="w-4 h-4 text-navy" /> Paso 3: Información Electoral
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Asignación territorial de puesto, mesa y seguimiento estratégico Día D.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <SearchableSelect
                        label="Departamento"
                        required
                        value={newVoter.departamento}
                        options={departamentosOptions}
                        placeholder="Buscar o seleccionar departamento..."
                        searchPlaceholder="Escriba para filtrar departamento..."
                        onChange={(nombre) => {
                          setNewVoter({
                            ...newVoter,
                            departamento: nombre,
                            municipio: '',
                            puestoVotacionId: '',
                          });
                        }}
                      />
                    </div>

                    <div>
                      <SearchableSelect
                        label="Municipio"
                        required
                        disabled={!newVoter.departamento}
                        disabledHint="Primero seleccione departamento"
                        value={newVoter.municipio}
                        options={electoralMunicipiosOptions}
                        placeholder="Buscar o seleccionar municipio..."
                        searchPlaceholder="Escriba para filtrar municipio..."
                        onChange={(nombre) => {
                          setNewVoter({
                            ...newVoter,
                            municipio: nombre,
                            puestoVotacionId: '',
                          });
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <SearchableSelect
                        label="Zona Electoral"
                        value={newVoter.zonaElectoral}
                        options={zonasElectoralesOptions}
                        placeholder="Seleccione o busque zona..."
                        searchPlaceholder="Buscar zona electoral..."
                        allowCustomValue
                        onChange={(nombre) => {
                          setNewVoter({
                            ...newVoter,
                            zonaElectoral: nombre,
                            puestoVotacionId: '',
                            mesa: 1,
                          });
                        }}
                      />
                      {newVoter.zonaElectoral && (
                        <button
                          type="button"
                          onClick={() => setNewVoter({ ...newVoter, zonaElectoral: '' })}
                          className="mt-1 text-[11px] text-navy hover:underline flex items-center gap-1 font-medium"
                        >
                          ✕ Limpiar filtro de zona (ver todos los puestos)
                        </button>
                      )}
                    </div>

                    <div>
                      <SearchableSelect
                        label="Puesto de Votación"
                        required
                        value={selectedPuestoObj?.nombrePuesto || (selectedPuestoObj as any)?.nombre || ''}
                        options={puestosOptions}
                        placeholder={filteredPuestos.length === 0 ? "No hay puestos para los filtros seleccionados" : "Buscar o seleccionar puesto de votación..."}
                        searchPlaceholder="Buscar por nombre, barrio, vereda o dirección..."
                        onChange={(_label, option) => {
                          if (!option) return;
                          const puesto = allAvailablePuestos.find(p => p.id === option.id);
                          if (puesto) {
                            setNewVoter({
                              ...newVoter,
                              puestoVotacionId: puesto.id,
                              zonaElectoral: puesto.zona || newVoter.zonaElectoral,
                              mesa: 1,
                            });
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Ficha Informativa del Puesto Seleccionado */}
                  {selectedPuestoObj && (
                    <div className="bg-navy/5 border border-navy/15 rounded-xl p-3 text-xs text-navy space-y-1 animate-in fade-in duration-150">
                      <div className="font-semibold flex items-center justify-between text-navy">
                        <span className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-navy" />
                          {selectedPuestoObj.institucion || selectedPuestoObj.nombrePuesto}
                        </span>
                        <span className="bg-navy/10 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          {selectedPuestoObj.zona}
                        </span>
                      </div>
                      <div className="text-gray-600 flex flex-wrap gap-x-4 gap-y-0.5 text-[11px]">
                        <span>📍 <strong>Dirección:</strong> {selectedPuestoObj.direccion || 'Sin dirección registrada'}</span>
                        {selectedPuestoObj.barrioVereda && (
                          <span>🏘️ <strong>Sector:</strong> {selectedPuestoObj.barrioVereda}</span>
                        )}
                        <span>🗳️ <strong>Capacidad:</strong> {selectedPuestoObj.totalMesas || selectedPuestoObj.mesasTotales || 1} mesas ({((selectedPuestoObj.totalMesas || selectedPuestoObj.mesasTotales || 1) * 100).toLocaleString()} votantes aprox.)</span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <SearchableSelect
                        label="Mesa de Votación"
                        required
                        disabled={!newVoter.puestoVotacionId}
                        disabledHint="Primero seleccione un puesto de votación"
                        value={newVoter.mesa ? `Mesa ${newVoter.mesa}` : ''}
                        options={mesasOptions}
                        placeholder={!newVoter.puestoVotacionId ? "Seleccione primero un puesto..." : "Seleccionar mesa de votación..."}
                        searchPlaceholder="Filtrar por número o código..."
                        onChange={(_label, option) => {
                          if (!option) return;
                          setNewVoter({
                            ...newVoter,
                            mesa: Number(option.id),
                          });
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">
                        Intención de Voto (Fidelización)
                      </label>
                      <select
                        value={newVoter.nivelFidelizacion}
                        onChange={(e) => setNewVoter({ ...newVoter, nivelFidelizacion: e.target.value as any })}
                        className="w-full bg-white border border-line-strong rounded-xl px-3 py-2 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                      >
                        <option value="SEGURO">Voto Seguro 🟢</option>
                        <option value="SIMPATIZANTE">Simpatizante 🔵</option>
                        <option value="INDECISO">Indeciso 🟡</option>
                        <option value="OPOSITOR">Opositor 🔴</option>
                      </select>
                    </div>
                  </div>

                  {/* Asignación automática del registrador */}
                  <div className="p-3 bg-surface-subtle border border-line rounded-xl flex items-center justify-between text-xs text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-navy" /> Registrador asignado:
                    </span>
                    <span className="font-semibold text-navy">
                      {user?.nombre || 'Usuario actual'} ({user?.role || 'LÍDER'})
                    </span>
                  </div>
                </div>
              )}
            </form>

            {/* Footer Modal con Stepper Navigation y Botones */}
            <div className="px-5 sm:px-6 py-3.5 bg-surface-subtle border-t border-line flex items-center justify-between gap-3 shrink-0">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-line text-xs font-bold text-gray-600 shadow-2xs">
                  Paso {currentStep} de 3
                </span>
              </div>

              <div className="flex items-center gap-2">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-white text-gray-700 border border-line-strong rounded-xl hover:bg-surface-subtle font-semibold text-xs sm:text-sm transition"
                  >
                    <ChevronLeft className="w-4 h-4" /> Atrás
                  </button>
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 bg-navy text-white rounded-xl hover:bg-navy-deep font-semibold text-xs sm:text-sm shadow-md transition"
                  >
                    Siguiente <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCreateVoter}
                    disabled={savingVoter}
                    className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 bg-navy text-white rounded-xl hover:bg-navy-deep font-semibold text-xs sm:text-sm shadow-md transition disabled:opacity-60"
                  >
                    {savingVoter ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Guardando...
                      </>
                    ) : editingVoterId ? (
                      <>
                        <Check className="w-4 h-4" /> Guardar Cambios
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" /> Registrar Votante
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
      {/* Modal de Gestión de Seguimiento */}
      {isSeguimientoModalOpen && selectedVoterForSeguimiento && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white border border-line rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-line flex items-center justify-between bg-surface-subtle">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-navy/10 text-navy flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5 text-navy" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-gray-800">
                    Gestión de Seguimiento
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Control de contacto y compromisos del votante
                  </p>
                </div>
              </div>
              <button
                onClick={closeSeguimientoModal}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Voter Info Card */}
            <div className="bg-slate-50 border-b border-line px-5 py-3 flex items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-gray-800 text-sm">
                  {selectedVoterForSeguimiento.nombres} {selectedVoterForSeguimiento.apellidos}
                </span>
                <div className="text-gray-500 text-[11px] flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                  <span>CC: {selectedVoterForSeguimiento.cedula}</span>
                  <span>📞 {selectedVoterForSeguimiento.telefono || 'Sin celular'}</span>
                  <span>🏘️ {selectedVoterForSeguimiento.barrioVereda || selectedVoterForSeguimiento.municipio}</span>
                </div>
              </div>
              <div>
                {getFidelizacionBadge(selectedVoterForSeguimiento.nivelFidelizacion)}
              </div>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveSeguimiento} className="p-5 space-y-4 overflow-y-auto flex-1">
              {/* Usuario Responsable */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Usuario Responsable del Contacto
                </label>
                <select
                  value={seguimientoForm.usuarioResponsableId}
                  onChange={(e) => setSeguimientoForm({ ...seguimientoForm, usuarioResponsableId: e.target.value })}
                  className="w-full bg-white border border-line-strong rounded-xl px-3 py-2 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                >
                  <option value="">Seleccionar responsable...</option>
                  {user && (
                    <option value={user.id}>
                      👤 Yo ({user.nombre} - {user.role})
                    </option>
                  )}
                  {leaders
                    .filter(l => l.id !== user?.id)
                    .map((leader) => (
                      <option key={leader.id} value={leader.id}>
                        {leader.nombre} ({leader.role})
                      </option>
                    ))}
                </select>
              </div>

              {/* Fecha de Seguimiento con atajos rápidos */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    Fecha del Seguimiento
                  </label>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() => {
                        const today = new Date().toISOString().substring(0, 10);
                        setSeguimientoForm({ ...seguimientoForm, fechaSeguimiento: today });
                      }}
                      className="text-navy hover:underline font-medium"
                    >
                      Hoy
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => {
                        const tomorrow = new Date(Date.now() + 86400000).toISOString().substring(0, 10);
                        setSeguimientoForm({ ...seguimientoForm, fechaSeguimiento: tomorrow });
                      }}
                      className="text-navy hover:underline font-medium"
                    >
                      Mañana
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setSeguimientoForm({ ...seguimientoForm, fechaSeguimiento: '' })}
                      className="text-rose-600 hover:underline font-medium"
                    >
                      Sin fecha
                    </button>
                  </div>
                </div>
                <input
                  type="date"
                  value={seguimientoForm.fechaSeguimiento}
                  onChange={(e) => setSeguimientoForm({ ...seguimientoForm, fechaSeguimiento: e.target.value })}
                  className="w-full bg-white border border-line-strong rounded-xl px-3 py-2 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                />
              </div>

              {/* Tipo de Seguimiento */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Tipo de Seguimiento
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Llamada', label: '📞 Llamada' },
                    { id: 'WhatsApp', label: '💬 WhatsApp' },
                    { id: 'Visita', label: '🚶 Visita' },
                    { id: 'Reunión', label: '👥 Reunión' },
                    { id: 'Evento', label: '🎪 Evento' },
                    { id: 'Correo', label: '✉️ Correo' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSeguimientoForm({ ...seguimientoForm, tipoSeguimiento: t.id as any })}
                      className={`px-2.5 py-2 rounded-xl text-xs font-medium border text-center transition ${
                        seguimientoForm.tipoSeguimiento === t.id
                          ? 'bg-navy text-white border-navy font-semibold shadow-xs'
                          : 'bg-white text-gray-700 border-line-strong hover:bg-surface-subtle'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Estado del Seguimiento */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Estado del Seguimiento
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'PENDIENTE', label: '🟡 Pendiente', border: 'border-amber-300', bg: 'bg-amber-50 text-amber-800' },
                    { id: 'EN_PROCESO', label: '🔵 En proceso', border: 'border-blue-300', bg: 'bg-blue-50 text-blue-800' },
                    { id: 'COMPLETADO', label: '🟢 Completado', border: 'border-emerald-300', bg: 'bg-emerald-50 text-emerald-800' },
                    { id: 'VENCIDO', label: '🔴 Vencido', border: 'border-rose-300', bg: 'bg-rose-50 text-rose-800' },
                    { id: 'CANCELADO', label: '⚪ Cancelado', border: 'border-gray-300', bg: 'bg-gray-100 text-gray-700' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSeguimientoForm({ ...seguimientoForm, estado: st.id as any })}
                      className={`px-2.5 py-2 rounded-xl text-xs font-medium border transition text-left flex items-center justify-between ${
                        seguimientoForm.estado === st.id
                          ? `${st.bg} ${st.border} font-bold ring-2 ring-navy/20 shadow-xs`
                          : 'bg-white text-gray-600 border-line-strong hover:bg-surface-subtle'
                      }`}
                    >
                      <span>{st.label}</span>
                      {seguimientoForm.estado === st.id && (
                        <Check className="w-3.5 h-3.5 text-navy" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Observaciones */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Observaciones y Notas de la Interacción
                </label>
                <textarea
                  rows={3}
                  value={seguimientoForm.observaciones}
                  onChange={(e) => setSeguimientoForm({ ...seguimientoForm, observaciones: e.target.value })}
                  placeholder="Escriba los compromisos acordados, peticiones, inquietudes o comentarios del contacto..."
                  className="w-full bg-white border border-line-strong rounded-xl px-3 py-2 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                />
              </div>

              {/* Historial previo si existe */}
              {historialSeguimientos.length > 0 && (
                <div className="border-t border-line pt-3 mt-2">
                  <h4 className="font-semibold text-xs text-gray-700 flex items-center gap-1.5 mb-2">
                    <FileText className="w-3.5 h-3.5 text-navy" /> Historial de Contactos ({historialSeguimientos.length})
                  </h4>
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {historialSeguimientos.map((h) => (
                      <div key={h.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-800">{h.tipoSeguimiento}</span>
                          <span className="font-medium text-[10px] text-gray-500">
                            {new Date(h.createdAt).toLocaleDateString('es-CO')}
                          </span>
                        </div>
                        {h.observaciones && (
                          <p className="text-gray-600 italic">&ldquo;{h.observaciones}&rdquo;</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="pt-3 border-t border-line flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={closeSeguimientoModal}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingSeguimiento}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-navy hover:bg-navy-deep text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition disabled:opacity-60"
                >
                  {savingSeguimiento ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Guardando...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" /> Guardar Seguimiento
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
