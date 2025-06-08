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
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 space-y-2 sm:space-y-0">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">Ventas Diarias</h3>
        <select className="text-xs sm:text-sm border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200 w-full sm:w-auto">
          <option>Últimos 7 días</option>
          <option>Últimos 30 días</option>
          <option>Este mes</option>
        </select>
      </div>

      <div className="flex items-end space-x-1 sm:space-x-2 h-48 sm:h-64 overflow-x-auto">
        {estadisticasVentas.map((item, index) => {
          const porcentajeAltura = (item.ventas / maxVenta) * 100;
          const esDiaActual = index === estadisticasVentas.length - 1;

          return (
            <div key={item.fecha} className="flex flex-col items-center flex-1 min-w-0 group">
              <div
                className={`relative w-full max-w-[32px] sm:max-w-[40px] rounded-t-md transition-all duration-300 ${esDiaActual ? 'bg-orange-500' : 'bg-blue-700'} hover:opacity-80`}
                style={{ height: `${Math.max(porcentajeAltura, 5)}%` }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-10">
                  {formatPrecio(item.ventas)}
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2 text-center">
                {formatearDia(item.fecha)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 space-y-2 sm:space-y-0">
        <div className="text-center sm:text-left">
          <span className="text-xs sm:text-sm font-semibold text-gray-700">Total periodo:</span>
          <span className="ml-2 text-xs sm:text-sm text-gray-900">
            {formatPrecio(estadisticasVentas.reduce((acc, item) => acc + item.ventas, 0))}
          </span>
        </div>
        <button className="text-xs sm:text-sm text-orange-600 hover:text-orange-700 transition-colors">
          Ver reporte completo →
        </button>
      </div>
    </div>
  );
};

export default GraficoVentas;