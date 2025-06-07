import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, AlertCircle } from 'lucide-react';
import { productos, clientes } from '../../data/mockData';
import { formatPrecio } from '../../utils/formatters';

interface VentaModalProps {
  venta?: any;
  onClose: () => void;
}

const VentaModal: React.FC<VentaModalProps> = ({ venta, onClose }) => {
  const [formData, setFormData] = useState({
    cliente: '',
    productos: [{ id: '', cantidad: 1, precioUnitario: 0 }],
    metodoPago: 'Efectivo',
    estado: 'pendiente',
    notas: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (venta) {
      setFormData({
        cliente: venta.cliente,
        productos: venta.productos,
        metodoPago: venta.metodoPago,
        estado: venta.estado,
        notas: venta.notas || ''
      });
    }
  }, [venta]);

  const agregarProducto = () => {
    setFormData(prev => ({
      ...prev,
      productos: [...prev.productos, { id: '', cantidad: 1, precioUnitario: 0 }]
    }));
  };

  const eliminarProducto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      productos: prev.productos.filter((_, i) => i !== index)
    }));
  };

  const actualizarProducto = (index: number, campo: string, valor: any) => {
    setFormData(prev => ({
      ...prev,
      productos: prev.productos.map((producto, i) => {
        if (i === index) {
          const nuevoProducto = { ...producto, [campo]: valor };
          if (campo === 'id') {
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

  const calcularTotal = () => {
    return formData.productos.reduce((total, producto) => {
      return total + (producto.cantidad * producto.precioUnitario);
    }, 0);
  };

  const validarFormulario = () => {
    const nuevosErrores: Record<string, string> = {};

    if (!formData.cliente) {
      nuevosErrores.cliente = 'Selecciona un cliente';
    }

    if (formData.productos.length === 0 || formData.productos.some(p => !p.id)) {
      nuevosErrores.productos = 'Agrega al menos un producto válido';
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validarFormulario()) {
      const ventaData = {
        ...formData,
        total: calcularTotal(),
        fecha: venta ? venta.fecha : new Date().toISOString()
      };
      console.log('Guardando venta:', ventaData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {venta ? 'Editar Venta' : 'Nueva Venta'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Cliente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cliente
            </label>
            <select
              value={formData.cliente}
              onChange={(e) => setFormData(prev => ({ ...prev, cliente: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Seleccionar cliente</option>
              {clientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre} - {cliente.email}
                </option>
              ))}
            </select>
            {errors.cliente && (
              <p className="mt-1 text-xs text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.cliente}
              </p>
            )}
          </div>

          {/* Productos */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Productos
              </label>
              <button
                type="button"
                onClick={agregarProducto}
                className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 flex items-center"
              >
                <Plus size={16} className="mr-1" />
                Agregar
              </button>
            </div>

            <div className="space-y-3">
              {formData.productos.map((producto, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-5">
                    <select
                      value={producto.id}
                      onChange={(e) => actualizarProducto(index, 'id', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Seleccionar producto</option>
                      {productos.map(prod => (
                        <option key={prod.id} value={prod.id}>
                          {prod.nombre} - {formatPrecio(prod.precio)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="1"
                      value={producto.cantidad}
                      onChange={(e) => actualizarProducto(index, 'cantidad', parseInt(e.target.value))}
                      placeholder="Cant."
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={producto.precioUnitario}
                      onChange={(e) => actualizarProducto(index, 'precioUnitario', parseFloat(e.target.value))}
                      placeholder="Precio"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-1">
                    <button
                      type="button"
                      onClick={() => eliminarProducto(index)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="col-span-1 text-right">
                    <span className="text-sm font-medium text-gray-900">
                      {formatPrecio(producto.cantidad * producto.precioUnitario)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {errors.productos && (
              <p className="mt-1 text-xs text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.productos}
              </p>
            )}
          </div>

          {/* Total */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-gray-900">{formatPrecio(calcularTotal())}</span>
            </div>
          </div>

          {/* Método de Pago y Estado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Método de Pago
              </label>
              <select
                value={formData.metodoPago}
                onChange={(e) => setFormData(prev => ({ ...prev, metodoPago: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta de crédito">Tarjeta de crédito</option>
                <option value="Tarjeta de débito">Tarjeta de débito</option>
                <option value="Transferencia">Transferencia</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="pendiente">Pendiente</option>
                <option value="completada">Completada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas adicionales
            </label>
            <textarea
              value={formData.notas}
              onChange={(e) => setFormData(prev => ({ ...prev, notas: e.target.value }))}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Información adicional sobre la venta..."
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {venta ? 'Guardar cambios' : 'Crear venta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VentaModal;