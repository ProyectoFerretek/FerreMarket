import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Cierra el sidebar al cambiar a una pantalla más grande
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />
      
      {/* Overlay para cerrar el sidebar en móvil */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Contenido principal */}
      <div className="flex flex-col flex-1 md:ml-64">
        <Header 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          sidebarOpen={sidebarOpen}
        />
        
        <main className="flex-1 p-4 sm:p-6 pt-20 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;