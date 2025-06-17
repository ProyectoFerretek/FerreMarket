import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, AlertCircle, Package, Check, Star, DollarSign } from 'lucide-react';
import { Categoria } from '../../types';
import { actualizarProducto, agregarProducto, obtenerProductos } from '../../data/mockData';

interface ProductoModalProps {
  producto?: any;
  onClose: () => void;
  categorias: Categoria[];
}

const ProductoModal: React.FC<ProductoModalProps> = ({ producto, onClose, categorias }) => {
  // Estados del formulario
  const [formData, setFormData] = useState({
    id : '',
    sku: '',
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    stock: '',
    imagen: '',
    estado: true
  });

  // Estados de UI
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagenPreview, setImagenPreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  // Referencias
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Detectar si es móvil
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Bloquear scroll del body y gestionar foco
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // Auto-focus en el primer input
    if (firstInputRef.current) {
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Cargar datos del producto si existe
  useEffect(() => {
    if (producto) {
      const data = {
        id: producto.id || '',
        sku: producto.sku || generateSKU(),
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        precio: producto.precio?.toString() || '',
        categoria: producto.categoria || '',
        stock: producto.stock?.toString() || '',
        imagen: producto.imagen || '',
        estado: producto.destacado || false
      };
      setFormData(data);
      setImagenPreview(producto.imagen || '');
    } else {
      // Generar SKU automático para productos nuevos
      setFormData(prev => ({ ...prev, sku: generateSKU() }));
    }
  }, [producto]);

  // Detectar cambios en el formulario
  useEffect(() => {
    const hasAnyChanges = Object.values(formData).some(value => 
      typeof value === 'string' ? value.trim() !== '' : value !== false
    );
    setHasChanges(hasAnyChanges);
  }, [formData]);

  // Manejar tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Generar SKU único
  const generateSKU = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetters = Array.from({ length: 3 }, () => 
      letters.charAt(Math.floor(Math.random() * letters.length))
    ).join('');
    const randomNumbers = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `SKU-${randomLetters}${randomNumbers}`;
  };

  // Validar SKU único
  const validateSKU = (sku: string) => {
    const skuRegex = /^SKU-[A-Z]{3}\d{4}$/;
    if (!skuRegex.test(sku)) {
      return 'El SKU debe seguir el formato SKU-XXX0000 (SKU-, 3 letras mayúsculas, 4 números)';
    }
    // Aquí podrías verificar si el SKU ya existe en la base de datos
    return null;
  };

  // Validaciones en tiempo real
  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'sku':
        return validateSKU(value);
      case 'nombre':
        if (!value.trim()) return 'El nombre es obligatorio';
        if (value.length < 3) return 'El nombre debe tener al menos 3 caracteres';
        return null;
      case 'descripcion':
        if (!value.trim()) return 'La descripción es obligatoria';
        if (value.length < 10) return 'La descripción debe tener al menos 10 caracteres';
        return null;
      case 'precio':
        if (!value) return 'El precio es obligatorio';
        if (isNaN(Number(value)) || Number(value) <= 0) return 'Ingrese un precio válido mayor a 0';
        return null;
      case 'categoria':
        if (!value) return 'La categoría es obligatoria';
        return null;
      case 'stock':
        if (!value) return 'El stock es obligatorio';
        if (isNaN(Number(value)) || Number(value) < 0) return 'Ingrese un stock válido (0 o mayor)';
        return null;
      default:
        return null;
    }
  };

  // Manejar cambios en los campos
  const handleFieldChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validación en tiempo real
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error || ''
    }));
  };

  // Validar formulario completo
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'imagen') { // La imagen se valida por separado
        const error = validateField(key, value);
        if (error) newErrors[key] = error;
      }
    });

    // Validar imagen
    if (!imagenPreview) {
      newErrors.imagen = 'La imagen es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambio de imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({ 
        ...prev, 
        imagen: 'Solo se permiten archivos .jpg, .png y .webp' 
      }));
      return;
    }

    // Validar tamaño (2MB máximo)
    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ 
        ...prev, 
        imagen: 'La imagen no puede superar los 2MB' 
      }));
      return;
    }

    setImageLoading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagenPreview(reader.result as string);
      setFormData(prev => ({ ...prev, imagen: reader.result as string }));
      setErrors(prev => ({ ...prev, imagen: '' }));
      setImageLoading(false);
    };
    reader.onerror = () => {
      setErrors(prev => ({ 
        ...prev, 
        imagen: 'Error al cargar la imagen' 
      }));
      setImageLoading(false);
    };
    reader.readAsDataURL(file);
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll al primer error
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const NuevoProducto = {
        id: producto?.id || `PROD-${Date.now()}`,
        sku: formData.sku,
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        categoria: formData.categoria,
        stock: parseInt(formData.stock),
        imagen: formData.imagen,
        destacado: formData.estado
      }

      await agregarProducto(NuevoProducto);
      
      setFormData({
        id: '',
        sku: generateSKU(),
        nombre: '',
        descripcion: '',
        precio: '',
        categoria: '',
        stock: '',
        imagen: '',
        estado: true
      });
      
      setImagenPreview('');
      setHasChanges(false);
      
      onClose();
    } catch (error) {
      setErrors({ general: 'Error al guardar el producto. Inténtalo de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll al primer error
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const NuevoProducto = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        categoria: formData.categoria,
        stock: parseInt(formData.stock),
        destacado: formData.estado
      }

      await actualizarProducto(formData.id, NuevoProducto);
      
      setFormData({
        id: formData.id,
        sku: generateSKU(),
        nombre: '',
        descripcion: '',
        precio: '',
        categoria: '',
        stock: '',
        imagen: '',
        estado: true
      });
      
      setImagenPreview('');
      setHasChanges(false);
      
      onClose();
    } catch (error) {
      setErrors({ general: 'Error al guardar el producto. Inténtalo de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar cierre del modal
  const handleClose = () => {
    if (hasChanges && !showConfirmClose) {
      setShowConfirmClose(true);
    } else {
      onClose();
    }
  };

  // Confirmar cierre sin guardar
  const confirmClose = () => {
    setShowConfirmClose(false);
    onClose();
  };

  return (
    <>
      {/* Modal Principal */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-2 sm:p-4 transition-all duration-300"
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        <div 
          ref={modalRef}
          className={`bg-white rounded-2xl w-full shadow-2xl transform transition-all duration-300 scale-100 ${
            isMobile 
              ? 'h-[95vh] max-w-full' 
              : 'max-w-4xl max-h-[90vh]'
          } flex flex-col overflow-hidden`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-lg">
                <Package size={20} />
              </div>
              <div>
                <h2 id="modal-title" className="text-lg sm:text-xl font-bold text-gray-900">
                  {producto ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
                <p className="text-sm text-gray-600">
                  {producto ? 'Modifica la información del producto' : 'Agrega un nuevo producto al inventario'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white/50 transition-all duration-200"
              aria-label="Cerrar modal"
            >
              <X size={24} />
            </button>
          </div>

          {/* Error general */}
          {errors.general && (
            <div className="mx-4 sm:mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex-shrink-0 animate-fade-in">
              <div className="flex items-center">
                <AlertCircle size={20} className="text-red-600 mr-2" />
                <span className="text-red-700 text-sm">{errors.general}</span>
              </div>
            </div>
          )}

          {/* Contenido del Formulario */}
          <div className="flex-1 overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
              
              {/* Grid Principal */}
              <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
                
                {/* Columna Izquierda - Imagen */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Upload size={20} className="mr-2 text-blue-600" />
                    Imagen del Producto
                  </h3>
                  
                  {/* Vista previa de imagen */}
                  <div className="relative">
                    <div className="aspect-square w-full max-w-sm mx-auto overflow-hidden rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 hover:border-amber-700 transition-colors">
                      {imagenPreview ? (
                        <div className="relative w-full h-full group">
                          {imageLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            </div>
                          )}
                          <img
                            src={imagenPreview}
                            alt="Vista previa"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onLoad={() => setImageLoading(false)}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="opacity-0 group-hover:opacity-100 bg-orange-500 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-amber-700"
                            >
                              Cambiar Imagen
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="w-full h-full flex flex-col items-center justify-center text-orange-500 cursor-pointer hover:text-amber-700 transition-colors"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload size={48} className="mb-4" />
                          <p className="text-sm font-medium">Subir imagen</p>
                          <p className="text-xs text-gray-500 mt-1">JPG, PNG, WEBP (máx. 5MB)</p>
                        </div>
                      )}
                    </div>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={handleImageChange}
                      className="hidden"
                      aria-describedby={errors.imagen ? 'imagen-error' : undefined}
                    />
                    
                    {!imagenPreview && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-4 w-full bg-orange-500 text-white py-3 px-4 rounded-lg border border-orange-400 hover:bg-amber-700 transition-colors font-medium"
                      >
                        Seleccionar archivo
                      </button>
                    )}
                    
                    {errors.imagen && (
                      <p id="imagen-error" className="mt-2 text-sm text-red-600 flex items-center" role="alert">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.imagen}
                      </p>
                    )}
                  </div>
                </div>

                {/* Columna Derecha - Información */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Star size={20} className="mr-2 text-yellow-600" />
                    Información del Producto
                  </h3>
                  
                  {/* SKU */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SKU (Código único) *
                    </label>
                    <div className="relative">
                      <input
                        ref={firstInputRef}
                        type="text"
                        name="sku"
                        value={formData.sku}
                        onChange={(e) => handleFieldChange('sku', e.target.value.toUpperCase())}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono ${
                          errors.sku ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="XXX-0000"
                        maxLength={8}
                        aria-describedby={errors.sku ? 'sku-error' : undefined}
                      />
                      <button
                        type="button"
                        onClick={() => handleFieldChange('sku', generateSKU())}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                      >
                        Generar
                      </button>
                    </div>
                    {errors.sku && (
                      <p id="sku-error" className="mt-2 text-sm text-red-600 flex items-center" role="alert">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.sku}
                      </p>
                    )}
                  </div>

                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Producto *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={(e) => handleFieldChange('nombre', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.nombre ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Ej: Taladro Inalámbrico 18V"
                      aria-describedby={errors.nombre ? 'nombre-error' : undefined}
                    />
                    {errors.nombre && (
                      <p id="nombre-error" className="mt-2 text-sm text-red-600 flex items-center" role="alert">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.nombre}
                      </p>
                    )}
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción *
                    </label>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={(e) => handleFieldChange('descripcion', e.target.value)}
                      rows={4}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                        errors.descripcion ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Describe las características y beneficios del producto..."
                      aria-describedby={errors.descripcion ? 'descripcion-error' : undefined}
                    />
                    {errors.descripcion && (
                      <p id="descripcion-error" className="mt-2 text-sm text-red-600 flex items-center" role="alert">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.descripcion}
                      </p>
                    )}
                  </div>

                  {/* Precio y Stock */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio *
                      </label>
                      <div className="relative">
                        <DollarSign size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          name="precio"
                          value={formData.precio}
                          onChange={(e) => handleFieldChange('precio', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                            errors.precio ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder=""
                          min="0"
                          step="500"   
                          aria-describedby={errors.precio ? 'precio-error' : undefined}
                        />
                      </div>
                      {errors.precio && (
                        <p id="precio-error" className="mt-2 text-sm text-red-600 flex items-center" role="alert">
                          <AlertCircle size={14} className="mr-1" />
                          {errors.precio}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock Disponible *
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={(e) => handleFieldChange('stock', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.stock ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="0"
                        min="0"
                        aria-describedby={errors.stock ? 'stock-error' : undefined}
                      />
                      {errors.stock && (
                        <p id="stock-error" className="mt-2 text-sm text-red-600 flex items-center" role="alert">
                          <AlertCircle size={14} className="mr-1" />
                          {errors.stock}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Categoría */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría *
                    </label>
                    <select
                      name="categoria"
                      value={formData.categoria}
                      onChange={(e) => handleFieldChange('categoria', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.categoria ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      aria-describedby={errors.categoria ? 'categoria-error' : undefined}
                    >
                      <option value="">Seleccionar categoría</option>
                      {categorias.map(categoria => (
                        <option key={categoria.id} value={categoria.id}>
                          {categoria.nombre}
                        </option>
                      ))}
                    </select>
                    {errors.categoria && (
                      <p id="categoria-error" className="mt-2 text-sm text-red-600 flex items-center" role="alert">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.categoria}
                      </p>
                    )}
                  </div>
                  {/* Estado */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={formData.estado}
                            onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.checked }))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">
                            ¿Producto Activo?
                        </label>
                    </div>

                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-200 flex-shrink-0">
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={producto ? handleUpdate : handleSubmit}
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center shadow-lg"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Check size={16} className="mr-2" />
                    {producto ? 'Guardar Cambios' : 'Crear Producto'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación de Cierre */}
      {showConfirmClose && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center mb-4">
              <AlertCircle size={24} className="text-amber-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">¿Cerrar sin guardar?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Tienes cambios sin guardar. ¿Estás seguro de que quieres cerrar el modal? Se perderán todos los cambios.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmClose(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Continuar editando
              </button>
              <button
                onClick={confirmClose}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Cerrar sin guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductoModal;