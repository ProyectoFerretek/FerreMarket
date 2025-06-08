import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Tag,
  BarChart2,
  ClipboardList,
  Settings,
  LogOut, UserCog
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  onLinkClick: () => void;
}

interface MenuItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  requiresAdmin?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, isMobile, onLinkClick }) => {
  const location = useLocation();

  const menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      path: '/',
      icon: <LayoutDashboard size={18} />
    },
    {
      title: 'Productos',
      path: '/productos',
      icon: <Package size={18} />
    },
    {
      title: 'Clientes',
      path: '/clientes',
      icon: <Users size={18} />
    },
    {
      title: 'Ventas',
      path: '/ventas',
      icon: <ShoppingCart size={18} />
    },
    {
      title: 'Promociones',
      path: '/promociones',
      icon: <Tag size={18} />
    },
    {
      title: 'Reportes',
      path: '/reportes',
      icon: <BarChart2 size={18} />
    },
    {
      title: 'Gestión de Usuarios',
      path: '/usuarios',
      icon: <UserCog size={18} />,
      requiresAdmin: true
    },
  ];

  const bottomMenuItems: MenuItem[] = [
    {
      title: 'Configuración',
      path: '/configuracion',
      icon: <Settings size={18} />
    },
    {
      title: 'Cerrar Sesión',
      path: '/logout',
      icon: <LogOut size={18} />
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside
      className={`
        fixed left-0 top-0 z-60 h-full w-64 bg-neutral-800 text-white transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isMobile ? 'shadow-2xl' : 'lg:translate-x-0 lg:static lg:shadow-none lg:z-10'}
      `}
      style={{
        position: isMobile ? 'fixed' : undefined,
        zIndex: isMobile ? 60 : undefined
      }}
    >
      <div className="flex flex-col justify-between h-full">
        {/* Logo Area - Visible en móvil y desktop */}
        <div className="px-4 py-4 sm:py-6 border-b border-charcoal-light">
          <div className="flex items-center justify-center sm:justify-start">
            <div className="text-lg sm:text-xl font-bold text-orange-500 mr-1">Ferre</div>
            <div className="text-lg sm:text-xl font-bold text-white">Market</div>
          </div>
          {/* Subtítulo solo visible en móvil cuando el sidebar está abierto */}
          {isMobile && (
            <div className="text-center mt-2">
              <p className="text-xs text-blue-200">Panel de Administración</p>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <div className="flex-1 px-3 py-4 lg:py-6 overflow-y-auto">
          <nav>
            <ul className="space-y-1">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    onClick={onLinkClick}
                    className={`
                      flex items-center px-3 py-2.5 text-sm rounded-lg transition-colors group
                      ${isActive(item.path)
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'text-blue-100 hover:bg-amber-700 hover:text-white'}
                    `}
                  >
                    <span className="mr-3 flex-shrink-0">{item.icon}</span>
                    <span className="truncate">{item.title}</span>
                    {item.requiresAdmin && (
                      <span className="ml-auto">
                        <UserCog size={12} className="text-blue-300" />
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom Navigation */}
        <div className="border-t border-charcoal-light px-3 py-4">
          <ul className="space-y-1">
            {bottomMenuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  onClick={onLinkClick}
                  className={`
                      flex items-center px-3 py-2.5 text-sm rounded-lg transition-colors group
                      ${isActive(item.path)
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'text-blue-100 hover:bg-amber-700 hover:text-white'}
                    `}
                >
                  <span className="mr-3 flex-shrink-0">{item.icon}</span>
                  <span className="truncate">{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;