import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Eye, EyeOff, User, Mail, Lock, Shield, Calendar } from 'lucide-react';
import { Usuario, UsuarioFormData } from '../../types';

interface UsuarioModalProps {
  usuario?: Usuario;
  onClose: () => void;
  onSave: (usuario: UsuarioFormData) => void;
}

const UsuarioModal: React.FC<UsuarioModalProps> = ({ usuario, onClose, onSave }) => {
  const [formData, setFormData] = useState<UsuarioFormData>({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    rol: 'usuario',
    estado: 'activo'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre,
        email: usuario.email,
        password: '',
        confirmPassword: '',
        rol: usuario.rol,
        estado: usuario.estado
      });
    }
  }, [usuario]);

  const validarEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validarPassword = (password: string): { isValid: boolean; errors: string[] } => {
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

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    } else if (formData.nombre.trim().length < 2) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar email
    if (!formData.email.trim()) {
      nuevosErrores.email = 'El email es obligatorio';
    } else if (!validarEmail(formData.email)) {
      nuevosErrores.email = 'Formato de email inválido';
    }

    // Validar contraseña (solo para usuarios nuevos o si se está cambiando)
    if (!usuario || formData.password) {
      if (!formData.password) {
        nuevosErrores.password = 'La contraseña es obligatoria';
      } else {
        const passwordValidation = validarPassword(formData.password);
        if (!passwordValidation.isValid) {
          nuevosErrores.password = passwordValidation.errors.join(', ');
        }
      }

      // Validar confirmación de contraseña
      if (formData.password !== formData.confirmPassword) {
        nuevosErrores.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSave(formData);
      onClose();
    } catch (error) {
      setErrors({ general: 'Error al guardar el usuario. Inténtalo de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldError = (fieldName: string) => {
    return errors[fieldName];
  };

  const isFieldValid = (fieldName: string) => {
    const value = formData[fieldName as keyof UsuarioFormData];
    return value && !getFieldError(fieldName);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <User size={24} className="mr-3 text-blue-600" />
            {usuario ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Error general */}
        {errors.general && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle size={20} className="text-red-600 mr-2" />
              <span className="text-red-700 text-sm">{errors.general}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              Información Básica
            </h3>

            {/* Nombre completo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo
              </label>
              <div className="relative">
                <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    getFieldError('nombre') ? 'border-red-300 bg-red-50' : 
                    isFieldValid('nombre') ? 'border-green-300 bg-green-50' : 'border-gray-300'
                  }`}
                  placeholder="Ingresa el nombre completo"
                />
              </div>
              {getFieldError('nombre') && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle size={16} className="mr-1" />
                  {getFieldError('nombre')}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Corporativo
              </label>
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    getFieldError('email') ? 'border-red-300 bg-red-50' : 
                    isFieldValid('email') ? 'border-green-300 bg-green-50' : 'border-gray-300'
                  }`}
                  placeholder="usuario@ferremarket.com"
                />
              </div>
              {getFieldError('email') && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle size={16} className="mr-1" />
                  {getFieldError('email')}
                </p>
              )}
            </div>
          </div>

          {/* Seguridad */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              Seguridad
            </h3>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {usuario ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    getFieldError('password') ? 'border-red-300 bg-red-50' : 
                    isFieldValid('password') ? 'border-green-300 bg-green-50' : 'border-gray-300'
                  }`}
                  placeholder={usuario ? 'Dejar vacío para mantener actual' : 'Mínimo 8 caracteres'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {getFieldError('password') && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle size={16} className="mr-1" />
                  {getFieldError('password')}
                </p>
              )}
              <div className="mt-2 text-xs text-gray-500">
                <p>Requisitos: 8+ caracteres, mayúscula, minúscula, número y carácter especial</p>
              </div>
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    getFieldError('confirmPassword') ? 'border-red-300 bg-red-50' : 
                    formData.password && formData.confirmPassword && formData.password === formData.confirmPassword ? 'border-green-300 bg-green-50' : 'border-gray-300'
                  }`}
                  placeholder="Confirma la contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {getFieldError('confirmPassword') && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle size={16} className="mr-1" />
                  {getFieldError('confirmPassword')}
                </p>
              )}
            </div>
          </div>

          {/* Permisos y Estado */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              Permisos y Estado
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Rol */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rol del Usuario
                </label>
                <div className="relative">
                  <Shield size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={formData.rol}
                    onChange={(e) => setFormData(prev => ({ ...prev, rol: e.target.value as 'admin' | 'usuario' }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="usuario">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {formData.rol === 'admin' ? 
                    'Acceso completo al sistema y gestión de usuarios' : 
                    'Acceso limitado a funciones básicas del sistema'
                  }
                </div>
              </div>

              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="activo"
                      checked={formData.estado === 'activo'}
                      onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value as 'activo' | 'inactivo' }))}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Activo</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="inactivo"
                      checked={formData.estado === 'inactivo'}
                      onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value as 'activo' | 'inactivo' }))}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Inactivo</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Información adicional para edición */}
          {usuario && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <Calendar size={16} className="mr-2" />
                Información del Usuario
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Fecha de creación:</span>
                  <div className="font-medium text-gray-900">
                    {new Date(usuario.fechaCreacion).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Último acceso:</span>
                  <div className="font-medium text-gray-900">
                    {usuario.ultimoAcceso ? 
                      new Date(usuario.ultimoAcceso).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 
                      'Nunca'
                    }
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Guardando...
                </>
              ) : (
                <>
                  {usuario ? 'Guardar Cambios' : 'Crear Usuario'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsuarioModal;