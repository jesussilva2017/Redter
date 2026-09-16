import React, { useEffect, useState } from 'react';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  Truck, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  MapPin,
  Vote
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<any>({ total: 0, seguros: 0, simpatizantes: 0, indecisos: 0, transporte: 0 });
  const [eventsCount, setEventsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [votersRes, eventsRes, usersRes] = await Promise.all([
        axios.get('/api/v1/voters'),
        axios.get('/api/v1/events'),
        axios.get('/api/v1/users'),
      ]);

      setMetrics(votersRes.data.metrics || {});
      setEventsCount(eventsRes.data.events?.length || 0);
      setUsersCount(usersRes.data.users?.length || 0);
    } catch (err) {
      console.error('Error al cargar métricas del dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const metaVotantes = 500;
  const progresoPorcentaje = Math.min(Math.round((metrics.total / metaVotantes) * 100), 100);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <h1 className="font-heading font-bold text-2xl text-white">
              Bienvenido, {user?.nombre}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Panel Ejecutivo de Control Electoral — <span className="text-sky-400 font-medium">Redter Inteligencia</span>
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-semibold text-sky-400">
            <MapPin className="w-3.5 h-3.5" />
            {user?.municipioAsignado || 'Nivel Nacional Colombia'}
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Votantes */}
        <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Votantes</p>
            <h3 className="font-heading text-3xl font-extrabold text-white mt-1">{metrics.total}</h3>
            <p className="text-xs text-emerald-400 font-semibold mt-2 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Meta: {metaVotantes} votantes
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Votos Seguros */}
        <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Votos Seguros</p>
            <h3 className="font-heading text-3xl font-extrabold text-emerald-400 mt-1">{metrics.seguros}</h3>
            <p className="text-xs text-slate-400 mt-2">
              {metrics.total ? Math.round((metrics.seguros / metrics.total) * 100) : 0}% de fidelidad total
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Requieren Transporte Día D */}
        <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Logística Transporte</p>
            <h3 className="font-heading text-3xl font-extrabold text-amber-400 mt-1">{metrics.transporte}</h3>
            <p className="text-xs text-slate-400 mt-2">Votantes que requieren apoyo</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        {/* Eventos y Tareas */}
        <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Eventos de Campaña</p>
            <h3 className="font-heading text-3xl font-extrabold text-purple-400 mt-1">{eventsCount}</h3>
            <p className="text-xs text-slate-400 mt-2">Reuniones y mitines activos</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Progress & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Meta Bar */}
        <div className="lg:col-span-2 bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60 shadow-lg space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-heading text-lg font-bold text-white">Progreso de Censo Electoral</h3>
              <p className="text-xs text-slate-400">Captura de votantes fidelizados en la zona</p>
            </div>
            <span className="text-sm font-bold text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
              {progresoPorcentaje}% Cumplido
            </span>
          </div>

          <div className="w-full bg-slate-900 rounded-full h-4 p-0.5 overflow-hidden border border-slate-700">
            <div
              className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progresoPorcentaje}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2 text-center text-xs">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="block text-slate-400">Votos Seguros</span>
              <span className="font-bold text-emerald-400 text-base">{metrics.seguros}</span>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="block text-slate-400">Simpatizantes</span>
              <span className="font-bold text-sky-400 text-base">{metrics.simpatizantes}</span>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="block text-slate-400">Indecisos</span>
              <span className="font-bold text-amber-400 text-base">{metrics.indecisos}</span>
            </div>
          </div>
        </div>

        {/* Roles Quick Summary */}
        <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60 shadow-lg space-y-4">
          <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-400" /> Red Específica de Mando
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Coordinadores / Líderes
              </div>
              <span className="font-bold text-white text-sm">{usersCount}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> Testigos de Mesa Acreditados
              </div>
              <span className="font-bold text-white text-sm">1</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400" /> Voluntarios Activos
              </div>
              <span className="font-bold text-white text-sm">1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
