import React, { useState, useMemo, useEffect } from 'react';
import { 
  Package, DollarSign, AlertTriangle, AlertCircle, 
  Search, Filter, Download, FileText, FileSpreadsheet,
  ArrowUpDown, Calendar, Truck, Plus, Eye
} from 'lucide-react';
import { categorias, obtenerProductos } from '../data/mockData';
import { formatPrecio, formatFecha, calcularStockTotal, calcularValorInventario } from '../utils/formatters';
import ConfirmDialog from '../components/common/ConfirmDialog';
import ReposicionModal from '../components/modals/ReposicionModal';
import { Producto } from '../types';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import logoURL from '../assets/images/logo.png'; // Adjust path to your logo

// Mock data para proveedores
const proveedores = [
  { id: '1', nombre: 'Ferretería Central', contacto: 'ventas@ferreteriacentral.com', telefono: '+56 9 1111 1111' },
  { id: '2', nombre: 'Distribuidora Industrial', contacto: 'pedidos@distindustrial.cl', telefono: '+56 9 2222 2222' },
  { id: '3', nombre: 'Suministros Técnicos', contacto: 'info@sumtecnicos.com', telefono: '+56 9 3333 3333' },
  { id: '4', nombre: 'Materiales del Sur', contacto: 'compras@matsur.cl', telefono: '+56 9 4444 4444' }
];

// Extender productos con información adicional para reportes
const ReportesInventario: React.FC = () => {
  const [reposicionModalOpen, setReposicionModalOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<any>(null);
  const [vistaActual, setVistaActual] = useState<'critico' | 'sinstock'>('critico');
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroProveedor, setFiltroProveedor] = useState('');
  const [filtroPrecio, setFiltroPrecio] = useState({ min: '', max: '' });
  const [filtroFecha, setFiltroFecha] = useState('');
  const [ordenamiento, setOrdenamiento] = useState({ campo: 'stock', direccion: 'asc' });

  const [productos, setProductos] = useState<Producto[]>([]);
  
  const productosExtendidos = useMemo(() => {
    return productos.map(producto => ({
      ...producto,
      nivelMinimo: Math.max(10, Math.floor(producto.stock * 0.2)), // Mínimo 10 unidades o 20% del stock actual
      proveedor: proveedores[Math.floor(Math.random() * proveedores.length)],
      ultimoPedido: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      ventasPromedio: Math.floor(Math.random() * 10) + 5, // Ventas promedio mensuales
      tiempoSinStock: producto.stock === 0 ? Math.floor(Math.random() * 15) + 1 : 0 // Días sin stock
    }));
  }, [productos]);

  const cargarProductos = async () => {
    const productosData = await obtenerProductos();
    setProductos(productosData);
  }

  useEffect(() => {
    cargarProductos();
  }, []);

  // Calcular KPIs
  const totalProductos = productos.length;
  const valorInventario = calcularValorInventario(productos);
  const productosSinStock = productosExtendidos.filter(p => p.stock === 0);
  const productosCriticos = productosExtendidos.filter(p => p.stock > 0 && p.stock <= p.nivelMinimo);

  // Filtrar productos según la vista actual
  const productosFiltrados = useMemo(() => {
    const productosBase = vistaActual === 'critico' ? productosCriticos : productosSinStock;
    
    return productosBase
      .filter(producto => {
        const matchBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                            producto.sku.toLowerCase().includes(busqueda.toLowerCase());
        const matchCategoria = !filtroCategoria || producto.categoria === filtroCategoria;
        const matchProveedor = !filtroProveedor || producto.proveedor.id === filtroProveedor;
        const matchPrecio = (!filtroPrecio.min || producto.precio >= parseFloat(filtroPrecio.min)) &&
                          (!filtroPrecio.max || producto.precio <= parseFloat(filtroPrecio.max));
        const matchFecha = !filtroFecha || producto.ultimoPedido.split('T')[0] >= filtroFecha;
        
        return matchBusqueda && matchCategoria && matchProveedor && matchPrecio && matchFecha;
      })
      .sort((a, b) => {
        const valorA = ordenamiento.campo === 'proveedor' ? a.proveedor.nombre : a[ordenamiento.campo];
        const valorB = ordenamiento.campo === 'proveedor' ? b.proveedor.nombre : b[ordenamiento.campo];
        
        if (valorA < valorB) return ordenamiento.direccion === 'asc' ? -1 : 1;
        if (valorA > valorB) return ordenamiento.direccion === 'asc' ? 1 : -1;
        return 0;
      });
  }, [vistaActual, busqueda, filtroCategoria, filtroProveedor, filtroPrecio, filtroFecha, ordenamiento, productosCriticos, productosSinStock]);

  const handleOrdenar = (campo: string) => {
    setOrdenamiento(prev => ({
      campo,
      direccion: prev.campo === campo && prev.direccion === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSolicitarReposicion = (producto: any) => {
    setProductoSeleccionado(producto);
    setReposicionModalOpen(true);
  };

  // PDF Export functions
  const generatePDF = () => {
    // Create a new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Add logo and header
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Add logo (commented out until logo is available)
    // doc.addImage(logoURL, 'PNG', 10, 10, 30, 15);
    
    // Add title
    doc.setFontSize(18);
    doc.setTextColor(33, 37, 41);
    doc.text('FerreMarket - Reporte de Inventario', pageWidth / 2, 20, { align: 'center' });
    
    // Add report info
    doc.setFontSize(12);
    doc.text(`Reporte de productos ${vistaActual === 'critico' ? 'con stock crítico' : 'sin stock'}`, pageWidth / 2, 30, { align: 'center' });
    doc.setFontSize(10);
    const today = new Date().toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    doc.text(`Generado el ${today}`, pageWidth / 2, 35, { align: 'center' });
    
    // Add summary information
    doc.setFontSize(12);
    doc.setTextColor(0, 102, 204);
    doc.text('Resumen:', 14, 45);
    doc.setTextColor(33, 37, 41);
    doc.setFontSize(10);
    const summaryData = [
      [`Total Productos: ${totalProductos}`, `Valor Inventario: ${formatPrecio(valorInventario)}`],
      [`Productos Sin Stock: ${productosSinStock.length}`, `Productos en Stock Crítico: ${productosCriticos.length}`]
    ];
    
    autoTable(doc, {
      startY: 50,
      head: [['Información de Inventario', '']],
      body: summaryData,
      theme: 'grid',
      headStyles: { 
        fillColor: [230, 126, 34], 
        textColor: [255, 255, 255],
        fontStyle: 'bold' 
      },
      styles: {
        fontSize: 10,
        cellPadding: 5
      }
    });
    
    // Get filtered products data for the table
    const tableData = productosFiltrados.map(producto => {
      if (vistaActual === 'critico') {
        return [
          producto.nombre,
          producto.sku,
          `${producto.stock} unidades`,
          `${producto.nivelMinimo} unidades`,
          producto.proveedor.nombre,
          formatFecha(producto.ultimoPedido)
        ];
      } else {
        return [
          producto.nombre,
          producto.sku,
          `${producto.stock} unidades`,
          `${producto.tiempoSinStock} días`,
          producto.proveedor.nombre,
          formatFecha(producto.ultimoPedido)
        ];
      }
    });
    
    // Add the main product table
    const headers = vistaActual === 'critico' 
      ? ['Producto', 'SKU', 'Stock Actual', 'Nivel Mínimo', 'Proveedor', 'Último Pedido']
      : ['Producto', 'SKU', 'Stock Actual', 'Tiempo Sin Stock', 'Proveedor', 'Último Pedido'];
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [headers],
      body: tableData,
      theme: 'grid',
      headStyles: { 
        fillColor: [230, 126, 34], 
        textColor: [255, 255, 255],
        fontStyle: 'bold' 
      },
      bodyStyles: {
        fontSize: 8
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      styles: {
        cellPadding: 3,
        fontSize: 8,
        overflow: 'linebreak'
      },
      columnStyles: {
        0: { cellWidth: 50 },
        4: { cellWidth: 40 }
      }
    });
    
    // Add footer
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      
      // Footer line
      doc.setDrawColor(200, 200, 200);
      doc.line(10, pageHeight - 20, pageWidth - 10, pageHeight - 20);
      
      // Footer text
      doc.text(
        `FerreMarket - Reporte de Inventario - Página ${i} de ${totalPages}`,
        pageWidth / 2, 
        pageHeight - 10, 
        { align: 'center' }
      );
    }
    
    // Save the PDF
    const fileName = `ferremarket_reporte_inventario_${new Date().toISOString().split('T')[0]}.pdf`;
    
    doc.save(fileName);
  };

  const exportarReporte = (formato: string) => {
    if (formato === 'pdf') {
      generatePDF();
    } else if (formato === 'excel') {
      console.log(`Exportando reporte de ${vistaActual} en formato Excel`);
      // Excel export functionality would go here
    }
  };

  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroCategoria('');
    setFiltroProveedor('');
    setFiltroPrecio({ min: '', max: '' });
    setFiltroFecha('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reportes de Inventario</h1>
          <p className="text-gray-600 mt-1">Monitorea el estado del inventario y gestiona reposiciones</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => exportarReporte('pdf')}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center transition-colors"
          >
            <FileText size={20} className="mr-2" />
            Exportar PDF
          </button>
          <button
            onClick={() => exportarReporte('excel')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center transition-colors"
          >
            <FileSpreadsheet size={20} className="mr-2" />
            Exportar Excel
          </button>
        </div>
      </div>

      {/* KPIs Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Productos</p>
              <p className="text-2xl font-bold text-gray-900">{totalProductos}</p>
              <p className="text-sm text-gray-500 mt-1">En catálogo</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Package size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Valor Inventario</p>
              <p className="text-2xl font-bold text-gray-900">{formatPrecio(valorInventario)}</p>
              <p className="text-sm text-gray-500 mt-1">Total en stock</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sin Stock</p>
              <p className="text-2xl font-bold text-red-600">{productosSinStock.length}</p>
              <p className="text-sm text-gray-500 mt-1">Productos agotados</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <AlertCircle size={24} className="text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Stock Crítico</p>
              <p className="text-2xl font-bold text-yellow-600">{productosCriticos.length}</p>
              <p className="text-sm text-gray-500 mt-1">Requieren atención</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <AlertTriangle size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Navegación de Vistas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setVistaActual('critico')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                vistaActual === 'critico'
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <AlertTriangle size={20} className="mr-2" />
                Stock Crítico ({productosCriticos.length})
              </div>
            </button>
            <button
              onClick={() => setVistaActual('sinstock')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                vistaActual === 'sinstock'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <AlertCircle size={20} className="mr-2" />
                Sin Stock ({productosSinStock.length})
              </div>
            </button>
          </nav>
        </div>

        {/* Filtros */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o SKU..."
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
              value={filtroProveedor}
              onChange={(e) => setFiltroProveedor(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los proveedores</option>
              {proveedores.map(prov => (
                <option key={prov.id} value={prov.id}>{prov.nombre}</option>
              ))}
            </select>

            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Precio mín"
                value={filtroPrecio.min}
                onChange={(e) => setFiltroPrecio(prev => ({ ...prev, min: e.target.value }))}
                className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Precio máx"
                value={filtroPrecio.max}
                onChange={(e) => setFiltroPrecio(prev => ({ ...prev, max: e.target.value }))}
                className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <input
              type="date"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              title="Último pedido desde"
            />

            <button
              onClick={limpiarFiltros}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Limpiar
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleOrdenar('sku')}
                >
                  <div className="flex items-center">
                    SKU
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleOrdenar('stock')}
                >
                  <div className="flex items-center">
                    Stock Actual
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </th>
                {vistaActual === 'critico' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nivel Mínimo
                  </th>
                )}
                {vistaActual === 'sinstock' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiempo Sin Stock
                  </th>
                )}
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleOrdenar('proveedor')}
                >
                  <div className="flex items-center">
                    Proveedor
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleOrdenar('ultimoPedido')}
                >
                  <div className="flex items-center">
                    Último Pedido
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productosFiltrados.map(producto => (
                <tr 
                  key={producto.id} 
                  className={`hover:bg-gray-50 ${
                    vistaActual === 'critico' ? 'bg-yellow-50' : 'bg-red-50'
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        className="w-10 h-10 rounded-lg object-cover mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{producto.nombre}</div>
                        <div className="text-sm text-gray-500">{formatPrecio(producto.precio)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono text-gray-900">{producto.sku}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {vistaActual === 'critico' ? (
                        <AlertTriangle size={16} className="text-yellow-500 mr-2" />
                      ) : (
                        <AlertCircle size={16} className="text-red-500 mr-2" />
                      )}
                      <span className="text-sm text-gray-900">{producto.stock} unidades</span>
                    </div>
                  </td>
                  {vistaActual === 'critico' && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{producto.nivelMinimo} unidades</span>
                    </td>
                  )}
                  {vistaActual === 'sinstock' && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-red-600 font-medium">
                        {producto.tiempoSinStock} días
                      </span>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{producto.proveedor.nombre}</div>
                      <div className="text-sm text-gray-500">{producto.proveedor.contacto}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {formatFecha(producto.ultimoPedido)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleSolicitarReposicion(producto)}
                      className="bg-orange-500 text-white px-3 py-1 rounded-md text-sm hover:bg-amber-700 flex items-center"
                    >
                      <Truck size={14} className="mr-1" />
                      Solicitar Reposición
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {productosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-500">
              {vistaActual === 'critico' 
                ? 'No hay productos con stock crítico que coincidan con los filtros.'
                : 'No hay productos sin stock que coincidan con los filtros.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Modal de Reposición */}
      {reposicionModalOpen && (
        <ReposicionModal
          producto={productoSeleccionado}
          onClose={() => {
            setReposicionModalOpen(false);
            setProductoSeleccionado(null);
          }}
        />
      )}
    </div>
  );
};

export default ReportesInventario;