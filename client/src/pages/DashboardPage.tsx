import React, { useEffect, useState } from 'react';
import {
  Users,
  UserCheck,
  Calendar,
  CheckSquare,
  TrendingUp,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<any>({ total: 0, seguros: 0, simpatizantes: 0, indecisos: 0, transporte: 0 });
  const [eventsCount, setEventsCount] = useState(0);
  const [tasksCount, setTasksCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [votersRes, eventsRes, tasksRes, usersRes] = await Promise.all([
        axios.get('/api/v1/voters'),
        axios.get('/api/v1/events'),
        axios.get('/api/v1/events/tasks/all'),
        axios.get('/api/v1/users'),
      ]);

      setMetrics(votersRes.data.metrics || {});
      setEventsCount(eventsRes.data.events?.length || 0);
      setTasksCount(tasksRes.data.tasks?.length || 0);
      setUsersCount(usersRes.data.users?.length || 0);
    } catch (err) {
      console.error('Error al cargar métricas del dashboard:', err);
    }
  };

  const metaVotantes = 500;
  const progresoPorcentaje = Math.min(Math.round((metrics.total / metaVotantes) * 100), 100);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-navy p-6 rounded-2xl shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-2xl text-white">
              Bienvenido, {user?.nombre}
            </h1>
            <p className="text-sm text-white/70 mt-1">
              Panel Ejecutivo — <span className="text-white font-medium">REDTER</span>
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-white">
            <MapPin className="w-3.5 h-3.5" />
            {user?.municipioAsignado || 'Nivel Nacional'}
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Votantes */}
        <div className="bg-white p-5 rounded-2xl border border-line flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Votantes</p>
            <h3 className="font-heading text-3xl font-extrabold text-gray-800 mt-1">{metrics.total}</h3>
            <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Meta: {metaVotantes} votantes
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-navy/10 border border-navy/20 text-navy flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Votos Seguros */}
        <div className="bg-white p-5 rounded-2xl border border-line flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Votos Seguros</p>
            <h3 className="font-heading text-3xl font-extrabold text-emerald-600 mt-1">{metrics.seguros}</h3>
            <p className="text-xs text-gray-500 mt-2">
              {metrics.total ? Math.round((metrics.seguros / metrics.total) * 100) : 0}% de fidelidad total
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Tareas Logísticas */}
        <div className="bg-white p-5 rounded-2xl border border-line flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Tareas Logísticas</p>
            <h3 className="font-heading text-3xl font-extrabold text-amber-600 mt-1">{tasksCount}</h3>
            <p className="text-xs text-gray-500 mt-2">Actividades y tareas operativas</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
            <CheckSquare className="w-6 h-6" />
          </div>
        </div>

        {/* Eventos y Tareas */}
        <div className="bg-white p-5 rounded-2xl border border-line flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Eventos de Agenda</p>
            <h3 className="font-heading text-3xl font-extrabold text-purple-600 mt-1">{eventsCount}</h3>
            <p className="text-xs text-gray-500 mt-2">Reuniones y actividades activas</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Progress & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Meta Bar */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-line shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-heading text-lg font-bold text-gray-800">Progreso de Censo</h3>
              <p className="text-xs text-gray-500">Captura de personas fidelizadas en el territorio</p>
            </div>
            <span className="text-sm font-bold text-navy bg-navy/10 px-3 py-1 rounded-full border border-navy/20">
              {progresoPorcentaje}% Cumplido
            </span>
          </div>

          <div className="w-full bg-surface-subtle rounded-full h-4 p-0.5 overflow-hidden border border-line">
            <div
              className="bg-navy h-full rounded-full transition-all duration-500"
              style={{ width: `${progresoPorcentaje}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2 text-center text-xs">
            <div className="p-3 bg-surface-subtle rounded-xl border border-line">
              <span className="block text-gray-500">Votos Seguros</span>
              <span className="font-bold text-emerald-600 text-base">{metrics.seguros}</span>
            </div>
            <div className="p-3 bg-surface-subtle rounded-xl border border-line">
              <span className="block text-gray-500">Simpatizantes</span>
              <span className="font-bold text-navy text-base">{metrics.simpatizantes}</span>
            </div>
            <div className="p-3 bg-surface-subtle rounded-xl border border-line">
              <span className="block text-gray-500">Indecisos</span>
              <span className="font-bold text-amber-600 text-base">{metrics.indecisos}</span>
            </div>
          </div>
        </div>

        {/* Roles Quick Summary */}
        <div className="bg-white p-6 rounded-2xl border border-line shadow-sm space-y-4">
          <h3 className="font-heading text-lg font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-navy" /> Estructura de Equipo
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-surface-subtle rounded-xl border border-line">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Coordinadores / Líderes
              </div>
              <span className="font-bold text-gray-800 text-sm">{usersCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
