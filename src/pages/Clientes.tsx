import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, ArrowUpDown, User } from 'lucide-react';
import { clientes } from '../data/mockData';
import { formatFecha } from '../utils/formatters';
import ClienteModal from '../components/modals/ClienteModal';
import ConfirmDialog from '../components/common/ConfirmDialog';

const Clientes: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [clienteSeleccionado, setClienteSeleccionado] = useState<any>(null);
    const [busqueda, setBusqueda] = useState('');
    const [pagina, setPagina] = useState(1);
    const [ordenamiento, setOrdenamiento] = useState({ campo: '', direccion: 'asc' });

    const clientesFiltrados = useMemo(() => {
        return clientes
            .filter(cliente => {
                const searchTerm = busqueda.toLowerCase();
                return (
                    cliente.nombre.toLowerCase().includes(searchTerm) ||
                    cliente.email.toLowerCase().includes(searchTerm) ||
                    cliente.telefono.includes(searchTerm)
                );
            })
            .sort((a, b) => {
                if (!ordenamiento.campo) return 0;
                const valorA = a[ordenamiento.campo];
                const valorB = b[ordenamiento.campo];
                return ordenamiento.direccion === 'asc' ?
                    (valorA > valorB ? 1 : -1) :
                    (valorA < valorB ? 1 : -1);
            });
    }, [clientes, busqueda, ordenamiento]);

    const clientesEnPagina = useMemo(() => {
        const inicio = (pagina - 1) * 20;
        return clientesFiltrados.slice(inicio, inicio + 20);
    }, [clientesFiltrados, pagina]);

    const totalPaginas = Math.ceil(clientesFiltrados.length / 20);

    const handleOrdenar = (campo: string) => {
        setOrdenamiento(prev => ({
            campo,
            direccion: prev.campo === campo && prev.direccion === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleEliminar = (cliente: any) => {
        setClienteSeleccionado(cliente);
        setConfirmOpen(true);
    };

    const confirmarEliminacion = () => {
        // Aquí iría la lógica para eliminar el cliente
        console.log('Eliminando cliente:', clienteSeleccionado);
        setConfirmOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                        <User size={28} className="mr-3 text-blue-600" />
                        Clientes
                    </h1>
                    <p className="text-gray-700 mt-1 text-sm sm:text-base">
                        Aquí puedes gestionar todos los clientes de tu negocio. Agrega, edita o elimina clientes según sea necesario.
                    </p>
                </div>
                <button
                    onClick={() => setModalOpen(true)}
                    className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 flex items-center"
                >
                    <Plus size={20} className="mr-2" />
                    Nuevo Cliente
                </button>
            </div>

            {/* Búsqueda */}
            <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar por nombre, email o teléfono..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {/* Tabla de clientes */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleOrdenar('id')}>
                                    <div className="flex items-center">
                                        ID
                                        <ArrowUpDown size={14} className="ml-1" />
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleOrdenar('nombre')}>
                                    <div className="flex items-center">
                                        Nombre
                                        <ArrowUpDown size={14} className="ml-1" />
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleOrdenar('email')}>
                                    <div className="flex items-center">
                                        Email
                                        <ArrowUpDown size={14} className="ml-1" />
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Teléfono
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Dirección
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleOrdenar('ultimaCompra')}>
                                    <div className="flex items-center">
                                        Última Compra
                                        <ArrowUpDown size={14} className="ml-1" />
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {clientesEnPagina.map((cliente) => (
                                <tr key={cliente.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        #{cliente.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{cliente.nombre}</div>
                                        {cliente.tipoCliente === 'empresa' && (
                                            <div className="text-xs text-gray-500">RUC: {cliente.identificacion}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{cliente.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{cliente.telefono}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{cliente.direccion}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{formatFecha(cliente.ultimaCompra)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => {
                                                    setClienteSeleccionado(cliente);
                                                    setModalOpen(true);
                                                }}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleEliminar(cliente)}
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

                {/* Paginación */}
                <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => setPagina(prev => Math.max(prev - 1, 1))}
                                disabled={pagina === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Anterior
                            </button>
                            <button
                                onClick={() => setPagina(prev => Math.min(prev + 1, totalPaginas))}
                                disabled={pagina === totalPaginas}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Siguiente
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Mostrando <span className="font-medium">{((pagina - 1) * 20) + 1}</span> a{' '}
                                    <span className="font-medium">
                                        {Math.min(pagina * 20, clientesFiltrados.length)}
                                    </span>{' '}
                                    de <span className="font-medium">{clientesFiltrados.length}</span> resultados
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        onClick={() => setPagina(1)}
                                        disabled={pagina === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                    >
                                        Primera
                                    </button>
                                    <button
                                        onClick={() => setPagina(prev => Math.max(prev - 1, 1))}
                                        disabled={pagina === 1}
                                        className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                    >
                                        Anterior
                                    </button>
                                    {[...Array(totalPaginas)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => setPagina(i + 1)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pagina === i + 1
                                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setPagina(prev => Math.min(prev + 1, totalPaginas))}
                                        disabled={pagina === totalPaginas}
                                        className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                    >
                                        Siguiente
                                    </button>
                                    <button
                                        onClick={() => setPagina(totalPaginas)}
                                        disabled={pagina === totalPaginas}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                    >
                                        Última
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de cliente */}
            {modalOpen && (
                <ClienteModal
                    cliente={clienteSeleccionado}
                    onClose={() => {
                        setModalOpen(false);
                        setClienteSeleccionado(null);
                    }}
                />
            )}

            {/* Diálogo de confirmación */}
            {confirmOpen && (
                <ConfirmDialog
                    titulo="Eliminar Cliente"
                    mensaje={`¿Estás seguro de que deseas eliminar al cliente "${clienteSeleccionado?.nombre}"? Esta acción no se puede deshacer.`}
                    onConfirm={confirmarEliminacion}
                    onCancel={() => setConfirmOpen(false)}
                />
            )}
        </div>
    );
};

export default Clientes;