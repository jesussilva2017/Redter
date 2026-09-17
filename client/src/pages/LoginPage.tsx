import React, { useState } from 'react';
import { Vote, Lock, IdCard, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DEMO_ACCOUNTS = [
  { cedula: '1018234567', label: '👑 Admin Campaña' },
  { cedula: '52890123', label: '🗺️ Coordinador Zonal' },
  { cedula: '79876543', label: '🙋‍♂️ Líder Electoral' },
  { cedula: '1020304050', label: '📋 Testigo de Mesa' },
];

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(cedula, password);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error de conexión. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoCedula: string) => {
    setCedula(demoCedula);
    setPassword('redter123');
    setError('');
    setLoading(true);
    try {
      await login(demoCedula, 'redter123');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error con usuario de prueba');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-subtle flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-navy shadow-lg mb-4">
            <Vote className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-heading font-extrabold text-3xl text-navy tracking-tight">REDTER</h1>
          <p className="text-xs text-gray-500 mt-2">Gestión Territorial y Relacionamiento Comunitario</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-line">
          <h2 className="text-lg font-semibold text-navy mb-6">Iniciar Sesión</h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Cédula</label>
              <div className="relative">
                <IdCard className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  placeholder="1018234567"
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-line-strong rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Contraseña</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-line-strong rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-navy hover:bg-navy-light text-white font-semibold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Roles */}
          <div className="mt-8 pt-6 border-t border-line">
            <p className="text-xs text-gray-500 font-medium mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-navy" /> Ingreso rápido por rol (demostración):
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.cedula}
                  type="button"
                  onClick={() => handleDemoLogin(acc.cedula)}
                  className="p-2.5 bg-surface-subtle hover:bg-line border border-line rounded-lg text-gray-700 text-left font-medium transition"
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 REDTER — DevSoluciones
        </p>
      </div>
    </div>
  );
};
