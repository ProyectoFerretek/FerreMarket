import React, { useState, useEffect, useRef } from 'react';
import { Search, Clock, TrendingUp, Package, Users, ShoppingCart, X } from 'lucide-react';
import { productos, clientes, ventas } from '../../data/mockData';

interface SugerenciaBusqueda {
  id: string;
  texto: string;
  tipo: 'producto' | 'cliente' | 'venta' | 'categoria';
  icono: React.ReactNode;
  detalles?: string;
}

interface SearchComponentProps {
  isMobile?: boolean;
  onClose?: () => void;
  className?: string;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ 
  isMobile = false, 
  onClose,
  className = ""
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [historialBusquedas, setHistorialBusquedas] = useState<string[]>([
    'Taladro inalámbrico',
    'Pintura blanca',
    'Herramientas',
    'Cable eléctrico',
    'Sierra circular'
  ]);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-enfoque cuando se abre el buscador móvil
  useEffect(() => {
    if (isMobile && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 150);
    }
  }, [isMobile]);

  // Cerrar con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isMobile && onClose) {
          onClose();
        } else {
          setShowDropdown(false);
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobile, onClose]);

  // Cerrar al hacer clic fuera (solo desktop)
  useEffect(() => {
    if (isMobile) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current && 
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile]);

  // Cerrar al cambiar de pestaña
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setShowDropdown(false);
        if (isMobile && onClose) {
          onClose();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isMobile, onClose]);

  // Generar sugerencias en tiempo real
  const generarSugerencias = (query: string): SugerenciaBusqueda[] => {
    if (!query.trim()) return [];

    const sugerencias: SugerenciaBusqueda[] = [];
    const queryLower = query.toLowerCase();

    // Buscar en productos
    productos.forEach(producto => {
      if (producto.nombre.toLowerCase().includes(queryLower) && sugerencias.length < 3) {
        sugerencias.push({
          id: `producto-${producto.id}`,
          texto: producto.nombre,
          tipo: 'producto',
          icono: <Package size={16} className="text-blue-500" />,
          detalles: `Stock: ${producto.stock} unidades`
        });
      }
    });

    // Buscar en clientes
    clientes.forEach(cliente => {
      if (cliente.nombre.toLowerCase().includes(queryLower) && sugerencias.length < 4) {
        sugerencias.push({
          id: `cliente-${cliente.id}`,
          texto: cliente.nombre,
          tipo: 'cliente',
          icono: <Users size={16} className="text-green-500" />,
          detalles: cliente.email
        });
      }
    });

    // Buscar en ventas
    ventas.forEach(venta => {
      if (venta.id.includes(queryLower) && sugerencias.length < 5) {
        sugerencias.push({
          id: `venta-${venta.id}`,
          texto: `Venta #${venta.id}`,
          tipo: 'venta',
          icono: <ShoppingCart size={16} className="text-purple-500" />,
          detalles: `Total: $${venta.total.toLocaleString()}`
        });
      }
    });

    return sugerencias.slice(0, 5);
  };

  const sugerencias = generarSugerencias(searchQuery);

  const resaltarTexto = (texto: string, query: string) => {
    if (!query.trim()) return texto;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const partes = texto.split(regex);
    
    return partes.map((parte, index) => 
      regex.test(parte) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">
          {parte}
        </mark>
      ) : parte
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Agregar al historial si no existe
      if (!historialBusquedas.includes(searchQuery.trim())) {
        setHistorialBusquedas(prev => [searchQuery.trim(), ...prev.slice(0, 4)]);
      }
      
      setShowDropdown(false);
      if (isMobile && onClose) {
        onClose();
      }
    }
  };

  const handleSugerenciaClick = (sugerencia: SugerenciaBusqueda) => {
    setSearchQuery(sugerencia.texto);
    if (!historialBusquedas.includes(sugerencia.texto)) {
      setHistorialBusquedas(prev => [sugerencia.texto, ...prev.slice(0, 4)]);
    }
    setShowDropdown(false);
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleHistorialClick = (termino: string) => {
    setSearchQuery(termino);
    setShowDropdown(false);
    searchInputRef.current?.focus();
  };

  const eliminarDelHistorial = (termino: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistorialBusquedas(prev => prev.filter(item => item !== termino));
  };

  const limpiarHistorial = () => {
    setHistorialBusquedas([]);
  };

  const limpiarBusqueda = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  const handleInputFocus = () => {
    if (!isMobile) {
      setShowDropdown(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (!isMobile) {
      setShowDropdown(true);
    }
  };

  // Contenido de búsqueda reutilizable
  const SearchContent = () => (
    <div className="space-y-4 max-h-80 overflow-y-auto">
      {searchQuery.length === 0 ? (
        <>
          {/* Búsquedas populares */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700 flex items-center">
                <TrendingUp size={16} className="mr-2 text-orange-500" />
                Búsquedas populares
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Taladros', 'Pinturas', 'Herramientas', 'Cables', 'Cemento'].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setSearchQuery(term)}
                  className={`px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors border border-blue-200 ${
                    isMobile ? 'min-h-[44px]' : ''
                  }`}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Historial de búsquedas */}
          {historialBusquedas.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700 flex items-center">
                  <Clock size={16} className="mr-2 text-gray-500" />
                  Búsquedas recientes
                </h4>
                <button
                  onClick={limpiarHistorial}
                  className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                >
                  {isMobile ? 'Limpiar todo' : 'Borrar historial'}
                </button>
              </div>
              <div className="space-y-1">
                {historialBusquedas.slice(0, 5).map((termino, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group ${
                      isMobile ? 'min-h-[44px]' : ''
                    }`}
                    onClick={() => handleHistorialClick(termino)}
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <Clock size={14} className="text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700 truncate">{termino}</span>
                    </div>
                    <button
                      onClick={(e) => eliminarDelHistorial(termino, e)}
                      className={`flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-all ${
                        isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                      aria-label={`Eliminar "${termino}" del historial`}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Sugerencias de búsqueda en tiempo real */}
          {sugerencias.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <Search size={16} className="mr-2 text-blue-500" />
                Sugerencias
              </h4>
              <div className="space-y-1">
                {sugerencias.map((sugerencia) => (
                  <button
                    key={sugerencia.id}
                    onClick={() => handleSugerenciaClick(sugerencia)}
                    className={`w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all text-left ${
                      isMobile ? 'min-h-[44px]' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      {sugerencia.icono}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {resaltarTexto(sugerencia.texto, searchQuery)}
                        </div>
                        {sugerencia.detalles && (
                          <div className="text-xs text-gray-500 truncate">
                            {sugerencia.detalles}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 capitalize bg-gray-100 px-2 py-1 rounded-lg">
                      {sugerencia.tipo}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Búsqueda en todas las secciones */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Buscar en todas las secciones</h4>
            <div className="space-y-2">
              <button
                onClick={handleSearchSubmit}
                className={`w-full flex items-center p-3 bg-orange-50 border border-orange-200 rounded-xl hover:bg-orange-100 transition-colors text-left ${
                  isMobile ? 'min-h-[44px]' : ''
                }`}
              >
                <Search size={16} className="text-orange-600 mr-3" />
                <span className="text-sm text-orange-700">
                  Buscar "<strong>{searchQuery}</strong>" en todos los productos
                </span>
              </button>
              <button
                onClick={handleSearchSubmit}
                className={`w-full flex items-center p-3 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors text-left ${
                  isMobile ? 'min-h-[44px]' : ''
                }`}
              >
                <Users size={16} className="text-green-600 mr-3" />
                <span className="text-sm text-green-700">
                  Buscar "<strong>{searchQuery}</strong>" en clientes
                </span>
              </button>
              <button
                onClick={handleSearchSubmit}
                className={`w-full flex items-center p-3 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition-colors text-left ${
                  isMobile ? 'min-h-[44px]' : ''
                }`}
              >
                <ShoppingCart size={16} className="text-purple-600 mr-3" />
                <span className="text-sm text-purple-700">
                  Buscar "<strong>{searchQuery}</strong>" en ventas
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <div ref={containerRef} className={`w-full ${className}`}>
        <form onSubmit={handleSearchSubmit} className="relative mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder="Buscar productos, clientes, órdenes..."
                className="w-full pl-12 pr-12 py-4 text-base bg-gray-50 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:bg-white transition-all shadow-sm [&::-webkit-search-cancel-button]:hidden [&::-ms-clear]:hidden"
                style={{ fontSize: '16px' }}
              />
            </div>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex-shrink-0 p-3 text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
                aria-label="Cerrar búsqueda"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </form>

        <SearchContent />
      </div>
    );
  }

  // Versión Desktop
  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="flex items-center bg-gray-50 border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500 focus-within:bg-white">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          
          <input 
            ref={searchInputRef}
            type="search" 
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            className="flex-1 pl-12 pr-20 py-3 text-sm bg-transparent border-0 focus:outline-none focus:ring-0 placeholder-gray-500 [&::-webkit-search-cancel-button]:hidden [&::-ms-clear]:hidden"
            placeholder="Buscar productos, clientes, órdenes..."
            autoComplete="off"
          />
          
          {searchQuery && (
            <button
              type="button"
              onClick={limpiarBusqueda}
              className="absolute right-16 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <X size={16} />
            </button>
          )}
          
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Buscar
          </button>
        </div>
      </form>

      {showDropdown && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-60 max-h-96 overflow-y-auto"
        >
          <div className="p-4">
            <SearchContent />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;