import React, { useState } from 'react';
import { Vote, Lock, IdCard, ArrowRight, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<{ cedula?: boolean; password?: boolean }>({});
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateCedula = (val: string): string => {
    if (!val || val.trim() === '') {
      return 'Por favor ingresa tu número de cédula.';
    }
    if (!/^\d+$/.test(val)) {
      return 'La cédula solo debe contener números.';
    }
    if (val.length < 5) {
      return 'La cédula debe tener al menos 5 dígitos.';
    }
    if (val.length > 12) {
      return 'La cédula no puede superar los 12 dígitos.';
    }
    return '';
  };

  const validatePassword = (val: string): string => {
    if (!val || val.trim() === '') {
      return 'Por favor ingresa tu contraseña.';
    }
    if (val.length < 4) {
      return 'La contraseña debe tener al menos 4 caracteres.';
    }
    return '';
  };

  const cedulaError = (touched.cedula || submitted) ? validateCedula(cedula) : '';
  const passwordError = (touched.password || submitted) ? validatePassword(password) : '';
  const isCedulaValid = cedula.length >= 5 && cedula.length <= 12 && /^\d+$/.test(cedula);

  const handleCedulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Permitir dígitos entre 5 y 12 caracteres
    const rawVal = e.target.value.replace(/\D/g, '').slice(0, 12);
    setCedula(rawVal);
    if (serverError) setServerError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (serverError) setServerError('');
  };

  const handleBlur = (field: 'cedula' | 'password') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setServerError('');

    const cErr = validateCedula(cedula);
    const pErr = validatePassword(password);

    if (cErr || pErr) {
      return;
    }

    setLoading(true);
    try {
      await login(cedula, password);
    } catch (err: any) {
      setServerError(
        err.response?.data?.error || 'Credenciales no válidas o error de conexión. Verifique sus datos.'
      );
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
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-line">
          <h2 className="text-lg font-semibold text-navy mb-6">Iniciar Sesión</h2>

          {/* Alerta de error de servidor / credenciales */}
          {serverError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-start gap-2.5 shadow-sm transition-all animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{serverError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Campo Cédula */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label
                  htmlFor="cedula"
                  className={`block text-xs font-medium transition-colors ${
                    cedulaError ? 'text-red-600' : 'text-gray-700'
                  }`}
                >
                  Cédula
                </label>
                <span
                  className={`text-[11px] font-medium transition-colors ${
                    isCedulaValid
                      ? 'text-emerald-600'
                      : cedula.length > 0
                      ? 'text-amber-600'
                      : 'text-gray-400'
                  }`}
                >
                  {cedula.length} dígitos
                </span>
              </div>

              <div className="relative">
                <IdCard
                  className={`w-4 h-4 absolute left-3 top-3 transition-colors ${
                    cedulaError ? 'text-red-400' : isCedulaValid ? 'text-emerald-500' : 'text-gray-400'
                  }`}
                />
                <input
                  id="cedula"
                  type="text"
                  inputMode="numeric"
                  autoComplete="username"
                  value={cedula}
                  onChange={handleCedulaChange}
                  onBlur={() => handleBlur('cedula')}
                  placeholder="Ej: 1018234567"
                  className={`w-full pl-9 pr-9 py-2.5 bg-white border rounded-xl text-sm transition-all focus:outline-none ${
                    cedulaError
                      ? 'border-red-500 bg-red-50/20 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                      : isCedulaValid
                      ? 'border-emerald-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-gray-800'
                      : 'border-line-strong text-gray-800 placeholder-gray-400 focus:border-navy focus:ring-2 focus:ring-navy/10'
                  }`}
                />
                {isCedulaValid && !cedulaError && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3 top-3 pointer-events-none" />
                )}
              </div>

              {/* Mensaje de alerta para cédula */}
              {cedulaError && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1.5 font-medium transition-all animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{cedulaError}</span>
                </p>
              )}
            </div>

            {/* Campo Contraseña */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label
                  htmlFor="password"
                  className={`block text-xs font-medium transition-colors ${
                    passwordError ? 'text-red-600' : 'text-gray-700'
                  }`}
                >
                  Contraseña
                </label>
              </div>

              <div className="relative">
                <Lock
                  className={`w-4 h-4 absolute left-3 top-3 transition-colors ${
                    passwordError ? 'text-red-400' : 'text-gray-400'
                  }`}
                />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={() => handleBlur('password')}
                  placeholder="••••••••"
                  className={`w-full pl-9 pr-10 py-2.5 bg-white border rounded-xl text-sm transition-all focus:outline-none ${
                    passwordError
                      ? 'border-red-500 bg-red-50/20 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-line-strong text-gray-800 placeholder-gray-400 focus:border-navy focus:ring-2 focus:ring-navy/10'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Mensaje de alerta para contraseña */}
              {passwordError && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1.5 font-medium transition-all animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{passwordError}</span>
                </p>
              )}
            </div>

            {/* Botón Ingresar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 px-4 bg-navy hover:bg-navy-light active:scale-[0.99] text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Validando credenciales...</span>
                </>
              ) : (
                <>
                  <span>Ingresar</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 REDTER — DevSoluciones
        </p>
      </div>
    </div>
  );
};
