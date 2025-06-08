import React, { useState, useEffect } from 'react';
import { 
  X, AlertCircle, Tag, Percent, DollarSign, Calendar, 
  Users, ShoppingCart, Package, Gift, Clock, Target,
  CheckCircle, Settings, Zap, Globe, Save, Copy
} from 'lucide-react';
import { productos, categorias, clientes } from '../../data/mockData';
import { formatPrecio } from '../../utils/formatters';

interface PromocionModalProps {
  promocion?: any;
  onClose: () => void;
  onSave: (promocion: any) => void;
}

const PromocionModal: React.FC<PromocionModalProps> = ({ promocion, onClose, onSave }) => {
  const [paso, setPaso] = useState(1);
  const [formData, setFormData] = useState({
    // Información básica
    nombre: '',
    descripcion: '',
    codigo: '',
    tipo: 'porcentaje', // porcentaje, monto_fijo, envio_gratis
    valor: 0,
    valorMaximo: 0,
    montoMinimo: 0,
    
    // Configuración temporal
    fechaInicio: '',
    horaInicio: '00:00',
    fechaFin: '',
    horaFin: '23:59',
    zonaHoraria: 'America/Lima',
    limiteTotalUsos: 0,
    limiteUsosPorCliente: 1,
    
    // Condiciones específicas
    aplicaA: 'toda_tienda', // toda_tienda, productos, categorias
    productosIncluidos: [] as string[],
    productosExcluidos: [] as string[],
    categoriasIncluidas: [] as string[],
    categoriasExcluidas: [] as string[],
    tipoCliente: 'todos', // todos, nuevo, existente
    combinable: false,
    
    // Estado
    estado: 'borrador' // borrador, activo, pausado
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [codigoGenerado, setCodigoGenerado] = useState(false);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    if (promocion) {
      const fechaInicio = new Date(promocion.fechaInicio);
      const fechaFin = new Date(promocion.fechaFin);
      
      setFormData({
        nombre: promocion.nombre || '',
        descripcion: promocion.descripcion || '',
        codigo: promocion.codigo || '',
        tipo: promocion.tipo || 'porcentaje',
        valor: promocion.valor || 0,
        valorMaximo: promocion.valorMaximo || 0,
        montoMinimo: promocion.montoMinimo || 0,
        
        fechaInicio: fechaInicio.toISOString().split('T')[0],
        horaInicio: fechaInicio.toTimeString().slice(0, 5),
        fechaFin: fechaFin.toISOString().split('T')[0],
        horaFin: fechaFin.toTimeString().slice(0, 5),
        zonaHoraria: 'America/Lima',
        limiteTotalUsos: promocion.limiteTotalUsos || 0,
        limiteUsosPorCliente: promocion.limiteUsosPorCliente || 1,
        
        aplicaA: promocion.aplicaA || 'toda_tienda',
        productosIncluidos: promocion.productosIncluidos || [],
        productosExcluidos: promocion.productosExcluidos || [],
        categoriasIncluidas: promocion.categoriasIncluidas || [],
        categoriasExcluidas: promocion.categoriasExcluidas || [],
        tipoCliente: promocion.tipoCliente || 'todos',
        combinable: promocion.combinable || false,
        
        estado: promocion.estado || 'borrador'
      });
    } else {
      // Valores por defecto para nueva promoción
      const hoy = new Date();
      const enUnMes = new Date();
      enUnMes.setMonth(enUnMes.getMonth() + 1);
      
      setFormData(prev => ({
        ...prev,
        fechaInicio: hoy.toISOString().split('T')[0],
        fechaFin: enUnMes.toISOString().split('T')[0]
      }));
    }
  }, [promocion]);

  const generarCodigo = () => {
    const prefijos = ['DESC', 'PROMO', 'OFERTA', 'SAVE'];
    const sufijos = ['2024', 'ESPECIAL', 'VIP', 'FLASH'];
    const numeros = Math.floor(Math.random() * 100);
    
    const prefijo = prefijos[Math.floor(Math.random() * prefijos.length)];
    const sufijo = sufijos[Math.floor(Math.random() * sufijos.length)];
    
    const codigoGenerado = `${prefijo}${numeros}${sufijo}`;
    setFormData(prev => ({ ...prev, codigo: codigoGenerado }));
    setCodigoGenerado(true);
  };

  const validarPaso = (pasoActual: number): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (pasoActual === 1) {
      // Validar información básica
      if (!formData.nombre.trim()) {
        nuevosErrores.nombre = 'El nombre es obligatorio';
      }
      
      if (!formData.codigo.trim()) {
        nuevosErrores.codigo = 'El código es obligatorio';
      } else if (formData.codigo.length < 3) {
        nuevosErrores.codigo = 'El código debe tener al menos 3 caracteres';
      }
      
      if (formData.valor <= 0) {
        nuevosErrores.valor = 'El valor debe ser mayor a 0';
      }
      
      if (formData.tipo === 'porcentaje' && formData.valor > 100) {
        nuevosErrores.valor = 'El porcentaje no puede ser mayor a 100%';
      }
    }
    
    if (pasoActual === 2) {
      // Validar configuración temporal
      if (!formData.fechaInicio) {
        nuevosErrores.fechaInicio = 'La fecha de inicio es obligatoria';
      }
      
      if (!formData.fechaFin) {
        nuevosErrores.fechaFin = 'La fecha de fin es obligatoria';
      }
      
      if (formData.fechaInicio && formData.fechaFin && formData.fechaInicio > formData.fechaFin) {
        nuevosErrores.fechaFin = 'La fecha de fin debe ser posterior a la de inicio';
      }
      
      if (formData.limiteTotalUsos <= 0) {
        nuevosErrores.limiteTotalUsos = 'El límite total debe ser mayor a 0';
      }
      
      if (formData.limiteUsosPorCliente <= 0) {
        nuevosErrores.limiteUsosPorCliente = 'El límite por cliente debe ser mayor a 0';
      }
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSiguiente = () => {
    if (validarPaso(paso)) {
      setPaso(prev => Math.min(prev + 1, 3));
    }
  };

  const handleAnterior = () => {
    setPaso(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validarPaso(3)) {
      return;
    }

    setIsLoading(true);

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const promocionData = {
        ...formData,
        id: promocion ? promocion.id : `PROMO${Date.now()}`,
        fechaCreacion: promocion ? promocion.fechaCreacion : new Date().toISOString(),
        creadoPor: 'Admin',
        usosActuales: promocion ? promocion.usosActuales : 0,
        ingresoGenerado: promocion ? promocion.ingresoGenerado : 0,
        valorPromedioCompra: promocion ? promocion.valorPromedioCompra : 0,
        tasaConversion: promocion ? promocion.tasaConversion : 0
      };
      
      onSave(promocionData);
      onClose();
    } catch (error) {
      setErrors({ general: 'Error al guardar la promoción. Inténtalo de nuevo.' });
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

  // Componente de paso 1: Información básica
  const PasoInformacionBasica = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-4 flex items-center">
          <Tag size={20} className="mr-2 text-blue-600" />
          Información Básica
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Promoción *
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                getFieldError('nombre') ? 'border-red-300 bg-red-50' : 
                isFieldValid('nombre') ? 'border-green-300 bg-green-50' : 'border-gray-300'
              }`}
              placeholder="Ej: Descuento 20% en toda la tienda"
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
              Código de Promoción *
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={formData.codigo}
                onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value.toUpperCase() }))}
                className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  getFieldError('codigo') ? 'border-red-300 bg-red-50' : 
                  isFieldValid('codigo') ? 'border-green-300 bg-green-50' : 'border-gray-300'
                }`}
                placeholder="DESCUENTO20"
              />
              <button
                type="button"
                onClick={generarCodigo}
                className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center"
              >
                <Zap size={16} className="mr-1" />
                Generar
              </button>
            </div>
            {getFieldError('codigo') && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {getFieldError('codigo')}
              </p>
            )}
            {codigoGenerado && (
              <p className="mt-1 text-sm text-green-600 flex items-center">
                <CheckCircle size={14} className="mr-1" />
                Código generado automáticamente
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Descuento *
            </label>
            <select
              value={formData.tipo}
              onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="porcentaje">Porcentaje (%)</option>
              <option value="monto_fijo">Monto fijo ($)</option>
              <option value="envio_gratis">Envío gratis</option>
            </select>
          </div>

          {formData.tipo !== 'envio_gratis' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor del Descuento *
              </label>
              <div className="relative">
                {formData.tipo === 'porcentaje' ? (
                  <Percent size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                ) : (
                  <DollarSign size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                )}
                <input
                  type="number"
                  min="0"
                  max={formData.tipo === 'porcentaje' ? 100 : undefined}
                  step={formData.tipo === 'porcentaje' ? 0.1 : 1}
                  value={formData.valor}
                  onChange={(e) => setFormData(prev => ({ ...prev, valor: parseFloat(e.target.value) || 0 }))}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    getFieldError('valor') ? 'border-red-300 bg-red-50' : 
                    isFieldValid('valor') ? 'border-green-300 bg-green-50' : 'border-gray-300'
                  }`}
                  placeholder={formData.tipo === 'porcentaje' ? '20' : '15000'}
                />
              </div>
              {getFieldError('valor') && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {getFieldError('valor')}
                </p>
              )}
            </div>
          )}

          {formData.tipo === 'porcentaje' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descuento Máximo (opcional)
              </label>
              <div className="relative">
                <DollarSign size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  min="0"
                  value={formData.valorMaximo}
                  onChange={(e) => setFormData(prev => ({ ...prev, valorMaximo: parseFloat(e.target.value) || 0 }))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="50000"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Límite máximo del descuento en pesos
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compra Mínima (opcional)
            </label>
            <div className="relative">
              <DollarSign size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                min="0"
                value={formData.montoMinimo}
                onChange={(e) => setFormData(prev => ({ ...prev, montoMinimo: parseFloat(e.target.value) || 0 }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="100000"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Monto mínimo de compra para aplicar el descuento
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Descripción detallada de la promoción..."
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Componente de paso 2: Configuración temporal
  const PasoConfiguracionTemporal = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-4 flex items-center">
          <Calendar size={20} className="mr-2 text-green-600" />
          Configuración Temporal
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Inicio *
            </label>
            <input
              type="date"
              value={formData.fechaInicio}
              onChange={(e) => setFormData(prev => ({ ...prev, fechaInicio: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                getFieldError('fechaInicio') ? 'border-red-300 bg-red-50' : 
                isFieldValid('fechaInicio') ? 'border-green-300 bg-green-50' : 'border-gray-300'
              }`}
            />
            {getFieldError('fechaInicio') && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {getFieldError('fechaInicio')}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hora de Inicio
            </label>
            <input
              type="time"
              value={formData.horaInicio}
              onChange={(e) => setFormData(prev => ({ ...prev, horaInicio: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Fin *
            </label>
            <input
              type="date"
              value={formData.fechaFin}
              onChange={(e) => setFormData(prev => ({ ...prev, fechaFin: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                getFieldError('fechaFin') ? 'border-red-300 bg-red-50' : 
                isFieldValid('fechaFin') ? 'border-green-300 bg-green-50' : 'border-gray-300'
              }`}
            />
            {getFieldError('fechaFin') && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {getFieldError('fechaFin')}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hora de Fin
            </label>
            <input
              type="time"
              value={formData.horaFin}
              onChange={(e) => setFormData(prev => ({ ...prev, horaFin: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zona Horaria
            </label>
            <select
              value={formData.zonaHoraria}
              onChange={(e) => setFormData(prev => ({ ...prev, zonaHoraria: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="America/Lima">Lima (UTC-5)</option>
              <option value="America/Santiago">Santiago (UTC-3)</option>
              <option value="America/Buenos_Aires">Buenos Aires (UTC-3)</option>
              <option value="America/Mexico_City">Ciudad de México (UTC-6)</option>
              <option value="America/New_York">Nueva York (UTC-5)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Límite Total de Usos *
            </label>
            <input
              type="number"
              min="1"
              value={formData.limiteTotalUsos}
              onChange={(e) => setFormData(prev => ({ ...prev, limiteTotalUsos: parseInt(e.target.value) || 0 }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                getFieldError('limiteTotalUsos') ? 'border-red-300 bg-red-50' : 
                isFieldValid('limiteTotalUsos') ? 'border-green-300 bg-green-50' : 'border-gray-300'
              }`}
              placeholder="1000"
            />
            {getFieldError('limiteTotalUsos') && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {getFieldError('limiteTotalUsos')}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Límite por Cliente *
            </label>
            <input
              type="number"
              min="1"
              value={formData.limiteUsosPorCliente}
              onChange={(e) => setFormData(prev => ({ ...prev, limiteUsosPorCliente: parseInt(e.target.value) || 0 }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                getFieldError('limiteUsosPorCliente') ? 'border-red-300 bg-red-50' : 
                isFieldValid('limiteUsosPorCliente') ? 'border-green-300 bg-green-50' : 'border-gray-300'
              }`}
              placeholder="5"
            />
            {getFieldError('limiteUsosPorCliente') && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {getFieldError('limiteUsosPorCliente')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Componente de paso 3: Condiciones específicas
  const PasoCondicionesEspecificas = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-4 flex items-center">
          <Settings size={20} className="mr-2 text-purple-600" />
          Condiciones Específicas
        </h3>

        <div className="space-y-6">
          {/* Aplicación del descuento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Aplicar Descuento A:
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="toda_tienda"
                  checked={formData.aplicaA === 'toda_tienda'}
                  onChange={(e) => setFormData(prev => ({ ...prev, aplicaA: e.target.value }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 flex items-center">
                  <Globe size={16} className="mr-2 text-blue-600" />
                  Toda la tienda
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="productos"
                  checked={formData.aplicaA === 'productos'}
                  onChange={(e) => setFormData(prev => ({ ...prev, aplicaA: e.target.value }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 flex items-center">
                  <Package size={16} className="mr-2 text-green-600" />
                  Productos específicos
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="categorias"
                  checked={formData.aplicaA === 'categorias'}
                  onChange={(e) => setFormData(prev => ({ ...prev, aplicaA: e.target.value }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 flex items-center">
                  <Tag size={16} className="mr-2 text-purple-600" />
                  Categorías específicas
                </span>
              </label>
            </div>
          </div>

          {/* Selección de productos/categorías */}
          {formData.aplicaA === 'productos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Productos Incluidos
                </label>
                <select
                  multiple
                  value={formData.productosIncluidos}
                  onChange={(e) => {
                    const valores = Array.from(e.target.selectedOptions, option => option.value);
                    setFormData(prev => ({ ...prev, productosIncluidos: valores }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                >
                  {productos.map(producto => (
                    <option key={producto.id} value={producto.id}>
                      {producto.nombre} - {formatPrecio(producto.precio)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Productos Excluidos
                </label>
                <select
                  multiple
                  value={formData.productosExcluidos}
                  onChange={(e) => {
                    const valores = Array.from(e.target.selectedOptions, option => option.value);
                    setFormData(prev => ({ ...prev, productosExcluidos: valores }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                >
                  {productos.map(producto => (
                    <option key={producto.id} value={producto.id}>
                      {producto.nombre} - {formatPrecio(producto.precio)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {formData.aplicaA === 'categorias' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categorías Incluidas
                </label>
                <select
                  multiple
                  value={formData.categoriasIncluidas}
                  onChange={(e) => {
                    const valores = Array.from(e.target.selectedOptions, option => option.value);
                    setFormData(prev => ({ ...prev, categoriasIncluidas: valores }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                >
                  {categorias.map(categoria => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre} ({categoria.cantidad} productos)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categorías Excluidas
                </label>
                <select
                  multiple
                  value={formData.categoriasExcluidas}
                  onChange={(e) => {
                    const valores = Array.from(e.target.selectedOptions, option => option.value);
                    setFormData(prev => ({ ...prev, categoriasExcluidas: valores }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                >
                  {categorias.map(categoria => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre} ({categoria.cantidad} productos)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Tipo de cliente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de Cliente:
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="todos"
                  checked={formData.tipoCliente === 'todos'}
                  onChange={(e) => setFormData(prev => ({ ...prev, tipoCliente: e.target.value }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Todos los clientes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="nuevo"
                  checked={formData.tipoCliente === 'nuevo'}
                  onChange={(e) => setFormData(prev => ({ ...prev, tipoCliente: e.target.value }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Solo clientes nuevos</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="existente"
                  checked={formData.tipoCliente === 'existente'}
                  onChange={(e) => setFormData(prev => ({ ...prev, tipoCliente: e.target.value }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Solo clientes existentes</span>
              </label>
            </div>
          </div>

          {/* Opciones adicionales */}
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.combinable}
                onChange={(e) => setFormData(prev => ({ ...prev, combinable: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                Permitir combinación con otras promociones
              </label>
            </div>
          </div>

          {/* Estado inicial */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Estado Inicial:
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="borrador"
                  checked={formData.estado === 'borrador'}
                  onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Guardar como borrador</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="activo"
                  checked={formData.estado === 'activo'}
                  onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Activar inmediatamente</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-2 sm:p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl h-[95vh] sm:h-[90vh] flex flex-col shadow-2xl">
        {/* Header del Modal */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-xl flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white">
              <Gift size={20} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                {promocion ? 'Editar Promoción' : 'Nueva Promoción'}
              </h2>
              <p className="text-sm text-gray-600">
                Paso {paso} de 3: {
                  paso === 1 ? 'Información básica' :
                  paso === 2 ? 'Configuración temporal' :
                  'Condiciones específicas'
                }
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

        {/* Indicador de progreso */}
        <div className="px-4 sm:px-6 py-3 bg-white border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center">
            {[1, 2, 3].map((numeroPaso) => (
              <React.Fragment key={numeroPaso}>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  numeroPaso <= paso 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {numeroPaso < paso ? (
                    <CheckCircle size={16} />
                  ) : (
                    numeroPaso
                  )}
                </div>
                {numeroPaso < 3 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    numeroPaso < paso ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
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

        {/* Contenido del formulario con scroll */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6">
            {paso === 1 && <PasoInformacionBasica />}
            {paso === 2 && <PasoConfiguracionTemporal />}
            {paso === 3 && <PasoCondicionesEspecificas />}
          </div>
        </div>

        {/* Footer con botones */}
        <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-200 rounded-b-xl flex-shrink-0">
          <div className="flex justify-between">
            <button
              onClick={handleAnterior}
              disabled={paso === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              
              {paso < 3 ? (
                <button
                  onClick={handleSiguiente}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Siguiente
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      {promocion ? 'Guardar Cambios' : 'Crear Promoción'}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromocionModal;