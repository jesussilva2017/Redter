import React, { useEffect, useState } from 'react';
import { Users, Plus, MapPin, X, Search, Pencil, Trash2, Loader2 } from 'lucide-react';
import axios from 'axios';
import { User, UserRole, Puesto } from '../types';

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'ADMIN_CAMPANA', label: '👑 Admin Campaña' },
  { value: 'COORDINADOR', label: '🗺️ Coordinador Zonal' },
  { value: 'LIDER', label: '🙋‍♂️ Líder Electoral' },
  { value: 'TESTIGO', label: '📋 Testigo de Mesa' },
  { value: 'VOLUNTARIO', label: '🤝 Voluntario' },
];

const emptyForm = {
  nombre: '',
  email: '',
  cedula: '',
  password: '',
  telefono: '',
  role: 'LIDER' as UserRole,
  departamentoAsignado: 'Cundinamarca',
  municipioAsignado: 'Bogotá D.C.',
  puestoAsignadoId: '',
  mesaAsignada: '',
};

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const [savingUser, setSavingUser] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchPuestos();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (searchTerm.trim()) params.q = searchTerm.trim();
      if (roleFilter) params.role = roleFilter;
      const res = await axios.get('/api/v1/users', { params });
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

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (u: User) => {
    setEditingId(u.id);
    setForm({
      nombre: u.nombre,
      email: u.email,
      cedula: u.cedula,
      password: '',
      telefono: u.telefono || '',
      role: u.role,
      departamentoAsignado: u.departamentoAsignado || 'Cundinamarca',
      municipioAsignado: u.municipioAsignado || 'Bogotá D.C.',
      puestoAsignadoId: u.puestoAsignadoId || '',
      mesaAsignada: u.mesaAsignada ? String(u.mesaAsignada) : '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSavingUser(true);
    try {
      if (editingId) {
        await axios.put(`/api/v1/users/${editingId}`, form);
      } else {
        await axios.post('/api/v1/users', form);
      }
      closeModal();
      fetchUsers();
    } catch (err: any) {
      setFormError(err.response?.data?.error || 'Error al guardar el usuario');
    } finally {
      setSavingUser(false);
    }
  };

  const handleToggleActivo = async (u: User) => {
    setTogglingId(u.id);
    try {
      await axios.patch(`/api/v1/users/${u.id}/activo`);
      await fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error al cambiar el estado del usuario');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (u: User) => {
    const confirmado = window.confirm(`¿Eliminar a "${u.nombre}"? Esta acción no se puede deshacer.`);
    if (!confirmado) return;

    setDeletingId(u.id);
    try {
      await axios.delete(`/api/v1/users/${u.id}`);
      await fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error al eliminar el usuario');
    } finally {
      setDeletingId(null);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    const found = ROLE_OPTIONS.find((r) => r.value === role);
    const colorByRole: Record<UserRole, string> = {
      SUPER_ADMIN: 'bg-navy/10 text-navy border-navy/20',
      ADMIN_CAMPANA: 'bg-navy/10 text-navy border-navy/20',
      COORDINADOR: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      LIDER: 'bg-amber-50 text-amber-700 border-amber-200',
      TESTIGO: 'bg-purple-50 text-purple-700 border-purple-200',
      VOLUNTARIO: 'bg-blue-50 text-blue-700 border-blue-200',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${colorByRole[role]}`}>
        {found?.label || role}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-gray-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-navy" /> Usuarios y Roles
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Administración de usuarios y permisos con alcance territorial.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy hover:bg-navy-deep text-white font-semibold text-sm rounded-xl shadow-md transition"
        >
          <Plus className="w-4 h-4" /> Nuevo
        </button>
      </div>

      {/* Buscador y filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, email o cédula..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-line-strong rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2.5 bg-white border border-line-strong rounded-xl text-sm text-gray-700 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
        >
          <option value="">Todos los roles</option>
          {ROLE_OPTIONS.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-line overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-surface-subtle text-gray-500 uppercase tracking-wider font-semibold border-b border-line">
              <tr>
                <th className="p-4">Usuario / Nombre</th>
                <th className="p-4">Rol</th>
                <th className="p-4">Ámbito Territorial</th>
                <th className="p-4">Contacto</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    Cargando usuarios...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    No se encontraron usuarios con estos criterios.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const puestoInfo = puestos.find((p) => p.id === u.puestoAsignadoId);
                  return (
                    <tr key={u.id} className="hover:bg-surface-subtle transition">
                      <td className="p-4">
                        <div className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-line text-navy font-bold flex items-center justify-center text-xs">
                            {u.nombre.charAt(0)}
                          </div>
                          {u.nombre}
                        </div>
                        <div className="text-gray-400 text-[11px] ml-9">{u.email}</div>
                      </td>

                      <td className="p-4">{getRoleBadge(u.role)}</td>

                      <td className="p-4">
                        <div className="text-gray-700 font-medium flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-navy" />
                          {u.municipioAsignado || 'Nivel General / Todos'}
                        </div>
                        {puestoInfo && (
                          <div className="text-gray-400 text-[11px] mt-0.5">
                            {puestoInfo.nombrePuesto} {u.mesaAsignada ? `(Mesa ${u.mesaAsignada})` : ''}
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="text-gray-600">{u.telefono || 'Sin teléfono'}</div>
                        <div className="text-gray-400 text-[11px]">CC: {u.cedula}</div>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => handleToggleActivo(u)}
                          disabled={togglingId === u.id}
                          className="inline-flex items-center gap-1.5 text-xs font-medium disabled:opacity-60"
                          title="Clic para cambiar el estado"
                        >
                          {togglingId === u.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400" />
                          ) : (
                            <span className={`w-2 h-2 rounded-full ${u.activo ? 'bg-emerald-500' : 'bg-red-400'}`} />
                          )}
                          <span className={u.activo ? 'text-emerald-600' : 'text-red-500'}>
                            {u.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </button>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(u)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-navy hover:bg-navy/10 transition"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(u)}
                            disabled={deletingId === u.id}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition disabled:opacity-60"
                            title="Eliminar"
                          >
                            {deletingId === u.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Crear/Editar Usuario */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-line rounded-2xl w-full max-w-lg p-6 shadow-xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-line pb-3">
              <h3 className="font-heading text-lg font-bold text-gray-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-navy" /> {editingId ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-600 font-medium mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Dra. Diana Salazar"
                  className="w-full bg-white border border-line-strong rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:border-navy"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="diana@redter.co"
                    className="w-full bg-white border border-line-strong rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:border-navy"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Rol *</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
                    className="w-full bg-white border border-line-strong rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:border-navy"
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Cédula (usuario de login) *</label>
                  <input
                    type="text"
                    required
                    value={form.cedula}
                    onChange={(e) => setForm({ ...form, cedula: e.target.value })}
                    placeholder="52890123"
                    className="w-full bg-white border border-line-strong rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:border-navy"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-1">
                    Contraseña {editingId ? '(dejar vacío para no cambiar)' : '*'}
                  </label>
                  <input
                    type="password"
                    required={!editingId}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-white border border-line-strong rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:border-navy"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={form.telefono}
                    onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                    placeholder="3109876543"
                    className="w-full bg-white border border-line-strong rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:border-navy"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Municipio Asignado</label>
                  <input
                    type="text"
                    value={form.municipioAsignado}
                    onChange={(e) => setForm({ ...form, municipioAsignado: e.target.value })}
                    className="w-full bg-white border border-line-strong rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:border-navy"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-600 font-medium mb-1">Puesto Asignado (si aplica)</label>
                <select
                  value={form.puestoAsignadoId}
                  onChange={(e) => setForm({ ...form, puestoAsignadoId: e.target.value })}
                  className="w-full bg-white border border-line-strong rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:border-navy"
                >
                  <option value="">Seleccione Puesto...</option>
                  {puestos.map((p) => (
                    <option key={p.id} value={p.id}>{p.nombrePuesto}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-line">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-surface-subtle text-gray-600 rounded-xl hover:bg-line font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingUser}
                  className="px-4 py-2 bg-navy text-white rounded-xl hover:bg-navy-deep font-semibold shadow-md disabled:opacity-60"
                >
                  {savingUser ? 'Guardando...' : editingId ? 'Guardar Cambios' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
