import React, { useEffect, useState } from 'react';
import { 
  UserCheck, 
  Plus, 
  Search, 
  Filter, 
  Truck, 
  CheckCircle2, 
  MapPin, 
  X, 
  Phone,
  Vote
} from 'lucide-react';
import axios from 'axios';
import { Voter, Puesto, User } from '../types';
import { useAuth } from '../context/AuthContext';

export const VotersPage: React.FC = () => {
  const { user } = useAuth();
  const [voters, setVoters] = useState<Voter[]>([]);
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [leaders, setLeaders] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [search, setSearch] = useState('');
  const [nivelFilter, setNivelFilter] = useState('');
  const [transporteFilter, setTransporteFilter] = useState(false);

  // Modal Registro
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVoter, setNewVoter] = useState({
    cedula: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    whatsapp: '',
    email: '',
    direccion: '',
    barrioVereda: '',
    departamento: 'Cundinamarca',
    municipio: 'Bogotá D.C.',
    puestoVotacionId: 'puesto-1',
    mesa: 1,
    leaderId: user?.id || 'user-admin',
    nivelFidelizacion: 'SEGURO' as const,
    requiereTransporte: false,
    votoAsistido: false,
    observaciones: '',
  });

  useEffect(() => {
    fetchVoters();
    fetchAuxiliaryData();
  }, [search, nivelFilter, transporteFilter]);

  const fetchVoters = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (search) params.search = search;
      if (nivelFilter) params.nivelFidelizacion = nivelFilter;
      if (transporteFilter) params.requiereTransporte = true;

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

  const handleCreateVoter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/v1/voters', newVoter);
      setIsModalOpen(false);
      setNewVoter({
        cedula: '',
        nombres: '',
        apellidos: '',
        telefono: '',
        whatsapp: '',
        email: '',
        direccion: '',
        barrioVereda: '',
        departamento: 'Cundinamarca',
        municipio: 'Bogotá D.C.',
        puestoVotacionId: 'puesto-1',
        mesa: 1,
        leaderId: user?.id || 'user-admin',
        nivelFidelizacion: 'SEGURO',
        requiereTransporte: false,
        votoAsistido: false,
        observaciones: '',
      });
      fetchVoters();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error al guardar votante');
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

  const getFidelizacionBadge = (nivel: string) => {
    switch (nivel) {
      case 'SEGURO':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">🟢 Voto Seguro</span>;
      case 'SIMPATIZANTE':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">🔵 Simpatizante</span>;
      case 'INDECISO':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">🟡 Indeciso</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">🔴 Opositor</span>;
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
          onClick={() => setIsModalOpen(true)}
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
            placeholder="Buscar por cédula, nombre, teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-line-strong rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={nivelFilter}
            onChange={(e) => setNivelFilter(e.target.value)}
            className="px-3 py-2.5 bg-white border border-line-strong rounded-xl text-sm text-gray-700 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
          >
            <option value="">Todas las intenciones</option>
            <option value="SEGURO">Voto Seguro</option>
            <option value="SIMPATIZANTE">Simpatizante</option>
            <option value="INDECISO">Indeciso</option>
            <option value="OPOSITOR">Opositor</option>
          </select>

          <button
            onClick={() => setTransporteFilter(!transporteFilter)}
            className={`px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 border transition ${
              transporteFilter
                ? 'bg-amber-50 text-amber-700 border-amber-300 shadow-sm'
                : 'bg-white text-gray-600 border-line-strong hover:bg-surface-subtle'
            }`}
          >
            <Truck className="w-4 h-4 text-amber-600" /> Transporte Día D
          </button>
        </div>
      </div>

      {/* Voters Table */}
      <div className="bg-white rounded-2xl border border-line overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-surface-subtle text-gray-500 uppercase tracking-wider font-semibold border-b border-line">
              <tr>
                <th className="p-4">Votante / Cédula</th>
                <th className="p-4">Puesto y Mesa (Registraduría)</th>
                <th className="p-4">Fidelización</th>
                <th className="p-4">Contacto</th>
                <th className="p-4">Estado Día D</th>
                <th className="p-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    Cargando censo electoral...
                  </td>
                </tr>
              ) : voters.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    No se encontraron votantes registrados con estos criterios.
                  </td>
                </tr>
              ) : (
                voters.map((voter) => {
                  const puestoInfo = puestos.find((p) => p.id === voter.puestoVotacionId);
                  return (
                    <tr key={voter.id} className="hover:bg-surface-subtle transition">
                      <td className="p-4">
                        <div className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-line text-navy font-bold flex items-center justify-center text-xs">
                            {voter.nombres.charAt(0)}
                          </div>
                          <span>{voter.nombres} {voter.apellidos}</span>
                        </div>
                        <div className="text-gray-400 text-[11px] ml-9">CC: {voter.cedula}</div>
                      </td>

                      <td className="p-4">
                        <div className="text-gray-700 font-medium flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-navy" />
                          <span>{puestoInfo?.nombrePuesto || voter.puestoVotacionId}</span>
                        </div>
                        <div className="text-gray-400 text-[11px] ml-4 flex items-center gap-2 mt-0.5">
                          <span>Mesa: <strong className="text-navy">{voter.mesa}</strong></span>
                          <span>• {voter.municipio}</span>
                        </div>
                      </td>

                      <td className="p-4">
                        {getFidelizacionBadge(voter.nivelFidelizacion)}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Phone className="w-3.5 h-3.5 text-gray-400" /> {voter.telefono || 'Sin teléfono'}
                        </div>
                        {voter.requiereTransporte && (
                          <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md font-medium">
                            <Truck className="w-3 h-3 text-amber-600" /> Requiere transporte
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        {voter.votoConfirmadoDiaD ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Votó Día D
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                            Pendiente
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        {!voter.votoConfirmadoDiaD && (
                          <button
                            onClick={() => handleConfirmVote(voter.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold border border-emerald-200 transition inline-flex items-center gap-1 shadow-sm"
                          >
                            <Vote className="w-3.5 h-3.5" /> Confirmar Voto
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Registrar Votante 360° */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-line rounded-2xl w-full max-w-xl p-6 shadow-xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-line pb-3">
              <h3 className="font-heading text-lg font-bold text-gray-800 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-navy" /> Registro 360° de Votante
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVoter} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Cédula de Ciudadanía *</label>
                  <input
                    type="text"
                    required
                    value={newVoter.cedula}
                    onChange={(e) => setNewVoter({ ...newVoter, cedula: e.target.value })}
                    placeholder="1019001122"
                    className="w-full bg-white border border-line-strong rounded-xl px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Teléfono / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={newVoter.telefono}
                    onChange={(e) => setNewVoter({ ...newVoter, telefono: e.target.value, whatsapp: e.target.value })}
                    placeholder="3001234567"
                    className="w-full bg-white border border-line-strong rounded-xl px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Nombres *</label>
                  <input
                    type="text"
                    required
                    value={newVoter.nombres}
                    onChange={(e) => setNewVoter({ ...newVoter, nombres: e.target.value })}
                    placeholder="Juan Carlos"
                    className="w-full bg-white border border-line-strong rounded-xl px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Apellidos *</label>
                  <input
                    type="text"
                    required
                    value={newVoter.apellidos}
                    onChange={(e) => setNewVoter({ ...newVoter, apellidos: e.target.value })}
                    placeholder="Pérez López"
                    className="w-full bg-white border border-line-strong rounded-xl px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Puesto de Votación</label>
                  <select
                    value={newVoter.puestoVotacionId}
                    onChange={(e) => setNewVoter({ ...newVoter, puestoVotacionId: e.target.value })}
                    className="w-full bg-white border border-line-strong rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                  >
                    {puestos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombrePuesto} ({p.municipio})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Mesa N°</label>
                  <input
                    type="number"
                    value={newVoter.mesa}
                    onChange={(e) => setNewVoter({ ...newVoter, mesa: Number(e.target.value) })}
                    className="w-full bg-white border border-line-strong rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Intención de Voto (Fidelización)</label>
                  <select
                    value={newVoter.nivelFidelizacion}
                    onChange={(e) => setNewVoter({ ...newVoter, nivelFidelizacion: e.target.value as any })}
                    className="w-full bg-white border border-line-strong rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                  >
                    <option value="SEGURO">Voto Seguro 🟢</option>
                    <option value="SIMPATIZANTE">Simpatizante 🔵</option>
                    <option value="INDECISO">Indeciso 🟡</option>
                    <option value="OPOSITOR">Opositor 🔴</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Líder Referente</label>
                  <select
                    value={newVoter.leaderId}
                    onChange={(e) => setNewVoter({ ...newVoter, leaderId: e.target.value })}
                    className="w-full bg-white border border-line-strong rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                  >
                    {leaders.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nombre} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 text-gray-700 cursor-pointer text-xs font-medium">
                  <input
                    type="checkbox"
                    checked={newVoter.requiereTransporte}
                    onChange={(e) => setNewVoter({ ...newVoter, requiereTransporte: e.target.checked })}
                    className="rounded border-line-strong text-navy focus:ring-navy"
                  />
                  Requiere transporte Día D
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-surface-subtle text-gray-600 rounded-xl hover:bg-line font-medium transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-navy text-white rounded-xl hover:bg-navy-deep font-semibold shadow-md transition"
                >
                  Guardar Votante
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
