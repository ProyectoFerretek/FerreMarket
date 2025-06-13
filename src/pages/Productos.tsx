import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
    Plus,
    Search,
    Filter,
    ArrowUpDown,
    Edit2,
    Trash2,
    CheckCircle,
    AlertTriangle,
    AlertCircle,
    Circle,
    CircleDot,
    CircleDashed,
    Eye,
    X,
    ChevronDown,
    Calculator,
    Box,
} from "lucide-react";
import { categorias, eliminarProducto, obtenerProductos } from "../data/mockData";
import { formatPrecio } from "../utils/formatters";
import ProductoModal from "../components/modals/ProductoModal";
import ConfirmDialog from "../components/common/ConfirmDialog";

const Productos: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [modalOpen, setModalOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState<any>(null);
    const [vistaPrevia, setVistaPrevia] = useState<string | null>(null);
    const [filtroCategoria, setFiltroCategoria] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("");
    const [busqueda, setBusqueda] = useState("");
    const [pagina, setPagina] = useState(1);
    const [itemsPorPagina, setItemsPorPagina] = useState(10);
    const [ordenamiento, setOrdenamiento] = useState({
        campo: "",
        direccion: "asc",
    });
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [vistaActual, setVistaActual] = useState<"tabla" | "grid">("grid");
    const [productos, setProductos] = useState<Producto[]>([]);
    
    const cargarProductos = async () => {
        const productosData = await obtenerProductos();
        setProductos(productosData);
    }

    useEffect(() => {
        cargarProductos();
    }, []);

    // Efecto para aplicar filtro de categoría desde URL
    useEffect(() => {
        const categoriaParam = searchParams.get("categoria");
        if (categoriaParam) {
            setFiltroCategoria(categoriaParam);
            // Limpiar el parámetro de la URL después de aplicarlo
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.delete("categoria");
            setSearchParams(newSearchParams, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    const getEstadoIcono = (estado: string) => {
        switch (estado) {
            case "activo":
                return <CircleDot size={16} className="text-green-500" />;
            case "inactivo":
                return <Circle size={16} className="text-gray-400" />;
            case "revision":
                return <CircleDashed size={16} className="text-orange-500" />;
            default:
                return <CircleDot size={16} className="text-green-500" />;
        }
    };

    const getStockIndicador = (stock: number) => {
        if (stock > 20) {
            return {
                icon: <CheckCircle size={16} className="text-green-500" />,
                color: "text-green-600",
                bgColor: "bg-green-50",
                label: "Disponible",
            };
        } else if (stock >= 5) {
            return {
                icon: <AlertTriangle size={16} className="text-yellow-500" />,
                color: "text-yellow-600",
                bgColor: "bg-yellow-50",
                label: "Stock bajo",
            };
        } else if (stock > 0) {
            return {
                icon: <AlertCircle size={16} className="text-red-500" />,
                color: "text-red-600",
                bgColor: "bg-red-50",
                label: "Muy bajo",
            };
        } else {
            return {
                icon: <Circle size={16} className="text-gray-400" />,
                color: "text-gray-500",
                bgColor: "bg-gray-50",
                label: "Sin stock",
            };
        }
    };

    const productosFiltrados = useMemo(() => {
        return productos
            .filter((producto) => {
                const matchCategoria =
                    !filtroCategoria || producto.categoria === filtroCategoria;
                const matchEstado =
                    !filtroEstado ||
                    producto.destacado === (filtroEstado === "activo");
                const matchBusqueda =
                    producto.nombre
                        .toLowerCase()
                        .includes(busqueda.toLowerCase()) ||
                    producto.descripcion
                        .toLowerCase()
                        .includes(busqueda.toLowerCase());
                return matchCategoria && matchEstado && matchBusqueda;
            })
            .sort((a, b) => {
                if (!ordenamiento.campo) return 0;
                const valorA = a[ordenamiento.campo];
                const valorB = b[ordenamiento.campo];
                return ordenamiento.direccion === "asc"
                    ? valorA > valorB
                        ? 1
                        : -1
                    : valorA < valorB
                    ? 1
                    : -1;
            });
    }, [productos, filtroCategoria, filtroEstado, busqueda, ordenamiento]);

    const productosEnPagina = useMemo(() => {
        const inicio = (pagina - 1) * itemsPorPagina;
        return productosFiltrados.slice(inicio, inicio + itemsPorPagina);
    }, [productosFiltrados, pagina, itemsPorPagina]);

    const totalPaginas = Math.ceil(productosFiltrados.length / itemsPorPagina);

    const handleOrdenar = (campo: string) => {
        setOrdenamiento((prev) => ({
            campo,
            direccion:
                prev.campo === campo && prev.direccion === "asc"
                    ? "desc"
                    : "asc",
        }));
    };

    const handleEliminar = (producto: any) => {
        setProductoSeleccionado(producto);
        setConfirmOpen(true);
    };

    const confirmarEliminacion = async () => {
        eliminarProducto(productoSeleccionado.id);
        await cargarProductos(); // Recargar productos después de eliminar

        setConfirmOpen(false);
        setProductoSeleccionado(null);
    };

    const limpiarFiltros = () => {
        setBusqueda("");
        setFiltroCategoria("");
        setFiltroEstado("");
        setPagina(1);
    };

    const handleItemsPorPaginaChange = (nuevaCantidad: number) => {
        setItemsPorPagina(nuevaCantidad);
        setPagina(1);
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                        <Box size={28} className="mr-3 text-blue-600" />
                        Productos
                    </h1>
                    <p className="text-gray-700 mt-1 text-sm sm:text-base">
                        Gestiona los productos de tu inventario, agrega nuevos
                        artículos y organiza tu catálogo de manera eficiente.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    {/* Selector de vista - solo en desktop */}
                    <div className="hidden lg:flex items-center bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setVistaActual("grid")}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                                vistaActual === "grid"
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-600"
                            }`}
                        >
                            Grid
                        </button>
                        <button
                            onClick={() => setVistaActual("tabla")}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                                vistaActual === "tabla"
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-600"
                            }`}
                        >
                            Tabla
                        </button>
                    </div>

                    <button
                        onClick={() => setModalOpen(true)}
                        className="bg-orange-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-amber-700 flex items-center text-sm font-medium"
                    >
                        <Plus size={16} className="mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Nuevo Producto</span>
                        <span className="sm:hidden">Nuevo</span>
                    </button>
                </div>
            </div>

            {/* Filtros y búsqueda */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex flex-col space-y-4">
                    {/* Primera fila: Búsqueda y botón de filtros móvil */}
                    <div className="flex items-center space-x-3">
                        <div className="relative flex-1">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                            />
                        </div>

                        <button
                            onClick={() => setMostrarFiltros(!mostrarFiltros)}
                            className="lg:hidden flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <Filter size={16} className="mr-1" />
                            Filtros
                        </button>
                    </div>

                    {/* Filtros adicionales */}
                    <div
                        className={`${
                            mostrarFiltros ? "block" : "hidden"
                        } lg:block`}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                            <select
                                value={filtroCategoria}
                                onChange={(e) =>
                                    setFiltroCategoria(e.target.value)
                                }
                                className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                            >
                                <option value="">Todas las categorías</option>
                                {categorias.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.nombre}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={filtroEstado}
                                onChange={(e) =>
                                    setFiltroEstado(e.target.value)
                                }
                                className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                            >
                                <option value="">Todos los estados</option>
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
                            </select>

                            <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-600 whitespace-nowrap">
                                    Mostrar:
                                </span>
                                <select
                                    value={itemsPorPagina}
                                    onChange={(e) =>
                                        handleItemsPorPaginaChange(
                                            Number(e.target.value)
                                        )
                                    }
                                    className="px-2 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                                >
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </div>

                            <button
                                onClick={limpiarFiltros}
                                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                            >
                                Limpiar
                            </button>

                            <div className="text-xs text-gray-600 flex items-center">
                                {productosFiltrados.length} producto
                                {productosFiltrados.length !== 1 ? "s" : ""}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vista Grid (por defecto en móvil) */}
            {(vistaActual === "grid" || window.innerWidth < 1024) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {productosEnPagina.map((producto) => {
                        const stockInfo = getStockIndicador(producto.stock);

                        return (
                            <div
                                key={producto.id}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col"
                            >
                                {/* Imagen */}
                                <div className="relative">
                                    <img
                                        className="w-full h-40 sm:h-48 object-cover cursor-pointer"
                                        src={producto.imagen}
                                        alt={producto.nombre}
                                        onClick={() =>
                                            setVistaPrevia(producto.imagen)
                                        }
                                    />
                                    <div className="absolute top-2 right-2 flex space-x-1">
                                        {getEstadoIcono("activo")}
                                    </div>
                                </div>

                                {/* Contenido */}
                                <div className="p-4 flex-grow flex flex-col">
                                    <div className="flex-grow space-y-3">
                                        {/* Nombre y categoría */}
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
                                                {producto.nombre}
                                            </h3>
                                            <span className="inline-block mt-1 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                                {
                                                    categorias.find(
                                                        (c) =>
                                                            c.id ===
                                                            producto.categoria
                                                    )?.nombre
                                                }
                                            </span>
                                        </div>

                                        {/* Descripción */}
                                        <p className="text-xs text-gray-600 line-clamp-2">
                                            {producto.descripcion}
                                        </p>

                                        {/* Precio */}
                                        <div className="text-lg font-bold text-gray-900">
                                            {formatPrecio(producto.precio)}
                                        </div>

                                        {/* Stock */}
                                        <div className="space-y-2">
                                            <div
                                                className={`flex items-center justify-between p-2 rounded-md bg-zinc-100`}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <Calculator
                                                        size={16}
                                                        className="text-zinc-600"
                                                    />
                                                    <span
                                                        className={`text-xs font-medium bg-zinc-50`}
                                                    >
                                                        {producto.stock}{" "}
                                                        unidades
                                                    </span>
                                                </div>
                                            </div>

                                            <div
                                                className={`flex items-center justify-between p-2 rounded-md ${stockInfo.bgColor}`}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    {stockInfo.icon}
                                                    <span
                                                        className={`text-xs font-medium ${stockInfo.color}`}
                                                    >
                                                        {stockInfo.label}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Acciones */}
                                    <div className="mt-4 flex space-x-2">
                                        <button
                                            onClick={() =>
                                                setVistaPrevia(producto.imagen)
                                            }
                                            className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                                        >
                                            <Eye size={14} className="mr-1" />
                                            Ver
                                        </button>
                                        <button
                                            onClick={() => {
                                                setProductoSeleccionado(
                                                    producto
                                                );
                                                setModalOpen(true);
                                            }}
                                            className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
                                        >
                                            <Edit2 size={14} className="mr-1" />
                                            Editar
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleEliminar(producto)
                                            }
                                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Vista Tabla (solo en desktop) */}
            {vistaActual === "tabla" && window.innerWidth >= 1024 && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Producto
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() =>
                                            handleOrdenar("categoria")
                                        }
                                    >
                                        <div className="flex items-center">
                                            Categoría
                                            <ArrowUpDown
                                                size={14}
                                                className="ml-1"
                                            />
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleOrdenar("precio")}
                                    >
                                        <div className="flex items-center">
                                            Precio
                                            <ArrowUpDown
                                                size={14}
                                                className="ml-1"
                                            />
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleOrdenar("stock")}
                                    >
                                        <div className="flex items-center">
                                            Stock
                                            <ArrowUpDown
                                                size={14}
                                                className="ml-1"
                                            />
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
                                {productosEnPagina.map((producto) => {
                                    const stockInfo = getStockIndicador(
                                        producto.stock
                                    );

                                    return (
                                        <tr
                                            key={producto.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img
                                                            className="h-10 w-10 rounded-lg object-cover cursor-pointer"
                                                            src={
                                                                producto.imagen
                                                            }
                                                            alt={
                                                                producto.nombre
                                                            }
                                                            onClick={() =>
                                                                setVistaPrevia(
                                                                    producto.imagen
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {producto.nombre}
                                                        </div>
                                                        <div className="text-sm text-gray-500 truncate max-w-xs">
                                                            {
                                                                producto.descripcion
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                                                    {
                                                        categorias.find(
                                                            (c) =>
                                                                c.id ===
                                                                producto.categoria
                                                        )?.nombre
                                                    }
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {formatPrecio(
                                                        producto.precio
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {stockInfo.icon}
                                                    <span className="ml-2 text-sm text-gray-900">
                                                        {producto.stock}{" "}
                                                        unidades
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {getEstadoIcono("activo")}
                                                    <span className="ml-2 text-sm">
                                                        Activo
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            setProductoSeleccionado(
                                                                producto
                                                            );
                                                            setModalOpen(true);
                                                        }}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleEliminar(
                                                                producto
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Paginación */}
            {totalPaginas > 1 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3">
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                        <div className="text-sm text-gray-700 text-center sm:text-left">
                            Mostrando {(pagina - 1) * itemsPorPagina + 1} a{" "}
                            {Math.min(
                                pagina * itemsPorPagina,
                                productosFiltrados.length
                            )}{" "}
                            de {productosFiltrados.length} productos
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() =>
                                    setPagina((prev) => Math.max(prev - 1, 1))
                                }
                                disabled={pagina === 1}
                                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Anterior
                            </button>

                            <span className="text-sm text-gray-600">
                                {pagina} de {totalPaginas}
                            </span>

                            <button
                                onClick={() =>
                                    setPagina((prev) =>
                                        Math.min(prev + 1, totalPaginas)
                                    )
                                }
                                disabled={pagina === totalPaginas}
                                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de vista previa de imagen */}
            {vistaPrevia && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={() => setVistaPrevia(null)}
                >
                    <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-lg">
                        <button
                            onClick={() => setVistaPrevia(null)}
                            className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
                        >
                            <X size={20} />
                        </button>
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
                        cargarProductos();
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