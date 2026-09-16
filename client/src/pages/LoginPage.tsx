import React, { useState } from 'react';
import { Vote, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('redter123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error de conexión. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setError('');
    setLoading(true);
    try {
      await login(demoEmail, 'redter123');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error con usuario de prueba');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-cyan-400 shadow-xl shadow-sky-500/25 mb-4">
            <Vote className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-heading font-extrabold text-3xl text-white tracking-tight">SIGE Electoral</h1>
          <p className="text-sm text-sky-400 font-semibold tracking-wider mt-1">REDTER INTELIGENCIA</p>
          <p className="text-xs text-slate-400 mt-2">Gestión Electoral y CRM Político para Colombia</p>
        </div>

        {/* Login Form Card */}
        <div className="glass-panel p-8 rounded-2xl shadow-2xl border border-slate-800">
          <h2 className="text-lg font-semibold text-white mb-6">Iniciar Sesión</h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Correo Electrónico</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@redter.co"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Contraseña</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-sky-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Ingresando...' : 'Ingresar a SIGE Electoral'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Roles */}
          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <p className="text-xs text-slate-400 font-medium mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-400" /> Ingreso Rápido por Rol (Demostración):
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleDemoLogin('admin@redter.co')}
                className="p-2.5 bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/60 rounded-lg text-slate-200 text-left font-medium transition"
              >
                👑 Admin Campaña
              </button>
              <button
                onClick={() => handleDemoLogin('coord.bogota@redter.co')}
                className="p-2.5 bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/60 rounded-lg text-slate-200 text-left font-medium transition"
              >
                🗺️ Coordinador Zonal
              </button>
              <button
                onClick={() => handleDemoLogin('lider.usaquen@redter.co')}
                className="p-2.5 bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/60 rounded-lg text-slate-200 text-left font-medium transition"
              >
                🙋‍♂️ Líder Electoral
              </button>
              <button
                onClick={() => handleDemoLogin('testigo.mesa1@redter.co')}
                className="p-2.5 bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/60 rounded-lg text-slate-200 text-left font-medium transition"
              >
                📋 Testigo de Mesa
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          © 2026 Redter Inteligencia — SIGE Electoral Colombia
        </p>
      </div>
    </div>
  );
};
