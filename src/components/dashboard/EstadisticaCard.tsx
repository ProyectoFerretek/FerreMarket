import React from 'react';
import NumberFlow from '@number-flow/react'

interface EstadisticaCardProps {
  titulo: string;
  valor: number;
  icono: React.ReactNode;
  colorClase: string;
  incremento?: number;
  comparacionTexto?: string;
}

const EstadisticaCard: React.FC<EstadisticaCardProps> = ({
  titulo,
  valor,
  icono,
  colorClase,
  incremento,
  comparacionTexto
}) => {
  return (
    <div className="bg-white-500 rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{titulo}</h3>
          <p className="mt-2 text-3xl font-bold text-gray-800"><NumberFlow value={valor} /></p>
          
          {(incremento !== undefined && comparacionTexto) && (
            <p className="mt-2 text-sm">
              <span className={incremento >= 0 ? 'text-green-600' : 'text-red-600'}>
                {incremento >= 0 ? `+${incremento}%` : `${incremento}%`}
              </span>
              <span className="text-gray-500 ml-1">{comparacionTexto}</span>
            </p>
          )}
        </div>
        
        <div className={`p-3 rounded-full ${colorClase}`}>
          {icono}
        </div>
      </div>
    </div>
  );
};

export default EstadisticaCard;