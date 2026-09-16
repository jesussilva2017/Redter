import React, { useEffect, useState } from 'react';
import { 
  Calendar, 
  Plus, 
  MapPin, 
  Clock, 
  Users, 
  CheckSquare, 
  AlertCircle, 
  X,
  FileText
} from 'lucide-react';
import axios from 'axios';
import { CampaignEvent, CampaignTask, User } from '../types';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<CampaignEvent[]>([]);
  const [tasks, setTasks] = useState<CampaignTask[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'events' | 'tasks'>('events');
  const [loading, setLoading] = useState(true);

  // Modales
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Form Evento
  const [newEvent, setNewEvent] = useState({
    titulo: '',
    descripcion: '',
    tipo: 'REUNION_LIDERES' as const,
    departamento: 'Cundinamarca',
    municipio: 'Bogotá D.C.',
    barrioVereda: 'Usaquén',
    direccion: '',
    fechaInicio: new Date().toISOString().slice(0, 16),
    fechaFin: new Date(Date.now() + 7200000).toISOString().slice(0, 16),
    aforoEstimado: 50,
  });

  // Form Tarea
  const [newTask, setNewTask] = useState({
    titulo: '',
    descripcion: '',
    prioridad: 'MEDIA' as const,
    asignadoAUserId: '',
    fechaLimite: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16),
  });

  useEffect(() => {
    fetchEventsAndTasks();
  }, []);

  const fetchEventsAndTasks = async () => {
    setLoading(true);
    try {
      const [eventsRes, tasksRes, usersRes] = await Promise.all([
        axios.get('/api/v1/events'),
        axios.get('/api/v1/events/tasks/all'),
        axios.get('/api/v1/users'),
      ]);
      setEvents(eventsRes.data.events || []);
      setTasks(tasksRes.data.tasks || []);
      setUsers(usersRes.data.users || []);
    } catch (err) {
      console.error('Error al cargar agenda:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/v1/events', newEvent);
      setIsEventModalOpen(false);
      fetchEventsAndTasks();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error al agendar evento');
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/v1/events/tasks/all', newTask);
      setIsTaskModalOpen(false);
      fetchEventsAndTasks();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error al asignar tarea');
    }
  };

  const handleToggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'COMPLETADA' ? 'PENDIENTE' : 'COMPLETADA';
    try {
      await axios.patch(`/api/v1/events/tasks/all/${taskId}`, { estado: nextStatus });
      fetchEventsAndTasks();
    } catch (err) {
      alert('Error al actualizar tarea');
    }
  };

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'REUNION_LIDERES':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-400 border border-sky-500/30">🤝 Reunión de Líderes</span>;
      case 'MITIN_MASIVO':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30">📣 Mitin Masivo</span>;
      case 'CANVASSING':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">🚶‍♂️ Puerta a Puerta</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">🎓 Capacitación</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-sky-400" /> Agenda, Eventos & Tareas Logísticas
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Programación de reuniones políticas, control de asistencia e insumos de campaña.
          </p>
        </div>

        <div className="flex gap-2">
          {activeTab === 'events' ? (
            <button
              onClick={() => setIsEventModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-sky-600/25 transition"
            >
              <Plus className="w-4 h-4" /> Agendar Evento / Reunión
            </button>
          ) : (
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-purple-600/25 transition"
            >
              <Plus className="w-4 h-4" /> Asignar Tarea Logística
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 text-sm font-semibold gap-6">
        <button
          onClick={() => setActiveTab('events')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'events'
              ? 'border-sky-500 text-sky-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" /> Eventos & Reuniones ({events.length})
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'tasks'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <CheckSquare className="w-4 h-4" /> Tareas Logísticas ({tasks.length})
        </button>
      </div>

      {/* Tab Content: Events Grid */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60 shadow-xl space-y-3 relative overflow-hidden"
            >
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h3 className="font-heading font-bold text-lg text-white">{evt.titulo}</h3>
                  <div className="mt-1">{getTipoBadge(evt.tipo)}</div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{evt.descripcion}</p>

              <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-700/50">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  <span>{new Date(evt.fechaInicio).toLocaleString('es-CO')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  <span>{evt.direccion || `${evt.barrioVereda}, ${evt.municipio}`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-sky-400" />
                  <span>
                    Aforo estimado: <strong className="text-white">{evt.aforoEstimado} pers.</strong> (Asistieron: <strong className="text-emerald-400">{evt.asistenciaReal}</strong>)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content: Logistical Tasks */}
      {activeTab === 'tasks' && (
        <div className="bg-slate-800/60 rounded-2xl border border-slate-700/60 overflow-hidden shadow-xl p-4 space-y-3">
          {tasks.map((task) => {
            const assignedUser = users.find((u) => u.id === task.asignadoAUserId);
            const isCompleted = task.estado === 'COMPLETADA';
            return (
              <div
                key={task.id}
                className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition ${
                  isCompleted
                    ? 'bg-slate-900/50 border-slate-800 opacity-60'
                    : 'bg-slate-900/90 border-slate-700/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleTaskStatus(task.id, task.estado)}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center transition ${
                      isCompleted
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-600 hover:border-sky-500'
                    }`}
                  >
                    {isCompleted && <CheckSquare className="w-4 h-4" />}
                  </button>
                  <div>
                    <h4 className={`font-semibold text-sm ${isCompleted ? 'line-through text-slate-400' : 'text-white'}`}>
                      {task.titulo}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">{task.descripcion}</p>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                      <span>Asignado a: <strong className="text-sky-400">{assignedUser?.nombre || 'Voluntario'}</strong></span>
                      <span>• Prioridad: <strong className="text-amber-400">{task.prioridad}</strong></span>
                    </div>
                  </div>
                </div>

                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                    isCompleted
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}
                >
                  {task.estado}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Agendar Evento */}
      {isEventModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sky-400" /> Agendar Evento Político
              </h3>
              <button onClick={() => setIsEventModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Título del Evento *</label>
                <input
                  type="text"
                  required
                  value={newEvent.titulo}
                  onChange={(e) => setNewEvent({ ...newEvent, titulo: e.target.value })}
                  placeholder="Reunión Comunal Barrio Usaquén"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Tipo de Actividad</label>
                  <select
                    value={newEvent.tipo}
                    onChange={(e) => setNewEvent({ ...newEvent, tipo: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="REUNION_LIDERES">🤝 Reunión de Líderes</option>
                    <option value="MITIN_MASIVO">📣 Mitin Masivo</option>
                    <option value="CANVASSING">🚶‍♂️ Puerta a Puerta</option>
                    <option value="CAPACITACION">🎓 Capacitación Electoral</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Aforo Estimado</label>
                  <input
                    type="number"
                    value={newEvent.aforoEstimado}
                    onChange={(e) => setNewEvent({ ...newEvent, aforoEstimado: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Dirección / Lugar de Encuentro</label>
                <input
                  type="text"
                  value={newEvent.direccion}
                  onChange={(e) => setNewEvent({ ...newEvent, direccion: e.target.value })}
                  placeholder="Salon Comunal - Cra 7 # 165"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Fecha y Hora Inicio *</label>
                  <input
                    type="datetime-local"
                    required
                    value={newEvent.fechaInicio}
                    onChange={(e) => setNewEvent({ ...newEvent, fechaInicio: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Fecha y Hora Fin *</label>
                  <input
                    type="datetime-local"
                    required
                    value={newEvent.fechaFin}
                    onChange={(e) => setNewEvent({ ...newEvent, fechaFin: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-500 font-semibold shadow-lg shadow-sky-600/30"
                >
                  Guardar Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Asignar Tarea */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-purple-400" /> Asignar Tarea Logística
              </h3>
              <button onClick={() => setIsTaskModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Título de la Tarea *</label>
                <input
                  type="text"
                  required
                  value={newTask.titulo}
                  onChange={(e) => setNewTask({ ...newTask, titulo: e.target.value })}
                  placeholder="Verificar credenciales de testigos"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Descripción / Instrucciones</label>
                <textarea
                  rows={3}
                  value={newTask.descripcion}
                  onChange={(e) => setNewTask({ ...newTask, descripcion: e.target.value })}
                  placeholder="Detalles logísticos..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Asignar a *</label>
                  <select
                    required
                    value={newTask.asignadoAUserId}
                    onChange={(e) => setNewTask({ ...newTask, asignadoAUserId: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="">Seleccionar voluntario/líder...</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nombre} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Prioridad</label>
                  <select
                    value={newTask.prioridad}
                    onChange={(e) => setNewTask({ ...newTask, prioridad: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="BAJA">Baja</option>
                    <option value="MEDIA">Media</option>
                    <option value="ALTA">Alta</option>
                    <option value="URGENTE">Urgente 🔥</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-500 font-semibold shadow-lg shadow-purple-600/30"
                >
                  Asignar Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
