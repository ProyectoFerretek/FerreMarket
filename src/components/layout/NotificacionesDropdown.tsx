import React from 'react';
import { formatFecha } from '../../utils/formatters';
import { Notificacion } from '../../types';
import { Bell, Info, AlertCircle, AlertTriangle, X } from 'lucide-react';

interface NotificacionesDropdownProps {
  notificaciones: Notificacion[];
  onClose: () => void;
}

const NotificacionesDropdown: React.FC<NotificacionesDropdownProps> = ({
  notificaciones,
  onClose
}) => {
  const getIcono = (tipo: string) => {
    switch (tipo) {
      case 'info':
        return <Info size={14} className="text-green-500" />;
      case 'alerta':
        return <AlertCircle size={14} className="text-yellow-500" />;
      case 'error':
        return <AlertTriangle size={14} className="text-red-500" />;
      default:
        return <Bell size={14} className="text-gray-500" />;
    }
  };

  const getClaseColor = (tipo: string) => {
    switch (tipo) {
      case 'info':
        return 'border-l-green-500';
      case 'alerta':
        return 'border-l-yellow-500';
      case 'error':
        return 'border-l-red-500';
      default:
        return 'border-l-gray-300';
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700">Notificaciones</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500 p-1 rounded"
        >
          <X size={16} />
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {notificaciones.length > 0 ? (
          <div>
            {notificaciones.map(notificacion => (
              <div
                key={notificacion.id}
                className={`px-4 py-3 border-l-4 ${getClaseColor(notificacion.tipo)} ${!notificacion.leida ? 'bg-orange-50' : ''} hover:bg-gray-50 transition-colors`}
              >
                <div className="flex items-start">
                  <div className="mr-3 mt-0.5 flex-shrink-0">
                    {getIcono(notificacion.tipo)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 leading-relaxed">{notificacion.mensaje}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatFecha(notificacion.fecha, true)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-4 py-8 text-center text-gray-500">
            <Bell size={32} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No hay notificaciones</p>
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 px-4 py-3">
        <button className="text-xs text-orange-500 hover:text-orange-700 font-medium w-full text-center">
          Ver todas las notificaciones
        </button>
      </div>
    </div>
  );
};

export default NotificacionesDropdown;