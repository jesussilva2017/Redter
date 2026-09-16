import React, { useEffect, useState } from 'react';
import { Users, Plus, Shield, MapPin, X, Check, Mail, Phone, Lock } from 'lucide-react';
import axios from 'axios';
import { User, UserRole, Puesto } from '../types';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newUser, setNewUser] = useState({
    nombre: '',
    email: '',
    cedula: '',
    telefono: '',
    role: 'LIDER' as UserRole,
    departamentoAsignado: 'Cundinamarca',
    municipioAsignado: 'Bogotá D.C.',
    puestoAsignadoId: '',
    mesaAsignada: '',
  });

  useEffect(() => {
    fetchUsers();
    fetchPuestos();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/v1/users');
      setUsers(res.data.users || []);
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPuestos = async () => {
    try {
      const res = await axios.get('/api/v1/territory/puestos');
      setPuestos(res.data.puestos || []);
    } catch (err) {
      console.error('Error al obtener puestos:', err);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/v1/users', newUser);
      setIsModalOpen(false);
      setNewUser({
        nombre: '',
        email: '',
        cedula: '',
        telefono: '',
        role: 'LIDER',
        departamentoAsignado: 'Cundinamarca',
        municipioAsignado: 'Bogotá D.C.',
        puestoAsignadoId: '',
        mesaAsignada: '',
      });
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error al crear usuario');
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'ADMIN_CAMPANA':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-400 border border-sky-500/30">👑 Admin Campaña</span>;
      case 'COORDINADOR':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">🗺️ Coordinador Zonal</span>;
      case 'LIDER':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">🙋‍♂️ Líder Electoral</span>;
      case 'TESTIGO':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30">📋 Testigo de Mesa</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">🤝 Voluntario</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-sky-400" /> Usuarios, Roles & Control de Acceso (RBAC)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Administración de la estructura de mando político y permisos con scoping territorial.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-sky-600/25 transition"
        >
          <Plus className="w-4 h-4" /> Crear Nuevo Usuario
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-slate-800/60 rounded-2xl border border-slate-700/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Usuario / Nombre</th>
                <th className="p-4">Rol Electoral</th>
                <th className="p-4">Ámbito Territorial / Scoping</th>
                <th className="p-4">Contacto</th>
                <th className="p-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    Cargando estructura de mando...
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const puestoInfo = puestos.find((p) => p.id === u.puestoAsignadoId);
                  return (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-4">
                        <div className="font-semibold text-white text-sm flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-700 text-sky-400 font-bold flex items-center justify-center text-xs">
                            {u.nombre.charAt(0)}
                          </div>
                          {u.nombre}
                        </div>
                        <div className="text-slate-400 text-[11px] ml-9">{u.email}</div>
                      </td>

                      <td className="p-4">{getRoleBadge(u.role)}</td>

                      <td className="p-4">
                        <div className="text-slate-200 font-medium flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-sky-400" />
                          {u.municipioAsignado || 'Nivel General / Todos'}
                        </div>
                        {puestoInfo && (
                          <div className="text-slate-400 text-[11px] mt-0.5">
                            {puestoInfo.nombrePuesto} {u.mesaAsignada ? `(Mesa ${u.mesaAsignada})` : ''}
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="text-slate-300">{u.telefono || 'Sin teléfono'}</div>
                        <div className="text-slate-500 text-[11px]">CC: {u.cedula || 'N/A'}</div>
                      </td>

                      <td className="p-4">
                        {u.activo ? (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Activo
                          </span>
                        ) : (
                          <span className="text-xs text-rose-400">Inactivo</span>
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

      {/* Modal Crear Usuario */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-sky-400" /> Crear Usuario en la Red Politica
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={newUser.nombre}
                  onChange={(e) => setNewUser({ ...newUser, nombre: e.target.value })}
                  placeholder="Dra. Diana Salazar"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="diana@redter.co"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Rol en Campaña *</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="ADMIN_CAMPANA">👑 Admin Campaña</option>
                    <option value="COORDINADOR">🗺️ Coordinador Zonal</option>
                    <option value="LIDER">🙋‍♂️ Líder Electoral</option>
                    <option value="TESTIGO">📋 Testigo de Mesa</option>
                    <option value="VOLUNTARIO">🤝 Voluntario</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Cédula</label>
                  <input
                    type="text"
                    value={newUser.cedula}
                    onChange={(e) => setNewUser({ ...newUser, cedula: e.target.value })}
                    placeholder="52890123"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={newUser.telefono}
                    onChange={(e) => setNewUser({ ...newUser, telefono: e.target.value })}
                    placeholder="3109876543"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Municipio Asignado</label>
                  <input
                    type="text"
                    value={newUser.municipioAsignado}
                    onChange={(e) => setNewUser({ ...newUser, municipioAsignado: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Puesto Asignado (Si aplica)</label>
                  <select
                    value={newUser.puestoAsignadoId}
                    onChange={(e) => setNewUser({ ...newUser, puestoAsignadoId: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="">Seleccione Puesto...</option>
                    {puestos.map((p) => (
                      <option key={p.id} value={p.id}>{p.nombrePuesto}</option>
                    ))}
                  </select>
                </div>
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
                  Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
