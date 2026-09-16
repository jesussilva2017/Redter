import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  CalendarDays, 
  MapPin, 
  LogOut, 
  ShieldAlert,
  Vote
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'ADMIN_CAMPANA':
        return { label: 'Admin Campaña', color: 'bg-sky-500/20 text-sky-400 border-sky-500/30' };
      case 'COORDINADOR':
        return { label: 'Coordinador Zonal', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
      case 'LIDER':
        return { label: 'Líder Electoral', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
      case 'TESTIGO':
        return { label: 'Testigo de Mesa', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' };
      case 'VOLUNTARIO':
        return { label: 'Voluntario', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
      default:
        return { label: role || 'Usuario', color: 'bg-slate-700 text-slate-300' };
    }
  };

  const badge = getRoleBadge(user?.role);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'ADMIN_CAMPANA', 'COORDINADOR', 'LIDER', 'TESTIGO', 'VOLUNTARIO'] },
    { id: 'voters', label: 'Votantes y CRM', icon: UserCheck, roles: ['SUPER_ADMIN', 'ADMIN_CAMPANA', 'COORDINADOR', 'LIDER', 'TESTIGO'] },
    { id: 'users', label: 'Usuarios y Roles', icon: Users, roles: ['SUPER_ADMIN', 'ADMIN_CAMPANA', 'COORDINADOR', 'LIDER'] },
    { id: 'events', label: 'Agenda y Eventos', icon: CalendarDays, roles: ['SUPER_ADMIN', 'ADMIN_CAMPANA', 'COORDINADOR', 'LIDER', 'VOLUNTARIO', 'TESTIGO'] },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/20">
          <Vote className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-heading font-bold text-lg text-white leading-tight">SIGE Electoral</h1>
          <p className="text-xs text-slate-400 font-medium tracking-wide">REDTER INTELIGENCIA</p>
        </div>
      </div>

      {/* User Info Card */}
      <div className="p-4 mx-3 my-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sky-400 border border-slate-600">
            {user?.nombre?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">{user?.nombre}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <div className={`mt-2 text-[11px] px-2.5 py-1 rounded-md border font-medium inline-block ${badge.color}`}>
          {badge.label}
        </div>
        {user?.municipioAsignado && (
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-sky-400 inline" /> {user.municipioAsignado}
          </p>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {menuItems
          .filter(item => user?.role && item.roles.includes(user.role))
          .map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};
