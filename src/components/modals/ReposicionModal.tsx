import React, { useState, useEffect } from 'react';
import { X, Calculator, Truck, AlertCircle, CheckCircle } from 'lucide-react';
import { formatPrecio, formatFecha } from '../../utils/formatters';

interface ReposicionModalProps {
    producto: any;
    onClose: () => void;
}

const ReposicionModal: React.FC<ReposicionModalProps> = ({ producto, onClose }) => {
    const [formData, setFormData] = useState({
        cantidad: 0,
        cantidadSugerida: 0,
        proveedor: '',
        precioUnitario: 0,
        fechaEntregaEstimada: '',
        notas: '',
        prioridad: 'media'
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [ordenGenerada, setOrdenGenerada] = useState(false);

    useEffect(() => {
        if (producto) {
            // Calcular cantidad sugerida basada en ventas promedio y tiempo de reposición
            const ventasPromedio = producto.ventasPromedio || 5;
            const tiempoReposicion = 15; // días
            const stockSeguridad = Math.ceil(ventasPromedio * 0.5); // 50% adicional como seguridad
            const cantidadSugerida = Math.ceil((ventasPromedio * tiempoReposicion / 30) + stockSeguridad);

            // Fecha estimada de entrega (7 días desde hoy)
            const fechaEntrega = new Date();
            fechaEntrega.setDate(fechaEntrega.getDate() + 7);

            setFormData({
                cantidad: cantidadSugerida,
                cantidadSugerida,
                proveedor: producto.proveedor.id,
                precioUnitario: producto.precio * 0.7, // Precio de compra estimado (70% del precio de venta)
                fechaEntregaEstimada: fechaEntrega.toISOString().split('T')[0],
                notas: `Reposición automática para ${producto.nombre}. Stock actual: ${producto.stock} unidades.`,
                prioridad: producto.stock === 0 ? 'alta' : 'media'
            });
        }
    }, [producto]);

    const validarFormulario = () => {
        const nuevosErrores: Record<string, string> = {};

        if (!formData.cantidad || formData.cantidad <= 0) {
            nuevosErrores.cantidad = 'La cantidad debe ser mayor a 0';
        }

        if (!formData.proveedor) {
            nuevosErrores.proveedor = 'Selecciona un proveedor';
        }

        if (!formData.precioUnitario || formData.precioUnitario <= 0) {
            nuevosErrores.precioUnitario = 'El precio debe ser mayor a 0';
        }

        if (!formData.fechaEntregaEstimada) {
            nuevosErrores.fechaEntregaEstimada = 'Selecciona una fecha de entrega';
        }

        setErrors(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validarFormulario()) {
            // Simular generación de orden
            const ordenData = {
                producto: producto.id,
                cantidad: formData.cantidad,
                proveedor: formData.proveedor,
                total: formData.cantidad * formData.precioUnitario,
                fechaOrden: new Date().toISOString(),
                fechaEntregaEstimada: formData.fechaEntregaEstimada,
                estado: 'pendiente',
                prioridad: formData.prioridad,
                notas: formData.notas
            };

            console.log('Orden de reposición generada:', ordenData);
            setOrdenGenerada(true);

            // Cerrar modal después de 2 segundos
            setTimeout(() => {
                onClose();
            }, 2000);
        }
    };

    const calcularTotal = () => {
        return formData.cantidad * formData.precioUnitario;
    };

    const getPrioridadColor = (prioridad: string) => {
        switch (prioridad) {
            case 'alta':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'media':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'baja':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (ordenGenerada) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg w-full max-w-md p-6">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                            <CheckCircle size={24} className="text-green-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            ¡Orden Generada Exitosamente!
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                            La orden de reposición ha sido enviada al proveedor {producto.proveedor.nombre}.
                        </p>
                        <div className="bg-gray-50 rounded-lg p-3 text-left">
                            <div className="text-sm">
                                <div className="flex justify-between mb-1">
                                    <span className="text-gray-600">Producto:</span>
                                    <span className="font-medium">{producto.nombre}</span>
                                </div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-gray-600">Cantidad:</span>
                                    <span className="font-medium">{formData.cantidad} unidades</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total:</span>
                                    <span className="font-medium">{formatPrecio(calcularTotal())}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Solicitar Reposición
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    {/* Información del Producto */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                            <img
                                src={producto.imagen}
                                alt={producto.nombre}
                                className="w-16 h-16 rounded-lg object-cover mr-4"
                            />
                            <div className="flex-1">
                                <h3 className="text-lg font-medium text-gray-900">{producto.nombre}</h3>
                                <p className="text-sm text-gray-600">SKU: {producto.sku}</p>
                                <div className="flex items-center mt-2">
                                    <span className="text-sm text-gray-600 mr-4">
                                        Stock actual: <span className="font-medium text-red-600">{producto.stock} unidades</span>
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        Nivel mínimo: <span className="font-medium">{producto.nivelMinimo} unidades</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Cantidad Sugerida */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                                <Calculator size={20} className="text-blue-600 mr-2" />
                                <h4 className="text-sm font-medium text-blue-900">Cálculo Automático</h4>
                            </div>
                            <p className="text-sm text-blue-700 mb-3">
                                Basado en ventas promedio de {producto.ventasPromedio} unidades/mes y tiempo de reposición de 15 días.
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-blue-700">Cantidad sugerida:</span>
                                <span className="text-lg font-bold text-blue-900">{formData.cantidadSugerida} unidades</span>
                            </div>
                        </div>

                        {/* Cantidad a Solicitar */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cantidad a Solicitar
                            </label>
                            <div className="flex items-center space-x-3">
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.cantidad}
                                    onChange={(e) => setFormData(prev => ({ ...prev, cantidad: parseInt(e.target.value) || 0 }))}
                                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, cantidad: prev.cantidadSugerida }))}
                                    className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                                >
                                    Usar sugerida
                                </button>
                            </div>
                            {errors.cantidad && (
                                <p className="mt-1 text-xs text-red-600 flex items-center">
                                    <AlertCircle size={14} className="mr-1" />
                                    {errors.cantidad}
                                </p>
                            )}
                        </div>

                        {/* Proveedor */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Proveedor
                            </label>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center">
                                    <Truck size={20} className="text-gray-400 mr-3" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{producto.proveedor.nombre}</div>
                                        <div className="text-sm text-gray-600">{producto.proveedor.contacto}</div>
                                        <div className="text-sm text-gray-600">{producto.proveedor.telefono}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Precio y Fecha */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Precio Unitario de Compra
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.precioUnitario}
                                        onChange={(e) => setFormData(prev => ({ ...prev, precioUnitario: parseFloat(e.target.value) || 0 }))}
                                        className="pl-8 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                {errors.precioUnitario && (
                                    <p className="mt-1 text-xs text-red-600 flex items-center">
                                        <AlertCircle size={14} className="mr-1" />
                                        {errors.precioUnitario}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fecha de Entrega Estimada
                                </label>
                                <input
                                    type="date"
                                    value={formData.fechaEntregaEstimada}
                                    onChange={(e) => setFormData(prev => ({ ...prev, fechaEntregaEstimada: e.target.value }))}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.fechaEntregaEstimada && (
                                    <p className="mt-1 text-xs text-red-600 flex items-center">
                                        <AlertCircle size={14} className="mr-1" />
                                        {errors.fechaEntregaEstimada}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Prioridad */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Prioridad
                            </label>
                            <div className="flex space-x-3">
                                {['alta', 'media', 'baja'].map(prioridad => (
                                    <label key={prioridad} className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            value={prioridad}
                                            checked={formData.prioridad === prioridad}
                                            onChange={(e) => setFormData(prev => ({ ...prev, prioridad: e.target.value }))}
                                            className="form-radio h-4 w-4 text-blue-600"
                                        />
                                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full border ${getPrioridadColor(prioridad)}`}>
                                            {prioridad.charAt(0).toUpperCase() + prioridad.slice(1)}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Notas */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notas Adicionales
                            </label>
                            <textarea
                                value={formData.notas}
                                onChange={(e) => setFormData(prev => ({ ...prev, notas: e.target.value }))}
                                rows={3}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Información adicional para el proveedor..."
                            />
                        </div>

                        {/* Resumen */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-blue-900 mb-3">Resumen de la Orden</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-blue-700">Cantidad:</span>
                                    <span className="font-medium text-blue-900">{formData.cantidad} unidades</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-blue-700">Precio unitario:</span>
                                    <span className="font-medium text-blue-900">{formatPrecio(formData.precioUnitario)}</span>
                                </div>
                                <div className="flex justify-between border-t border-blue-200 pt-2">
                                    <span className="text-blue-700 font-medium">Total:</span>
                                    <span className="font-bold text-blue-900 text-lg">{formatPrecio(calcularTotal())}</span>
                                </div>
                            </div>
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
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                            >
                                <Truck size={16} className="mr-2" />
                                Generar Orden de Pedido
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReposicionModal;