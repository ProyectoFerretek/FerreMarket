import React, { useState, useEffect } from 'react';
import { X, AlertCircle, User, Building2, Mail, Phone, MapPin, StickyNote, CheckCircle } from 'lucide-react';
import { agregarCliente } from '../../data/mockData';
import { Cliente } from '../../types';

interface ClienteModalProps {
  cliente?: any;
  onClose: () => void;
}

const ClienteModal: React.FC<ClienteModalProps> = ({ cliente, onClose }) => {
  const [tipoCliente, setTipoCliente] = useState<'individual' | 'empresa'>('individual');
  const [formData, setFormData] = useState({
    // Campos comunes
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    estado: 'activo' as 'activo' | 'inactivo',
    notas: '',
    
    // Campos específicos individual
    apellidos: '',
    run: '', // ROL UNICO NACIONAL (RUT)
    
    // Campos específicos empresa
    razonSocial: '',
    rut: '', // ROL UNICO TRIBUTARIO (RUC)
    nombreComercial: '',
    giro: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    if (cliente) {
      setTipoCliente(cliente.tipoCliente || 'individual');
      setFormData({
        nombre: cliente.nombre || '',
        email: cliente.email || '',
        telefono: cliente.telefono || '',
        direccion: cliente.direccion || '',
        estado: cliente.estado || 'activo',
        notas: cliente.notas || '',
        
        // Individual
        apellidos: cliente.apellidos || '',
        run: cliente.run || cliente.identificacion || '',
        
        // Empresa
        razonSocial: cliente.razonSocial || '',
        rut: cliente.rut || cliente.identificacion || '',
        nombreComercial: cliente.nombreComercial || '',
        giro: cliente.giro || '',
      });
    }
  }, [cliente]);

  const validarFormulario = () => {
    const nuevosErrores: Record<string, string> = {};
    
    // Validaciones comunes
    if (!formData.email.trim()) {
      nuevosErrores.email = 'El email es obligatorio';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        nuevosErrores.email = 'Formato de email inválido';
      }
    }

    if (!formData.telefono.trim()) {
      nuevosErrores.telefono = 'El teléfono es obligatorio';
    } else {
      const telefonoRegex = /^[\+]?[\d\s\-\(\)]{9,}$/;
      if (!telefonoRegex.test(formData.telefono)) {
        nuevosErrores.telefono = 'Formato de teléfono inválido';
      }
    }
    // Validaciones específicas por tipo
    if (tipoCliente === 'individual') {
      if (!formData.nombre.trim()) {
        nuevosErrores.nombre = 'El nombre es obligatorio';
      }
      
      if (!formData.apellidos.trim()) {
        nuevosErrores.apellidos = 'Los apellidos son obligatorios';
      }

      if (!formData.run.trim()) {
        nuevosErrores.run = 'El RUN es obligatorio';
      } else {
        const runRegex = /^\d{7,8}-[\dkK]$/;
        if (!runRegex.test(formData.run)) {
          nuevosErrores.run = 'El RUN debe tener entre 7 y 8 dígitos seguido de un guion y un dígito verificador (puede ser K)';
        }
      }

    } else {
      if (!formData.razonSocial.trim()) {
        nuevosErrores.razonSocial = 'La razón social es obligatoria';
      }

      if (!formData.rut.trim()) {
        nuevosErrores.rut = 'El RUT es obligatorio';
      } else {
        const rutRegex = /^\d{11}$/;
        if (!rutRegex.test(formData.rut)) {
          nuevosErrores.rut = 'El RUT debe tener 11 dígitos';
        }
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
      
      const clientData: Cliente = {
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        direccion: formData.direccion || 'Sin dirección registrada.',
        estado: formData.estado as 'activo' | 'inactivo',
        notas: formData.notas,
        tipoCliente,
      }

      if (tipoCliente === 'individual') {
        clientData['run'] = formData.run;
        clientData['apellidos'] = formData.apellidos;
      } else if (tipoCliente === 'empresa') {
        clientData['razonSocial'] = formData.razonSocial;
        clientData['rut'] = formData.rut;
        clientData['nombreComercial'] = formData.nombreComercial || 'Sin nombre comercial';
        clientData['giro'] = formData.giro || 'Sin giro registrado';
      }

      if (cliente) {
        // LOGICA PARA ACTUALIZAR EL CLIENTE
        console.log('Actualizando cliente:', cliente.id, clientData);
      } else {
        await agregarCliente(tipoCliente, clientData);
      }

      onClose();
    } catch (error) {
      setErrors({ general: 'Error al guardar el cliente. Inténtalo de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldError = (fieldName: string) => {
    return errors[fieldName];
  };

  const isFieldValid = (fieldName: string) => {
    const value = formData[fieldName as keyof typeof formData];
    return value && !getFieldError(fieldName);
  };

  return (
    <div className="mt-0 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-2 sm:p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl h-[95vh] sm:h-[90vh] flex flex-col shadow-2xl">
        {/* Header del Modal */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 bg-gray-50 rounded-t-xl flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white bg-orange-500`}>
              {tipoCliente === 'empresa' ? <Building2 size={20} /> : <User size={20} />}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                {cliente ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h2>
              <p className="text-sm text-gray-600">
                {tipoCliente === 'empresa' ? 'Cliente Empresarial' : 'Cliente Individual'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Selector de Tipo de Cliente */}
        <div className="p-4 sm:p-6 border-b border-gray-200 bg-white flex-shrink-0">
          <div className="flex items-center justify-center">
            <div className="bg-gray-100 rounded-xl p-1 flex">
              <button
                type="button"
                onClick={() => setTipoCliente('individual')}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  tipoCliente === 'individual'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <User size={16} className="mr-2" />
                Cliente Individual
              </button>
              <button
                type="button"
                onClick={() => setTipoCliente('empresa')}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  tipoCliente === 'empresa'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Building2 size={16} className="mr-2" />
                Cliente Empresarial
              </button>
            </div>
          </div>
        </div>

        {/* Error general */}
        {errors.general && (
          <div className="mx-4 sm:mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex-shrink-0">
            <div className="flex items-center">
              <AlertCircle size={20} className="text-red-600 mr-2" />
              <span className="text-red-700 text-sm">{errors.general}</span>
            </div>
          </div>
        )}

        {/* Formulario con Scroll - Área principal que crece */}
        <div className="flex-1 overflow-y-auto">
          <form className="p-4 sm:p-6 space-y-6">
            
            {/* Información Básica */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 flex items-center">
                <User size={20} className="mr-2 text-blue-600" />
                Información Básica
              </h3>

              {tipoCliente === 'individual' ? (
                // Campos para Cliente Individual
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombres *
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        getFieldError('nombre') ? 'border-red-300 bg-red-50' : 
                        isFieldValid('nombre') ? 'border-green-300 bg-green-50' : 'border-gray-300'
                      }`}
                      placeholder="Ingresa los nombres"
                    />
                    {getFieldError('nombre') && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {getFieldError('nombre')}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellidos *
                    </label>
                    <input
                      type="text"
                      value={formData.apellidos}
                      onChange={(e) => setFormData(prev => ({ ...prev, apellidos: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        getFieldError('apellidos') ? 'border-red-300 bg-red-50' : 
                        isFieldValid('apellidos') ? 'border-green-300 bg-green-50' : 'border-gray-300'
                      }`}
                      placeholder="Ingresa los apellidos"
                    />
                    {getFieldError('apellidos') && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {getFieldError('apellidos')}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      RUN *
                    </label>
                    <input
                      type="text"
                      value={formData.run}
                      onChange={(e) => setFormData(prev => ({ ...prev, run: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        getFieldError('run') ? 'border-red-300 bg-red-50' : 
                        isFieldValid('run') ? 'border-green-300 bg-green-50' : 'border-gray-300'
                      }`}
                      placeholder=""
                      maxLength={10}
                    />
                    {getFieldError('run') && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {getFieldError('run')}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                // Campos para Cliente Empresarial
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Razón Social (Nombre Legal) *
                    </label>
                    <input
                      type="text"
                      value={formData.razonSocial}
                      onChange={(e) => setFormData(prev => ({ ...prev, razonSocial: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                        getFieldError('razonSocial') ? 'border-red-300 bg-red-50' : 
                        isFieldValid('razonSocial') ? 'border-green-300 bg-green-50' : 'border-gray-300'
                      }`}
                      placeholder="Empresa S.A.C."
                    />
                    {getFieldError('razonSocial') && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {getFieldError('razonSocial')}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      RUT *
                    </label>
                    <input
                      type="text"
                      value={formData.rut}
                      onChange={(e) => setFormData(prev => ({ ...prev, rut: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                        getFieldError('rut') ? 'border-red-300 bg-red-50' : 
                        isFieldValid('rut') ? 'border-green-300 bg-green-50' : 'border-gray-300'
                      }`}
                      placeholder="12345678901"
                      maxLength={11}
                    />
                    {getFieldError('rut') && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {getFieldError('rut')}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Comercial
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData(prev => ({ ...prev, nombreComercial: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Nombre comercial de la empresa"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giro del Negocio
                    </label>
                    <input
                      type="text"
                      value={formData.giro}
                      onChange={(e) => setFormData(prev => ({ ...prev, giro: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Construcción, Comercio, etc."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Información de Contacto */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 flex items-center">
                <Mail size={20} className="mr-2 text-green-600" />
                Información de Contacto
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        getFieldError('email') ? 'border-red-300 bg-red-50' : 
                        isFieldValid('email') ? 'border-green-300 bg-green-50' : 'border-gray-300'
                      }`}
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                  {getFieldError('email') && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {getFieldError('email')}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        getFieldError('telefono') ? 'border-red-300 bg-red-50' : 
                        isFieldValid('telefono') ? 'border-green-300 bg-green-50' : 'border-gray-300'
                      }`}
                      placeholder="+56"
                    />
                  </div>
                  {getFieldError('telefono') && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {getFieldError('telefono')}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección
                  </label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-3 text-gray-400" />
                    <textarea
                      value={formData.direccion}
                      onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
                      rows={2}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                        getFieldError('direccion') ? 'border-red-300 bg-red-50' : 
                        isFieldValid('direccion') ? 'border-green-300 bg-green-50' : 'border-gray-300'
                      }`}
                      placeholder="Dirección completa del cliente"
                    />
                  </div>
                  {getFieldError('direccion') && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {getFieldError('direccion')}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Estado y Notas */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 flex items-center">
                <StickyNote size={20} className="mr-2 text-orange-600" />
                Estado y Observaciones
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado del Cliente
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="activo"
                        checked={formData.estado === 'activo'}
                        onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value as 'activo' | 'inactivo' }))}
                        className="form-radio h-4 w-4 text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 flex items-center">
                        <CheckCircle size={16} className="text-green-500 mr-1" />
                        Activo
                      </span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="inactivo"
                        checked={formData.estado === 'inactivo'}
                        onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value as 'activo' | 'inactivo' }))}
                        className="form-radio h-4 w-4 text-red-600 focus:ring-red-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 flex items-center">
                        <X size={16} className="text-red-500 mr-1" />
                        Inactivo
                      </span>
                    </label>
                  </div>
                </div>

                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas Adicionales
                  </label>
                  <textarea
                    value={formData.notas}
                    onChange={(e) => setFormData(prev => ({ ...prev, notas: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Observaciones, preferencias, historial, etc."
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer con Botones - Posición fija en la parte inferior */}
        <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-200 rounded-b-xl flex-shrink-0">
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full sm:w-auto px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors flex items-center justify-center bg-orange-500 hover:bg-amber-700 focus:ring-amber-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Guardando...
                </>
              ) : (
                <>
                  {cliente ? 'Guardar Cambios' : 'Crear Cliente'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClienteModal;