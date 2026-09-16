import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { VotersPage } from './pages/VotersPage';
import { UsersPage } from './pages/UsersPage';
import { EventsPage } from './pages/EventsPage';
import { Search, Bell, ShieldCheck } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-subtle flex flex-col justify-center items-center text-gray-500 gap-3">
        <div className="w-10 h-10 border-4 border-navy border-t-transparent rounded-full animate-spin"></div>
        <p className="font-heading text-sm tracking-wide">Cargando REDTER...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'voters':
        return <VotersPage />;
      case 'users':
        return <UsersPage />;
      case 'events':
        return <EventsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-surface-subtle text-gray-800 font-sans">
      {/* Sidebar navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="bg-white/90 backdrop-blur-md border-b border-line sticky top-0 z-30 px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-navy" />
            <span>Plataforma de Gestión Territorial y Relacionamiento Comunitario</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-subtle border border-line text-xs font-semibold text-navy">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Operaciones Activas
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

export default App;
