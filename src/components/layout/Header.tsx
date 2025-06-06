import React, { useState } from 'react';
import { Bell, Menu, Search, User, X } from 'lucide-react';
import { notificaciones } from '../../data/mockData';
import NotificacionesDropdown from './NotificacionesDropdown';

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, sidebarOpen }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificacionesOpen, setNotificacionesOpen] = useState(false);

  const notificacionesNoLeidas = notificaciones.filter(n => !n.leida).length;

  return (
    <header className="bg-white border-b border-gray-200 fixed w-full z-30">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-orange-500 focus:outline-none focus:text-orange-500 mr-3"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center">
            <div className="text-2xl font-bold text-blue-600 mr-1">FerreMarket</div>
            {/* <div className="text-2xl font-bold text-blue-900">Market</div> */}
          </div>
        </div>

        <div className={`${searchOpen ? 'flex' : 'hidden'} md:flex flex-grow max-w-md mx-4`}>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="search"
              className="bg-gray-100 w-full pl-10 pr-4 py-2 rounded-lg border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white"
              placeholder="Buscar productos, clientes, órdenes..."
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden text-gray-500 hover:text-orange-500 focus:outline-none"
          >
            {searchOpen ? <X size={20} /> : <Search size={20} />}
          </button>

          <div className="relative">
            <button
              onClick={() => setNotificacionesOpen(!notificacionesOpen)}
              className="text-gray-500 hover:text-orange-500 focus:outline-none p-1 rounded-full"
            >
              <Bell size={20} />
              {notificacionesNoLeidas > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                  {notificacionesNoLeidas}
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

          <button className="flex items-center text-gray-500 hover:text-orange-500 focus:outline-none">
            <div className="hidden md:block mr-2 text-right">
              <div className="text-sm font-medium">Admin</div>
              <div className="text-xs text-gray-500">Administrador</div>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-900 flex items-center justify-center text-white">
              <User size={16} />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;