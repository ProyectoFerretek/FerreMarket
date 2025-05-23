import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Tag, 
  BarChart2, 
  Settings, 
  LogOut
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

interface MenuItem {
  title: string;
  path: string;
  icon: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  
  const menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      path: '/',
      icon: <LayoutDashboard size={20} />
    },
    {
      title: 'Productos',
      path: '/productos',
      icon: <Package size={20} />
    },
    {
      title: 'Clientes',
      path: '/clientes',
      icon: <Users size={20} />
    },
    {
      title: 'Ventas',
      path: '/ventas',
      icon: <ShoppingCart size={20} />
    },
    {
      title: 'Promociones',
      path: '/promociones',
      icon: <Tag size={20} />
    },
    {
      title: 'Reportes',
      path: '/reportes',
      icon: <BarChart2 size={20} />
    }
  ];

  const bottomMenuItems: MenuItem[] = [
    {
      title: 'Configuración',
      path: '/configuracion',
      icon: <Settings size={20} />
    },
    {
      title: 'Cerrar Sesión',
      path: '/logout',
      icon: <LogOut size={20} />
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside 
      className={`
          fixed left-0 top-0 z-20 h-full w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out pt-16
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
      `}
    >
      <div className="flex flex-col justify-between h-full">
        <div className="px-4 py-6">
          <nav>
            <ul className="space-y-1">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center px-4 py-3 text-sm rounded-lg transition-colors
                      ${isActive(item.path) 
                        ? 'bg-blue-500 text-white' 
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
                    `}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="border-t border-gray-700 px-4 py-4">
          <ul className="space-y-1">
            {bottomMenuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center px-4 py-3 text-sm rounded-lg transition-colors
                    ${isActive(item.path) 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
                  `}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.title}</span>
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