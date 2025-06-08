import React from 'react';

interface EstadisticaCardProps {
  titulo: string;
  valor: string | number;
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
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        {/* Contenido principal - lado izquierdo */}
        <div className="min-w-0 flex-1">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 truncate leading-tight">
            {titulo}
          </h3>
          <p className="mt-2 text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 truncate leading-none">
            {valor}
          </p>

          {(incremento !== undefined && comparacionTexto) && (
            <div className="mt-2">
              <p className="text-xs sm:text-sm leading-tight">
                <span className={`font-medium ${incremento >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {incremento >= 0 ? `+${incremento}%` : `${incremento}%`}
                </span>
                <span className="text-gray-500 ml-1">{comparacionTexto}</span>
              </p>
            </div>
          )}
        </div>

        {/* Contenedor del icono - lado derecho */}
        <div className="flex-shrink-0 self-start">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${colorClase} flex items-center justify-center`}>
            <div className="flex items-center justify-center">
              {icono}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstadisticaCard;