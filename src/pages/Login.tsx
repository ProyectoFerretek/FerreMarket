import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Shield, ArrowRight, Building2 } from 'lucide-react';
import { UserAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cargarPermisosTrabajador } from '../utils/auth';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { signInUser } = UserAuth();
  const Nav = useNavigate();

  // Simulación de bloqueo temporal
  useEffect(() => {
    if (isBlocked && blockTimeRemaining > 0) {
      const timer = setTimeout(() => {
        setBlockTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (blockTimeRemaining === 0 && isBlocked) {
      setIsBlocked(false);
      setLoginAttempts(0);
    }
  }, [isBlocked, blockTimeRemaining]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'El email es obligatorio';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Formato de email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } 

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const MAX_LOGIN_ATTEMPTS = 3;
  const BLOCK_DURATION_SECONDS = 300;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isBlocked) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const { session, error } = await signInUser(formData.email, formData.password);
      
      if (error) {
        handleLoginError();
      } else {
        resetLoginAttempts();
        cargarPermisosTrabajador();
        
        await new Promise(resolve => setTimeout(resolve, 800));
        Nav('/');
      }
    } catch (error) {
      console.error('Error durante el login:', error);
      handleLoginError();
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginError = () => {
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);

    if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
      blockUser();
    } else {
      showRemainingAttempts(newAttempts);
    }
  };

  const blockUser = () => {
    setIsBlocked(true);
    setBlockTimeRemaining(BLOCK_DURATION_SECONDS);
    setErrors({ 
      general: 'Demasiados intentos fallidos. Cuenta bloqueada temporalmente.' 
    });
  };

  const showRemainingAttempts = (attempts: number) => {
    const remainingAttempts = MAX_LOGIN_ATTEMPTS - attempts;
    setErrors({
      general: `Credenciales incorrectas. Intentos restantes: ${remainingAttempts}`
    });
  };

  const resetLoginAttempts = () => {
    setLoginAttempts(0);
    setErrors({});
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getFieldError = (fieldName: string) => {
    return errors[fieldName];
  };

  const isFieldValid = (fieldName: string) => {
    return formData[fieldName as keyof typeof formData] && !getFieldError(fieldName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Building2 size={32} className="text-white" />
              </div>
            </div>
            <div className="flex items-center justify-center mb-4">
              <div className="text-2xl font-bold text-orange-600 mr-1">Ferre</div>
              <div className="text-2xl font-bold text-blue-900">Market</div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Panel de Administración</h2>
            <p className="text-gray-600">Accede a tu cuenta corporativa</p>
          </div>

          {/* Error general */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center">
                <AlertCircle size={20} className="text-red-600 mr-2" />
                <span className="text-red-700 text-sm">{errors.general}</span>
              </div>
            </div>
          )}

          {/* Bloqueo temporal */}
          {isBlocked && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="flex items-center">
                <Shield size={20} className="text-yellow-600 mr-2" />
                <div>
                  <p className="text-yellow-700 text-sm font-medium">Cuenta bloqueada temporalmente</p>
                  <p className="text-yellow-600 text-xs">
                    Tiempo restante: {formatTime(blockTimeRemaining)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Corporativo
              </label>
              <div className="relative">
                <Mail size={20} className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                  focusedField === 'email' ? 'text-blue-500' : 'text-gray-400'
                }`} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white ${
                    getFieldError('email') ? 'border-red-300 bg-red-50' : 
                    isFieldValid('email') ? 'border-green-300 bg-green-50' : 'border-gray-300'
                  }`}
                  placeholder="admin@ferremarket.com"
                  disabled={isBlocked}
                  autoComplete="email"
                  aria-describedby={getFieldError('email') ? 'email-error' : undefined}
                />
              </div>
              {getFieldError('email') && (
                <p id="email-error" className="mt-2 text-sm text-red-600 flex items-center" role="alert">
                  <AlertCircle size={16} className="mr-1" />
                  {getFieldError('email')}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock size={20} className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                  focusedField === 'password' ? 'text-blue-500' : 'text-gray-400'
                }`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white ${
                    getFieldError('password') ? 'border-red-300 bg-red-50' : 
                    isFieldValid('password') ? 'border-green-300 bg-green-50' : 'border-gray-300'
                  }`}
                  placeholder="Admin123!"
                  disabled={isBlocked}
                  autoComplete="current-password"
                  aria-describedby={getFieldError('password') ? 'password-error' : 'password-requirements'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isBlocked}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {getFieldError('password') && (
                <p id="password-error" className="mt-2 text-sm text-red-600 flex items-center" role="alert">
                  <AlertCircle size={16} className="mr-1" />
                  {getFieldError('password')}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isBlocked}
              className="w-full bg-orange-500 text-white py-3 px-4 rounded-xl hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Iniciar Sesión
                  <ArrowRight size={20} className="ml-2" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>© 2025 FerreMarket. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;