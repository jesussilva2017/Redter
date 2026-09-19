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
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-navy/10 text-navy border border-navy/20">🤝 Reunión de Líderes</span>;
      case 'MITIN_MASIVO':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">📣 Mitin Masivo</span>;
      case 'CANVASSING':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">🚶‍♂️ Puerta a Puerta</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">🎓 Capacitación</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-gray-800 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-navy" /> Agenda, Eventos & Tareas Logísticas
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Programación de reuniones políticas, control de asistencia e insumos de campaña.
          </p>
        </div>

        <div className="flex gap-2">
          {activeTab === 'events' ? (
            <button
              onClick={() => setIsEventModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy hover:bg-navy-deep text-white font-semibold text-sm rounded-xl shadow-md transition"
            >
              <Plus className="w-4 h-4" /> Agendar Evento / Reunión
            </button>
          ) : (
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy hover:bg-navy-deep text-white font-semibold text-sm rounded-xl shadow-md transition"
            >
              <Plus className="w-4 h-4" /> Asignar Tarea Logística
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-line text-sm font-semibold gap-6">
        <button
          onClick={() => setActiveTab('events')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'events'
              ? 'border-navy text-navy font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Calendar className="w-4 h-4" /> Eventos & Reuniones ({events.length})
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'tasks'
              ? 'border-navy text-navy font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <CheckSquare className="w-4 h-4" /> Tareas Logísticas ({tasks.length})
        </button>
      </div>

      {/* Tab Content: Events Grid */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.length === 0 ? (
            <div className="col-span-full bg-white p-8 rounded-2xl border border-line text-center text-gray-400 text-xs">
              No hay eventos programados en este momento.
            </div>
          ) : (
            events.map((evt) => (
              <div
                key={evt.id}
                className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-3 relative overflow-hidden hover:shadow-md transition"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-heading font-bold text-lg text-gray-800">{evt.titulo}</h3>
                    <div className="mt-1">{getTipoBadge(evt.tipo)}</div>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">{evt.descripcion}</p>

                <div className="space-y-1.5 text-xs text-gray-500 pt-2 border-t border-line">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-navy" />
                    <span>{new Date(evt.fechaInicio).toLocaleString('es-CO')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-navy" />
                    <span>{evt.direccion || `${evt.barrioVereda}, ${evt.municipio}`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-navy" />
                    <span>
                      Aforo estimado: <strong className="text-gray-800">{evt.aforoEstimado} pers.</strong> (Asistieron: <strong className="text-emerald-700">{evt.asistenciaReal}</strong>)
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab Content: Logistical Tasks */}
      {activeTab === 'tasks' && (
        <div className="bg-white rounded-2xl border border-line overflow-hidden shadow-sm p-4 space-y-3">
          {tasks.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-xs">
              No hay tareas asignadas en este momento.
            </div>
          ) : (
            tasks.map((task) => {
              const assignedUser = users.find((u) => u.id === task.asignadoAUserId);
              const isCompleted = task.estado === 'COMPLETADA';
              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition ${
                    isCompleted
                      ? 'bg-surface-subtle border-line opacity-75'
                      : 'bg-white border-line-strong hover:border-navy/40 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleTaskStatus(task.id, task.estado)}
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center transition ${
                        isCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-line-strong hover:border-navy'
                      }`}
                    >
                      {isCompleted && <CheckSquare className="w-4 h-4" />}
                    </button>
                    <div>
                      <h4 className={`font-semibold text-sm ${isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {task.titulo}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">{task.descripcion}</p>
                      <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-2">
                        <span>Asignado a: <strong className="text-navy">{assignedUser?.nombre || 'Voluntario'}</strong></span>
                        <span>• Prioridad: <strong className="text-amber-700">{task.prioridad}</strong></span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {task.estado}
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Modal Agendar Evento */}
      {isEventModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-line rounded-2xl w-full max-w-lg p-6 shadow-xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-line pb-3">
              <h3 className="font-heading text-lg font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-navy" /> Agendar Evento Político
              </h3>
              <button onClick={() => setIsEventModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3">
              <div>
                <label className="block text-gray-600 font-medium mb-1">Título del Evento *</label>
                <input
                  type="text"
                  required
                  value={newEvent.titulo}
                  onChange={(e) => setNewEvent({ ...newEvent, titulo: e.target.value })}
                  placeholder="Reunión Comunal Barrio Usaquén"
                  className="w-full bg-white border border-line-strong rounded-xl px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Tipo de Actividad</label>
                  <select
                    value={newEvent.tipo}
                    onChange={(e) => setNewEvent({ ...newEvent, tipo: e.target.value as any })}
                    className="w-full bg-white border border-line-strong rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                  >
                    <option value="REUNION_LIDERES">🤝 Reunión de Líderes</option>
                    <option value="MITIN_MASIVO">📣 Mitin Masivo</option>
                    <option value="CANVASSING">🚶‍♂️ Puerta a Puerta</option>
                    <option value="CAPACITACION">🎓 Capacitación Electoral</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Aforo Estimado</label>
                  <input
                    type="number"
                    value={newEvent.aforoEstimado}
                    onChange={(e) => setNewEvent({ ...newEvent, aforoEstimado: Number(e.target.value) })}
                    className="w-full bg-white border border-line-strong rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-600 font-medium mb-1">Dirección / Lugar de Encuentro</label>
                <input
                  type="text"
                  value={newEvent.direccion}
                  onChange={(e) => setNewEvent({ ...newEvent, direccion: e.target.value })}
                  placeholder="Salon Comunal - Cra 7 # 165"
                  className="w-full bg-white border border-line-strong rounded-xl px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Fecha y Hora Inicio *</label>
                  <input
                    type="datetime-local"
                    required
                    value={newEvent.fechaInicio}
                    onChange={(e) => setNewEvent({ ...newEvent, fechaInicio: e.target.value })}
                    className="w-full bg-white border border-line-strong rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Fecha y Hora Fin *</label>
                  <input
                    type="datetime-local"
                    required
                    value={newEvent.fechaFin}
                    onChange={(e) => setNewEvent({ ...newEvent, fechaFin: e.target.value })}
                    className="w-full bg-white border border-line-strong rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-4 py-2 bg-surface-subtle text-gray-600 rounded-xl hover:bg-line font-medium transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-navy text-white rounded-xl hover:bg-navy-deep font-semibold shadow-md transition"
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
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-line rounded-2xl w-full max-w-lg p-6 shadow-xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-line pb-3">
              <h3 className="font-heading text-lg font-bold text-gray-800 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-navy" /> Asignar Tarea Logística
              </h3>
              <button onClick={() => setIsTaskModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-gray-600 font-medium mb-1">Título de la Tarea *</label>
                <input
                  type="text"
                  required
                  value={newTask.titulo}
                  onChange={(e) => setNewTask({ ...newTask, titulo: e.target.value })}
                  placeholder="Verificar credenciales de testigos"
                  className="w-full bg-white border border-line-strong rounded-xl px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-medium mb-1">Descripción / Instrucciones</label>
                <textarea
                  rows={3}
                  value={newTask.descripcion}
                  onChange={(e) => setNewTask({ ...newTask, descripcion: e.target.value })}
                  placeholder="Detalles logísticos..."
                  className="w-full bg-white border border-line-strong rounded-xl px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Asignar a *</label>
                  <select
                    required
                    value={newTask.asignadoAUserId}
                    onChange={(e) => setNewTask({ ...newTask, asignadoAUserId: e.target.value })}
                    className="w-full bg-white border border-line-strong rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
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
                  <label className="block text-gray-600 font-medium mb-1">Prioridad</label>
                  <select
                    value={newTask.prioridad}
                    onChange={(e) => setNewTask({ ...newTask, prioridad: e.target.value as any })}
                    className="w-full bg-white border border-line-strong rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                  >
                    <option value="BAJA">Baja</option>
                    <option value="MEDIA">Media</option>
                    <option value="ALTA">Alta</option>
                    <option value="URGENTE">Urgente 🔥</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 bg-surface-subtle text-gray-600 rounded-xl hover:bg-line font-medium transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-navy text-white rounded-xl hover:bg-navy-deep font-semibold shadow-md transition"
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
