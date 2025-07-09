import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatPrecio } from '../../utils/formatters';
import { LineChart, TrendingUp, DollarSign } from 'lucide-react';

interface GraficoVentasProps {
  datos: { fecha: string; ventas: number }[];
  isLoading?: boolean;
}

const GraficoVentas: React.FC<GraficoVentasProps> = ({ datos, isLoading = false }) => {
  // Formatear las fechas para mostrar solo los últimos 7 días
  const datosFormateados = datos.slice(-7).map(item => {
    const date = new Date(item.fecha);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    return {
      ...item,
      fecha: date.toLocaleDateString('es-CL', { 
        day: 'numeric',
        month: 'short'
      })
    };
  });

  const totalVentas7Dias = datosFormateados.reduce((sum, item) => sum + item.ventas, 0);
  const promedioDiario = datosFormateados.length > 0 
    ? totalVentas7Dias / datosFormateados.length 
    : 0;

  // Personalizar el tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-orange-500 font-bold">
            {formatPrecio(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <LineChart size={20} className="mr-2 text-blue-600" />
            Ventas de los últimos 7 días
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            Análisis de ventas diarias
          </p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center text-sm text-gray-500">
            <DollarSign size={16} className="text-green-500 mr-1" />
            Total: <span className="font-semibold text-gray-900 ml-1">{formatPrecio(totalVentas7Dias)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <TrendingUp size={16} className="text-blue-500 mr-1" />
            Promedio: <span className="font-semibold text-gray-900 ml-1">{formatPrecio(promedioDiario)}</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : datos.length === 0 ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">No hay datos disponibles</p>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={datosFormateados}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="fecha" 
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="ventas" 
                fill="#f97316" 
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default GraficoVentas;