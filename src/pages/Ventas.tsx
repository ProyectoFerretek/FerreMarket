import React, { useState, useMemo } from 'react';
import {
    Plus, Search, Filter, Calendar, Download, Eye, Edit2, Trash2,
    ArrowUpDown, FileText, FileSpreadsheet, FileDown, TrendingUp,
    TrendingDown, DollarSign, ShoppingCart, Users, Clock, ShoppingCartIcon
} from 'lucide-react';
import { ventas, clientes, productos } from '../data/mockData';
import { formatPrecio, formatFecha, getNombreCliente, getEstadoVenta } from '../utils/formatters';
import ConfirmDialog from '../components/common/ConfirmDialog';
import VentaModal from '../components/modals/VentaModal';
import VentaPreview from '../components/preview/VentaPreview';

const Ventas: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [ventaSeleccionada, setVentaSeleccionada] = useState<any>(null);
    const [busqueda, setBusqueda] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');
    const [filtroMetodoPago, setFiltroMetodoPago] = useState('');
    const [filtroFecha, setFiltroFecha] = useState('');
    const [pagina, setPagina] = useState(1);
    const [ventasSeleccionadas, setVentasSeleccionadas] = useState<string[]>([]);
    const [ordenamiento, setOrdenamiento] = useState({ campo: 'fecha', direccion: 'desc' });

    // Calcular KPIs
    const ventasHoy = ventas.filter(v => {
        const hoy = new Date().toISOString().split('T')[0];
        return v.fecha.split('T')[0] === hoy;
    });

    const ventasAyer = ventas.filter(v => {
        const ayer = new Date();
        ayer.setDate(ayer.getDate() - 1);
        return v.fecha.split('T')[0] === ayer.toISOString().split('T')[0];
    });

    const totalHoy = ventasHoy.reduce((sum, v) => sum + v.total, 0);
    const totalAyer = ventasAyer.reduce((sum, v) => sum + v.total, 0);
    const cambioVentas = totalAyer > 0 ? ((totalHoy - totalAyer) / totalAyer) * 100 : 0;

    const ventasSemana = ventas.filter(v => {
        const fechaVenta = new Date(v.fecha);
        const hoy = new Date();
        const inicioSemana = new Date(hoy.setDate(hoy.getDate() - hoy.getDay()));
        return fechaVenta >= inicioSemana;
    });

    const totalSemana = ventasSemana.reduce((sum, v) => sum + v.total, 0);
    const promedioVenta = ventas.length > 0 ? ventas.reduce((sum, v) => sum + v.total, 0) / ventas.length : 0;

    // Filtrar ventas
    const ventasFiltradas = useMemo(() => {
        return ventas
            .filter(venta => {
                const matchBusqueda = venta.id.toLowerCase().includes(busqueda.toLowerCase()) ||
                    getNombreCliente(venta.cliente, clientes).toLowerCase().includes(busqueda.toLowerCase());
                const matchEstado = !filtroEstado || venta.estado === filtroEstado;
                const matchMetodo = !filtroMetodoPago || venta.metodoPago === filtroMetodoPago;
                const matchFecha = !filtroFecha || venta.fecha.split('T')[0] === filtroFecha;

                return matchBusqueda && matchEstado && matchMetodo && matchFecha;
            })
            .sort((a, b) => {
                const valorA = ordenamiento.campo === 'cliente' ? getNombreCliente(a.cliente, clientes) : a[ordenamiento.campo];
                const valorB = ordenamiento.campo === 'cliente' ? getNombreCliente(b.cliente, clientes) : b[ordenamiento.campo];

                if (valorA < valorB) return ordenamiento.direccion === 'asc' ? -1 : 1;
                if (valorA > valorB) return ordenamiento.direccion === 'asc' ? 1 : -1;
                return 0;
            });
    }, [ventas, busqueda, filtroEstado, filtroMetodoPago, filtroFecha, ordenamiento]);

    const ventasEnPagina = ventasFiltradas.slice((pagina - 1) * 15, pagina * 15);
    const totalPaginas = Math.ceil(ventasFiltradas.length / 15);

    const handleOrdenar = (campo: string) => {
        setOrdenamiento(prev => ({
            campo,
            direccion: prev.campo === campo && prev.direccion === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleSeleccionarVenta = (ventaId: string) => {
        setVentasSeleccionadas(prev =>
            prev.includes(ventaId)
                ? prev.filter(id => id !== ventaId)
                : [...prev, ventaId]
        );
    };

    const handleSeleccionarTodas = () => {
        setVentasSeleccionadas(
            ventasSeleccionadas.length === ventasEnPagina.length
                ? []
                : ventasEnPagina.map(v => v.id)
        );
    };

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'completada':
                return 'bg-green-50 border-green-200';
            case 'pendiente':
                return 'bg-yellow-50 border-yellow-200';
            case 'cancelada':
                return 'bg-red-50 border-red-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    const exportarSeleccion = (formato: string) => {
        const ventasParaExportar = ventas.filter(v => ventasSeleccionadas.includes(v.id));
        console.log(`Exportando ${ventasParaExportar.length} ventas en formato ${formato}`);
        // Aquí iría la lógica de exportación
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                        <ShoppingCartIcon size={28} className="mr-3 text-blue-600" />
                        Ventas
                    </h1>
                    <p className="text-gray-700 mt-1 text-sm sm:text-base">
                        Aquí puedes gestionar todas las ventas de tu negocio, desde crear nuevas hasta editar o eliminar las existentes.
                    </p>
                </div>
                <button
                    onClick={() => setModalOpen(true)}
                    className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 flex items-center transition-colors"
                >
                    <Plus size={20} className="mr-2" />
                    Nueva Venta
                </button>
            </div>

            {/* KPIs Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Ventas Hoy</p>
                            <p className="text-2xl font-bold text-gray-900">{formatPrecio(totalHoy)}</p>
                            <div className="flex items-center mt-2">
                                {cambioVentas >= 0 ? (
                                    <TrendingUp size={16} className="text-green-500 mr-1" />
                                ) : (
                                    <TrendingDown size={16} className="text-red-500 mr-1" />
                                )}
                                <span className={`text-sm font-medium ${cambioVentas >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {Math.abs(cambioVentas).toFixed(1)}% vs ayer
                                </span>
                            </div>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <DollarSign size={24} className="text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Ventas Esta Semana</p>
                            <p className="text-2xl font-bold text-gray-900">{formatPrecio(totalSemana)}</p>
                            <p className="text-sm text-gray-500 mt-2">{ventasSemana.length} transacciones</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <ShoppingCart size={24} className="text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Promedio por Venta</p>
                            <p className="text-2xl font-bold text-gray-900">{formatPrecio(promedioVenta)}</p>
                            <p className="text-sm text-gray-500 mt-2">Últimas 30 ventas</p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-full">
                            <Users size={24} className="text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Pendientes</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {ventas.filter(v => v.estado === 'pendiente').length}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">Requieren atención</p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <Clock size={24} className="text-yellow-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtros y Búsqueda */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="relative">
                        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por ID o cliente..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <select
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Todos los estados</option>
                        <option value="completada">Completada</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="cancelada">Cancelada</option>
                    </select>

                    <select
                        value={filtroMetodoPago}
                        onChange={(e) => setFiltroMetodoPago(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Todos los métodos</option>
                        <option value="Efectivo">Efectivo</option>
                        <option value="Tarjeta de crédito">Tarjeta de crédito</option>
                        <option value="Tarjeta de débito">Tarjeta de débito</option>
                        <option value="Transferencia">Transferencia</option>
                    </select>

                    <input
                        type="date"
                        value={filtroFecha}
                        onChange={(e) => setFiltroFecha(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />

                    <button
                        onClick={() => {
                            setBusqueda('');
                            setFiltroEstado('');
                            setFiltroMetodoPago('');
                            setFiltroFecha('');
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Limpiar Filtros
                    </button>
                </div>
            </div>

            {/* Exportación Masiva */}
            {ventasSeleccionadas.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-blue-800 font-medium">
                            {ventasSeleccionadas.length} venta(s) seleccionada(s)
                        </span>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => exportarSeleccion('pdf')}
                                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center text-sm"
                            >
                                <FileText size={16} className="mr-1" />
                                PDF
                            </button>
                            <button
                                onClick={() => exportarSeleccion('excel')}
                                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center text-sm"
                            >
                                <FileSpreadsheet size={16} className="mr-1" />
                                Excel
                            </button>
                            <button
                                onClick={() => exportarSeleccion('csv')}
                                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center text-sm"
                            >
                                <FileDown size={16} className="mr-1" />
                                CSV
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabla de Ventas */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={ventasSeleccionadas.length === ventasEnPagina.length && ventasEnPagina.length > 0}
                                        onChange={handleSeleccionarTodas}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleOrdenar('id')}
                                >
                                    <div className="flex items-center">
                                        ID
                                        <ArrowUpDown size={14} className="ml-1" />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleOrdenar('fecha')}
                                >
                                    <div className="flex items-center">
                                        Fecha
                                        <ArrowUpDown size={14} className="ml-1" />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleOrdenar('cliente')}
                                >
                                    <div className="flex items-center">
                                        Cliente
                                        <ArrowUpDown size={14} className="ml-1" />
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Productos
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleOrdenar('total')}
                                >
                                    <div className="flex items-center">
                                        Total
                                        <ArrowUpDown size={14} className="ml-1" />
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Método Pago
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {ventasEnPagina.map(venta => {
                                const estadoInfo = getEstadoVenta(venta.estado);
                                const isSelected = ventasSeleccionadas.includes(venta.id);

                                return (
                                    <tr
                                        key={venta.id}
                                        className={`hover:bg-gray-50 transition-colors ${getEstadoColor(venta.estado)} ${isSelected ? 'bg-blue-50' : ''}`}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleSeleccionarVenta(venta.id)}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-medium text-gray-900">#{venta.id}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-900">{formatFecha(venta.fecha, true)}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-900">{getNombreCliente(venta.cliente, clientes)}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {venta.productos.map((item, index) => {
                                                    const producto = productos.find(p => p.id === item.id);
                                                    return (
                                                        <div key={index} className="flex justify-between">
                                                            <span>{producto?.nombre || 'Producto no encontrado'}</span>
                                                            <span className="text-gray-500">x{item.cantidad}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-medium text-gray-900">{formatPrecio(venta.total)}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-900">{venta.metodoPago}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${estadoInfo.color}`}>
                                                {estadoInfo.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setVentaSeleccionada(venta);
                                                        setPreviewOpen(true);
                                                    }}
                                                    className="text-gray-600 hover:text-gray-900 p-1 rounded"
                                                    title="Vista previa"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setVentaSeleccionada(venta);
                                                        setModalOpen(true);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                                    title="Editar"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setVentaSeleccionada(venta);
                                                        setConfirmOpen(true);
                                                    }}
                                                    className="text-red-600 hover:text-red-900 p-1 rounded"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => exportarSeleccion('pdf')}
                                                    className="text-green-600 hover:text-green-900 p-1 rounded"
                                                    title="Exportar"
                                                >
                                                    <Download size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Mostrando {((pagina - 1) * 15) + 1} a {Math.min(pagina * 15, ventasFiltradas.length)} de {ventasFiltradas.length} ventas
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setPagina(prev => Math.max(prev - 1, 1))}
                                disabled={pagina === 1}
                                className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
                            >
                                Anterior
                            </button>
                            <span className="px-4 py-2 text-sm text-gray-700">
                                Página {pagina} de {totalPaginas}
                            </span>
                            <button
                                onClick={() => setPagina(prev => Math.min(prev + 1, totalPaginas))}
                                disabled={pagina === totalPaginas}
                                className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modales */}
            {modalOpen && (
                <VentaModal
                    venta={ventaSeleccionada}
                    onClose={() => {
                        setModalOpen(false);
                        setVentaSeleccionada(null);
                    }}
                />
            )}

            {previewOpen && (
                <VentaPreview
                    venta={ventaSeleccionada}
                    onClose={() => {
                        setPreviewOpen(false);
                        setVentaSeleccionada(null);
                    }}
                />
            )}

            {confirmOpen && (
                <ConfirmDialog
                    titulo="Eliminar Venta"
                    mensaje={`¿Estás seguro de que deseas eliminar la venta #${ventaSeleccionada?.id}? Esta acción no se puede deshacer.`}
                    onConfirm={() => {
                        console.log('Eliminando venta:', ventaSeleccionada);
                        setConfirmOpen(false);
                        setVentaSeleccionada(null);
                    }}
                    onCancel={() => setConfirmOpen(false)}
                />
            )}
        </div>
    );
};

export default Ventas;