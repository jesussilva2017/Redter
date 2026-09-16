import React from 'react';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  CalendarDays,
  MapPin,
  LogOut,
  Vote,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'ADMIN_CAMPANA':
        return { label: 'Admin Campaña', color: 'bg-navy/10 text-navy border-navy/20' };
      case 'COORDINADOR':
        return { label: 'Coordinador Zonal', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'LIDER':
        return { label: 'Líder Electoral', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'TESTIGO':
        return { label: 'Testigo de Mesa', color: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'VOLUNTARIO':
        return { label: 'Voluntario', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      default:
        return { label: role || 'Usuario', color: 'bg-line text-gray-600 border-line-strong' };
    }
  };

  const badge = getRoleBadge(user?.role);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'ADMIN_CAMPANA', 'COORDINADOR', 'LIDER', 'TESTIGO', 'VOLUNTARIO'] },
    { id: 'voters', label: 'Votantes y CRM', icon: UserCheck, roles: ['SUPER_ADMIN', 'ADMIN_CAMPANA', 'COORDINADOR', 'LIDER', 'TESTIGO'] },
    { id: 'users', label: 'Usuarios y Roles', icon: Users, roles: ['SUPER_ADMIN', 'ADMIN_CAMPANA', 'COORDINADOR', 'LIDER'] },
    { id: 'events', label: 'Agenda y Eventos', icon: CalendarDays, roles: ['SUPER_ADMIN', 'ADMIN_CAMPANA', 'COORDINADOR', 'LIDER', 'VOLUNTARIO', 'TESTIGO'] },
  ];

  const handleSelect = (tab: string) => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <>
      {/* Overlay móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`w-64 bg-white border-r border-line flex flex-col h-screen fixed md:sticky top-0 left-0 z-50 transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
      {/* Brand Header */}
      <div className="p-5 border-b border-line flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center shadow-md">
          <Vote className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="font-heading font-bold text-lg text-navy leading-tight">REDTER</h1>
          <p className="text-xs text-gray-500 font-medium tracking-wide">Gestión Territorial</p>
        </div>
        <button onClick={onClose} className="md:hidden text-gray-400 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* User Info Card */}
      <div className="p-4 mx-3 my-4 rounded-xl bg-surface-subtle border border-line">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-full bg-line flex items-center justify-center font-bold text-navy border border-line-strong">
            {user?.nombre?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-gray-800 truncate">{user?.nombre}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <div className={`mt-2 text-[11px] px-2.5 py-1 rounded-md border font-medium inline-block ${badge.color}`}>
          {badge.label}
        </div>
        {user?.municipioAsignado && (
          <p className="text-[11px] text-gray-500 mt-2 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-navy inline" /> {user.municipioAsignado}
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
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-navy text-white shadow-md'
                    : 'text-gray-500 hover:text-navy hover:bg-surface-subtle'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                {item.label}
              </button>
            );
          })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-line">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 border border-red-200 transition"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </button>
      </div>
      </aside>
    </>
  );
};
