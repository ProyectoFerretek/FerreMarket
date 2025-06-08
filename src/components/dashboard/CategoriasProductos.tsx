import React from 'react';
import { useNavigate } from 'react-router-dom';
import { categorias } from '../../data/mockData';
import { PenTool as Tool, Paintbrush, Zap, Droplets, Box, Flower } from 'lucide-react';

const CategoriasProductos: React.FC = () => {
  const navigate = useNavigate();

  // Mapeo de iconos por ID de categoría
  const getIcono = (iconoNombre: string) => {
    switch (iconoNombre) {
      case 'tool':
        return <Tool size={20} />;
      case 'paintbrush':
        return <Paintbrush size={20} />;
      case 'zap':
        return <Zap size={20} />;
      case 'droplets':
        return <Droplets size={20} />;
      case 'box':
        return <Box size={20} />;
      case 'flower':
        return <Flower size={20} />;
      default:
        return <Box size={20} />;
    }
  };

  // Definir colores para cada categoría
  const colores = [
    'bg-blue-100 text-blue-700',
    'bg-purple-100 text-purple-700',
    'bg-yellow-100 text-yellow-700',
    'bg-green-100 text-green-700',
    'bg-red-100 text-red-700',
    'bg-orange-100 text-orange-700'
  ];

  // Función para navegar a productos con filtro de categoría
  const handleCategoriaClick = (categoriaId: string) => {
    // Navegar a productos con el filtro de categoría en la URL
    navigate(`/productos?categoria=${categoriaId}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Categorías de Productos</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {categorias.map((categoria, index) => (
          <button
            key={categoria.id}
            onClick={() => handleCategoriaClick(categoria.id)}
            className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg border border-gray-100 hover:border-gray-300 transition-all duration-200 cursor-pointer hover:shadow-sm group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {/* Contenedor del icono con dimensiones fijas */}
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${colores[index % colores.length]} flex items-center justify-center mb-3 transition-transform duration-200 group-hover:scale-105`}>
              {getIcono(categoria.icono)}
            </div>
            
            {/* Contenedor de texto con alineación centrada */}
            <div className="flex flex-col items-center justify-center text-center space-y-1 min-h-[2.5rem] sm:min-h-[3rem]">
              <h4 className="text-xs sm:text-sm font-medium text-gray-800 leading-tight px-1 line-clamp-2">
                {categoria.nombre}
              </h4>
              <p className="text-xs text-gray-500 font-normal whitespace-nowrap">
                {categoria.cantidad} productos
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoriasProductos;