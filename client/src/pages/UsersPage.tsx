import React, { useEffect, useState } from 'react';
import { Users, Plus, MapPin, X, Search, Pencil, Trash2, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { User, UserRole, Puesto } from '../types';
import { confirmDelete, showErrorAlert, showToast } from '../utils/alerts';

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'SUPER_ADMIN', label: '⚡ Super Admin' },
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
      showToast(u.activo ? 'Usuario desactivado' : 'Usuario activado', 'info');
      await fetchUsers();
    } catch (err: any) {
      showErrorAlert('Error', err.response?.data?.error || 'Error al cambiar el estado del usuario');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (u: User) => {
    const confirmado = await confirmDelete({
      title: `¿Eliminar a "${u.nombre}"?`,
      text: 'Esta acción no se puede deshacer y eliminará el acceso del usuario.',
    });
    if (!confirmado) return;

    setDeletingId(u.id);
    try {
      await axios.delete(`/api/v1/users/${u.id}`);
      showToast('Usuario eliminado exitosamente', 'success');
      await fetchUsers();
    } catch (err: any) {
      showErrorAlert('Error al eliminar', err.response?.data?.error || 'Error al eliminar el usuario');
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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="font-heading font-bold text-xl sm:text-2xl text-gray-800 flex items-center gap-2">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-navy shrink-0" /> Usuarios y Roles
          </h1>
          <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">
            Administración de usuarios y permisos con alcance territorial.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-navy hover:bg-navy-deep active:bg-navy-deep text-white font-semibold text-sm rounded-xl shadow-md transition w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" /> Nuevo Usuario
        </button>
      </div>

      {/* Buscador y filtros */}
      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center w-full">
        <div className="relative flex-1 min-w-0 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
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
          className="w-full sm:w-auto sm:min-w-[190px] px-3.5 py-2.5 bg-white border border-line-strong rounded-xl text-xs sm:text-sm text-gray-700 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
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
          <table className="w-full text-left text-xs text-gray-600 mobile-card-table">
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
                      <td className="p-4" data-label="Usuario / Nombre">
                        <div className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-line text-navy font-bold flex items-center justify-center text-xs shrink-0">
                            {u.nombre.charAt(0)}
                          </div>
                          <span className="truncate">{u.nombre}</span>
                        </div>
                        <div className="text-gray-400 text-[11px] sm:ml-9 truncate">{u.email}</div>
                      </td>

                      <td className="p-4" data-label="Rol">
                        {getRoleBadge(u.role)}
                      </td>

                      <td className="p-4" data-label="Ámbito Territorial">
                        <div className="text-gray-700 font-medium flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-navy shrink-0" />
                          <span>{u.municipioAsignado || 'Nivel General / Todos'}</span>
                        </div>
                        {puestoInfo && (
                          <div className="text-gray-400 text-[11px] mt-0.5">
                            {puestoInfo.nombrePuesto} {u.mesaAsignada ? `(Mesa ${u.mesaAsignada})` : ''}
                          </div>
                        )}
                      </td>

                      <td className="p-4" data-label="Contacto">
                        <div className="text-gray-600">{u.telefono || 'Sin teléfono'}</div>
                        <div className="text-gray-400 text-[11px]">CC: {u.cedula}</div>
                      </td>

                      <td className="p-4" data-label="Estado">
                        <button
                          onClick={() => handleToggleActivo(u)}
                          disabled={togglingId === u.id}
                          className="inline-flex items-center gap-1.5 text-xs font-medium disabled:opacity-60 py-1"
                          title="Clic para cambiar el estado"
                        >
                          {togglingId === u.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400 shrink-0" />
                          ) : (
                            <span className={`w-2 h-2 rounded-full shrink-0 ${u.activo ? 'bg-emerald-500' : 'bg-red-400'}`} />
                          )}
                          <span className={u.activo ? 'text-emerald-600 font-semibold' : 'text-red-500 font-semibold'}>
                            {u.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </button>
                      </td>

                      <td className="p-4" data-label="Acciones">
                        <div className="flex items-center sm:justify-end gap-2">
                          <button
                            onClick={() => openEditModal(u)}
                            className="p-2 sm:p-1.5 rounded-xl text-gray-600 hover:text-navy hover:bg-navy/10 active:bg-navy/20 transition flex items-center gap-1 text-xs font-semibold"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                            <span className="sm:hidden">Editar</span>
                          </button>
                          <button
                            onClick={() => handleDelete(u)}
                            disabled={deletingId === u.id}
                            className="p-2 sm:p-1.5 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 active:bg-red-100 transition disabled:opacity-60 flex items-center gap-1 text-xs font-semibold"
                            title="Eliminar"
                          >
                            {deletingId === u.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                            <span className="sm:hidden">Eliminar</span>
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

      {/* Modal Crear/Editar Usuario (Responsive) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs z-50 flex items-start sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
          <div className="bg-white border-0 sm:border border-line rounded-none sm:rounded-2xl w-full max-w-lg shadow-2xl flex flex-col min-h-screen sm:min-h-0 sm:max-h-[90vh] overflow-hidden text-xs">
            {/* Header Modal */}
            <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-line flex items-center justify-between bg-white shrink-0">
              <h3 className="font-heading text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2 min-w-0">
                <Users className="w-5 h-5 text-navy shrink-0" />
                <span className="truncate">{editingId ? 'Editar Usuario' : 'Nuevo Usuario'}</span>
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-surface-subtle active:bg-gray-200 transition shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 text-xs overscroll-contain space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Dra. Diana Salazar"
                  className="w-full max-w-full min-w-0 box-border bg-white border border-line-strong rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="min-w-0">
                  <label className="block text-gray-700 font-semibold mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="diana@redter.co"
                    className="w-full max-w-full min-w-0 box-border bg-white border border-line-strong rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                  />
                </div>
                <div className="min-w-0">
                  <label className="block text-gray-700 font-semibold mb-1">Rol *</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
                    className="w-full max-w-full min-w-0 box-border bg-white border border-line-strong rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="min-w-0">
                  <label className="block text-gray-700 font-semibold mb-1">Cédula (login) *</label>
                  <input
                    type="text"
                    required
                    value={form.cedula}
                    onChange={(e) => setForm({ ...form, cedula: e.target.value })}
                    placeholder="52890123"
                    className="w-full max-w-full min-w-0 box-border bg-white border border-line-strong rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                  />
                </div>
                <div className="min-w-0">
                  <label className="block text-gray-700 font-semibold mb-1">
                    Contraseña {editingId ? '(opcional)' : '*'}
                  </label>
                  <input
                    type="password"
                    required={!editingId}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full max-w-full min-w-0 box-border bg-white border border-line-strong rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="min-w-0">
                  <label className="block text-gray-700 font-semibold mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={form.telefono}
                    onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                    placeholder="3109876543"
                    className="w-full max-w-full min-w-0 box-border bg-white border border-line-strong rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                  />
                </div>
                <div className="min-w-0">
                  <label className="block text-gray-700 font-semibold mb-1">Municipio Asignado</label>
                  <input
                    type="text"
                    value={form.municipioAsignado}
                    onChange={(e) => setForm({ ...form, municipioAsignado: e.target.value })}
                    className="w-full max-w-full min-w-0 box-border bg-white border border-line-strong rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                  />
                </div>
              </div>

              <div className="min-w-0">
                <label className="block text-gray-700 font-semibold mb-1">Puesto Asignado (si aplica)</label>
                <select
                  value={form.puestoAsignadoId}
                  onChange={(e) => setForm({ ...form, puestoAsignadoId: e.target.value })}
                  className="w-full max-w-full min-w-0 box-border bg-white border border-line-strong rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                >
                  <option value="">Seleccione Puesto...</option>
                  {puestos.map((p) => (
                    <option key={p.id} value={p.id}>{p.nombrePuesto}</option>
                  ))}
                </select>
              </div>

              {/* Footer Modal */}
              <div className="pt-4 flex justify-end gap-2.5 border-t border-line modal-safe-bottom shrink-0">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 bg-surface-subtle hover:bg-line active:bg-gray-200 text-gray-700 rounded-xl font-semibold text-xs transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingUser}
                  className="px-4 py-2.5 bg-navy hover:bg-navy-deep active:bg-navy-deep text-white rounded-xl font-semibold text-xs shadow-md transition disabled:opacity-60"
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
