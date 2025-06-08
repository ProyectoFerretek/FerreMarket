import React, { useState, useEffect, useRef } from 'react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const notificacionesNoLeidas = notificaciones.filter(n => !n.leida).length;

  // Auto-enfoque cuando se abre el buscador móvil
  useEffect(() => {
    if (searchOpen && isMobile && searchInputRef.current) {
      // Pequeño delay para asegurar que la animación se complete
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 150);
    }
  }, [searchOpen, isMobile]);

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Búsqueda:', searchQuery);
      // Aquí iría la lógica de búsqueda
      if (isMobile) {
        setSearchOpen(false);
      }
    }
  };

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
    if (searchOpen) {
      setSearchQuery('');
    }
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
          <div className="hidden md:flex flex-grow max-w-md mx-2 sm:mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input 
                type="search" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-100 w-full pl-9 pr-4 py-2 text-sm rounded-lg border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                placeholder="Buscar productos, clientes, órdenes..."
              />
            </form>
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
            <button className="flex items-center text-orange-500 hover:text-orange-500 focus:outline-none p-1 rounded-lg hover:bg-orange-100 transition-colors min-w-[44px] min-h-[44px]">
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
          className={`fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out z-60 ${
            searchOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
          style={{ 
            top: searchOpen ? '0' : '-100%',
            paddingTop: '4px' // Pequeño espacio desde el top
          }}
        >
          <div className="px-4 py-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="flex items-center space-x-3">
                {/* Campo de búsqueda */}
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Search size={20} className="text-gray-400" />
                  </div>
                  <input
                    ref={searchInputRef}
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar productos, clientes, órdenes..."
                    className="w-full pl-12 pr-4 py-4 text-base bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:bg-white transition-all"
                    style={{ fontSize: '16px' }} // Previene zoom en iOS
                  />
                </div>

                {/* Botón de cerrar */}
                <button
                  type="button"
                  onClick={handleSearchToggle}
                  className="flex-shrink-0 p-3 text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
                  aria-label="Cerrar búsqueda"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Sugerencias de búsqueda rápida */}
              {searchQuery.length === 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-500 font-medium">Búsquedas populares:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Taladros', 'Pinturas', 'Herramientas', 'Cables', 'Cemento'].map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setSearchQuery(term)}
                        className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Resultados de búsqueda en tiempo real */}
              {searchQuery.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-500 font-medium">Resultados:</p>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {/* Aquí irían los resultados filtrados */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Buscar "{searchQuery}" en productos</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Buscar "{searchQuery}" en clientes</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Buscar "{searchQuery}" en ventas</p>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Overlay para cerrar el buscador móvil */}
      {isMobile && searchOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-50"
          style={{ top: '100px' }} // Comienza debajo del panel de búsqueda
          onClick={handleSearchToggle}
        />
      )}
    </>
  );
};

export default Header;