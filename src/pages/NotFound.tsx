import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-500">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mt-4">Página no encontrada</h2>
        <p className="text-gray-600 mt-2 max-w-md mx-auto">
          La página que estás buscando no existe.
        </p>
        
        <Link 
          to="/" 
          className="inline-flex items-center justify-center px-5 py-3 mt-8 font-medium text-white bg-blue-900 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors"
        >
          <Home size={20} className="mr-2" />
          Volver al Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;