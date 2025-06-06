import React, { useState, useMemo } from 'react';
import {
    Plus, Search, Filter, Download, Edit2, Trash2,
    CheckCircle, AlertTriangle, AlertCircle, Circle,
    CircleDot, CircleDashed, ArrowUpDown, ImagePlus
} from 'lucide-react';
import { productos, categorias } from '../data/mockData';
import { formatPrecio } from '../utils/formatters';
import ProductoModal from '../components/modals/ProductoModal';
import ConfirmDialog from '../components/common/ConfirmDialog';

const Productos: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState<any>(null);
    const [vistaPrevia, setVistaPrevia] = useState<string | null>(null);
    const [filtroCategoria, setFiltroCategoria] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [pagina, setPagina] = useState(1);
    const [ordenamiento, setOrdenamiento] = useState({ campo: '', direccion: 'asc' });
    const [vistaGrid, setVistaGrid] = useState(true);

    const getEstadoIcono = (estado: string) => {
        switch (estado) {
            case 'activo':
                return <CircleDot size={16} className="text-green-500" />;
            case 'inactivo':
                return <Circle size={16} className="text-gray-400" />;
            case 'revision':
                return <CircleDashed size={16} className="text-orange-500" />;
            default:
                return null;
        }
    };

    const getStockIndicador = (stock: number) => {
        if (stock > 20) {
            return <CheckCircle size={16} className="text-green-500" />;
        } else if (stock >= 5) {
            return <AlertTriangle size={16} className="text-yellow-500" />;
        } else {
            return <AlertCircle size={16} className="text-red-500" />;
        }
    };

    const productosFiltrados = useMemo(() => {
        return productos
            .filter(producto => {
                const matchCategoria = !filtroCategoria || producto.categoria === filtroCategoria;
                const matchEstado = !filtroEstado || producto.destacado === (filtroEstado === 'activo');
                const matchBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase());
                return matchCategoria && matchEstado && matchBusqueda;
            })
            .sort((a, b) => {
                if (!ordenamiento.campo) return 0;
                const valorA = a[ordenamiento.campo];
                const valorB = b[ordenamiento.campo];
                return ordenamiento.direccion === 'asc' ?
                    (valorA > valorB ? 1 : -1) :
                    (valorA < valorB ? 1 : -1);
            });
    }, [productos, filtroCategoria, filtroEstado, busqueda, ordenamiento]);

    const productosEnPagina = useMemo(() => {
        const inicio = (pagina - 1) * 12;
        return productosFiltrados.slice(inicio, inicio + 12);
    }, [productosFiltrados, pagina]);

    const totalPaginas = Math.ceil(productosFiltrados.length / 12);

    const handleOrdenar = (campo: string) => {
        setOrdenamiento(prev => ({
            campo,
            direccion: prev.campo === campo && prev.direccion === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleEliminar = (producto: any) => {
        setProductoSeleccionado(producto);
        setConfirmOpen(true);
    };

    const confirmarEliminacion = () => {
        console.log('Eliminando producto:', productoSeleccionado);
        setConfirmOpen(false);
    };

    return (
        <div className="space-y-6 pt-16">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setVistaGrid(!vistaGrid)}
                        className="p-2 text-gray-600 hover:text-gray-900 bg-white rounded-lg border border-gray-200"
                    >
                        {vistaGrid ? 'Vista Tabla' : 'Vista Grid'}
                    </button>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 flex items-center"
                    >
                        <Plus size={20} className="mr-2" />
                        Nuevo Producto
                    </button>
                </div>
            </div>

            {/* Filtros y búsqueda */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <select
                    value={filtroCategoria}
                    onChange={(e) => setFiltroCategoria(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">Todas las categorías</option>
                    {categorias.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                </select>

                <select
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">Todos los estados</option>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="revision">En revisión</option>
                </select>
            </div>

            {/* Vista Grid */}
            {vistaGrid ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {productosEnPagina.map(producto => (
                        <div key={producto.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative aspect-square">
                                <img
                                    src={producto.imagen}
                                    alt={producto.nombre}
                                    className="w-full h-full object-cover cursor-pointer"
                                    onClick={() => setVistaPrevia(producto.imagen)}
                                />
                                <div className="absolute top-2 right-2 flex space-x-1">
                                    {getEstadoIcono(producto.estado)}
                                    {getStockIndicador(producto.stock)}
                                </div>
                            </div>

                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">{producto.nombre}</h3>
                                <span className="inline-block px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800 mb-2">
                                    {categorias.find(c => c.id === producto.categoria)?.nombre}
                                </span>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-lg font-bold text-gray-900">{formatPrecio(producto.precio)}</span>
                                    <span className="text-sm text-gray-600">{producto.stock} unidades</span>
                                </div>

                                <div className="flex justify-end space-x-2 mt-4">
                                    <button
                                        onClick={() => {
                                            setProductoSeleccionado(producto);
                                            setModalOpen(true);
                                        }}
                                        className="p-2 text-blue-600 hover:text-blue-800"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleEliminar(producto)}
                                        className="p-2 text-red-600 hover:text-red-800"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Vista Tabla */
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Producto
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleOrdenar('categoria')}>
                                        <div className="flex items-center">
                                            Categoría
                                            <ArrowUpDown size={14} className="ml-1" />
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleOrdenar('precio')}>
                                        <div className="flex items-center">
                                            Precio
                                            <ArrowUpDown size={14} className="ml-1" />
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleOrdenar('stock')}>
                                        <div className="flex items-center">
                                            Stock
                                            <ArrowUpDown size={14} className="ml-1" />
                                        </div>
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
                                {productosEnPagina.map(producto => (
                                    <tr key={producto.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img
                                                        className="h-10 w-10 rounded-lg object-cover cursor-pointer"
                                                        src={producto.imagen}
                                                        alt={producto.nombre}
                                                        onClick={() => setVistaPrevia(producto.imagen)}
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{producto.nombre}</div>
                                                    <div className="text-sm text-gray-500">{producto.descripcion}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                                                {categorias.find(c => c.id === producto.categoria)?.nombre}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-medium text-gray-900">
                                                {formatPrecio(producto.precio)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {getStockIndicador(producto.stock)}
                                                <span className="ml-2 text-sm text-gray-900">{producto.stock} unidades</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {getEstadoIcono(producto.estado)}
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{producto.estado}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setProductoSeleccionado(producto);
                                                        setModalOpen(true);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleEliminar(producto)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Paginación */}
            <div className="flex justify-between items-center">
                <div className="text-sm text-gray-700">
                    Mostrando {((pagina - 1) * 12) + 1} a {Math.min(pagina * 12, productosFiltrados.length)} de {productosFiltrados.length} productos
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setPagina(prev => Math.max(prev - 1, 1))}
                        disabled={pagina === 1}
                        className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <button
                        onClick={() => setPagina(prev => Math.min(prev + 1, totalPaginas))}
                        disabled={pagina === totalPaginas}
                        className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
                    >
                        Siguiente
                    </button>
                </div>
            </div>

            {/* Modal de vista previa de imagen */}
            {vistaPrevia && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setVistaPrevia(null)}
                >
                    <div className="max-w-4xl max-h-[90vh] overflow-hidden rounded-lg">
                        <img
                            src={vistaPrevia}
                            alt="Vista previa"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>
            )}

            {/* Modal de producto */}
            {modalOpen && (
                <ProductoModal
                    producto={productoSeleccionado}
                    onClose={() => {
                        setModalOpen(false);
                        setProductoSeleccionado(null);
                    }}
                    categorias={categorias}
                />
            )}

            {/* Diálogo de confirmación */}
            {confirmOpen && (
                <ConfirmDialog
                    titulo="Eliminar Producto"
                    mensaje={`¿Estás seguro de que deseas eliminar el producto "${productoSeleccionado?.nombre}"?`}
                    onConfirm={confirmarEliminacion}
                    onCancel={() => setConfirmOpen(false)}
                />
            )}
        </div>
    );
};

export default Productos;