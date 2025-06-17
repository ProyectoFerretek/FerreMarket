import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Plus, Search, Filter, Calendar, Download, Eye, Edit2, Trash2, 
  ArrowUpDown, FileText, FileSpreadsheet, FileDown, TrendingUp,
  TrendingDown, DollarSign, ShoppingCart, Users, Clock, Star,
  MoreVertical, SlidersHorizontal, Grid3X3, List, Mail, Send,
  PieChart, BarChart3, Activity, Target, Bookmark, BookmarkCheck
} from 'lucide-react';
import { obtenerVentas, obtenerProductos, obtenerClientes } from '../data/mockData';
import { formatPrecio, formatFecha, getNombreCliente, getEstadoVenta } from '../utils/formatters';
import ConfirmDialog from '../components/common/ConfirmDialog';
import VentaModal from '../components/modals/VentaModal';
import VentaPreview from '../components/preview/VentaPreview';
import { Cliente, Producto, Venta } from "../types";

const Ventas: React.FC = () => {
  // Estados principales
  const [modalOpen, setModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState<any>(null);

  const [ventas, setVentas] = useState<Venta[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const cargarVentas = useCallback(async () => {
    const ventasData = await obtenerVentas();
    setVentas(ventasData);
  }, []);

  const [productos, setProductos] = useState<Producto[]>([]);
  const cargarProductos = useCallback(async () => {
    const productosData = await obtenerProductos();
    setProductos(productosData);
  }, []);

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const cargarClientes = useCallback(async () => {
    const clientesData = await obtenerClientes();
    setClientes(clientesData);
  }, []);

  // Add a function to refresh all data
  const refreshData = useCallback(async () => {
    console.log("Refreshing ventas data...");
    await Promise.all([
      cargarVentas(),
      cargarProductos(),
      cargarClientes()
    ]);
    setRefreshKey(prev => prev + 1);
  }, [cargarVentas, cargarProductos, cargarClientes]);

  // Update the useEffect to use refreshData
  useEffect(() => {
    refreshData();
    
    // Set up a focus event listener to refresh data when tab becomes active
    const handleFocus = () => {
      console.log("Window focused, refreshing data...");
      refreshData();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [refreshData]);
  
  // Estados de filtros y búsqueda
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroMetodoPago, setFiltroMetodoPago] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');
  const [filtroFechaInicio, setFiltroFechaInicio] = useState('');
  const [filtroFechaFin, setFiltroFechaFin] = useState('');
  const [filtroMontoMin, setFiltroMontoMin] = useState('');
  const [filtroMontoMax, setFiltroMontoMax] = useState('');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [filtrosFavoritos, setFiltrosFavoritos] = useState<any[]>([]);
  
  // Estados de vista y paginación
  const [vistaActual, setVistaActual] = useState<'grid' | 'tabla' | 'lista'>('grid');
  const [pagina, setPagina] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(12);
  const [ventasSeleccionadas, setVentasSeleccionadas] = useState<string[]>([]);
  
  // Estados de ordenamiento
  const [ordenamiento, setOrdenamiento] = useState({ campo: 'fecha', direccion: 'desc' });
  
  // Estados responsive
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);

  // Detectar cambios de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      
      // Ajustar vista automáticamente
      if (width < 768) {
        setVistaActual('lista');
        setItemsPorPagina(8);
      } else if (width < 1024) {
        setVistaActual('grid');
        setItemsPorPagina(9);
      } else {
        setItemsPorPagina(12);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calcular KPIs y estadísticas
  const estadisticas = useMemo(() => {
    console.log("Recalculating estadisticas with", ventas.length, "ventas");
    const hoy = new Date().toISOString().split('T')[0];
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);
    const ayerStr = ayer.toISOString().split('T')[0];
    
    const hace7Dias = new Date();
    hace7Dias.setDate(hace7Dias.getDate() - 7);
    
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);

    const ventasHoy = ventas.filter(v => v.fecha.split('T')[0] === hoy);
    const ventasAyer = ventas.filter(v => v.fecha.split('T')[0] === ayerStr);
    const ventasSemana = ventas.filter(v => new Date(v.fecha) >= hace7Dias);
    const ventasMes = ventas.filter(v => new Date(v.fecha) >= hace30Dias);
    
    const totalHoy = ventasHoy.reduce((sum, v) => sum + v.total, 0);
    const totalAyer = ventasAyer.reduce((sum, v) => sum + v.total, 0);
    const totalSemana = ventasSemana.reduce((sum, v) => sum + v.total, 0);
    const totalMes = ventasMes.reduce((sum, v) => sum + v.total, 0);
    
    const cambioVentas = totalAyer > 0 ? ((totalHoy - totalAyer) / totalAyer) * 100 : 0;
    const promedioVenta = ventas.length > 0 ? ventas.reduce((sum, v) => sum + v.total, 0) / ventas.length : 0;
    const ventasPendientes = ventas.filter(v => v.estado === 'pendiente').length;
    
    // Distribución por método de pago
    const metodosPago = ventas.reduce((acc, venta) => {
      acc[venta.metodoPago] = (acc[venta.metodoPago] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Distribución por estado
    const estados = ventas.reduce((acc, venta) => {
      acc[venta.estado] = (acc[venta.estado] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalHoy,
      totalAyer,
      totalSemana,
      totalMes,
      cambioVentas,
      promedioVenta,
      ventasPendientes,
      ventasHoy: ventasHoy.length,
      ventasSemana: ventasSemana.length,
      metodosPago,
      estados
    };
  }, [ventas, refreshKey]);

  // Filtrar ventas
  const ventasFiltradas = useMemo(() => {
    return ventas
      .filter(venta => {
        const matchBusqueda = getNombreCliente(venta.cliente, clientes).toLowerCase().includes(busqueda.toLowerCase());
        
        const matchEstado = !filtroEstado || venta.estado === filtroEstado;
        const matchMetodo = !filtroMetodoPago || venta.metodoPago === filtroMetodoPago;
        const matchCliente = !filtroCliente || venta.cliente === filtroCliente;
        
        const fechaVenta = venta.fecha.split('T')[0];
        const matchFechaInicio = !filtroFechaInicio || fechaVenta >= filtroFechaInicio;
        const matchFechaFin = !filtroFechaFin || fechaVenta <= filtroFechaFin;
        
        const matchMontoMin = !filtroMontoMin || venta.total >= parseFloat(filtroMontoMin);
        const matchMontoMax = !filtroMontoMax || venta.total <= parseFloat(filtroMontoMax);
        
        return matchBusqueda && matchEstado && matchMetodo && matchCliente && 
               matchFechaInicio && matchFechaFin && matchMontoMin && matchMontoMax;
      })
      .sort((a, b) => {
        const valorA = ordenamiento.campo === 'cliente' ? getNombreCliente(a.cliente, clientes) : a[ordenamiento.campo];
        const valorB = ordenamiento.campo === 'cliente' ? getNombreCliente(b.cliente, clientes) : b[ordenamiento.campo];
        
        if (valorA < valorB) return ordenamiento.direccion === 'asc' ? -1 : 1;
        if (valorA > valorB) return ordenamiento.direccion === 'asc' ? 1 : -1;
        return 0;
      });
  }, [ventas, busqueda, filtroEstado, filtroMetodoPago, filtroCliente, filtroFechaInicio, filtroFechaFin, filtroMontoMin, filtroMontoMax, ordenamiento]);

  // Paginación
  const totalPaginas = Math.ceil(ventasFiltradas.length / itemsPorPagina);
  const ventasEnPagina = ventasFiltradas.slice((pagina - 1) * itemsPorPagina, pagina * itemsPorPagina);

  // Funciones de manejo
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

  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroEstado('');
    setFiltroMetodoPago('');
    setFiltroCliente('');
    setFiltroFechaInicio('');
    setFiltroFechaFin('');
    setFiltroMontoMin('');
    setFiltroMontoMax('');
    setPagina(1);
  };

  const guardarFiltrosFavoritos = () => {
    const filtrosActuales = {
      nombre: `Filtro ${new Date().toLocaleDateString()}`,
      filtroEstado,
      filtroMetodoPago,
      filtroCliente,
      filtroFechaInicio,
      filtroFechaFin,
      filtroMontoMin,
      filtroMontoMax,
      fecha: new Date().toISOString()
    };
    setFiltrosFavoritos(prev => [...prev, filtrosActuales]);
  };

  const aplicarFiltrosFavoritos = (filtros: any) => {
    setFiltroEstado(filtros.filtroEstado || '');
    setFiltroMetodoPago(filtros.filtroMetodoPago || '');
    setFiltroCliente(filtros.filtroCliente || '');
    setFiltroFechaInicio(filtros.filtroFechaInicio || '');
    setFiltroFechaFin(filtros.filtroFechaFin || '');
    setFiltroMontoMin(filtros.filtroMontoMin || '');
    setFiltroMontoMax(filtros.filtroMontoMax || '');
    setPagina(1);
  };

  const exportarSeleccion = (formato: string) => {
    const ventasParaExportar = ventasFiltradas.filter(v => ventasSeleccionadas.includes(v.id));
    console.log(`Exportando ${ventasParaExportar.length} ventas en formato ${formato}`);
  };

  const generarFactura = (venta: any) => {
    console.log('Generando factura para venta:', venta.id);
    // Aquí iría la lógica de generación de PDF
  };

  const enviarFacturaPorEmail = (venta: any) => {
    const cliente = clientes.find(c => c.id === venta.cliente);
    console.log(`Enviando factura de venta ${venta.id} a ${cliente?.email}`);
  };

  // Componente de KPIs Dashboard
  const KPIDashboard = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Ventas Hoy</p>
            <p className="text-2xl font-bold text-gray-900">{formatPrecio(estadisticas.totalHoy)}</p>
            <div className="flex items-center mt-2">
              {estadisticas.cambioVentas >= 0 ? (
                <TrendingUp size={16} className="text-green-500 mr-1" />
              ) : (
                <TrendingDown size={16} className="text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${estadisticas.cambioVentas >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(estadisticas.cambioVentas).toFixed(1)}% vs ayer
              </span>
            </div>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <DollarSign size={24} className="text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Esta Semana</p>
            <p className="text-2xl font-bold text-gray-900">{formatPrecio(estadisticas.totalSemana)}</p>
            <p className="text-sm text-gray-500 mt-2">{estadisticas.ventasSemana} transacciones</p>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <ShoppingCart size={24} className="text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Promedio/Venta</p>
            <p className="text-2xl font-bold text-gray-900">{formatPrecio(estadisticas.promedioVenta)}</p>
            <p className="text-sm text-gray-500 mt-2">Últimas 30 ventas</p>
          </div>
          <div className="p-3 bg-purple-100 rounded-full">
            <Target size={24} className="text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Pendientes</p>
            <p className="text-2xl font-bold text-gray-900">{estadisticas.ventasPendientes}</p>
            <p className="text-sm text-gray-500 mt-2">Requieren atención</p>
          </div>
          <div className="p-3 bg-yellow-100 rounded-full">
            <Clock size={24} className="text-yellow-600" />
          </div>
        </div>
      </div>
    </div>
  );

  // Componente de Gráficos
  const GraficosEstadisticas = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Distribución por Estado */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <PieChart size={20} className="mr-2 text-blue-600" />
            Estados de Ventas
          </h3>
        </div>
        <div className="space-y-3">
          {Object.entries(estadisticas.estados).map(([estado, cantidad]) => {
            const porcentaje = ((cantidad / ventas.length) * 100).toFixed(1);
            const estadoInfo = getEstadoVenta(estado);
            return (
              <div key={estado} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    estado === 'completada' ? 'bg-green-500' :
                    estado === 'pendiente' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm text-gray-700 capitalize">{estadoInfo.label}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">{cantidad}</span>
                  <span className="text-xs text-gray-500 ml-1">({porcentaje}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Distribución por Método de Pago */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <BarChart3 size={20} className="mr-2 text-green-600" />
            Métodos de Pago
          </h3>
        </div>
        <div className="space-y-3">
          {Object.entries(estadisticas.metodosPago).map(([metodo, cantidad]) => {
            const porcentaje = ((cantidad / ventas.length) * 100).toFixed(1);
            return (
              <div key={metodo} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-3 bg-orange-500"></div>
                  <span className="text-sm text-gray-700">{metodo}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">{cantidad}</span>
                  <span className="text-xs text-gray-500 ml-1">({porcentaje}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Componente de Tarjeta de Venta con layout mejorado
  const VentaCard = ({ venta }: { venta: any }) => {
    const estadoInfo = getEstadoVenta(venta.estado);
    const cliente = clientes.find(c => Number(c.id) === Number(venta.cliente));
    const isSelected = ventasSeleccionadas.includes(venta.id);

    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col h-full ${
        isSelected ? 'ring-2 ring-blue-500 border-blue-300' : ''
      }`}>
        {/* Header de la tarjeta */}
        <div className="p-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleSeleccionarVenta(venta.id)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <h3 className="text-sm font-bold text-gray-900">#{venta.id}</h3>
                <p className="text-xs text-gray-500">{formatFecha(venta.fecha, true)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${estadoInfo.color}`}>
                {estadoInfo.label}
              </span>
              <div className="relative">
                <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal - flex-grow para ocupar espacio disponible */}
        <div className="p-4 flex-grow flex flex-col">
          <div className="flex-grow space-y-3">
            {/* Cliente */}
            <div className="flex items-center">
              <Users size={16} className="text-gray-400 mr-2 flex-shrink-0" />
              <span className="text-sm text-gray-900 truncate">{cliente?.nombre}</span>
            </div>

            {/* Productos */}
            <div className="flex items-start">
              <ShoppingCart size={16} className="text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 font-medium">
                  {venta.productos.length} producto{venta.productos.length !== 1 ? 's' : ''}
                </p>
                <div className="text-xs text-gray-500 mt-1">
                  {venta.productos.slice(0, 2).map((item: any, index: number) => (
                    <div key={index} className="truncate">
                      {item.cantidad}x Producto #{item.id}
                    </div>
                  ))}
                  {venta.productos.length > 2 && (
                    <div className="text-gray-400">+{venta.productos.length - 2} más...</div>
                  )}
                </div>
              </div>
            </div>

            {/* Método de pago */}
            <div className="flex items-center">
              <DollarSign size={16} className="text-gray-400 mr-2 flex-shrink-0" />
              <span className="text-sm text-gray-700">{venta.metodoPago}</span>
            </div>
          </div>

          {/* Total - Posición fija encima de los botones */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">Total:</span>
              <span className="text-lg font-bold text-gray-900">{formatPrecio(venta.total)}</span>
            </div>
          </div>
        </div>

        {/* Acciones - siempre en la parte inferior */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex-shrink-0">
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setVentaSeleccionada(venta);
                setPreviewOpen(true);
              }}
              className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Eye size={14} className="mr-1" />
              Ver
            </button>
            <button
              onClick={() => generarFactura(venta)}
              className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition-colors"
            >
              <Download size={14} className="mr-1" />
              PDF
            </button>
            <button
              onClick={() => enviarFacturaPorEmail(venta)}
              className="px-3 py-2 text-blue-600 hover:bg-blue-50 border border-transparent rounded-md transition-colors"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Memoize the VentaCard component to prevent unnecessary re-renders
  const MemoizedVentaCard = React.memo(VentaCard);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Gestión de Ventas</h1>
          <p className="text-sm text-gray-600 mt-1">
            Administra y monitorea todas las transacciones
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {/* Selector de vista - solo en desktop */}
          {!isMobile && (
            <div className="hidden lg:flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setVistaActual('grid')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  vistaActual === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                <Grid3X3 size={14} className="mr-1" />
                Grid
              </button>
              <button
                onClick={() => setVistaActual('tabla')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  vistaActual === 'tabla' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                <List size={14} className="mr-1" />
                Tabla
              </button>
            </div>
          )}
          
          <button
            onClick={() => setModalOpen(true)}
            className="bg-orange-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-amber-700 flex items-center text-sm font-medium transition-colors"
          >
            <Plus size={16} className="mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Nueva Venta</span>
            <span className="sm:hidden">Nueva</span>
          </button>
        </div>
      </div>

      {/* KPIs Dashboard */}
      <KPIDashboard />

      {/* Gráficos de Estadísticas */}
      <GraficosEstadisticas />

      {/* Filtros y búsqueda responsive */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col space-y-4">
          {/* Primera fila: Búsqueda y botón de filtros móvil */}
          <div className="flex items-center space-x-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por ID de venta o cliente..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="lg:hidden flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <SlidersHorizontal size={16} className="mr-1" />
              Filtros
            </button>
          </div>

          {/* Filtros adicionales */}
          <div className={`${mostrarFiltros ? 'block' : 'hidden'} lg:block`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="">Todos los estados</option>
                <option value="completada">Completada</option>
                <option value="pendiente">Pendiente</option>
                <option value="cancelada">Cancelada</option>
              </select>

              <select
                value={filtroMetodoPago}
                onChange={(e) => setFiltroMetodoPago(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="">Todos los métodos</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta de crédito">Tarjeta de crédito</option>
                <option value="Tarjeta de débito">Tarjeta de débito</option>
                <option value="Transferencia">Transferencia</option>
              </select>

              <select
                value={filtroCliente}
                onChange={(e) => setFiltroCliente(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="">Todos los clientes</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>
                ))}
              </select>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-600 whitespace-nowrap">Mostrar:</span>
                <select
                  value={itemsPorPagina}
                  onChange={(e) => {
                    setItemsPorPagina(Number(e.target.value));
                    setPagina(1);
                  }}
                  className="px-2 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value={8}>8</option>
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={48}>48</option>
                </select>
              </div>
            </div>

            {/* Filtros de fecha y monto */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Fecha desde</label>
                <input
                  type="date"
                  value={filtroFechaInicio}
                  onChange={(e) => setFiltroFechaInicio(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Fecha hasta</label>
                <input
                  type="date"
                  value={filtroFechaFin}
                  onChange={(e) => setFiltroFechaFin(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Monto mínimo</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filtroMontoMin}
                  onChange={(e) => setFiltroMontoMin(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Monto máximo</label>
                <input
                  type="number"
                  placeholder="999999"
                  value={filtroMontoMax}
                  onChange={(e) => setFiltroMontoMax(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              <button
                onClick={limpiarFiltros}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Limpiar
              </button>

              <button
                onClick={guardarFiltrosFavoritos}
                className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm flex items-center justify-center"
              >
                <Bookmark size={14} className="mr-1" />
                Guardar
              </button>
            </div>

            {/* Filtros favoritos */}
            {filtrosFavoritos.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-600 mb-2">Filtros guardados:</p>
                <div className="flex flex-wrap gap-2">
                  {filtrosFavoritos.map((filtro, index) => (
                    <button
                      key={index}
                      onClick={() => aplicarFiltrosFavoritos(filtro)}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs hover:bg-blue-100 transition-colors flex items-center"
                    >
                      <BookmarkCheck size={12} className="mr-1" />
                      {filtro.nombre}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="text-xs text-gray-600 mt-3">
              {ventasFiltradas.length} venta{ventasFiltradas.length !== 1 ? 's' : ''} encontrada{ventasFiltradas.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Exportación masiva */}
      {ventasSeleccionadas.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <span className="text-blue-800 font-medium text-sm">
              {ventasSeleccionadas.length} venta{ventasSeleccionadas.length !== 1 ? 's' : ''} seleccionada{ventasSeleccionadas.length !== 1 ? 's' : ''}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => exportarSeleccion('pdf')}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center text-sm transition-colors"
              >
                <FileText size={14} className="mr-1" />
                PDF
              </button>
              <button
                onClick={() => exportarSeleccion('excel')}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center text-sm transition-colors"
              >
                <FileSpreadsheet size={14} className="mr-1" />
                Excel
              </button>
              <button
                onClick={() => exportarSeleccion('csv')}
                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center text-sm transition-colors"
              >
                <FileDown size={14} className="mr-1" />
                CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vista Grid/Cards */}
      {(vistaActual === 'grid' || vistaActual === 'lista' || isMobile) && (
        <div className={`grid gap-4 sm:gap-6 ${
          isMobile 
            ? 'grid-cols-1' 
            : isTablet 
              ? 'grid-cols-2' 
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }`}>
          {ventasEnPagina.map(venta => (
            <MemoizedVentaCard key={venta.id} venta={venta} />
          ))}
        </div>
      )}

      {/* Vista Tabla (solo desktop) */}
      {vistaActual === 'tabla' && !isMobile && !isTablet && (
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
                      className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}
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
                          {venta.productos.map((item: any, index: number) => {
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
                            onClick={() => generarFactura(venta)}
                            className="text-green-600 hover:text-green-900 p-1 rounded"
                            title="Descargar factura"
                          >
                            <Download size={16} />
                          </button>
                          <button
                            onClick={() => enviarFacturaPorEmail(venta)}
                            className="text-purple-600 hover:text-purple-900 p-1 rounded"
                            title="Enviar por email"
                          >
                            <Mail size={16} />
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

      {/* Mensaje cuando no hay resultados */}
      {ventasEnPagina.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron ventas
          </h3>
          <p className="text-gray-500 mb-4">
            No hay ventas que coincidan con los filtros aplicados.
          </p>
          <button
            onClick={limpiarFiltros}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Limpiar Filtros
          </button>
        </div>
      )}

      {/* Paginación responsive */}
      {totalPaginas > 1 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
            <div className="text-sm text-gray-700 text-center sm:text-left">
              Mostrando {((pagina - 1) * itemsPorPagina) + 1} a {Math.min(pagina * itemsPorPagina, ventasFiltradas.length)} de {ventasFiltradas.length} ventas
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPagina(prev => Math.max(prev - 1, 1))}
                disabled={pagina === 1}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              
              {/* Números de página - solo en desktop */}
              {!isMobile && (
                <div className="hidden sm:flex space-x-1">
                  {Array.from({ length: Math.min(totalPaginas, 5) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPagina(pageNum)}
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          pagina === pageNum
                            ? 'bg-orange-500 text-white'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
              )}
              
              <span className="text-sm text-gray-600 sm:hidden">
                {pagina} de {totalPaginas}
              </span>
              
              <button
                onClick={() => setPagina(prev => Math.min(prev + 1, totalPaginas))}
                disabled={pagina === totalPaginas}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modales */}
      {modalOpen && (
        <VentaModal
          venta={ventaSeleccionada}
          onClose={async () => {
            await refreshData(); // Use refreshData instead
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
          mensaje={`¿Estás seguro de que deseas eliminar la venta #${ventaSeleccionada?.id}? Esta acción no se puede deshacer y se registrará en el historial del sistema.`}
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