import React, { useEffect, useState, useMemo } from 'react';
import { 
  Calendar, 
  CalendarDays,
  Plus, 
  MapPin, 
  Clock, 
  Users, 
  CheckSquare, 
  AlertCircle, 
  X,
  FileText,
  User as UserIcon,
  Search,
  Pencil,
  Trash2,
  Loader2
} from 'lucide-react';
import axios from 'axios';
import { CampaignEvent, CampaignTask, User } from '../types';
import { confirmDelete, showErrorAlert, showToast } from '../utils/alerts';
import { useAuth } from '../context/AuthContext';

const EVENT_TYPES = [
  { value: 'REUNION', label: '🤝 Reunión' },
  { value: 'MESA_TRABAJO', label: '📊 Mesa de trabajo' },
  { value: 'VISITA', label: '🚶‍♂️ Visita' },
  { value: 'PUERTA_A_PUERTA', label: '🚪 Puerta a puerta' },
  { value: 'EVENTO', label: '🎪 Evento' },
  { value: 'FORO', label: '💬 Foro' },
  { value: 'DEBATE', label: '🎙️ Debate' },
  { value: 'ENTREVISTA', label: '📻 Entrevista' },
  { value: 'CAPACITACION', label: '🎓 Capacitación' },
  { value: 'RUEDA_PRENSA', label: '📰 Rueda de prensa' },
  { value: 'GRABACION_CONTENIDO', label: '📹 Grabación de contenido' },
  { value: 'MEDIOS_COMUNICACION', label: '📺 Medios de comunicación' },
];

// Helper para obtener string "YYYY-MM-DDTHH:mm" en la hora LOCAL del usuario
const getNowLocalInput = (hoursAhead: number = 0): string => {
  const d = new Date(Date.now() + hoursAhead * 3600000);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// Helper para convertir fecha a formato de input datetime-local sin desfase de zona horaria
const formatDateTimeLocal = (dateStr?: string | null): string => {
  if (!dateStr) return getNowLocalInput();

  // Si ya es un formato local YYYY-MM-DDTHH:mm sin Z ni offset
  const localMatch = String(dateStr).match(/^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})/);
  if (localMatch && !dateStr.includes('Z') && !dateStr.includes('+') && !dateStr.match(/-\d{2}:\d{2}$/)) {
    return `${localMatch[1]}T${localMatch[2]}`;
  }

  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const pad = (num: number) => String(num).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }
  } catch {
    // fallback
  }

  return getNowLocalInput();
};

// Helper para extraer la parte local YYYY-MM-DD para el filtro del calendario
const getLocalDatePart = (dateStr?: string | null): string => {
  if (!dateStr) return '';
  const localMatch = String(dateStr).match(/^(\d{4}-\d{2}-\d{2})[T ]/);
  if (localMatch && !dateStr.includes('Z') && !dateStr.includes('+') && !dateStr.match(/-\d{2}:\d{2}$/)) {
    return localMatch[1];
  }
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const pad = (num: number) => String(num).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    }
  } catch {
    // fallback
  }
  return String(dateStr).slice(0, 10);
};

// Helper para formatear fecha y rango de horas de inicio a fin en las tarjetas
const formatEventDisplay = (inicioStr?: string, finStr?: string): { fecha: string; horario: string } => {
  if (!inicioStr) return { fecha: 'Fecha no definida', horario: '' };

  const parseSafe = (str: string): Date => {
    const clean = str.includes(' ') && !str.includes('T') ? str.replace(' ', 'T') : str;
    return new Date(clean);
  };

  try {
    const dInicio = parseSafe(inicioStr);
    if (isNaN(dInicio.getTime())) {
      return { fecha: String(inicioStr).replace('T', ' '), horario: '' };
    }

    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    const formatTimeOnly = (d: Date) => {
      let hours = d.getHours();
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'p. m.' : 'a. m.';
      hours = hours % 12;
      hours = hours ? hours : 12;
      return `${hours}:${minutes} ${ampm}`;
    };

    const diaNombre = diasSemana[dInicio.getDay()];
    const diaNum = dInicio.getDate();
    const mesNombre = meses[dInicio.getMonth()];
    const anio = dInicio.getFullYear();

    const fechaFormat = `${diaNombre}, ${diaNum} ${mesNombre} ${anio}`;
    const horaInicio = formatTimeOnly(dInicio);

    if (!finStr) {
      return { fecha: fechaFormat, horario: horaInicio };
    }

    const dFin = parseSafe(finStr);
    if (isNaN(dFin.getTime())) {
      return { fecha: fechaFormat, horario: horaInicio };
    }

    // Si termina el mismo día:
    const mismoDia = dInicio.getFullYear() === dFin.getFullYear() &&
                     dInicio.getMonth() === dFin.getMonth() &&
                     dInicio.getDate() === dFin.getDate();

    if (mismoDia) {
      const horaFin = formatTimeOnly(dFin);
      return { fecha: fechaFormat, horario: `${horaInicio} – ${horaFin}` };
    } else {
      const diaFinNum = dFin.getDate();
      const mesFinNombre = meses[dFin.getMonth()];
      const horaFin = formatTimeOnly(dFin);
      return {
        fecha: `${diaNum} ${mesNombre} – ${diaFinNum} ${mesFinNombre} ${dFin.getFullYear()}`,
        horario: `${horaInicio} – ${horaFin}`,
      };
    }
  } catch {
    return { fecha: String(inicioStr), horario: '' };
  }
};

export const EventsPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const isAdminCampana = currentUser?.role === 'ADMIN_CAMPANA' || currentUser?.role === 'SUPER_ADMIN';

  const [events, setEvents] = useState<CampaignEvent[]>([]);
  const [tasks, setTasks] = useState<CampaignTask[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'events' | 'tasks'>('events');
  const [loading, setLoading] = useState(true);

  // Filtros y Buscador para Eventos
  const [searchTermEvents, setSearchTermEvents] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');
  const [fechaFilter, setFechaFilter] = useState('');

  // Modales y estados de edición/eliminación
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  // Form Evento
  const [newEvent, setNewEvent] = useState({
    titulo: '',
    descripcion: '',
    tipo: 'REUNION',
    estado: 'PROGRAMADO' as 'PROGRAMADO' | 'COMPLETADO' | 'CANCELADO',
    departamento: '',
    municipio: '',
    barrioVereda: '',
    direccion: '',
    encargado: '',
    fechaInicio: getNowLocalInput(),
    fechaFin: getNowLocalInput(2),
    observaciones: '',
    aforoEstimado: 50,
  });

  // Form Tarea
  const [newTask, setNewTask] = useState({
    titulo: '',
    descripcion: '',
    prioridad: 'MEDIA' as 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE',
    asignadoAUserId: '',
    fechaLimite: getNowLocalInput(48),
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

  // Eventos filtrados y ordenados cronológicamente (primera reunión por fecha/hora primero)
  const filteredEvents = useMemo(() => {
    let result = [...events];

    // 1. Buscador texto
    if (searchTermEvents.trim()) {
      const q = searchTermEvents.toLowerCase();
      result = result.filter(
        (e) =>
          e.titulo.toLowerCase().includes(q) ||
          e.descripcion.toLowerCase().includes(q) ||
          e.direccion.toLowerCase().includes(q) ||
          (e.encargado && e.encargado.toLowerCase().includes(q)) ||
          (e.barrioVereda && e.barrioVereda.toLowerCase().includes(q))
      );
    }

    // 2. Filtro Tipo
    if (tipoFilter) {
      result = result.filter((e) => e.tipo === tipoFilter);
    }

    // 3. Filtro Estado
    if (estadoFilter) {
      result = result.filter((e) => e.estado === estadoFilter);
    }

    // 4. Filtro Fecha (respetando la fecha local)
    if (fechaFilter) {
      result = result.filter((e) => {
        if (!e.fechaInicio) return false;
        const eventDateStr = getLocalDatePart(e.fechaInicio);
        return eventDateStr === fechaFilter;
      });
    }

    // 5. Ordenar por fecha y hora de inicio (más próxima primero)
    result.sort((a, b) => {
      const timeA = new Date(a.fechaInicio).getTime();
      const timeB = new Date(b.fechaInicio).getTime();
      return timeA - timeB;
    });

    return result;
  }, [events, searchTermEvents, tipoFilter, estadoFilter, fechaFilter]);

  const openCreateEventModal = () => {
    setEditingEventId(null);
    setNewEvent({
      titulo: '',
      descripcion: '',
      tipo: 'REUNION',
      estado: 'PROGRAMADO',
      departamento: '',
      municipio: '',
      barrioVereda: '',
      direccion: '',
      encargado: '',
      fechaInicio: getNowLocalInput(),
      fechaFin: getNowLocalInput(2),
      observaciones: '',
      aforoEstimado: 50,
    });
    setIsEventModalOpen(true);
  };

  const openEditEventModal = (evt: CampaignEvent) => {
    setEditingEventId(evt.id);
    setNewEvent({
      titulo: evt.titulo || '',
      descripcion: evt.descripcion || '',
      tipo: evt.tipo || 'REUNION',
      estado: (evt.estado as any) || 'PROGRAMADO',
      departamento: evt.departamento || '',
      municipio: evt.municipio || '',
      barrioVereda: evt.barrioVereda || '',
      direccion: evt.direccion || '',
      encargado: evt.encargado || '',
      fechaInicio: formatDateTimeLocal(evt.fechaInicio),
      fechaFin: formatDateTimeLocal(evt.fechaFin),
      observaciones: evt.observaciones || '',
      aforoEstimado: evt.aforoEstimado || 50,
    });
    setIsEventModalOpen(true);
  };

  const handleCreateOrUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEventId) {
        await axios.put(`/api/v1/events/${editingEventId}`, newEvent);
        showToast('Evento actualizado correctamente', 'success');
      } else {
        await axios.post('/api/v1/events', newEvent);
        showToast('Evento agendado exitosamente', 'success');
      }
      setIsEventModalOpen(false);
      setEditingEventId(null);
      fetchEventsAndTasks();
    } catch (err: any) {
      showErrorAlert('Error al guardar', err.response?.data?.error || 'Error al guardar el evento');
    }
  };

  const handleDeleteEvent = async (evt: CampaignEvent) => {
    if (!isAdminCampana) {
      showErrorAlert('Permiso Denegado', 'Solo el usuario Admin Campaña tiene permiso para eliminar eventos.');
      return;
    }

    const confirmado = await confirmDelete({
      title: `¿Eliminar "${evt.titulo}"?`,
      text: 'Esta acción no se puede deshacer y eliminará el evento de la agenda.',
    });
    if (!confirmado) return;

    setDeletingEventId(evt.id);
    try {
      await axios.delete(`/api/v1/events/${evt.id}`);
      showToast('Evento eliminado exitosamente', 'success');
      fetchEventsAndTasks();
    } catch (err: any) {
      showErrorAlert('Error al eliminar', err.response?.data?.error || 'Error al eliminar el evento');
    } finally {
      setDeletingEventId(null);
    }
  };

  const openCreateTaskModal = () => {
    setEditingTaskId(null);
    setNewTask({
      titulo: '',
      descripcion: '',
      prioridad: 'MEDIA',
      asignadoAUserId: '',
      fechaLimite: getNowLocalInput(48),
    });
    setIsTaskModalOpen(true);
  };

  const openEditTaskModal = (task: CampaignTask) => {
    setEditingTaskId(task.id);
    setNewTask({
      titulo: task.titulo || '',
      descripcion: task.descripcion || '',
      prioridad: task.prioridad || 'MEDIA',
      asignadoAUserId: task.asignadoAUserId || '',
      fechaLimite: formatDateTimeLocal(task.fechaLimite),
    });
    setIsTaskModalOpen(true);
  };

  const handleCreateOrUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTaskId) {
        await axios.put(`/api/v1/events/tasks/all/${editingTaskId}`, newTask);
        showToast('Tarea actualizada correctamente', 'success');
      } else {
        await axios.post('/api/v1/events/tasks/all', newTask);
        showToast('Tarea asignada correctamente', 'success');
      }
      setIsTaskModalOpen(false);
      setEditingTaskId(null);
      fetchEventsAndTasks();
    } catch (err: any) {
      showErrorAlert('Error al guardar tarea', err.response?.data?.error || 'Error al procesar la tarea');
    }
  };

  const handleDeleteTask = async (task: CampaignTask) => {
    if (!isAdminCampana) {
      showErrorAlert('Permiso Denegado', 'Solo el usuario Admin Campaña tiene permiso para eliminar tareas logísticas.');
      return;
    }

    const confirmado = await confirmDelete({
      title: `¿Eliminar tarea "${task.titulo}"?`,
      text: 'Esta acción no se puede deshacer y eliminará la tarea logística.',
    });
    if (!confirmado) return;

    setDeletingTaskId(task.id);
    try {
      await axios.delete(`/api/v1/events/tasks/all/${task.id}`);
      showToast('Tarea eliminada exitosamente', 'success');
      fetchEventsAndTasks();
    } catch (err: any) {
      showErrorAlert('Error al eliminar tarea', err.response?.data?.error || 'Error al eliminar la tarea');
    } finally {
      setDeletingTaskId(null);
    }
  };

  const handleToggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'COMPLETADA' ? 'PENDIENTE' : 'COMPLETADA';
    try {
      await axios.patch(`/api/v1/events/tasks/all/${taskId}`, { estado: nextStatus });
      showToast(nextStatus === 'COMPLETADA' ? 'Tarea completada' : 'Tarea marcada como pendiente', 'info');
      fetchEventsAndTasks();
    } catch (err) {
      showErrorAlert('Error', 'Error al actualizar el estado de la tarea');
    }
  };

  const getTipoBadge = (tipo: string) => {
    const found = EVENT_TYPES.find((t) => t.value === tipo || t.label === tipo);
    if (found) {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-navy/10 text-navy border border-navy/20">
          {found.label}
        </span>
      );
    }
    const legacyLabels: Record<string, string> = {
      REUNION_LIDERES: '🤝 Reunión de Líderes',
      MITIN_MASIVO: '📣 Mitin Masivo',
      CANVASSING: '🚶‍♂️ Puerta a Puerta',
      EVENTO_BARRIAL: '🎪 Evento Barrial',
      CAPACITACION: '🎓 Capacitación Electoral',
    };
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-navy/10 text-navy border border-navy/20">
        {legacyLabels[tipo] || `📌 ${tipo || 'Actividad'}`}
      </span>
    );
  };

  const getEstadoBadge = (estado: string) => {
    const config: Record<string, { label: string; className: string }> = {
      PROGRAMADO: { label: '📅 Programado', className: 'bg-blue-50 text-blue-700 border-blue-200' },
      COMPLETADO: { label: '✅ Completado', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      CANCELADO: { label: '🚫 Cancelado', className: 'bg-rose-50 text-rose-700 border-rose-200' },
    };
    const current = config[estado] || { label: estado || 'Programado', className: 'bg-blue-50 text-blue-700 border-blue-200' };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${current.className}`}>
        {current.label}
      </span>
    );
  };

  const handleQuickStatusChange = async (evt: CampaignEvent, newStatus: string) => {
    try {
      await axios.put(`/api/v1/events/${evt.id}`, { ...evt, estado: newStatus });
      showToast('Estado del evento actualizado', 'success');
      fetchEventsAndTasks();
    } catch (err) {
      showErrorAlert('Error', 'No se pudo actualizar el estado del evento');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="font-heading font-bold text-xl sm:text-2xl text-gray-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-navy shrink-0" /> Agenda, Eventos & Tareas
          </h1>
          <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">
            Programación de reuniones políticas, control de asistencia e insumos de campaña.
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {activeTab === 'events' ? (
            <button
              onClick={openCreateEventModal}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-navy hover:bg-navy-deep active:bg-navy-deep text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" /> Agendar Evento
            </button>
          ) : (
            <button
              onClick={openCreateTaskModal}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-navy hover:bg-navy-deep active:bg-navy-deep text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" /> Asignar Tarea
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-line text-xs sm:text-sm font-semibold gap-4 sm:gap-6 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('events')}
          className={`pb-3 flex items-center gap-1.5 sm:gap-2 border-b-2 transition whitespace-nowrap shrink-0 ${
            activeTab === 'events'
              ? 'border-navy text-navy font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Calendar className="w-4 h-4" /> Eventos & Reuniones ({filteredEvents.length})
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`pb-3 flex items-center gap-1.5 sm:gap-2 border-b-2 transition whitespace-nowrap shrink-0 ${
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
        <div className="space-y-4">
          {/* Buscador y filtros de eventos */}
          <div className="flex flex-col lg:flex-row gap-2.5 sm:gap-3 items-stretch lg:items-center w-full">
            <div className="relative flex-1 min-w-0 w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por título, lugar, encargado, observaciones..."
                value={searchTermEvents}
                onChange={(e) => setSearchTermEvents(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-line-strong rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
              />
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-2.5 w-full lg:w-auto shrink-0">
              <select
                value={tipoFilter}
                onChange={(e) => setTipoFilter(e.target.value)}
                className="flex-1 sm:flex-none sm:w-auto sm:min-w-[160px] px-3 sm:px-3.5 py-2.5 bg-white border border-line-strong rounded-xl text-xs sm:text-sm text-gray-700 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition truncate"
              >
                <option value="">Todas las actividades</option>
                {EVENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>

              <select
                value={estadoFilter}
                onChange={(e) => setEstadoFilter(e.target.value)}
                className="flex-1 sm:flex-none sm:w-auto sm:min-w-[145px] px-3 sm:px-3.5 py-2.5 bg-white border border-line-strong rounded-xl text-xs sm:text-sm text-gray-700 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition truncate"
              >
                <option value="">Todos los estados</option>
                <option value="PROGRAMADO">📅 Programado</option>
                <option value="COMPLETADO">✅ Completado</option>
                <option value="CANCELADO">🚫 Cancelado</option>
              </select>

              <div className="flex-1 sm:flex-none flex items-center gap-2">
                <input
                  type="date"
                  value={fechaFilter}
                  onChange={(e) => setFechaFilter(e.target.value)}
                  className="w-full sm:w-auto sm:min-w-[140px] max-w-full box-border px-3 sm:px-3.5 py-2.5 bg-white border border-line-strong rounded-xl text-xs sm:text-sm text-gray-700 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                />
                {(fechaFilter || estadoFilter || tipoFilter || searchTermEvents) && (
                  <button
                    type="button"
                    onClick={() => {
                      setFechaFilter('');
                      setEstadoFilter('');
                      setTipoFilter('');
                      setSearchTermEvents('');
                    }}
                    className="text-xs text-rose-600 hover:underline font-medium shrink-0"
                    title="Limpiar todos los filtros"
                  >
                    Limpiar
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Grid de 3 tarjetas por fila en pantalla grande */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredEvents.length === 0 ? (
              <div className="col-span-full bg-white p-8 rounded-2xl border border-line text-center text-gray-400 text-xs">
                No se encontraron eventos con los filtros seleccionados.
              </div>
            ) : (
              filteredEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-line shadow-sm space-y-3 relative overflow-hidden hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2 min-w-0">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-heading font-bold text-base sm:text-lg text-gray-800 truncate" title={evt.titulo}>{evt.titulo}</h3>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          {getTipoBadge(evt.tipo)}
                          <select
                            value={evt.estado || 'PROGRAMADO'}
                            onChange={(e) => handleQuickStatusChange(evt, e.target.value)}
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold border cursor-pointer focus:outline-none transition shrink-0 ${
                              evt.estado === 'COMPLETADO'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : evt.estado === 'CANCELADO'
                                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                                : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                            }`}
                            title="Cambiar estado del evento rápidamente"
                          >
                            <option value="PROGRAMADO">📅 Programado</option>
                            <option value="COMPLETADO">✅ Completado</option>
                            <option value="CANCELADO">🚫 Cancelado</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => openEditEventModal(evt)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-navy hover:bg-navy/10 active:bg-navy/20 transition"
                          title="Editar evento"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {isAdminCampana && (
                          <button
                            type="button"
                            onClick={() => handleDeleteEvent(evt)}
                            disabled={deletingEventId === evt.id}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 active:bg-red-100 transition disabled:opacity-60"
                            title="Eliminar evento (Solo Admin Campaña)"
                          >
                            {deletingEventId === evt.id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {evt.descripcion && (
                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{evt.descripcion}</p>
                    )}
                  </div>

                  <div className="space-y-2 text-xs text-gray-500 pt-2 border-t border-line mt-3">
                    {(() => {
                      const timeDisplay = formatEventDisplay(evt.fechaInicio, evt.fechaFin);
                      return (
                        <div className="space-y-1 text-xs text-gray-600 bg-surface-subtle p-2.5 rounded-xl border border-line">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="w-3.5 h-3.5 text-navy shrink-0" />
                            <span className="font-bold text-gray-800">{timeDisplay.fecha}</span>
                          </div>
                          {timeDisplay.horario && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-3.5 h-3.5 text-navy shrink-0" />
                              <span className="font-semibold text-navy">{timeDisplay.horario}</span>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-navy shrink-0" />
                      <span className="truncate">{evt.direccion || 'Lugar por definir'}</span>
                    </div>
                    {evt.encargado && (
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-3.5 h-3.5 text-navy shrink-0" />
                        <span className="truncate">Encargado: <strong className="text-gray-800 font-semibold">{evt.encargado}</strong></span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-navy shrink-0" />
                      <span>
                        Aforo estimado: <strong className="text-gray-800">{evt.aforoEstimado || 0} pers.</strong>
                      </span>
                    </div>
                    {evt.observaciones && (
                      <div className="text-[11px] text-gray-600 bg-surface-subtle p-2 rounded-xl border border-line mt-1 line-clamp-2">
                        <strong className="text-gray-700 font-semibold">Observaciones:</strong> {evt.observaciones}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab Content: Logistical Tasks */}
      {activeTab === 'tasks' && (
        <div className="bg-white rounded-2xl border border-line overflow-hidden shadow-sm p-3 sm:p-4 space-y-3">
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
                  className={`p-3.5 sm:p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 transition ${
                    isCompleted
                      ? 'bg-surface-subtle border-line opacity-75'
                      : 'bg-white border-line-strong hover:border-navy/40 shadow-xs'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <button
                      onClick={() => handleToggleTaskStatus(task.id, task.estado)}
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center transition shrink-0 mt-0.5 sm:mt-0 ${
                        isCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-line-strong hover:border-navy'
                      }`}
                    >
                      {isCompleted && <CheckSquare className="w-4 h-4" />}
                    </button>
                    <div className="min-w-0">
                      <h4 className={`font-semibold text-xs sm:text-sm ${isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {task.titulo}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">{task.descripcion}</p>
                      <div className="text-[11px] text-gray-400 mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span>Asignado a: <strong className="text-navy">{assignedUser?.nombre || 'Voluntario'}</strong></span>
                        <span className="hidden sm:inline">•</span>
                        <span>Prioridad: <strong className="text-amber-700">{task.prioridad}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {task.estado}
                    </span>
                    <button
                      type="button"
                      onClick={() => openEditTaskModal(task)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-navy hover:bg-navy/10 active:bg-navy/20 transition"
                      title="Editar tarea"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    {isAdminCampana && (
                      <button
                        type="button"
                        onClick={() => handleDeleteTask(task)}
                        disabled={deletingTaskId === task.id}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 active:bg-red-100 transition disabled:opacity-60"
                        title="Eliminar tarea (Solo Admin Campaña)"
                      >
                        {deletingTaskId === task.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Modal Agendar Evento (Responsive) */}
      {isEventModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs z-50 flex items-start sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
          <div className="bg-white border-0 sm:border border-line rounded-none sm:rounded-2xl w-full max-w-lg shadow-2xl flex flex-col min-h-screen sm:min-h-0 sm:max-h-[90vh] overflow-hidden text-xs">
            {/* Header Modal */}
            <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-line flex items-center justify-between bg-white shrink-0">
              <h3 className="font-heading text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2 min-w-0">
                <Calendar className="w-5 h-5 text-navy shrink-0" />
                <span className="truncate">{editingEventId ? 'Editar Evento Político' : 'Agendar Evento Político'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsEventModalOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-surface-subtle active:bg-gray-200 transition shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form body */}
            <form onSubmit={handleCreateOrUpdateEvent} className="flex-1 overflow-y-auto p-4 sm:p-6 text-xs overscroll-contain space-y-3.5">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Título del Evento *</label>
                <input
                  type="text"
                  required
                  value={newEvent.titulo}
                  onChange={(e) => setNewEvent({ ...newEvent, titulo: e.target.value })}
                  placeholder="Reunión Comunal Barrio Usaquén"
                  className="w-full max-w-full min-w-0 box-border bg-white border border-line-strong rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Descripción del Evento</label>
                <textarea
                  rows={2}
                  value={newEvent.descripcion}
                  onChange={(e) => setNewEvent({ ...newEvent, descripcion: e.target.value })}
                  placeholder="Detalles sobre el propósito del encuentro o temas a tratar..."
                  className="w-full max-w-full min-w-0 box-border bg-white border border-line-strong rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="min-w-0">
                  <label className="block text-gray-700 font-semibold mb-1">Tipo de Actividad *</label>
                  <select
                    value={newEvent.tipo}
                    onChange={(e) => setNewEvent({ ...newEvent, tipo: e.target.value })}
                    className="w-full max-w-full min-w-0 box-border bg-white border border-line-strong rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                  >
                    {EVENT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div className="min-w-0">
                  <label className="block text-gray-700 font-semibold mb-1">Estado del Evento</label>
                  <select
                    value={newEvent.estado}
                    onChange={(e) => setNewEvent({ ...newEvent, estado: e.target.value as any })}
                    className="w-full max-w-full min-w-0 box-border bg-white border border-line-strong rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                  >
                    <option value="PROGRAMADO">📅 Programado</option>
                    <option value="COMPLETADO">✅ Completado</option>
                    <option value="CANCELADO">🚫 Cancelado</option>
                  </select>
                </div>
                <div className="min-w-0">
                  <label className="block text-gray-700 font-semibold mb-1">Aforo Estimado</label>
                  <input
                    type="number"
                    value={newEvent.aforoEstimado}
                    onChange={(e) => setNewEvent({ ...newEvent, aforoEstimado: Number(e.target.value) })}
                    className="w-full max-w-full min-w-0 box-border bg-white border border-line-strong rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Dirección / Lugar de Encuentro</label>
                <input
                  type="text"
                  value={newEvent.direccion}
                  onChange={(e) => setNewEvent({ ...newEvent, direccion: e.target.value })}
                  placeholder="Salon Comunal - Cra 7 # 165"
                  className="w-full max-w-full min-w-0 box-border bg-white border border-line-strong rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                />
              </div>

              {/* Encargado: campo de texto después de Dirección / Lugar de Encuentro */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Encargado</label>
                <input
                  type="text"
                  value={newEvent.encargado}
                  onChange={(e) => setNewEvent({ ...newEvent, encargado: e.target.value })}
                  placeholder="Nombre de la persona o coordinador a cargo..."
                  className="w-full max-w-full min-w-0 box-border bg-white border border-line-strong rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="min-w-0">
                  <label className="block text-gray-700 font-semibold mb-1">Fecha y Hora Inicio *</label>
                  <input
                    type="datetime-local"
                    required
                    value={newEvent.fechaInicio}
                    onChange={(e) => setNewEvent({ ...newEvent, fechaInicio: e.target.value })}
                    className="w-full max-w-full min-w-0 box-border bg-white border border-line-strong rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                  />
                </div>
                <div className="min-w-0">
                  <label className="block text-gray-700 font-semibold mb-1">Fecha y Hora Fin *</label>
                  <input
                    type="datetime-local"
                    required
                    value={newEvent.fechaFin}
                    onChange={(e) => setNewEvent({ ...newEvent, fechaFin: e.target.value })}
                    className="w-full max-w-full min-w-0 box-border bg-white border border-line-strong rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                  />
                </div>
              </div>

              {/* Observaciones: campo de texto después de Fecha y hora de inicio/fin */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Observaciones</label>
                <textarea
                  rows={2}
                  value={newEvent.observaciones}
                  onChange={(e) => setNewEvent({ ...newEvent, observaciones: e.target.value })}
                  placeholder="Observaciones, logística requerida o notas adicionales..."
                  className="w-full max-w-full min-w-0 box-border bg-white border border-line-strong rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                />
              </div>

              {/* Footer Modal */}
              <div className="pt-4 flex justify-end gap-2.5 border-t border-line modal-safe-bottom shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-4 py-2.5 bg-surface-subtle hover:bg-line active:bg-gray-200 text-gray-700 rounded-xl font-semibold text-xs transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-navy hover:bg-navy-deep active:bg-navy-deep text-white rounded-xl font-semibold text-xs shadow-md transition"
                >
                  {editingEventId ? 'Guardar Cambios' : 'Guardar Evento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Asignar Tarea (Responsive) */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs z-50 flex items-start sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
          <div className="bg-white border-0 sm:border border-line rounded-none sm:rounded-2xl w-full max-w-lg shadow-2xl flex flex-col min-h-screen sm:min-h-0 sm:max-h-[90vh] overflow-hidden text-xs">
            {/* Header Modal */}
            <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-line flex items-center justify-between bg-white shrink-0">
              <h3 className="font-heading text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2 min-w-0">
                <CheckSquare className="w-5 h-5 text-navy shrink-0" />
                <span className="truncate">{editingTaskId ? 'Editar Tarea Logística' : 'Asignar Tarea Logística'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsTaskModalOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-surface-subtle active:bg-gray-200 transition shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form body */}
            <form onSubmit={handleCreateOrUpdateTask} className="flex-1 overflow-y-auto p-4 sm:p-6 text-xs overscroll-contain space-y-3.5">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Título de la Tarea *</label>
                <input
                  type="text"
                  required
                  value={newTask.titulo}
                  onChange={(e) => setNewTask({ ...newTask, titulo: e.target.value })}
                  placeholder="Verificar credenciales de testigos"
                  className="w-full max-w-full min-w-0 box-border bg-white border border-line-strong rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Descripción / Instrucciones</label>
                <textarea
                  rows={3}
                  value={newTask.descripcion}
                  onChange={(e) => setNewTask({ ...newTask, descripcion: e.target.value })}
                  placeholder="Detalles logísticos..."
                  className="w-full max-w-full min-w-0 box-border bg-white border border-line-strong rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="min-w-0">
                  <label className="block text-gray-700 font-semibold mb-1">Asignar a *</label>
                  <select
                    required
                    value={newTask.asignadoAUserId}
                    onChange={(e) => setNewTask({ ...newTask, asignadoAUserId: e.target.value })}
                    className="w-full max-w-full min-w-0 box-border bg-white border border-line-strong rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                  >
                    <option value="">Seleccionar voluntario/líder...</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nombre} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="min-w-0">
                  <label className="block text-gray-700 font-semibold mb-1">Prioridad</label>
                  <select
                    value={newTask.prioridad}
                    onChange={(e) => setNewTask({ ...newTask, prioridad: e.target.value as any })}
                    className="w-full max-w-full min-w-0 box-border bg-white border border-line-strong rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                  >
                    <option value="BAJA">Baja</option>
                    <option value="MEDIA">Media</option>
                    <option value="ALTA">Alta</option>
                    <option value="URGENTE">Urgente 🔥</option>
                  </select>
                </div>
              </div>

              {/* Footer Modal */}
              <div className="pt-4 flex justify-end gap-2.5 border-t border-line modal-safe-bottom shrink-0">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2.5 bg-surface-subtle hover:bg-line active:bg-gray-200 text-gray-700 rounded-xl font-semibold text-xs transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-navy hover:bg-navy-deep active:bg-navy-deep text-white rounded-xl font-semibold text-xs shadow-md transition"
                >
                  {editingTaskId ? 'Guardar Cambios' : 'Asignar Tarea'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
