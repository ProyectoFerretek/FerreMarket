import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, Search, Filter, ArrowUpDown, Edit2, Trash2, 
  Eye, X, ChevronDown, Users, Building2, Mail, 
  Phone, MapPin, Calendar, ShoppingBag, MoreVertical,
  SlidersHorizontal, Grid3X3, List, Download
} from 'lucide-react';
import { clientes } from '../data/mockData';
import { formatFecha } from '../utils/formatters';
import ClienteModal from '../components/modals/ClienteModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import type { Cliente } from '../types';

const Clientes: React.FC = () => {
  // Estados principales
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [vistaPreview, setVistaPreview] = useState<Cliente | null>(null);
  
  // Estados de filtros y búsqueda
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroCompras, setFiltroCompras] = useState('');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  
  // Estados de vista y paginación
  const [vistaActual, setVistaActual] = useState<'grid' | 'tabla' | 'lista'>('grid');
  const [pagina, setPagina] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(12);
  const [clientesSeleccionados, setClientesSeleccionados] = useState<string[]>([]);
  
  // Estados de ordenamiento
  const [ordenamiento, setOrdenamiento] = useState<{ 
    campo: keyof Cliente; 
    direccion: 'asc' | 'desc' 
  }>({
    campo: 'nombre',
    direccion: 'asc'
  });

  // Estados responsive
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      
      // Ajustar vista automáticamente según el dispositivo
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

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Extender datos de clientes con información adicional
  const clientesExtendidos = useMemo(() => {
    return clientes.map(cliente => ({
      ...cliente,
      tipoCliente: cliente.tipoCliente || 'individual',
      identificacion: cliente.identificacion || `${Math.floor(Math.random() * 90000000) + 10000000}`,
      estado: Math.random() > 0.1 ? 'activo' : 'inactivo',
      fechaRegistro: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      valorTotal: cliente.compras * (Math.random() * 50000 + 10000),
      ultimaActividad: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    }));
  }, []);

  // Filtrar y ordenar clientes
  const clientesFiltrados = useMemo(() => {
    return clientesExtendidos
      .filter(cliente => {
        const matchBusqueda = cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                            cliente.email.toLowerCase().includes(busqueda.toLowerCase()) ||
                            cliente.telefono.includes(busqueda) ||
                            cliente.identificacion.includes(busqueda);
        
        const matchTipo = !filtroTipo || cliente.tipoCliente === filtroTipo;
        const matchEstado = !filtroEstado || cliente.estado === filtroEstado;
        
        let matchCompras = true;
        if (filtroCompras === 'alto') matchCompras = cliente.compras >= 10;
        else if (filtroCompras === 'medio') matchCompras = cliente.compras >= 5 && cliente.compras < 10;
        else if (filtroCompras === 'bajo') matchCompras = cliente.compras < 5;
        
        return matchBusqueda && matchTipo && matchEstado && matchCompras;
      })
      .sort((a, b) => {
        const valorA = a[ordenamiento.campo];
        const valorB = b[ordenamiento.campo];
        if (valorA < valorB) return ordenamiento.direccion === 'asc' ? -1 : 1;
        if (valorA > valorB) return ordenamiento.direccion === 'asc' ? 1 : -1;
        return 0;
      });
  }, [clientesExtendidos, busqueda, filtroTipo, filtroEstado, filtroCompras, ordenamiento]);

  // Paginación
  const totalPaginas = Math.ceil(clientesFiltrados.length / itemsPorPagina);
  const clientesEnPagina = clientesFiltrados.slice(
    (pagina - 1) * itemsPorPagina, 
    pagina * itemsPorPagina
  );

  // Funciones de manejo
  const handleOrdenar = (campo: keyof Cliente) => {
    setOrdenamiento(prev => ({
      campo,
      direccion: prev.campo === campo && prev.direccion === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSeleccionarCliente = (clienteId: string) => {
    setClientesSeleccionados(prev => 
      prev.includes(clienteId) 
        ? prev.filter(id => id !== clienteId)
        : [...prev, clienteId]
    );
  };

  const handleSeleccionarTodos = () => {
    setClientesSeleccionados(
      clientesSeleccionados.length === clientesEnPagina.length 
        ? [] 
        : clientesEnPagina.map(c => c.id)
    );
  };

  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroTipo('');
    setFiltroEstado('');
    setFiltroCompras('');
    setPagina(1);
  };

  const exportarSeleccion = (formato: string) => {
    const clientesParaExportar = clientesFiltrados.filter(c => 
      clientesSeleccionados.includes(c.id)
    );
    console.log(`Exportando ${clientesParaExportar.length} clientes en formato ${formato}`);
  };

  // Componente de estadísticas rápidas
  const EstadisticasRapidas = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <Users size={20} className="text-blue-600 mr-3" />
          <div>
            <p className="text-2xl font-bold text-gray-900">{clientesFiltrados.length}</p>
            <p className="text-xs text-gray-600">Total clientes</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <Building2 size={20} className="text-purple-600 mr-3" />
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {clientesFiltrados.filter(c => c.tipoCliente === 'empresa').length}
            </p>
            <p className="text-xs text-gray-600">Empresas</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <ShoppingBag size={20} className="text-green-600 mr-3" />
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {clientesFiltrados.filter(c => c.compras >= 10).length}
            </p>
            <p className="text-xs text-gray-600">VIP (10+ compras)</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <Calendar size={20} className="text-orange-600 mr-3" />
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {clientesFiltrados.filter(c => {
                const ultimaCompra = new Date(c.ultimaCompra);
                const hace30Dias = new Date();
                hace30Dias.setDate(hace30Dias.getDate() - 30);
                return ultimaCompra >= hace30Dias;
              }).length}
            </p>
            <p className="text-xs text-gray-600">Activos (30 días)</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Componente de tarjeta de cliente para vista móvil/grid
  const ClienteCard = ({ cliente }: { cliente: any }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200">
      {/* Header de la tarjeta */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
              cliente.tipoCliente === 'empresa' ? 'bg-purple-500' : 'bg-blue-500'
            }`}>
              {cliente.tipoCliente === 'empresa' ? (
                <Building2 size={20} />
              ) : (
                cliente.nombre.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {cliente.nombre}
              </h3>
              <p className="text-xs text-gray-500 truncate">{cliente.email}</p>
              <div className="flex items-center mt-1">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  cliente.estado === 'activo' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {cliente.estado === 'activo' ? 'Activo' : 'Inactivo'}
                </span>
                <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  cliente.tipoCliente === 'empresa' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {cliente.tipoCliente === 'empresa' ? 'Empresa' : 'Individual'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Menú de acciones */}
          <div className="flex items-center space-x-1">
            <input
              type="checkbox"
              checked={clientesSeleccionados.includes(cliente.id)}
              onChange={() => handleSeleccionarCliente(cliente.id)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="relative">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-4 space-y-3">
        {/* Información de contacto */}
        <div className="space-y-2">
          <div className="flex items-center text-xs text-gray-600">
            <Phone size={12} className="mr-2 flex-shrink-0" />
            <span className="truncate">{cliente.telefono}</span>
          </div>
          <div className="flex items-start text-xs text-gray-600">
            <MapPin size={12} className="mr-2 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-2">{cliente.direccion}</span>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{cliente.compras}</p>
            <p className="text-xs text-gray-500">Compras</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">
              ${Math.round(cliente.valorTotal).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">Valor total</p>
          </div>
        </div>

        {/* Última actividad */}
        <div className="pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Última compra: {formatFecha(cliente.ultimaCompra)}
          </p>
        </div>
      </div>

      {/* Acciones */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex space-x-2">
          <button
            onClick={() => setVistaPreview(cliente)}
            className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Eye size={14} className="mr-1" />
            Ver
          </button>
          <button
            onClick={() => {
              setClienteSeleccionado(cliente);
              setModalOpen(true);
            }}
            className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
          >
            <Edit2 size={14} className="mr-1" />
            Editar
          </button>
          <button
            onClick={() => {
              setClienteSeleccionado(cliente);
              setConfirmOpen(true);
            }}
            className="px-3 py-2 text-red-600 hover:bg-red-50 border border-transparent rounded-md transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-sm text-gray-600 mt-1">
            Gestiona tu base de clientes y sus datos de contacto
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
            className="bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-800 flex items-center text-sm font-medium transition-colors"
          >
            <Plus size={16} className="mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Nuevo Cliente</span>
            <span className="sm:hidden">Nuevo</span>
          </button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <EstadisticasRapidas />

      {/* Filtros y búsqueda responsive */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col space-y-4">
          {/* Primera fila: Búsqueda y botón de filtros móvil */}
          <div className="flex items-center space-x-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, email, teléfono o ID..."
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="">Todos los tipos</option>
                <option value="individual">Individual</option>
                <option value="empresa">Empresa</option>
              </select>

              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="">Todos los estados</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>

              <select
                value={filtroCompras}
                onChange={(e) => setFiltroCompras(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="">Todas las compras</option>
                <option value="alto">Alto (10+)</option>
                <option value="medio">Medio (5-9)</option>
                <option value="bajo">Bajo (&lt;5)</option>
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

              <button
                onClick={limpiarFiltros}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Limpiar
              </button>

              <div className="text-xs text-gray-600 flex items-center">
                {clientesFiltrados.length} cliente{clientesFiltrados.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exportación masiva */}
      {clientesSeleccionados.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <span className="text-blue-800 font-medium text-sm">
              {clientesSeleccionados.length} cliente{clientesSeleccionados.length !== 1 ? 's' : ''} seleccionado{clientesSeleccionados.length !== 1 ? 's' : ''}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => exportarSeleccion('excel')}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center text-sm transition-colors"
              >
                <Download size={14} className="mr-1" />
                Excel
              </button>
              <button
                onClick={() => exportarSeleccion('csv')}
                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center text-sm transition-colors"
              >
                <Download size={14} className="mr-1" />
                CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vista Grid/Cards (móvil y tablet) */}
      {(vistaActual === 'grid' || vistaActual === 'lista' || isMobile) && (
        <div className={`grid gap-4 sm:gap-6 ${
          isMobile 
            ? 'grid-cols-1' 
            : isTablet 
              ? 'grid-cols-2' 
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }`}>
          {clientesEnPagina.map(cliente => (
            <ClienteCard key={cliente.id} cliente={cliente} />
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
                      checked={clientesSeleccionados.length === clientesEnPagina.length && clientesEnPagina.length > 0}
                      onChange={handleSeleccionarTodos}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleOrdenar('nombre')}
                  >
                    <div className="flex items-center">
                      Cliente
                      <ArrowUpDown size={14} className="ml-1" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleOrdenar('compras')}
                  >
                    <div className="flex items-center">
                      Compras
                      <ArrowUpDown size={14} className="ml-1" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleOrdenar('ultimaCompra')}
                  >
                    <div className="flex items-center">
                      Última Compra
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
                {clientesEnPagina.map(cliente => (
                  <tr key={cliente.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={clientesSeleccionados.includes(cliente.id)}
                        onChange={() => handleSeleccionarCliente(cliente.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold mr-3 ${
                          cliente.tipoCliente === 'empresa' ? 'bg-purple-500' : 'bg-blue-500'
                        }`}>
                          {cliente.tipoCliente === 'empresa' ? (
                            <Building2 size={16} />
                          ) : (
                            cliente.nombre.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{cliente.nombre}</div>
                          <div className="text-sm text-gray-500">{cliente.identificacion}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{cliente.email}</div>
                      <div className="text-sm text-gray-500">{cliente.telefono}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        cliente.tipoCliente === 'empresa' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {cliente.tipoCliente === 'empresa' ? 'Empresa' : 'Individual'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{cliente.compras}</div>
                      <div className="text-sm text-gray-500">
                        ${Math.round(cliente.valorTotal).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatFecha(cliente.ultimaCompra)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        cliente.estado === 'activo' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {cliente.estado === 'activo' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setVistaPreview(cliente)}
                          className="text-gray-600 hover:text-gray-900 p-1 rounded"
                          title="Vista previa"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setClienteSeleccionado(cliente);
                            setModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setClienteSeleccionado(cliente);
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mensaje cuando no hay resultados */}
      {clientesEnPagina.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron clientes
          </h3>
          <p className="text-gray-500 mb-4">
            No hay clientes que coincidan con los filtros aplicados.
          </p>
          <button
            onClick={limpiarFiltros}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {/* Paginación responsive */}
      {totalPaginas > 1 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
            <div className="text-sm text-gray-700 text-center sm:text-left">
              Mostrando {((pagina - 1) * itemsPorPagina) + 1} a {Math.min(pagina * itemsPorPagina, clientesFiltrados.length)} de {clientesFiltrados.length} clientes
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
                            ? 'bg-blue-600 text-white'
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

      {/* Modal de vista previa */}
      {vistaPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Detalles del Cliente
              </h2>
              <button
                onClick={() => setVistaPreview(null)}
                className="text-gray-400 hover:text-gray-500 p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Información básica */}
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                  vistaPreview.tipoCliente === 'empresa' ? 'bg-purple-500' : 'bg-blue-500'
                }`}>
                  {vistaPreview.tipoCliente === 'empresa' ? (
                    <Building2 size={24} />
                  ) : (
                    vistaPreview.nombre.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{vistaPreview.nombre}</h3>
                  <p className="text-gray-600">{vistaPreview.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      vistaPreview.estado === 'activo' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {vistaPreview.estado === 'activo' ? 'Activo' : 'Inactivo'}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      vistaPreview.tipoCliente === 'empresa' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {vistaPreview.tipoCliente === 'empresa' ? 'Empresa' : 'Individual'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Información de contacto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Información de Contacto</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail size={16} className="text-gray-400 mr-3" />
                      <span className="text-sm text-gray-900">{vistaPreview.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone size={16} className="text-gray-400 mr-3" />
                      <span className="text-sm text-gray-900">{vistaPreview.telefono}</span>
                    </div>
                    <div className="flex items-start">
                      <MapPin size={16} className="text-gray-400 mr-3 mt-0.5" />
                      <span className="text-sm text-gray-900">{vistaPreview.direccion}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Estadísticas</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total de compras:</span>
                      <span className="text-sm font-medium text-gray-900">{vistaPreview.compras}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Valor total:</span>
                      <span className="text-sm font-medium text-gray-900">
                        ${Math.round(vistaPreview.valorTotal).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Última compra:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatFecha(vistaPreview.ultimaCompra)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setClienteSeleccionado(vistaPreview);
                    setVistaPreview(null);
                    setModalOpen(true);
                  }}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Editar Cliente
                </button>
                <button
                  onClick={() => setVistaPreview(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
          onConfirm={() => {
            console.log('Eliminando cliente:', clienteSeleccionado);
            setConfirmOpen(false);
            setClienteSeleccionado(null);
          }}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </div>
  );
};

export default Clientes;