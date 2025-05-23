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
        return <Info size={16} className="text-blue-500" />;
      case 'alerta':
        return <AlertCircle size={16} className="text-yellow-500" />;
      case 'error':
        return <AlertTriangle size={16} className="text-red-500" />;
      default:
        return <Bell size={16} className="text-gray-500" />;
    }
  };

  const getClaseColor = (tipo: string) => {
    switch (tipo) {
      case 'info':
        return 'border-l-blue-500';
      case 'alerta':
        return 'border-l-yellow-500';
      case 'error':
        return 'border-l-red-500';
      default:
        return 'border-l-gray-300';
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 z-50">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700">Notificaciones</h3>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <X size={16} />
        </button>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {notificaciones.length > 0 ? (
          <div>
            {notificaciones.map(notificacion => (
              <div 
                key={notificacion.id} 
                className={`px-4 py-3 border-l-4 ${getClaseColor(notificacion.tipo)} ${!notificacion.leida ? 'bg-orange-50' : ''} hover:bg-gray-50 transition-colors`}
              >
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    {getIcono(notificacion.tipo)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-800">{notificacion.mensaje}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatFecha(notificacion.fecha, true)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-4 py-6 text-center text-gray-500">
            No hay notificaciones
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-100 px-4 py-2">
        <button className="text-xs text-orange-500 hover:text-orange-700 font-medium">
          Ver todas las notificaciones
        </button>
      </div>
    </div>
  );
};

export default NotificacionesDropdown;