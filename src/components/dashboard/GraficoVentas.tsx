import React from 'react';
import { estadisticasVentas } from '../../data/mockData';
import { formatPrecio } from '../../utils/formatters';

const GraficoVentas: React.FC = () => {
  // Encontrar el valor máximo para calcular porcentajes
  const maxVenta = Math.max(...estadisticasVentas.map(item => item.ventas));
  
  // Formatear fechas para mostrar solo el día
  const formatearDia = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    return fecha.getDate();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Ventas Diarias</h3>
        <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200">
          <option>Últimos 7 días</option>
          <option>Últimos 30 días</option>
          <option>Este mes</option>
        </select>
      </div>
      
      <div className="flex items-end space-x-2 h-64">
        {estadisticasVentas.map((item, index) => {
          const porcentajeAltura = (item.ventas / maxVenta) * 100;
          const esDiaActual = index === estadisticasVentas.length - 1;
          
          return (
            <div key={item.fecha} className="flex flex-col items-center flex-1">
              <div 
                className={`relative w-full max-w-[40px] rounded-t-md ${esDiaActual ? 'bg-orange-500' : 'bg-blue-700'}`} 
                style={{ height: `${porcentajeAltura}%` }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                  {formatPrecio(item.ventas)}
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {formatearDia(item.fecha)}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-between mt-4">
        <div>
          <span className="text-sm font-semibold text-gray-700">Total periodo:</span>
          <span className="ml-2 text-sm text-gray-900">
            {formatPrecio(estadisticasVentas.reduce((acc, item) => acc + item.ventas, 0))}
          </span>
        </div>
        <button className="text-sm text-orange-600 hover:text-orange-700">
          Ver reporte completo →
        </button>
      </div>
    </div>
  );
};

export default GraficoVentas;