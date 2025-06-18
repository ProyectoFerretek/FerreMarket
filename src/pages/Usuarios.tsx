import React, { useState, useMemo, useEffect } from "react";
import {
    Plus,
    Search,
    Filter,
    ArrowUpDown,
    Edit2,
    Trash2,
    Shield,
    ShieldCheck,
    User,
    Users,
    Eye,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    AlertTriangle,
    Lock,
} from "lucide-react";
import { agregarUsuario, eliminarUsuario, obtenerUsuarios } from "../data/mockData";
import { formatFecha } from "../utils/formatters";
import { puedeGestionarUsuarios, puedeRealizarAccion } from "../utils/auth";
import UsuarioModal from "../components/modals/UsuarioModal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import type { Usuario, UsuarioFormData } from "../types";

const GestionUsuarios: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] =
        useState<Usuario | null>(null);
    const [busqueda, setBusqueda] = useState("");
    const [filtroRol, setFiltroRol] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("");
    const [pagina, setPagina] = useState(1);
    const [itemsPorPagina, setItemsPorPagina] = useState(10);
    const [ordenamiento, setOrdenamiento] = useState<{
        campo: keyof Usuario;
        direccion: "asc" | "desc";
    }>({
        campo: "fechaCreacion",
        direccion: "desc",
    });
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    const [usuarios, setUsuarios] = useState<Usuario[]>([]);

    const cargarUsuarios = async () => {
        const data = await obtenerUsuarios();
        setUsuarios(data);
    };

    useEffect(() => {
        cargarUsuarios();
    }, []);

    // Verificar permisos
    if (!puedeGestionarUsuarios()) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Shield size={64} className="mx-auto text-gray-400 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Acceso Restringido
                    </h2>
                    <p className="text-gray-600 mb-4">
                        No tienes permisos para acceder a la gestión de
                        usuarios.
                    </p>
                    <p className="text-sm text-gray-500">
                        Contacta al administrador del sistema si necesitas
                        acceso.
                    </p>
                </div>
            </div>
        );
    }

    const usuariosFiltrados = useMemo(() => {
        return usuarios
            .filter((usuario) => {
                const matchBusqueda =
                    usuario.nombre
                        .toLowerCase()
                        .includes(busqueda.toLowerCase()) ||
                    usuario.email
                        .toLowerCase()
                        .includes(busqueda.toLowerCase());
                const matchRol = !filtroRol || usuario.rol === filtroRol;
                const matchEstado =
                    !filtroEstado || usuario.estado === filtroEstado;
                return matchBusqueda && matchRol && matchEstado;
            })
            .sort((a, b) => {
                const valorA = a[ordenamiento.campo];
                const valorB = b[ordenamiento.campo];
                if (valorA < valorB)
                    return ordenamiento.direccion === "asc" ? -1 : 1;
                if (valorA > valorB)
                    return ordenamiento.direccion === "asc" ? 1 : -1;
                return 0;
            });
    }, [usuarios, busqueda, filtroRol, filtroEstado, ordenamiento]);

    const totalPaginas = Math.ceil(usuariosFiltrados.length / itemsPorPagina);
    const usuariosEnPagina = usuariosFiltrados.slice(
        (pagina - 1) * itemsPorPagina,
        pagina * itemsPorPagina
    );

    const handleOrdenar = (campo: keyof Usuario) => {
        setOrdenamiento((prev) => ({
            campo,
            direccion:
                prev.campo === campo && prev.direccion === "asc"
                    ? "desc"
                    : "asc",
        }));
    };

    const handleEliminar = (usuario: Usuario) => {
        setUsuarioSeleccionado(usuario);
        setConfirmOpen(true);
    };

    const handleRecuperar = (usuario: Usuario) => {}

    const confirmarEliminacion = async () => {
        // await eliminarCuenta(usuarioSeleccionado!.id).then(async () => {
        //     await eliminarUsuario(usuarioSeleccionado!.id);
        //     await cargarUsuarios();
        // })

        setConfirmOpen(false);
        setUsuarioSeleccionado(null);
    };

    const handleGuardarUsuario = async (usuarioData: UsuarioFormData) => {
        if (usuarioSeleccionado) {
            console.log("Actualizando usuario:", usuarioData);
        } else {
            const NuevoUsuario = {
                uid: "",
                nombre: usuarioData.nombre,
                email: usuarioData.email,
                rol: usuarioData.rol || "usuario",
                estado: usuarioData.estado || "activo",
                fechaCreacion: new Date().toISOString(),
                ultimaModificacion: new Date().toISOString(),
                ultimoAcceso: new Date().toISOString(),
            }

            await registrarCuenta(usuarioData.email, usuarioData.password).then(async (usuario) => {
              NuevoUsuario.uid = usuario.user.uid;
              await agregarUsuario(NuevoUsuario)
            })

            await cargarUsuarios()
        }
    };

    const limpiarFiltros = () => {
        setBusqueda("");
        setFiltroRol("");
        setFiltroEstado("");
        setPagina(1);
    };

    const getEstadoIcono = (estado: string) => {
        return estado === "activo" ? (
            <CheckCircle size={16} className="text-green-500" />
        ) : (
            <XCircle size={16} className="text-red-500" />
        );
    };

    const getRolIcono = (rol: string) => {
        return rol === "admin" ? (
            <ShieldCheck size={16} className="text-blue-600" />
        ) : (
            <User size={16} className="text-gray-600" />
        );
    };

    const getUltimoAccesoEstado = (ultimoAcceso?: string) => {
        if (!ultimoAcceso)
            return {
                texto: "Nunca",
                color: "text-gray-500",
                icono: <XCircle size={14} />,
            };

        const fecha = new Date(ultimoAcceso);
        const ahora = new Date();
        const diferenciaDias = Math.floor(
            (ahora.getTime() - fecha.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diferenciaDias === 0) {
            return {
                texto: "Hoy",
                color: "text-green-600",
                icono: <CheckCircle size={14} />,
            };
        } else if (diferenciaDias <= 7) {
            return {
                texto: `Hace ${diferenciaDias} día${
                    diferenciaDias > 1 ? "s" : ""
                }`,
                color: "text-yellow-600",
                icono: <Clock size={14} />,
            };
        } else {
            return {
                texto: `Hace ${diferenciaDias} días`,
                color: "text-red-600",
                icono: <AlertTriangle size={14} />,
            };
        }
    };

    // Estadísticas rápidas
    const estadisticas = useMemo(() => {
        const total = usuarios.length;
        const activos = usuarios.filter((u) => u.estado === "activo").length;
        const administradores = usuarios.filter(
            (u) => u.rol === "admin"
        ).length;
        const conectadosHoy = usuarios.filter((u) => {
            if (!u.ultimoAcceso) return false;
            const fecha = new Date(u.ultimoAcceso);
            const hoy = new Date();
            return fecha.toDateString() === hoy.toDateString();
        }).length;

        return { total, activos, administradores, conectadosHoy };
    }, [usuarios]);

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                        <Users size={28} className="mr-3 text-blue-600" />
                        Gestión de Usuarios
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Administra usuarios del sistema y sus permisos
                    </p>
                </div>
                {puedeRealizarAccion("crear") && (
                    <button
                        onClick={() => {
                            setUsuarioSeleccionado(null);
                            setModalOpen(true);
                        }}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-amber-700 flex items-center text-sm font-medium transition-colors"
                    >
                        <Plus size={16} className="mr-2" />
                        <span className="hidden sm:inline">Nuevo Usuario</span>
                        <span className="sm:hidden">Nuevo</span>
                    </button>
                )}
            </div>

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <Users size={20} className="text-blue-600 mr-3" />
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {estadisticas.total}
                            </p>
                            <p className="text-xs text-gray-600">
                                Total usuarios
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <CheckCircle
                            size={20}
                            className="text-green-600 mr-3"
                        />
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {estadisticas.activos}
                            </p>
                            <p className="text-xs text-gray-600">
                                Usuarios activos
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <ShieldCheck
                            size={20}
                            className="text-purple-600 mr-3"
                        />
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {estadisticas.administradores}
                            </p>
                            <p className="text-xs text-gray-600">
                                Administradores
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <Clock size={20} className="text-orange-600 mr-3" />
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {estadisticas.conectadosHoy}
                            </p>
                            <p className="text-xs text-gray-600">
                                Conectados hoy
                            </p>
                        </div>
                    </div>
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
                                placeholder="Buscar por nombre o email..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                                value={filtroRol}
                                onChange={(e) => setFiltroRol(e.target.value)}
                                className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            >
                                <option value="">Todos los roles</option>
                                <option value="admin">Administrador</option>
                                <option value="usuario">Usuario</option>
                            </select>

                            <select
                                value={filtroEstado}
                                onChange={(e) =>
                                    setFiltroEstado(e.target.value)
                                }
                                className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                                    onChange={(e) => {
                                        setItemsPorPagina(
                                            Number(e.target.value)
                                        );
                                        setPagina(1);
                                    }}
                                    className="px-2 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                >
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>

                            <button
                                onClick={limpiarFiltros}
                                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                            >
                                Limpiar
                            </button>

                            <div className="text-xs text-gray-600 flex items-center">
                                {usuariosFiltrados.length} usuario
                                {usuariosFiltrados.length !== 1 ? "s" : ""}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabla de usuarios - Vista desktop */}
            <div className="hidden lg:block bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Usuario
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleOrdenar("rol")}
                                >
                                    <div className="flex items-center">
                                        Rol
                                        <ArrowUpDown
                                            size={14}
                                            className="ml-1"
                                        />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleOrdenar("estado")}
                                >
                                    <div className="flex items-center">
                                        Estado
                                        <ArrowUpDown
                                            size={14}
                                            className="ml-1"
                                        />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() =>
                                        handleOrdenar("ultimoAcceso")
                                    }
                                >
                                    <div className="flex items-center">
                                        Último Acceso
                                        <ArrowUpDown
                                            size={14}
                                            className="ml-1"
                                        />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() =>
                                        handleOrdenar("fechaCreacion")
                                    }
                                >
                                    <div className="flex items-center">
                                        Fecha Creación
                                        <ArrowUpDown
                                            size={14}
                                            className="ml-1"
                                        />
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {usuariosEnPagina.map((usuario) => {
                                const ultimoAccesoInfo = getUltimoAccesoEstado(
                                    usuario.ultimoAcceso
                                );

                                return (
                                    <tr
                                        key={usuario.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    {usuario.avatar ? (
                                                        <img
                                                            className="h-10 w-10 rounded-full object-cover"
                                                            src={usuario.avatar}
                                                            alt={usuario.nombre}
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                            <User
                                                                size={20}
                                                                className="text-gray-600"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {usuario.nombre}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {usuario.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {getRolIcono(usuario.rol)}
                                                <span
                                                    className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                                                        usuario.rol === "admin"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : "bg-gray-100 text-gray-800"
                                                    }`}
                                                >
                                                    {usuario.rol === "admin"
                                                        ? "Administrador"
                                                        : "Usuario"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {getEstadoIcono(usuario.estado)}
                                                <span
                                                    className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                                                        usuario.estado ===
                                                        "activo"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {usuario.estado === "activo"
                                                        ? "Activo"
                                                        : "Inactivo"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <span
                                                    className={`${ultimoAccesoInfo.color} mr-2`}
                                                >
                                                    {ultimoAccesoInfo.icono}
                                                </span>
                                                <span
                                                    className={`text-sm ${ultimoAccesoInfo.color}`}
                                                >
                                                    {ultimoAccesoInfo.texto}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {formatFecha(
                                                    usuario.fechaCreacion
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                {puedeRealizarAccion("ver") && (
                                                    <button
                                                        onClick={() => {
                                                            setUsuarioSeleccionado(
                                                                usuario
                                                            );
                                                            setModalOpen(true);
                                                        }}
                                                        className="text-gray-600 hover:text-gray-900 p-1 rounded"
                                                        title="Ver detalles"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                )}
                                                {puedeRealizarAccion(
                                                    "editar"
                                                ) && (
                                                    <button
                                                        onClick={() => {
                                                            setUsuarioSeleccionado(
                                                                usuario
                                                            );
                                                            setModalOpen(true);
                                                        }}
                                                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                                        title="Editar"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                )}
                                                {puedeRealizarAccion(
                                                    "recuperar"
                                                ) &&
                                                    usuario.id !== "1" && (
                                                        <button
                                                            onClick={() =>
                                                                handleRecuperar(
                                                                    usuario
                                                                )
                                                            }
                                                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                                            title="Recuperar Contraseña"
                                                        >
                                                            <Lock size={16} />
                                                        </button>
                                                    )}
                                                {puedeRealizarAccion(
                                                    "eliminar"
                                                ) &&
                                                    usuario.id !== "1" && (
                                                        <button
                                                            onClick={() =>
                                                                handleEliminar(
                                                                    usuario
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-900 p-1 rounded"
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Vista móvil - Cards */}
            <div className="lg:hidden space-y-4">
                {usuariosEnPagina.map((usuario) => {
                    const ultimoAccesoInfo = getUltimoAccesoEstado(
                        usuario.ultimoAcceso
                    );

                    return (
                        <div
                            key={usuario.id}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                        >
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    {usuario.avatar ? (
                                        <img
                                            className="h-12 w-12 rounded-full object-cover"
                                            src={usuario.avatar}
                                            alt={usuario.nombre}
                                        />
                                    ) : (
                                        <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                                            <User
                                                size={24}
                                                className="text-gray-600"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium text-gray-900 truncate">
                                            {usuario.nombre}
                                        </h3>
                                        <div className="flex items-center space-x-1">
                                            {getRolIcono(usuario.rol)}
                                            {getEstadoIcono(usuario.estado)}
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-500 truncate">
                                        {usuario.email}
                                    </p>

                                    <div className="mt-2 flex items-center justify-between">
                                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                                            <span
                                                className={`px-2 py-1 rounded-full ${
                                                    usuario.rol === "admin"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "bg-gray-100 text-gray-800"
                                                }`}
                                            >
                                                {usuario.rol === "admin"
                                                    ? "Admin"
                                                    : "Usuario"}
                                            </span>
                                            <span
                                                className={`px-2 py-1 rounded-full ${
                                                    usuario.estado === "activo"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {usuario.estado === "activo"
                                                    ? "Activo"
                                                    : "Inactivo"}
                                            </span>
                                        </div>

                                        <div className="flex space-x-2">
                                            {puedeRealizarAccion("editar") && (
                                                <button
                                                    onClick={() => {
                                                        setUsuarioSeleccionado(
                                                            usuario
                                                        );
                                                        setModalOpen(true);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex space-x-2">
                                            {puedeRealizarAccion("eliminar") &&
                                                usuario.id !== "1" && (
                                                    <button
                                                        onClick={() =>
                                                            handleRecuperar(
                                                                usuario
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50"
                                                    >
                                                        <Lock size={16} />
                                                    </button>
                                                )}
                                        </div>
                                    </div>

                                    <div className="mt-2 text-xs text-gray-500 flex items-center">
                                        <Calendar size={12} className="mr-1" />
                                        Creado:{" "}
                                        {formatFecha(usuario.fechaCreacion)}
                                    </div>

                                    <div className="mt-1 text-xs flex items-center">
                                        <span
                                            className={`${ultimoAccesoInfo.color} mr-1`}
                                        >
                                            {ultimoAccesoInfo.icono}
                                        </span>
                                        <span
                                            className={ultimoAccesoInfo.color}
                                        >
                                            Último acceso:{" "}
                                            {ultimoAccesoInfo.texto}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Paginación */}
            {totalPaginas > 1 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3">
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                        <div className="text-sm text-gray-700 text-center sm:text-left">
                            Mostrando {(pagina - 1) * itemsPorPagina + 1} a{" "}
                            {Math.min(
                                pagina * itemsPorPagina,
                                usuariosFiltrados.length
                            )}{" "}
                            de {usuariosFiltrados.length} usuarios
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

            {/* Modal de usuario */}
            {modalOpen && (
                <UsuarioModal
                    usuario={usuarioSeleccionado}
                    onClose={() => {
                        setModalOpen(false);
                        setUsuarioSeleccionado(null);
                    }}
                    onSave={handleGuardarUsuario}
                />
            )}

            {/* Diálogo de confirmación */}
            {confirmOpen && (
                <ConfirmDialog
                    titulo="Eliminar Usuario"
                    mensaje={`¿Estás seguro de que deseas eliminar al usuario "${usuarioSeleccionado?.nombre}"? Esta acción no se puede deshacer y el usuario perderá acceso al sistema.`}
                    onConfirm={confirmarEliminacion}
                    onCancel={() => setConfirmOpen(false)}
                />
            )}
        </div>
    );
};

export default GestionUsuarios;
