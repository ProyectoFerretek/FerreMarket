import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, Search, Filter, Calendar, Download, Eye, Edit2, Trash2, 
  ArrowUpDown, FileText, FileSpreadsheet, Tag, Percent, DollarSign,
  Users, ShoppingCart, TrendingUp, Clock, Target, Gift, Zap,
  BarChart3, PieChart, Activity, Star, AlertCircle, CheckCircle,
  X, Copy, Share2, QrCode, Mail, MessageSquare, Globe
} from 'lucide-react';
import { formatPrecio, formatFecha } from '../utils/formatters';
import { productos, categorias, clientes, ventas, agregarPromocion, obtenerPromociones } from '../data/mockData';
import ConfirmDialog from '../components/common/ConfirmDialog';
import PromocionModal from '../components/modals/PromocionModal';
import { Promocion } from '../types';

// Mock data para promociones
const promocionesIniciales = [
  // {
  //   id: 'PROMO001',
  //   codigo: 'DESCUENTO20',
  //   nombre: 'Descuento 20% en toda la tienda',
  //   tipo: 'porcentaje',
  //   valor: 20,
  //   valorMaximo: 50000,
  //   montoMinimo: 100000,
  //   fechaInicio: '2024-01-01T00:00:00',
  //   fechaFin: '2024-12-31T23:59:59',
  //   limiteTotalUsos: 1000,
  //   limiteUsosPorCliente: 5,
  //   usosActuales: 245,
  //   estado: 'activo',
  //   aplicaA: 'toda_tienda',
  //   productosIncluidos: [],
  //   productosExcluidos: [],
  //   categoriasIncluidas: [],
  //   categoriasExcluidas: [],
  //   tipoCliente: 'todos',
  //   combinable: false,
  //   descripcion: 'Descuento del 20% en toda la tienda con compra mínima de $100.000',
  //   fechaCreacion: '2024-01-01T10:00:00',
  //   creadoPor: 'Admin',
  //   ingresoGenerado: 2450000,
  //   valorPromedioCompra: 125000,
  //   tasaConversion: 15.2,
  //   horariosUso: {
  //     '00-06': 5,
  //     '06-12': 45,
  //     '12-18': 120,
  //     '18-24': 75
  //   },
  //   productosVendidos: [
  //     { id: '1', cantidad: 45, ingresos: 450000 },
  //     { id: '2', cantidad: 32, ingresos: 320000 },
  //     { id: '3', cantidad: 28, ingresos: 280000 }
  //   ]
  // },
  // {
  //   id: 'PROMO002',
  //   codigo: 'NUEVOCLIENTE',
  //   nombre: 'Bienvenida nuevos clientes',
  //   tipo: 'monto_fijo',
  //   valor: 15000,
  //   valorMaximo: 15000,
  //   montoMinimo: 50000,
  //   fechaInicio: '2024-01-01T00:00:00',
  //   fechaFin: '2024-12-31T23:59:59',
  //   limiteTotalUsos: 500,
  //   limiteUsosPorCliente: 1,
  //   usosActuales: 89,
  //   estado: 'activo',
  //   aplicaA: 'toda_tienda',
  //   productosIncluidos: [],
  //   productosExcluidos: [],
  //   categoriasIncluidas: [],
  //   categoriasExcluidas: [],
  //   tipoCliente: 'nuevo',
  //   combinable: true,
  //   descripcion: 'Descuento de $15.000 para nuevos clientes',
  //   fechaCreacion: '2024-01-15T14:30:00',
  //   creadoPor: 'Admin',
  //   ingresoGenerado: 890000,
  //   valorPromedioCompra: 75000,
  //   tasaConversion: 22.5,
  //   horariosUso: {
  //     '00-06': 2,
  //     '06-12': 25,
  //     '12-18': 45,
  //     '18-24': 17
  //   },
  //   productosVendidos: [
  //     { id: '1', cantidad: 25, ingresos: 250000 },
  //     { id: '4', cantidad: 18, ingresos: 180000 },
  //     { id: '7', cantidad: 15, ingresos: 150000 }
  //   ]
  // },
  // {
  //   id: 'PROMO003',
  //   codigo: 'HERRAMIENTAS10',
  //   nombre: 'Descuento en herramientas',
  //   tipo: 'porcentaje',
  //   valor: 10,
  //   valorMaximo: 25000,
  //   montoMinimo: 0,
  //   fechaInicio: '2024-02-01T00:00:00',
  //   fechaFin: '2024-02-29T23:59:59',
  //   limiteTotalUsos: 200,
  //   limiteUsosPorCliente: 3,
  //   usosActuales: 156,
  //   estado: 'expirado',
  //   aplicaA: 'categorias',
  //   productosIncluidos: [],
  //   productosExcluidos: [],
  //   categoriasIncluidas: ['1'], // Herramientas
  //   categoriasExcluidas: [],
  //   tipoCliente: 'todos',
  //   combinable: true,
  //   descripcion: 'Descuento del 10% en toda la categoría de herramientas',
  //   fechaCreacion: '2024-01-25T09:15:00',
  //   creadoPor: 'Admin',
  //   ingresoGenerado: 1560000,
  //   valorPromedioCompra: 95000,
  //   tasaConversion: 18.7,
  //   horariosUso: {
  //     '00-06': 8,
  //     '06-12': 52,
  //     '12-18': 78,
  //     '18-24': 18
  //   },
  //   productosVendidos: [
  //     { id: '1', cantidad: 65, ingresos: 650000 },
  //     { id: '2', cantidad: 42, ingresos: 420000 },
  //     { id: '4', cantidad: 35, ingresos: 350000 }
  //   ]
  // }
];

const Promociones: React.FC = () => {
  // Estados principales
  const [promociones, setPromociones] = useState<Promocion[]>([]);

  const cargarPromociones = async () => {
      const promocionesData = await obtenerPromociones();
      setPromociones(promocionesData);
  }
  
  useEffect(() => {
      cargarPromociones();
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [promocionSeleccionada, setPromocionSeleccionada] = useState<any>(null);
  const [vistaAnalisis, setVistaAnalisis] = useState<any>(null);
  
  // Estados de filtros y búsqueda
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroFechaInicio, setFiltroFechaInicio] = useState('');
  const [filtroFechaFin, setFiltroFechaFin] = useState('');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  
  // Estados de vista y paginación
  const [vistaActual, setVistaActual] = useState<'grid' | 'tabla'>('grid');
  const [pagina, setPagina] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(12);
  const [promocionesSeleccionadas, setPromocionesSeleccionadas] = useState<string[]>([]);
  
  // Estados de ordenamiento
  const [ordenamiento, setOrdenamiento] = useState({ campo: 'fechaCreacion', direccion: 'desc' });

  // Calcular estadísticas generales
  const estadisticas = useMemo(() => {
    const promocionesActivas = promociones.filter(p => p.estado === 'activo').length;
    const totalUsos = promociones.reduce((sum, p) => sum + p.usosActuales, 0);
    const ingresoTotal = promociones.reduce((sum, p) => sum + p.ingresoGenerado, 0);
    const promedioConversion = promociones.reduce((sum, p) => sum + p.tasaConversion, 0) / promociones.length;
    
    return {
      promocionesActivas,
      totalUsos,
      ingresoTotal,
      promedioConversion: promedioConversion.toFixed(1)
    };
  }, [promociones]);

  // Filtrar promociones
  const promocionesFiltradas = useMemo(() => {
    return promociones
      .filter((promocion: { codigo: string; nombre: string; estado: string; tipo: string; fechaInicio: string | number | Date; fechaFin: string | number | Date; }) => {
        const matchBusqueda = promocion.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
                            promocion.nombre.toLowerCase().includes(busqueda.toLowerCase());
        const matchEstado = !filtroEstado || promocion.estado === filtroEstado;
        const matchTipo = !filtroTipo || promocion.tipo === filtroTipo;
        
        const fechaInicio = new Date(promocion.fechaInicio).toISOString().split('T')[0];
        const fechaFin = new Date(promocion.fechaFin).toISOString().split('T')[0];
        const matchFechaInicio = !filtroFechaInicio || fechaInicio >= filtroFechaInicio;
        const matchFechaFin = !filtroFechaFin || fechaFin <= filtroFechaFin;
        
        return matchBusqueda && matchEstado && matchTipo && matchFechaInicio && matchFechaFin;
      })
      .sort((a, b) => {
        const valorA = a[ordenamiento.campo];
        const valorB = b[ordenamiento.campo];
        if (valorA < valorB) return ordenamiento.direccion === 'asc' ? -1 : 1;
        if (valorA > valorB) return ordenamiento.direccion === 'asc' ? 1 : -1;
        return 0;
      });
  }, [promociones, busqueda, filtroEstado, filtroTipo, filtroFechaInicio, filtroFechaFin, ordenamiento]);

  // Paginación
  const totalPaginas = Math.ceil(promocionesFiltradas.length / itemsPorPagina);
  const promocionesEnPagina = promocionesFiltradas.slice(
    (pagina - 1) * itemsPorPagina, 
    pagina * itemsPorPagina
  );

  // Funciones de manejo
  const handleOrdenar = (campo: string) => {
    setOrdenamiento(prev => ({
      campo,
      direccion: prev.campo === campo && prev.direccion === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleGuardarPromocion = (promocionData: any) => {
    if (promocionSeleccionada) {
      // Editar promoción existente
      setPromociones(prev => prev.map(p => 
        p.id === promocionSeleccionada.id ? { ...p, ...promocionData } : p
      ));
    } else {
      agregarPromocion(promocionData).then(() => {
        cargarPromociones();
      })
    }
    setPromocionSeleccionada(null);
  };

  const handleEliminarPromocion = () => {
    if (promocionSeleccionada) {
      setPromociones(prev => prev.filter(p => p.id !== promocionSeleccionada.id));
      setPromocionSeleccionada(null);
      setConfirmOpen(false);
    }
  };

  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroEstado('');
    setFiltroTipo('');
    setFiltroFechaInicio('');
    setFiltroFechaFin('');
    setPagina(1);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pausado':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'expirado':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'borrador':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEstadoIcono = (estado: string) => {
    switch (estado) {
      case 'activo':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'pausado':
        return <Clock size={16} className="text-yellow-600" />;
      case 'expirado':
        return <X size={16} className="text-red-600" />;
      case 'borrador':
        return <Edit2 size={16} className="text-gray-600" />;
      default:
        return <AlertCircle size={16} className="text-gray-600" />;
    }
  };

  const getTipoIcono = (tipo: string) => {
    switch (tipo) {
      case 'porcentaje':
        return <Percent size={16} className="text-white-500" />;
      case 'monto_fijo':
        return <DollarSign size={16} className="text-white-500" />;
      case 'envio_gratis':
        return <Gift size={16} className="text-white-500" />;
      default:
        return <Tag size={16} className="text-white-500" />;
    }
  };

  const copiarCodigo = (codigo: string) => {
    navigator.clipboard.writeText(codigo);
    // Aquí podrías mostrar una notificación de éxito
  };

  const compartirPromocion = (promocion: any) => {
    const texto = `¡Aprovecha esta promoción! Usa el código ${promocion.codigo} y obtén ${promocion.tipo === 'porcentaje' ? `${promocion.valor}% de descuento` : `$${promocion.valor.toLocaleString()} de descuento`}`;
    
    if (navigator.share) {
      navigator.share({
        title: promocion.nombre,
        text: texto,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(texto);
    }
  };

  // Componente de estadísticas rápidas
  const EstadisticasRapidas = () => (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <Zap size={20} className="text-blue-600 mr-3" />
          <div>
            <p className="text-2xl font-bold text-gray-900">{estadisticas.promocionesActivas}</p>
            <p className="text-xs text-gray-600">Promociones activas</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <Users size={20} className="text-green-600 mr-3" />
          <div>
            <p className="text-2xl font-bold text-gray-900">{estadisticas.totalUsos.toLocaleString()}</p>
            <p className="text-xs text-gray-600">Total de usos</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <DollarSign size={20} className="text-purple-600 mr-3" />
          <div>
            <p className="text-2xl font-bold text-gray-900">{formatPrecio(estadisticas.ingresoTotal)}</p>
            <p className="text-xs text-gray-600">Ingresos generados</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Componente de tarjeta de promoción
  const PromocionCard = ({ promocion }: { promocion: any }) => {
    const porcentajeUso = (promocion.usosActuales / promocion.limiteTotalUsos) * 100;
    const diasRestantes = Math.ceil((new Date(promocion.fechaFin).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col h-full">
        {/* Header de la tarjeta */}
        <div className="p-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                {getTipoIcono(promocion.tipo)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate h-5">
                  {promocion.nombre}
                </h3>
                <div className="flex items-center mt-1 h-6">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono text-blue-600">
                    {promocion.codigo}
                  </code>
                  <button
                    onClick={() => copiarCodigo(promocion.codigo)}
                    className="ml-2 p-1 text-gray-400 hover:text-gray-600 rounded"
                    title="Copiar código"
                  >
                    <Copy size={12} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 flex-shrink-0">
              <div className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border ${getEstadoColor(promocion.estado)}`}>
                {getEstadoIcono(promocion.estado)}
                <span className="ml-1 capitalize">{promocion.estado}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido de la tarjeta */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Valor del descuento */}
          <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mb-3">
            <div className="text-2xl font-bold text-gray-900 h-8 flex items-center justify-center">
              {promocion.tipo === 'porcentaje' ? `${promocion.valor}%` : formatPrecio(promocion.valor)}
            </div>
            <div className="text-xs text-gray-600 h-4 flex items-center justify-center">
              {promocion.tipo === 'porcentaje' ? 'de descuento' : 'descuento fijo'}
            </div>
            <div className="text-xs text-gray-500 mt-1 h-4 flex items-center justify-center">
              {promocion.montoMinimo > 0 ? `Compra mínima: ${formatPrecio(promocion.montoMinimo)}` : ' '}
            </div>
          </div>

          {/* Estadísticas de uso */}
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-xs h-4">
              <span className="text-gray-600">Usos:</span>
              <span className="font-medium">{promocion.usosActuales} / {promocion.limiteTotalUsos}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(porcentajeUso, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Información temporal */}
          <div className="grid grid-cols-2 gap-3 text-xs mb-3">
            <div className="text-center">
              <div className="text-gray-600 h-4">Ingresos</div>
              <div className="font-bold text-green-600 h-5 flex items-center justify-center">{formatPrecio(promocion.ingresoGenerado)}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-600 h-4">Conversión</div>
              <div className="font-bold text-blue-600 h-5 flex items-center justify-center">{promocion.tasaConversion}%</div>
            </div>
          </div>

          {/* Días restantes */}
          <div className="text-center mb-3 flex-1 flex items-center justify-center">
            {promocion.estado === 'activo' ? (
              <div className={`text-xs px-2 py-1 rounded-full ${
                diasRestantes <= 7 ? 'bg-red-100 text-red-700' : 
                diasRestantes <= 30 ? 'bg-yellow-100 text-yellow-700' : 
                'bg-green-100 text-green-700'
              }`}>
                {diasRestantes > 0 ? `${diasRestantes} días restantes` : 'Expirado'}
              </div>
            ) : (
              <div className="h-6"></div>
            )}
          </div>
        </div>

        {/* Acciones */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex-shrink-0">
          <div className="flex space-x-2">
            <button
              onClick={() => setVistaAnalisis(promocion)}
              className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <BarChart3 size={14} className="mr-1" />
              Análisis
            </button>
            <button
              onClick={() => compartirPromocion(promocion)}
              className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
            >
              <Share2 size={14} className="mr-1" />
              Compartir
            </button>
            <button
              onClick={() => {
                setPromocionSeleccionada(promocion);
                setModalOpen(true);
              }}
              className="px-3 py-2 text-gray-600 hover:bg-gray-100 border border-transparent rounded-md transition-colors"
            >
              <Edit2 size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Modal de análisis detallado
  const ModalAnalisis = ({ promocion, onClose }: { promocion: any; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Análisis de Promoción: {promocion.codigo}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 p-2 rounded-lg hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Total de Usos</p>
                  <p className="text-2xl font-bold text-blue-900">{promocion.usosActuales}</p>
                </div>
                <Users size={24} className="text-blue-600" />
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Ingresos Generados</p>
                  <p className="text-2xl font-bold text-green-900">{formatPrecio(promocion.ingresoGenerado)}</p>
                </div>
                <DollarSign size={24} className="text-green-600" />
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600">Valor Promedio</p>
                  <p className="text-2xl font-bold text-purple-900">{formatPrecio(promocion.valorPromedioCompra)}</p>
                </div>
                <ShoppingCart size={24} className="text-purple-600" />
              </div>
            </div>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Horarios de mayor uso */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock size={20} className="mr-2 text-blue-600" />
                Horarios de Mayor Uso
              </h3>
              <div className="space-y-3">
                {Object.entries(promocion.horariosUso).map(([horario, usos]) => {
                  const maxUsos = Math.max(...Object.values(promocion.horariosUso));
                  const porcentaje = (usos / maxUsos) * 100;
                  
                  return (
                    <div key={horario} className="flex items-center">
                      <div className="w-16 text-sm text-gray-600">{horario}h</div>
                      <div className="flex-1 mx-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full"
                            style={{ width: `${porcentaje}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-12 text-sm font-medium text-gray-900">{usos}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Productos más vendidos */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Star size={20} className="mr-2 text-yellow-600" />
                Productos Más Vendidos
              </h3>
              <div className="space-y-3">
                {promocion.productosVendidos.map((item: any, index: number) => {
                  const producto = productos.find(p => p.id === item.id);
                  const maxIngresos = Math.max(...promocion.productosVendidos.map((p: any) => p.ingresos));
                  const porcentaje = (item.ingresos / maxIngresos) * 100;
                  
                  return (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {producto?.nombre || `Producto ${item.id}`}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.cantidad} unidades - {formatPrecio(item.ingresos)}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                          <div 
                            className="bg-yellow-500 h-1 rounded-full"
                            style={{ width: `${porcentaje}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Información detallada */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Detallada</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Fecha de creación:</span>
                <div className="font-medium text-gray-900">{formatFecha(promocion.fechaCreacion, true)}</div>
              </div>
              <div>
                <span className="text-gray-600">Creado por:</span>
                <div className="font-medium text-gray-900">{promocion.creadoPor}</div>
              </div>
              <div>
                <span className="text-gray-600">Vigencia:</span>
                <div className="font-medium text-gray-900">
                  {formatFecha(promocion.fechaInicio)} - {formatFecha(promocion.fechaFin)}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Límite por cliente:</span>
                <div className="font-medium text-gray-900">{promocion.limiteUsosPorCliente} usos</div>
              </div>
              <div>
                <span className="text-gray-600">Combinable:</span>
                <div className="font-medium text-gray-900">{promocion.combinable ? 'Sí' : 'No'}</div>
              </div>
              <div>
                <span className="text-gray-600">Tipo de cliente:</span>
                <div className="font-medium text-gray-900 capitalize">{promocion.tipoCliente}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <div className="flex space-x-3">
            <button
              onClick={() => {/* Exportar CSV */}}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
            >
              <FileSpreadsheet size={16} className="mr-2" />
              Exportar CSV
            </button>
            <button
              onClick={() => {/* Exportar Excel */}}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-amber-700 flex items-center"
            >
              <FileText size={16} className="mr-2" />
              Exportar Excel
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Códigos Promocionales</h1>
          <p className="text-gray-600 mt-1">Gestiona descuentos y promociones para tus clientes</p>
        </div>
        <button
          onClick={() => {
            setPromocionSeleccionada(null);
            setModalOpen(true);
          }}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-amber-700 flex items-center transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Nueva Promoción
        </button>
      </div>

      {/* Estadísticas rápidas */}
      <EstadisticasRapidas />

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por código o nombre..."
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

          <div className={`${mostrarFiltros ? 'block' : 'hidden'} lg:block`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="">Todos los estados</option>
                <option value="activo">Activo</option>
                <option value="pausado">Pausado</option>
                <option value="expirado">Expirado</option>
                <option value="borrador">Borrador</option>
              </select>

              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="">Todos los tipos</option>
                <option value="porcentaje">Porcentaje</option>
                <option value="monto_fijo">Monto fijo</option>
                <option value="envio_gratis">Envío gratis</option>
              </select>

              <input
                type="date"
                value={filtroFechaInicio}
                onChange={(e) => setFiltroFechaInicio(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Fecha inicio"
              />

              <input
                type="date"
                value={filtroFechaFin}
                onChange={(e) => setFiltroFechaFin(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Fecha fin"
              />

              <button
                onClick={limpiarFiltros}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Limpiar
              </button>

              <div className="text-xs text-gray-600 flex items-center">
                {promocionesFiltradas.length} promoción{promocionesFiltradas.length !== 1 ? 'es' : ''}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vista Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {promocionesEnPagina.map(promocion => (
          <PromocionCard key={promocion.id} promocion={promocion} />
        ))}
      </div>

      {/* Mensaje cuando no hay resultados */}
      {promocionesEnPagina.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <Tag size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron promociones
          </h3>
          <p className="text-gray-500 mb-4">
            No hay promociones que coincidan con los filtros aplicados.
          </p>
          <button
            onClick={limpiarFiltros}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando {((pagina - 1) * itemsPorPagina) + 1} a {Math.min(pagina * itemsPorPagina, promocionesFiltradas.length)} de {promocionesFiltradas.length} promociones
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPagina(prev => Math.max(prev - 1, 1))}
                disabled={pagina === 1}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              
              <span className="text-sm text-gray-600">
                {pagina} de {totalPaginas}
              </span>
              
              <button
                onClick={() => setPagina(prev => Math.min(prev + 1, totalPaginas))}
                disabled={pagina === totalPaginas}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de análisis */}
      {vistaAnalisis && (
        <ModalAnalisis
          promocion={vistaAnalisis}
          onClose={() => setVistaAnalisis(null)}
        />
      )}

      {/* Modal de creación/edición */}
      {modalOpen && (
        <PromocionModal
          promocion={promocionSeleccionada}
          onClose={() => {
            setModalOpen(false);
            setPromocionSeleccionada(null);
            obtenerPromociones();
          }}
          onSave={handleGuardarPromocion}
        />
      )}

      {/* Diálogo de confirmación */}
      {confirmOpen && (
        <ConfirmDialog
          titulo="Eliminar Promoción"
          mensaje={`¿Estás seguro de que deseas eliminar la promoción "${promocionSeleccionada?.nombre}"?`}
          onConfirm={handleEliminarPromocion}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </div>
  );
};

export default Promociones;