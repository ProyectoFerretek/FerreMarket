import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle, Shield, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [isBlocked, setIsBlocked] = useState(false);
    const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotEmailSent, setForgotEmailSent] = useState(false);

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

    const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
        const errors: string[] = [];

        if (password.length < 8) {
            errors.push('Mínimo 8 caracteres');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Al menos una mayúscula');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Al menos una minúscula');
        }
        if (!/\d/.test(password)) {
            errors.push('Al menos un número');
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push('Al menos un carácter especial');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
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
        } else {
            const passwordValidation = validatePassword(formData.password);
            if (!passwordValidation.isValid) {
                newErrors.password = passwordValidation.errors.join(', ');
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

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
            // Simulación de autenticación
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simulación de fallo para demostrar el sistema de bloqueo
            if (formData.email !== 'admin@ferremarket.com' || formData.password !== 'Admin123!') {
                throw new Error('Credenciales incorrectas');
            }

            // Éxito - redirigir al dashboard
            console.log('Login exitoso:', formData);
            // Aquí iría la redirección: navigate('/dashboard');

        } catch (error) {
            const newAttempts = loginAttempts + 1;
            setLoginAttempts(newAttempts);

            if (newAttempts >= 3) {
                setIsBlocked(true);
                setBlockTimeRemaining(300); // 5 minutos
                setErrors({ general: 'Demasiados intentos fallidos. Cuenta bloqueada temporalmente.' });
            } else {
                setErrors({
                    general: `Credenciales incorrectas. Intentos restantes: ${3 - newAttempts}`
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            // Simulación de Google OAuth
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log('Login con Google exitoso');
            // Aquí iría la integración real con Google OAuth
        } catch (error) {
            setErrors({ general: 'Error al iniciar sesión con Google' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateEmail(forgotEmail)) {
            setErrors({ forgot: 'Formato de email inválido' });
            return;
        }

        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setForgotEmailSent(true);
            setErrors({});
        } catch (error) {
            setErrors({ forgot: 'Error al enviar el email de recuperación' });
        } finally {
            setIsLoading(false);
        }
    };

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    if (showForgotPassword) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <div className="text-center mb-8">
                            <div className="flex items-center justify-center mb-4">
                                <div className="text-3xl font-bold text-orange-600 mr-1">Ferre</div>
                                <div className="text-3xl font-bold text-blue-900">Market</div>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Recuperar Contraseña</h2>
                            <p className="text-gray-600">
                                {forgotEmailSent
                                    ? 'Te hemos enviado un enlace de recuperación'
                                    : 'Ingresa tu email para recuperar tu contraseña'
                                }
                            </p>
                        </div>

                        {forgotEmailSent ? (
                            <div className="text-center space-y-6">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle size={32} className="text-green-600" />
                                </div>
                                <div>
                                    <p className="text-gray-700 mb-4">
                                        Hemos enviado un enlace de recuperación a <strong>{forgotEmail}</strong>
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Revisa tu bandeja de entrada y spam. El enlace expira en 24 horas.
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowForgotPassword(false);
                                        setForgotEmailSent(false);
                                        setForgotEmail('');
                                    }}
                                    className="w-full bg-blue-700 text-white py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors font-medium"
                                >
                                    Volver al Login
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleForgotPassword} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email"
                                            value={forgotEmail}
                                            onChange={(e) => setForgotEmail(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="tu@email.com"
                                            required
                                        />
                                    </div>
                                    {errors.forgot && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center">
                                            <AlertCircle size={16} className="mr-1" />
                                            {errors.forgot}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-blue-700 text-white py-3 px-4 rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Enviar Enlace de Recuperación
                                            <ArrowRight size={20} className="ml-2" />
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setShowForgotPassword(false)}
                                    className="w-full text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    ← Volver al Login
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-4">
                            <div className="text-3xl font-bold text-orange-600 mr-1">Ferre</div>
                            <div className="text-3xl font-bold text-blue-900">Market</div>
                        </div>
                        {/* <h2 className="text-2xl font-bold text-gray-900 mb-2">Iniciar Sesión</h2>
                        <p className="text-gray-600">Accede a tu panel de administración</p> */}
                    </div>

                    {/* Error general */}
                    {errors.general && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center">
                                <AlertCircle size={20} className="text-red-600 mr-2" />
                                <span className="text-red-700 text-sm">{errors.general}</span>
                            </div>
                        </div>
                    )}

                    {/* Bloqueo temporal */}
                    {isBlocked && (
                        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
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

                    {/* Google OAuth Button */}
                    {/* <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading || isBlocked}
                        className="w-full mb-6 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center shadow-sm"
                    >
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        {isLoading ? 'Conectando...' : 'Continuar con Google'}
                    </button> */}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.email ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="admin@ferremarket.com"
                                    disabled={isBlocked}
                                    autoComplete="email"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <AlertCircle size={16} className="mr-1" />
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.password ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="Admin123!"
                                    disabled={isBlocked}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    disabled={isBlocked}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <AlertCircle size={16} className="mr-1" />
                                    {errors.password}
                                </p>
                            )}
                            <div className="mt-2 text-xs text-gray-500">
                                <p>Requisitos: 8+ caracteres, mayúscula, minúscula, número y carácter especial</p>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.rememberMe}
                                    onChange={(e) => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    disabled={isBlocked}
                                />
                                <span className="ml-2 text-sm text-gray-600">Recordar sesión</span>
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowForgotPassword(true)}
                                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                disabled={isBlocked}
                            >
                                ¿Olvidaste tu contraseña?
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || isBlocked}
                            className="w-full bg-blue-700 text-white py-3 px-4 rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center"
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

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center pt-5">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm pt-5">
                            <span className="px-2 bg-white text-gray-500">o continúa con google</span>
                        </div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading || isBlocked}
                        className="w-full mb-6 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center shadow-sm"
                    >
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        {isLoading ? 'Conectando...' : 'Continuar con Google'}
                    </button>


                    {/* Demo Credentials */}
                    {/* <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-700 font-medium mb-2">Credenciales de demostración:</p>
                        <p className="text-xs text-blue-600">Email: admin@ferremarket.com</p>
                        <p className="text-xs text-blue-600">Contraseña: Admin123!</p>
                    </div> */}
                </div>

                {/* Footer */}
                <div className="text-center mt-6 text-sm text-gray-500">
                    <p>© 2025 FerreMarket. Todos los derechos reservados.</p>
                    <div className="mt-2 space-x-4">
                        <a href="#" className="hover:text-gray-700 transition-colors">Términos de Servicio</a>
                        <a href="#" className="hover:text-gray-700 transition-colors">Política de Privacidad</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;