import React, { useState } from 'react';
import { ventas, clientes } from '../../data/mockData';
import { formatPrecio, formatFecha, getNombreCliente, getEstadoVenta } from '../../utils/formatters';
import { Calendar, User, CreditCard, Package, Eye, ChevronDown } from 'lucide-react';

const VentasRecientes: React.FC = () => {
  const [cantidadVentas, setCantidadVentas] = useState(5);

  // Ordenar ventas por fecha (más recientes primero) y aplicar límite seleccionado
  const ventasOrdenadas = [...ventas]
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, cantidadVentas);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Ventas Recientes</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Últimas transacciones realizadas</p>
          </div>
          
          {/* Selector de cantidad de ventas */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-600 whitespace-nowrap">Mostrar:</span>
            <div className="relative">
              <select
                value={cantidadVentas}
                onChange={(e) => setCantidadVentas(Number(e.target.value))}
                className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-1 pr-8 text-xs font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <span className="text-xs text-gray-600 whitespace-nowrap">ventas</span>
          </div>
        </div>
      </div>
      
      {/* Grid responsive para ventas */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ventasOrdenadas.map(venta => {
            const estadoInfo = getEstadoVenta(venta.estado);
            const cliente = clientes.find(c => c.id === venta.cliente);
            
            return (
              <div 
                key={venta.id}
                className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 hover:border-gray-300 group flex flex-col h-full"
              >
                {/* Header de la venta */}
                <div className="flex items-center justify-between p-4 pb-3 border-b border-gray-100 flex-shrink-0">
                  <span className="text-sm font-bold text-gray-900">#{venta.id}</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${estadoInfo.color}`}>
                    {estadoInfo.label}
                  </span>
                </div>

                {/* Contenido principal - flex-grow para ocupar espacio disponible */}
                <div className="flex-grow p-4 pt-3 flex flex-col">
                  <div className="flex-grow space-y-3">
                    {/* Fecha */}
                    <div className="flex items-center text-xs text-gray-600">
                      <Calendar size={14} className="mr-2 flex-shrink-0" />
                      <span className="truncate">{formatFecha(venta.fecha, true)}</span>
                    </div>

                    {/* Cliente */}
                    <div className="flex items-center text-xs text-gray-600">
                      <User size={14} className="mr-2 flex-shrink-0" />
                      <span className="truncate">{cliente?.nombre || 'Cliente no encontrado'}</span>
                    </div>

                    {/* Método de pago */}
                    <div className="flex items-center text-xs text-gray-600">
                      <CreditCard size={14} className="mr-2 flex-shrink-0" />
                      <span className="truncate">{venta.metodoPago}</span>
                    </div>

                    {/* Productos */}
                    <div className="flex items-start text-xs text-gray-600">
                      <Package size={14} className="mr-2 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <span className="text-gray-700 font-medium">
                          {venta.productos.length} producto{venta.productos.length !== 1 ? 's' : ''}
                        </span>
                        <div className="text-xs text-gray-500 mt-1 space-y-1">
                          {venta.productos.slice(0, 2).map((item, index) => (
                            <div key={index} className="truncate">
                              {item.cantidad}x Producto #{item.id}
                            </div>
                          ))}
                          {venta.productos.length > 2 && (
                            <div className="text-gray-400">
                              +{venta.productos.length - 2} más...
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Total - Posición fija encima del botón */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex-shrink-0">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-gray-600">Total:</span>
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrecio(venta.total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botón de acción - siempre en la parte inferior */}
                <div className="p-4 pt-0 flex-shrink-0">
                  <button className="w-full flex items-center justify-center px-3 py-2.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors group-hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1">
                    <Eye size={14} className="mr-1.5" />
                    Ver detalles
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mensaje cuando no hay ventas */}
        {ventasOrdenadas.length === 0 && (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay ventas recientes
            </h3>
            <p className="text-gray-500">
              Las ventas aparecerán aquí una vez que se realicen transacciones.
            </p>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="px-4 sm:px-6 py-3 border-t border-gray-100 bg-gray-50">
        <button className="text-xs sm:text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors">
          Ver todas las ventas →
        </button>
      </div>
    </div>
  );
};

export default VentasRecientes;