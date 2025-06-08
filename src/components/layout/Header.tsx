import React, { useState } from 'react';
import { Bell, Menu, Search, User, X } from 'lucide-react';
import { notificaciones } from '../../data/mockData';
import NotificacionesDropdown from './NotificacionesDropdown';

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
  isMobile: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, sidebarOpen, isMobile }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificacionesOpen, setNotificacionesOpen] = useState(false);

  const notificacionesNoLeidas = notificaciones.filter(n => !n.leida).length;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center min-w-0">
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-orange-500 focus:outline-none focus:text-orange-500 mr-2 sm:mr-3 p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={isMobile ? 20 : 24} />
          </button>

          <div className="flex items-center min-w-0">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600 mr-1">Ferre</div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900">Market</div>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className={`${searchOpen ? 'flex' : 'hidden'} md:flex flex-grow max-w-md mx-2 sm:mx-4`}>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="search"
              className="bg-gray-100 w-full pl-9 pr-4 py-2 text-sm rounded-lg border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
              placeholder={isMobile ? "Buscar..." : "Buscar productos, clientes, órdenes..."}
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden text-gray-500 hover:text-orange-500 focus:outline-none p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle search"
          >
            {searchOpen ? <X size={18} /> : <Search size={18} />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificacionesOpen(!notificacionesOpen)}
              className="text-gray-500 hover:text-orange-500 focus:outline-none p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {notificacionesNoLeidas > 0 && (
                <span className="absolute top-1 right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                  {notificacionesNoLeidas > 9 ? '9+' : notificacionesNoLeidas}
                </span>
              )}
            </button>

            {notificacionesOpen && (
              <NotificacionesDropdown
                notificaciones={notificaciones}
                onClose={() => setNotificacionesOpen(false)}
              />
            )}
          </div>

          {/* User Menu */}
          <button className="flex items-center text-gray-500 hover:text-orange-500 focus:outline-none p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="hidden sm:block mr-2 text-right">
              <div className="text-xs sm:text-sm font-medium">Admin</div>
              <div className="text-xs text-gray-500 hidden lg:block">Administrador</div>
            </div>
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
              <User size={isMobile ? 14 : 16} />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;