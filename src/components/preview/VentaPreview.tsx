import React from 'react';
import { X, Calendar, User, CreditCard, Package, Clock } from 'lucide-react';
import { formatPrecio, formatFecha, getNombreCliente, getEstadoVenta } from '../../utils/formatters';
import { clientes, productos } from '../../data/mockData';

interface VentaPreviewProps {
    venta: any;
    onClose: () => void;
}

const VentaPreview: React.FC<VentaPreviewProps> = ({ venta, onClose }) => {
    const cliente = clientes.find(c => c.id === venta.cliente);
    const estadoInfo = getEstadoVenta(venta.estado);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Detalle de Venta #{venta.id}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Información General */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <Calendar size={20} className="text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-500">Fecha</p>
                                    <p className="font-medium">{formatFecha(venta.fecha, true)}</p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <User size={20} className="text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-500">Cliente</p>
                                    <p className="font-medium">{cliente?.nombre}</p>
                                    <p className="text-sm text-gray-500">{cliente?.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center">
                                <CreditCard size={20} className="text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-500">Método de Pago</p>
                                    <p className="font-medium">{venta.metodoPago}</p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <Clock size={20} className="text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-500">Estado</p>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${estadoInfo.color}`}>
                                        {estadoInfo.label}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Productos */}
                    <div>
                        <div className="flex items-center mb-4">
                            <Package size={20} className="text-gray-400 mr-3" />
                            <h3 className="text-lg font-medium text-gray-900">Productos</h3>
                        </div>

                        <div className="bg-gray-50 rounded-lg overflow-hidden">
                            <table className="min-w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Producto
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Cantidad
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Precio Unit.
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Subtotal
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {venta.productos.map((item: any, index: number) => {
                                        const producto = productos.find(p => p.id === item.id);
                                        return (
                                            <tr key={index} className="bg-white">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center">
                                                        <img
                                                            src={producto?.imagen}
                                                            alt={producto?.nombre}
                                                            className="w-10 h-10 rounded-md object-cover mr-3"
                                                        />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {producto?.nombre}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                    {item.cantidad}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                    {formatPrecio(item.precioUnitario)}
                                                </td>
                                                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                    {formatPrecio(item.cantidad * item.precioUnitario)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-medium text-gray-900">Total de la Venta:</span>
                            <span className="text-2xl font-bold text-blue-900">{formatPrecio(venta.total)}</span>
                        </div>
                    </div>

                    {/* Notas */}
                    {venta.notas && (
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Notas</h4>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                {venta.notas}
                            </p>
                        </div>
                    )}

                    {/* Información del Cliente */}
                    {cliente && (
                        <div className="border-t border-gray-200 pt-6">
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Información del Cliente</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">Teléfono:</span>
                                    <span className="ml-2 text-gray-900">{cliente.telefono}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Total de compras:</span>
                                    <span className="ml-2 text-gray-900">{cliente.compras}</span>
                                </div>
                                <div className="md:col-span-2">
                                    <span className="text-gray-500">Dirección:</span>
                                    <span className="ml-2 text-gray-900">{cliente.direccion}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-gray-50 px-6 py-4 rounded-b-lg">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VentaPreview;