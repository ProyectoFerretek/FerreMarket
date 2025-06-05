import React from 'react';
import { productos } from '../../data/mockData';
import { formatPrecio } from '../../utils/formatters';
import { AlertTriangle } from 'lucide-react';

const ProductosDestacados: React.FC = () => {
  // Filtrar productos destacados y ordenar por stock bajo
  const productosDestacados = productos
    .filter(producto => producto.destacado)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 5); // Limitar a 5 productos para mejor rendimiento

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Productos Destacados</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {productosDestacados.map(producto => (
              <tr 
                key={producto.id} 
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img 
                        className="h-10 w-10 rounded-md object-cover" 
                        src={producto.imagen} 
                        alt={producto.nombre}
                        loading="lazy"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{producto.nombre}</div>
                      <div className="text-sm text-gray-600 truncate max-w-[200px]">{producto.descripcion}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-medium">{formatPrecio(producto.precio)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{producto.stock} unidades</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {producto.stock < 10 ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      <AlertTriangle size={14} className="mr-1" /> Stock bajo
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Disponible
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
        <button className="text-sm text-blue-700 hover:text-blue-800 font-medium">
          Ver todos los productos →
        </button>
      </div>
    </div>
  );
};

export default ProductosDestacados;