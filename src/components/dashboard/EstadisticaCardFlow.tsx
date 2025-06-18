import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import NumberFlow from '@number-flow/react'

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
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">{titulo}</h3>
          <p className="text-2xl font-bold text-gray-900">$<NumberFlow value={valor} /></p>
        </div>
      </div>
    </div>
  );
};

export default EstadisticaCard;