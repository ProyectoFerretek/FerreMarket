import React from 'react';
import { ShoppingCart, DollarSign, Package, Users } from 'lucide-react';
import { formatPrecio, calcularStockTotal, calcularValorInventario } from '../utils/formatters';
import { productos, ventas, estadisticasVentas, clientes } from '../data/mockData';

import EstadisticaCard from '../components/dashboard/EstadisticaCard';
import GraficoVentas from '../components/dashboard/GraficoVentas';
// import ProductosDestacados from '../components/dashboard/ProductosDestacados';
import VentasRecientes from '../components/dashboard/VentasRecientes';
import CategoriasProductos from '../components/dashboard/CategoriasProductos';

const Dashboard: React.FC = () => {
  // Calcular totales
  const totalVentas = ventas.reduce((total, venta) => total + venta.total, 0);
  const totalProductos = calcularStockTotal(productos);
  const valorInventario = calcularValorInventario(productos);
  const totalClientes = clientes.length;
  
  // Calcular incremento de ventas (comparando el último día con el penúltimo)
  const ultimoDia = estadisticasVentas[estadisticasVentas.length - 1].ventas;
  const penultimoDia = estadisticasVentas[estadisticasVentas.length - 2].ventas;
  const incrementoVentas = Math.round((ultimoDia - penultimoDia) / penultimoDia * 100);

  return (
    <div className="space-y-6">
      <br></br>
      <br></br>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-700 mt-1 text-base">
          Bienvenido al panel de control de FerreMarket. Aquí encontrarás un resumen de la actividad de tu negocio.
        </p>
      </div>
      
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <EstadisticaCard 
          titulo="Ventas Totales"
          valor={totalVentas}
          icono={<ShoppingCart size={24} className="text-white" />}
          colorClase="bg-blue-700 text-white"
          incremento={incrementoVentas}
          comparacionTexto="vs. ayer"
        />
        
        <EstadisticaCard 
          titulo="Valor del Inventario"
          valor={valorInventario}
          icono={<DollarSign size={24} className="text-white" />}
          colorClase="bg-blue-800 text-white"
        />
        
        <EstadisticaCard 
          titulo="Total de Productos"
          valor={totalProductos}
          icono={<Package size={24} className="text-white" />}
          colorClase="bg-blue-600 text-white"
        />
        
        <EstadisticaCard 
          titulo="Clientes Registrados"
          valor={totalClientes}
          icono={<Users size={24} className="text-white" />}
          colorClase="bg-blue-900 text-white"
        />
      </div>
      
      {/* Gráfico de ventas y categorías */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GraficoVentas />
        </div>
        <div className="lg:col-span-1">
          <CategoriasProductos />
        </div>
      </div>
      
      {/* Productos destacados y ventas recientes */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* <ProductosDestacados /> */}
        <VentasRecientes />
      </div>
    </div>
  );
};

export default Dashboard;