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
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">🟢 Voto Seguro</span>;
      case 'SIMPATIZANTE':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">🔵 Simpatizante</span>;
      case 'INDECISO':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">🟡 Indeciso</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">🔴 Opositor</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-sky-400" /> CRM Votantes & Segmentación
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gestión 360° de simpatizantes, asignación por puestos de votación e intención de voto.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-sky-600/25 transition"
        >
          <Plus className="w-4 h-4" /> Registrar Nuevo Votante
        </button>
      </div>

      {/* Bar Filter */}
      <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por cédula, nombre, teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={nivelFilter}
            onChange={(e) => setNivelFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-sky-500"
          >
            <option value="">Todas las intenciones</option>
            <option value="SEGURO">Voto Seguro</option>
            <option value="SIMPATIZANTE">Simpatizante</option>
            <option value="INDECISO">Indeciso</option>
            <option value="OPOSITOR">Opositor</option>
          </select>

          <button
            onClick={() => setTransporteFilter(!transporteFilter)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
              transporteFilter
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Truck className="w-3.5 h-3.5" /> Transporte Día D
          </button>
        </div>
      </div>

      {/* Voters Table */}
      <div className="bg-slate-800/60 rounded-2xl border border-slate-700/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Votante / Cédula</th>
                <th className="p-4">Puesto y Mesa (Registraduría)</th>
                <th className="p-4">Fidelización</th>
                <th className="p-4">Contacto</th>
                <th className="p-4">Estado Día D</th>
                <th className="p-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Cargando censo electoral...
                  </td>
                </tr>
              ) : voters.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No se encontraron votantes registrados.
                  </td>
                </tr>
              ) : (
                voters.map((voter) => {
                  const puestoInfo = puestos.find((p) => p.id === voter.puestoVotacionId);
                  return (
                    <tr key={voter.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-4">
                        <div className="font-semibold text-white text-sm">
                          {voter.nombres} {voter.apellidos}
                        </div>
                        <div className="text-slate-400 text-[11px]">CC: {voter.cedula}</div>
                      </td>

                      <td className="p-4">
                        <div className="text-slate-200 font-medium">
                          {puestoInfo?.nombrePuesto || voter.puestoVotacionId}
                        </div>
                        <div className="text-slate-400 text-[11px] flex items-center gap-2">
                          <span>Mesa: <strong className="text-sky-400">{voter.mesa}</strong></span>
                          <span>• {voter.municipio}</span>
                        </div>
                      </td>

                      <td className="p-4">
                        {getFidelizacionBadge(voter.nivelFidelizacion)}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Phone className="w-3 h-3 text-slate-500" /> {voter.telefono || 'Sin teléfono'}
                        </div>
                        {voter.requiereTransporte && (
                          <span className="mt-1 inline-flex items-center gap-1 text-[10px] text-amber-400 font-medium">
                            <Truck className="w-3 h-3" /> Requiere transporte
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        {voter.votoConfirmadoDiaD ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Votó Día D
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                            Pendiente
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        {!voter.votoConfirmadoDiaD && (
                          <button
                            onClick={() => handleConfirmVote(voter.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-semibold border border-emerald-500/30 transition inline-flex items-center gap-1"
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
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-sky-400" /> Registro 360° de Votante
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVoter} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Cédula de Ciudadanía *</label>
                  <input
                    type="text"
                    required
                    value={newVoter.cedula}
                    onChange={(e) => setNewVoter({ ...newVoter, cedula: e.target.value })}
                    placeholder="1019001122"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Teléfono / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={newVoter.telefono}
                    onChange={(e) => setNewVoter({ ...newVoter, telefono: e.target.value, whatsapp: e.target.value })}
                    placeholder="3001234567"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Nombres *</label>
                  <input
                    type="text"
                    required
                    value={newVoter.nombres}
                    onChange={(e) => setNewVoter({ ...newVoter, nombres: e.target.value })}
                    placeholder="Juan Carlos"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Apellidos *</label>
                  <input
                    type="text"
                    required
                    value={newVoter.apellidos}
                    onChange={(e) => setNewVoter({ ...newVoter, apellidos: e.target.value })}
                    placeholder="Pérez López"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Puesto de Votación</label>
                  <select
                    value={newVoter.puestoVotacionId}
                    onChange={(e) => setNewVoter({ ...newVoter, puestoVotacionId: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  >
                    {puestos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombrePuesto} ({p.municipio})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Mesa N°</label>
                  <input
                    type="number"
                    value={newVoter.mesa}
                    onChange={(e) => setNewVoter({ ...newVoter, mesa: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Intención de Voto (Fidelización)</label>
                  <select
                    value={newVoter.nivelFidelizacion}
                    onChange={(e) => setNewVoter({ ...newVoter, nivelFidelizacion: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="SEGURO">Voto Seguro 🟢</option>
                    <option value="SIMPATIZANTE">Simpatizante 🔵</option>
                    <option value="INDECISO">Indeciso 🟡</option>
                    <option value="OPOSITOR">Opositor 🔴</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Líder Referente</label>
                  <select
                    value={newVoter.leaderId}
                    onChange={(e) => setNewVoter({ ...newVoter, leaderId: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  >
                    {leaders.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nombre} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newVoter.requiereTransporte}
                    onChange={(e) => setNewVoter({ ...newVoter, requiereTransporte: e.target.checked })}
                    className="rounded bg-slate-800 border-slate-700 text-sky-600 focus:ring-sky-500"
                  />
                  Requiere transporte Día D
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-500 font-semibold shadow-lg shadow-sky-600/30"
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
