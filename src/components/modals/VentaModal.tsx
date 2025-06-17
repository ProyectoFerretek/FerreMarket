import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, Plus, Trash2, AlertCircle, Calculator, ShoppingCart, 
  User, CreditCard, FileText, Calendar, Package, Search,
  CheckCircle, Clock, XCircle, DollarSign, Tag, Save, Building2, Mail, Phone, MapPin, ShoppingBag
} from 'lucide-react';
import { obtenerClientes, obtenerProductos, agregarVenta } from '../../data/mockData';
import { formatPrecio } from '../../utils/formatters';
import { Cliente, Producto } from '../../types';

interface VentaModalProps {
  venta?: any;
  onClose: () => void;
}

const VentaModal: React.FC<VentaModalProps> = ({ venta, onClose }) => {
  const [formData, setFormData] = useState({
    cliente: '',
    productos: [{ id: '', cantidad: 1, precioUnitario: 0, descuento: 0 }],
    metodoPago: 'Efectivo',
    estado: 'pendiente',
    notas: '',
    fechaVenta: new Date().toISOString().split('T')[0],
    descuentoGeneral: 0,
    impuestos: 19, // IVA 19%
    moneda: 'CLP'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  // Replace single search state with an array
  const [busquedaProductos, setBusquedaProductos] = useState<string[]>(['']);
  const [busquedaCliente, setBusquedaCliente] = useState('');
  const [mostrarCalculadora, setMostrarCalculadora] = useState(false);

  const [clientes, setClientes] = useState<Cliente[]>();
  const cargarClientes = async () => {
    const dataClientes = await obtenerClientes();
    setClientes(dataClientes);
  }

  // Add a function to get the selected client details
  const clienteSeleccionadoData = useMemo(() => {
    return clientes?.find(c => c.id === formData.cliente);
  }, [clientes, formData.cliente]);

  const [productos, setProductos] = useState<Producto[]>();
  const cargarProductos = async () => {
    const dataProductos = await obtenerProductos();
    setProductos(dataProductos);
  }

  useEffect(() => {
    cargarClientes();
    cargarProductos();
  }, []);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    if (venta) {
      setFormData({
        cliente: venta.cliente || '',
        productos: venta.productos || [{ id: '', cantidad: 1, precioUnitario: 0, descuento: 0 }],
        metodoPago: venta.metodoPago || 'Efectivo',
        estado: venta.estado || 'pendiente',
        notas: venta.notas || '',
        fechaVenta: venta.fecha ? venta.fecha.split('T')[0] : new Date().toISOString().split('T')[0],
        descuentoGeneral: venta.descuentoGeneral || 0,
        impuestos: venta.impuestos || 18,
        moneda: venta.moneda || 'CLP'
      });
      // Initialize search array based on products count
      setBusquedaProductos(new Array(venta.productos?.length || 1).fill(''));
    }
  }, [venta]);

  // Update the filtered products function to work with index
  const getProductosFiltrados = (searchTerm: string) => {
    return productos?.filter(producto =>
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.sku.includes(searchTerm)
    ) || [];
  };

  const clientesFiltrados = clientes?.filter(cliente =>
    cliente.nombre.toLowerCase().includes(busquedaCliente.toLowerCase()) ||
    cliente.email.toLowerCase().includes(busquedaCliente.toLowerCase())
  ) || [];

  const agregarProducto = () => {
    setFormData(prev => ({
      ...prev,
      productos: [...prev.productos, { id: '', cantidad: 1, precioUnitario: 0, descuento: 0 }]
    }));
    // Add an empty search term for the new product
    setBusquedaProductos(prev => [...prev, '']);
  };

  const eliminarProducto = (index: number) => {
    if (formData.productos.length > 1) {
      setFormData(prev => ({
        ...prev,
        productos: prev.productos.filter((_, i) => i !== index)
      }));
      // Remove the search term for the deleted product
      setBusquedaProductos(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Update product search term
  const actualizarBusquedaProducto = (index: number, valor: string) => {
    setBusquedaProductos(prev => {
      const newBusquedas = [...prev];
      newBusquedas[index] = valor;
      return newBusquedas;
    });
  };

  const actualizarProducto = (index: number, campo: string, valor: any) => {
    setFormData(prev => ({
      ...prev,
      productos: prev.productos.map((producto, i) => {
        if (i === index) {
          const nuevoProducto = { ...producto, [campo]: valor };
          if (campo === 'id' && productos) {
            const productoSeleccionado = productos.find(p => p.id === valor);
            if (productoSeleccionado) {
              nuevoProducto.precioUnitario = productoSeleccionado.precio;
            }
          }
          return nuevoProducto;
        }
        return producto;
      })
    }));
  };

  // Cálculos de totales
  const calcularSubtotal = () => {
    return formData.productos.reduce((total, producto) => {
      const subtotalProducto = producto.cantidad * producto.precioUnitario;
      const descuentoProducto = (subtotalProducto * producto.descuento) / 100;
      return total + (subtotalProducto - descuentoProducto);
    }, 0);
  };

  const calcularDescuentoGeneral = () => {
    const subtotal = calcularSubtotal();
    return (subtotal * formData.descuentoGeneral) / 100;
  };

  const calcularImpuestos = () => {
    const subtotalConDescuento = calcularSubtotal() - calcularDescuentoGeneral();
    return (subtotalConDescuento * formData.impuestos) / 100;
  };

  const calcularTotal = () => {
    const subtotal = calcularSubtotal();
    const descuento = calcularDescuentoGeneral();
    const impuestos = calcularImpuestos();
    return subtotal - descuento + impuestos;
  };

  const validarFormulario = () => {
    const nuevosErrores: Record<string, string> = {};
    
    if (!formData.cliente) {
      nuevosErrores.cliente = 'Selecciona un cliente';
    }

    if (formData.productos.length === 0 || formData.productos.some(p => !p.id)) {
      nuevosErrores.productos = 'Agrega al menos un producto válido';
    }

    // Validar stock disponible
    formData.productos.forEach((producto, index) => {
      const productoData = productos.find(p => p.id === producto.id);
      if (productoData && producto.cantidad > productoData.stock) {
        nuevosErrores[`producto_${index}`] = `Stock insuficiente. Disponible: ${productoData.stock}`;
      }
    });

    if (calcularTotal() <= 0) {
      nuevosErrores.total = 'El total de la venta debe ser mayor a 0';
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add debugging to see the actual state value before submission
    console.log("Estado al guardar:", formData.estado);
    
    if (!validarFormulario()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const ventaData = {
        fecha: formData.fechaVenta,
        cliente: formData.cliente,
        total: calcularTotal(),
        metodoPago: formData.metodoPago,
        estado: formData.estado,
        productos: formData.productos.map(p => ({
          id: p.id,
          cantidad: p.cantidad,
          precioUnitario: p.precioUnitario,
          descuento: p.descuento
        })),
      }

      console.log('Datos de la venta a guardar:', ventaData);
      await agregarVenta(ventaData);

      onClose();
    } catch (error) {
      setErrors({ general: 'Error al guardar la venta. Inténtalo de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'completada':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelada':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEstadoIcono = (estado: string) => {
    switch (estado) {
      case 'completada':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'pendiente':
        return <Clock size={16} className="text-yellow-600" />;
      case 'cancelada':
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-2 sm:p-4">
      <div className="bg-white rounded-xl w-full max-w-6xl h-[95vh] sm:h-[90vh] flex flex-col shadow-2xl">
        {/* Header del Modal */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-xl flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white">
              <ShoppingCart size={20} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                {venta ? `Editar Venta #${venta.id}` : 'Nueva Venta'}
              </h2>
              <p className="text-sm text-gray-600">
                {venta ? 'Modifica los detalles de la venta' : 'Registra una nueva transacción'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setMostrarCalculadora(!mostrarCalculadora)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              title="Calculadora"
            >
              <Calculator size={20} />
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={24} />
            </button>
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

        {/* Contenido Principal con Scroll */}
        <div className="flex-1 overflow-y-auto">
          <form className="p-4 sm:p-6 space-y-6">
            
            {/* Información de la Venta */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cliente */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-4 flex items-center">
                  <User size={20} className="mr-2 text-blue-600" />
                  Información del Cliente
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Buscar Cliente *
                    </label>
                    <div className="relative">
                      <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={busquedaCliente}
                        onChange={(e) => setBusquedaCliente(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Buscar por nombre o email..."
                      />
                    </div>
                    
                    {busquedaCliente && (
                      <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                        {clientesFiltrados.map(cliente => (
                          <button
                            key={cliente.id}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, cliente: cliente.id }));
                              setBusquedaCliente(cliente.nombre);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium text-gray-900">{cliente.nombre}</div>
                            <div className="text-sm text-gray-500">{cliente.email}</div>
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* Cliente seleccionado - información */}
                    {clienteSeleccionadoData && (
                      <div className="mt-3 bg-blue-50 border border-blue-100 rounded-lg p-3">
                        <div className="flex items-start">
                          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white flex-shrink-0">
                            {clienteSeleccionadoData.tipoCliente === 'empresa' ? (
                              <Building2 size={18} />
                            ) : (
                              <span className="text-sm font-semibold">
                                {clienteSeleccionadoData.nombre.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="ml-3 flex-grow">
                            <div className="flex flex-wrap justify-between">
                              <div className="font-medium text-gray-900">{clienteSeleccionadoData.nombre}</div>
                              <div className="text-xs">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full ${
                                  clienteSeleccionadoData.tipoCliente === 'empresa' 
                                    ? 'bg-purple-100 text-purple-800' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {clienteSeleccionadoData.tipoCliente === 'empresa' ? 'Empresa' : 'Individual'}
                                </span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-4 mt-1">
                              <div className="flex items-center text-xs text-gray-600">
                                <Mail size={10} className="mr-1" />
                                {clienteSeleccionadoData.email}
                              </div>
                              <div className="flex items-center text-xs text-gray-600">
                                <Phone size={10} className="mr-1" />
                                {clienteSeleccionadoData.telefono}
                              </div>
                              <div className="flex items-center text-xs text-gray-600 sm:col-span-2">
                                <MapPin size={10} className="mr-1 flex-shrink-0" />
                                <span className="truncate">{clienteSeleccionadoData.direccion}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-blue-100">
                              <div className="text-xs text-gray-700">
                                <ShoppingBag size={10} className="inline mr-1" />
                                <span className="font-semibold">{clienteSeleccionadoData.compras}</span> compras totales
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, cliente: '' }));
                                  setBusquedaCliente('');
                                }}
                                className="text-xs text-red-600 hover:text-red-800"
                              >
                                <X size={10} className="inline mr-1" />
                                Cambiar cliente
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {errors.cliente && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.cliente}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Detalles de la Venta */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-4 flex items-center">
                  <FileText size={20} className="mr-2 text-green-600" />
                  Detalles
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Venta
                    </label>
                    <div className="relative">
                      <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        value={formData.fechaVenta}
                        onChange={(e) => setFormData(prev => ({ ...prev, fechaVenta: e.target.value }))}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado de la Venta
                    </label>
                    <select
                      value={formData.estado}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, estado: e.target.value }))
                        console.log("Estado seleccionado:", e.target.value);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="completada">Completada</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                    <div className={`mt-2 inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border ${getEstadoColor(formData.estado)}`}>
                      {getEstadoIcono(formData.estado)}
                      <span className="ml-1 capitalize">{formData.estado}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Método de Pago
                    </label>
                    <div className="relative">
                      <CreditCard size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select
                        value={formData.metodoPago}
                        onChange={(e) => setFormData(prev => ({ ...prev, metodoPago: e.target.value }))}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Efectivo">Efectivo</option>
                        <option value="Tarjeta de crédito">Tarjeta de crédito</option>
                        <option value="Tarjeta de débito">Tarjeta de débito</option>
                        <option value="Transferencia">Transferencia bancaria</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Productos */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 flex items-center">
                  <Package size={20} className="mr-2 text-purple-600" />
                  Productos de la Venta
                </h3>
                <button
                  type="button"
                  onClick={agregarProducto}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-700 flex items-center transition-colors"
                >
                  <Plus size={16} className="mr-1" />
                  Agregar Producto
                </button>
              </div>

              <div className="space-y-4">
                {formData.productos.map((producto, index) => {
                  const productoData = productos?.find(p => p.id === producto.id);
                  const subtotalProducto = producto.cantidad * producto.precioUnitario;
                  const descuentoProducto = (subtotalProducto * producto.descuento) / 100;
                  const totalProducto = subtotalProducto - descuentoProducto;
                  // Get filtered products for this specific index
                  const productosFiltrados = getProductosFiltrados(busquedaProductos[index] || '');

                  return (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      {/* Labels row - add a separate row just for labels to ensure alignment */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-2">
                        <div className="lg:col-span-4">
                          <label className="block text-sm font-medium text-gray-700">
                            Producto *
                          </label>
                        </div>
                        <div className="lg:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Cantidad
                          </label>
                        </div>
                        <div className="lg:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Precio Unit.
                          </label>
                        </div>
                        <div className="lg:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Desc. %
                          </label>
                        </div>
                        <div className="lg:col-span-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Total
                          </label>
                        </div>
                        <div className="lg:col-span-1">
                          {/* Empty label for delete button column */}
                        </div>
                      </div>
                      
                      {/* Input fields row - now all controls will be aligned */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                        {/* Producto */}
                        <div className="lg:col-span-4">
                          {productoData ? (
                            <div className="bg-white p-3 rounded-lg border border-gray-200 flex items-center">
                              <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
                                {productoData.imagen ? (
                                  <img 
                                    src={productoData.imagen} 
                                    alt={productoData.nombre} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Package size={24} className="text-gray-400" />
                                )}
                              </div>
                              <div className="ml-3 flex-grow">
                                <div className="font-medium text-gray-900">{productoData.nombre}</div>
                                <div className="text-sm text-gray-500 flex items-center">
                                  <Tag size={12} className="mr-1" /> 
                                  SKU: {productoData.sku}
                                </div>
                                <div className="text-sm mt-1 flex items-center">
                                  <span className={`inline-flex items-center ${productoData.stock > 10 ? 'text-green-600' : productoData.stock > 0 ? 'text-amber-600' : 'text-red-600'}`}>
                                    <Package size={12} className="mr-1" />
                                    Stock: <span className="font-semibold ml-1">{productoData.stock} unidades</span>
                                  </span>
                                  {productoData.stock < producto.cantidad && (
                                    <span className="ml-2 text-red-600 text-xs">¡Stock insuficiente!</span>
                                  )}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  actualizarProducto(index, 'id', '');
                                  actualizarBusquedaProducto(index, '');
                                }}
                                className="ml-2 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50"
                                title="Cambiar producto"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <div className="relative">
                              <input
                                type="text"
                                value={busquedaProductos[index] || ''}
                                onChange={(e) => actualizarBusquedaProducto(index, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Buscar producto..."
                              />
                              {busquedaProductos[index] && (
                                <div className="absolute top-full left-0 right-0 mt-1 max-h-40 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                  {productosFiltrados.map(prod => (
                                    <button
                                      key={prod.id}
                                      type="button"
                                      onClick={() => {
                                        actualizarProducto(index, 'id', prod.id);
                                        actualizarBusquedaProducto(index, '');
                                      }}
                                      className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                    >
                                      <div className="font-medium text-gray-900">{prod.nombre}</div>
                                      <div className="text-sm text-gray-500">
                                        {formatPrecio(prod.precio)} - Stock: {prod.stock}
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Cantidad */}
                        <div className="lg:col-span-2">
                          <input
                            type="number"
                            min="1"
                            value={producto.cantidad}
                            onChange={(e) => actualizarProducto(index, 'cantidad', parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        {/* Precio Unitario */}
                        <div className="lg:col-span-2">
                          <div className="relative">
                            <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="number"
                              step="0.01"
                              value={producto.precioUnitario}
                              onChange={(e) => actualizarProducto(index, 'precioUnitario', parseFloat(e.target.value) || 0)}
                              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        {/* Descuento */}
                        <div className="lg:col-span-2">
                          <div className="relative">
                            <Tag size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="1"
                              value={producto.descuento}
                              onChange={(e) => actualizarProducto(index, 'descuento', parseFloat(e.target.value) || 0)}
                              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        {/* Total */}
                        <div className="lg:col-span-1">
                          <div className="text-lg font-bold text-gray-900 py-1">
                            {formatPrecio(totalProducto)}
                          </div>
                        </div>

                        {/* Eliminar */}
                        <div className="lg:col-span-1 flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => eliminarProducto(index)}
                            disabled={formData.productos.length === 1}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Eliminar producto"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {errors[`producto_${index}`] && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <AlertCircle size={14} className="mr-1" />
                          {errors[`producto_${index}`]}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {errors.productos && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.productos}
                </p>
              )}
            </div>

            {/* Descuentos e Impuestos - Now in its own row */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-4">
                Descuentos e Impuestos
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descuento General (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={formData.descuentoGeneral === 0 ? '' : formData.descuentoGeneral}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData(prev => ({ 
                        ...prev, 
                        descuentoGeneral: value === '' ? 0 : parseFloat(value) || 0 
                      }));
                    }}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IVA (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={formData.impuestos}
                    onChange={(e) => setFormData(prev => ({ ...prev, impuestos: parseFloat(e.target.value) || 0 }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Observaciones - Now in its own row */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-4">
                Observaciones
              </h3>
              
              <textarea
                value={formData.notas}
                onChange={(e) => setFormData(prev => ({ ...prev, notas: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Notas adicionales sobre la venta..."
              />
            </div>

            {/* Espaciado adicional */}
            <div className="h-4"></div>
          </form>
        </div>

        {/* Footer con Resumen y Botones */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200 rounded-b-xl flex-shrink-0">
          {/* Resumen de Totales */}
          <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
            <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <Calculator size={20} className="mr-2 text-blue-600" />
              Resumen de la Venta
            </h4>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <p className="text-gray-600">Subtotal</p>
                <p className="text-lg font-bold text-gray-900">{formatPrecio(calcularSubtotal())}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600">Descuento</p>
                <p className="text-lg font-bold text-orange-600">-{formatPrecio(calcularDescuentoGeneral())}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600">IVA ({formData.impuestos}%)</p>
                <p className="text-lg font-bold text-blue-600">+{formatPrecio(calcularImpuestos())}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600">Total Final</p>
                <p className="text-2xl font-bold text-green-600">{formatPrecio(calcularTotal())}</p>
              </div>
            </div>

            {errors.total && (
              <p className="mt-2 text-sm text-red-600 flex items-center justify-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.total}
              </p>
            )}
          </div>

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
            >
              Cancelar
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Guardando...
                </>
              ) : (
                <><Save size={16} className="mr-2" />Crear Venta</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VentaModal;