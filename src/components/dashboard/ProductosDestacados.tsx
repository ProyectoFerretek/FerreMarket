import React, { useState } from 'react';
import { productos } from '../../data/mockData';
import { formatPrecio } from '../../utils/formatters';
import { CheckCircle, AlertTriangle, AlertCircle, XCircle, ChevronDown, Calculator } from 'lucide-react';

const ProductosDestacados: React.FC = () => {
  const [itemsPorPagina, setItemsPorPagina] = useState(6);
  const [paginaActual, setPaginaActual] = useState(1);

  // Filtrar productos destacados y ordenar por stock bajo
  const productosDestacados = productos
    .filter(producto => producto.destacado)
    .sort((a, b) => a.stock - b.stock);

  // Calcular paginación
  const totalProductos = productosDestacados.length;
  const totalPaginas = Math.ceil(totalProductos / itemsPorPagina);
  const indiceInicio = (paginaActual - 1) * itemsPorPagina;
  const indiceFin = indiceInicio + itemsPorPagina;
  const productosEnPagina = productosDestacados.slice(indiceInicio, indiceFin);

  // Resetear página cuando cambia items por página
  const handleItemsPorPaginaChange = (nuevaCantidad: number) => {
    setItemsPorPagina(nuevaCantidad);
    setPaginaActual(1);
  };

  const getStockIndicador = (stock: number) => {
    if (stock === 0) {
      return {
        icon: <XCircle size={16} className="text-gray-500" />,
        color: 'text-gray-500',
        bgColor: 'bg-gray-100',
        label: 'Sin stock',
        dotColor: 'bg-gray-500'
      };
    } else if (stock < 5) {
      return {
        icon: <AlertCircle size={16} className="text-red-600" />,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        label: 'Muy bajo',
        dotColor: 'bg-red-500'
      };
    } else if (stock <= 20) {
      return {
        icon: <AlertTriangle size={16} className="text-yellow-600" />,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        label: 'Stock bajo',
        dotColor: 'bg-yellow-500'
      };
    } else {
      return {
        icon: <CheckCircle size={16} className="text-green-600" />,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        label: 'Disponible',
        dotColor: 'bg-green-500'
      };
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Productos Destacados</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Productos con mayor demanda</p>
          </div>
          
          {/* Selector de items por página */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-600 whitespace-nowrap">Mostrar:</span>
            <div className="relative">
              <select
                value={itemsPorPagina}
                onChange={(e) => handleItemsPorPaginaChange(Number(e.target.value))}
                className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-1 pr-8 text-xs font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <span className="text-xs text-gray-600 whitespace-nowrap">items</span>
          </div>
        </div>
      </div>
      
      {/* Grid responsive para productos */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {productosEnPagina.map(producto => {
            const stockInfo = getStockIndicador(producto.stock);
            
            return (
              <div 
                key={producto.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-gray-300 group"
              >
                {/* Imagen del producto */}
                <div className="relative mb-3">
                  <img 
                    className="w-full h-32 sm:h-36 rounded-md object-cover group-hover:scale-105 transition-transform duration-200" 
                    src={producto.imagen} 
                    alt={producto.nombre}
                    loading="lazy"
                  />
                  {/* Indicador de stock en la esquina */}
                  <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${stockInfo.dotColor} border-2 border-white shadow-sm`}></div>
                </div>

                {/* Información del producto */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
                    {producto.nombre}
                  </h4>
                  
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {producto.descripcion}
                  </p>

                  {/* Precio */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-900">
                      {formatPrecio(producto.precio)}
                    </span>
                  </div>

                  {/* Información de stock con espaciado mejorado */}
                  <div className="space-y-2">
                    {/* Primera línea: Stock actual en formato "X unidades" */}
                    <div className={`flex items-center justify-between p-2 rounded-md bg-zinc-100 border border-opacity-20`}>
                      <div className="flex items-center space-x-2">
                        <Calculator size={16} className="text-zinc-600" />
                        <span className={`text-xs font-medium bg-zinc-50`}>
                           {producto.stock} unidades
                        </span>
                      </div>
                    </div>
                    
                    {/* Segunda línea: Estado de disponibilidad */}
                    <div className={`flex items-center justify-between p-2 rounded-md ${stockInfo.bgColor} border border-opacity-20`}>
                      <div className="flex items-center space-x-2">
                        {stockInfo.icon}
                        <span className={`text-xs font-medium ${stockInfo.color}`}>
                          {stockInfo.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Información de paginación y navegación */}
        {totalPaginas > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
            <div className="text-xs text-gray-600">
              Mostrando {indiceInicio + 1} a {Math.min(indiceFin, totalProductos)} de {totalProductos} productos
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                disabled={paginaActual === 1}
                className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              
              <span className="text-xs text-gray-600">
                Página {paginaActual} de {totalPaginas}
              </span>
              
              <button
                onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                disabled={paginaActual === totalPaginas}
                className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="px-4 sm:px-6 py-3 border-t border-gray-100 bg-gray-50">
        <button className="text-xs sm:text-sm text-blue-700 hover:text-blue-800 font-medium transition-colors">
          Ver todos los productos →
        </button>
      </div>
    </div>
  );
};

export default ProductosDestacados;