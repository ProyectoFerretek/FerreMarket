import React from 'react';
import { categorias } from '../../data/mockData';
import { PenTool as Tool, Paintbrush, Zap, Droplets, Box, Flower } from 'lucide-react';

const CategoriasProductos: React.FC = () => {
  // Mapeo de iconos por ID de categoría
  const getIcono = (iconoNombre: string) => {
    switch (iconoNombre) {
      case 'tool':
        return <Tool size={24} />;
      case 'paintbrush':
        return <Paintbrush size={24} />;
      case 'zap':
        return <Zap size={24} />;
      case 'droplets':
        return <Droplets size={24} />;
      case 'box':
        return <Box size={24} />;
      case 'flower':
        return <Flower size={24} />;
      default:
        return <Box size={24} />;
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

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Categorías de Productos</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {categorias.map((categoria, index) => (
          <div 
            key={categoria.id}
            className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-100 hover:border-gray-300 transition-colors cursor-pointer"
          >
            <div className={`w-12 h-12 rounded-full ${colores[index % colores.length]} flex items-center justify-center mb-3`}>
              {getIcono(categoria.icono)}
            </div>
            <h4 className="text-sm font-medium text-gray-800 text-center">{categoria.nombre}</h4>
            <p className="text-xs text-gray-500 mt-1">{categoria.cantidad} productos</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriasProductos;