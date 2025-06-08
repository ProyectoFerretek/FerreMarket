import React, { useState, useEffect } from 'react';
import { Bell, Menu, Search, User, X } from 'lucide-react';
import { notificaciones } from '../../data/mockData';
import NotificacionesDropdown from './NotificacionesDropdown';
import SearchComponent from '../common/Search';

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
  isMobile: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, sidebarOpen, isMobile }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificacionesOpen, setNotificacionesOpen] = useState(false);
  
  const notificacionesNoLeidas = notificaciones.filter(n => !n.leida).length;

  // Cerrar buscador con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [searchOpen]);

  // Gestión de gestos táctiles para cerrar
  useEffect(() => {
    if (!isMobile || !searchOpen) return;

    let startY = 0;
    let currentY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      currentY = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      const deltaY = startY - currentY;
      if (deltaY > 50) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, searchOpen]);

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center min-w-0">
            <button 
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-orange-500 focus:outline-none focus:text-orange-500 mr-2 sm:mr-3 p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Toggle sidebar"
            >
              <Menu size={isMobile ? 20 : 24} />
            </button>

            <div className="flex items-center min-w-0">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600 mr-1">Ferre</div>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900">Market</div>
            </div>
          </div>

          {/* Center Section - Desktop Search */}
          <div className="hidden md:flex flex-grow justify-center mx-4">
            <SearchComponent className="w-full max-w-2xl" />
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Mobile Search Toggle */}
            <button
              onClick={handleSearchToggle}
              className="md:hidden text-gray-500 hover:text-orange-500 focus:outline-none p-2 rounded-lg hover:bg-gray-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Toggle search"
            >
              <Search size={18} />
            </button>
            
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificacionesOpen(!notificacionesOpen)}
                className="text-gray-500 hover:text-orange-500 focus:outline-none p-2 rounded-lg hover:bg-gray-100 transition-colors relative min-w-[44px] min-h-[44px] flex items-center justify-center"
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
            <button className="flex items-center text-gray-500 hover:text-orange-500 focus:outline-none p-1 rounded-lg hover:bg-gray-100 transition-colors min-w-[44px] min-h-[44px]">
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

      {/* Panel de búsqueda móvil expandible */}
      {isMobile && (
        <div 
          className={`fixed top-0 left-0 right-0 bg-white shadow-2xl transform transition-all duration-300 ease-out z-60 ${
            searchOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
          }`}
          style={{ 
            paddingTop: '8px',
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px'
          }}
        >
          <div className="px-4 py-4 pb-6">
            {/* Header del panel de búsqueda */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Buscar</h3>
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>

            <SearchComponent 
              isMobile={true} 
              onClose={handleSearchClose}
            />

            {/* Indicador de gesto para cerrar */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400">Desliza hacia arriba para cerrar</p>
            </div>
          </div>
        </div>
      )}

      {/* Overlay para cerrar el buscador móvil */}
      {isMobile && searchOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-50 transition-opacity duration-300"
          style={{ top: '320px' }}
          onClick={handleSearchClose}
        />
      )}
    </>
  );
};

export default Header;