import React, { useState, useEffect } from 'react';
import { ShoppingCart, DollarSign, Package, Users, Library } from 'lucide-react';
import { formatPrecio } from '../utils/formatters';
import { productos, ventas, estadisticasVentas, clientes, calcularValorInventario, calcularStockTotal } from '../data/mockData';

import EstadisticaCard from '../components/dashboard/EstadisticaCard';
import GraficoVentas from '../components/dashboard/GraficoVentas';
import ProductosDestacados from '../components/dashboard/ProductosDestacados';
import VentasRecientes from '../components/dashboard/VentasRecientes';
import CategoriasProductos from '../components/dashboard/CategoriasProductos';

const Dashboard: React.FC = () => {
  // Estado para valor del inventario
  const [valorInventario, setValorInventario] = useState<number>(0);
  const [stockInventario, setStockInventario] = useState<number>(0);
  
  // Calcular totales
  const totalVentas = ventas.reduce((total, venta) => total + venta.total, 0);
  // const totalProductos = calcularStockTotal(productos);
  const totalClientes = clientes.length;
  
  // Cargar el valor del inventario de manera asíncrona
  useEffect(() => {
    const cargarValorInventario = async () => {
      const valor = await calcularValorInventario();
      setValorInventario(valor);
    };

    const cargarStockTotal = async () => {
      const totalProductos = await calcularStockTotal();
      setStockInventario(totalProductos);
    }
    
    cargarValorInventario();
    cargarStockTotal();
  }, []);

  // Calcular incremento de ventas (comparando el último día con el penúltimo)
  const ultimoDia = estadisticasVentas[estadisticasVentas.length - 1].ventas;
  const penultimoDia = estadisticasVentas[estadisticasVentas.length - 2].ventas;
  const incrementoVentas = Math.round((ultimoDia - penultimoDia) / penultimoDia * 100);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
          <Library size={28} className="mr-3 text-blue-600" />
          Dashboard
        </h1>
        <p className="text-gray-700 mt-1 text-sm sm:text-base">
          Bienvenido al panel de control de FerreMarket. Aquí encontrarás un resumen de la actividad de tu negocio.
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <EstadisticaCard
          titulo="Ventas Totales"
          valor={formatPrecio(totalVentas)}
          icono={<ShoppingCart size={20} className="text-white" />}
          colorClase="bg-orange-500 text-white"
          incremento={incrementoVentas}
          comparacionTexto="vs. ayer"
        />

        <EstadisticaCard
          titulo="Valor del Inventario"
          valor={formatPrecio(valorInventario)}
          icono={<DollarSign size={20} className="text-white" />}
          colorClase="bg-orange-500 text-white"
        />

        <EstadisticaCard
          titulo="Total de Productos"
          valor={stockInventario}
          icono={<Package size={20} className="text-white" />}
          colorClase="bg-orange-500 text-white"
        />

        <EstadisticaCard
          titulo="Clientes Registrados"
          valor={totalClientes}
          icono={<Users size={20} className="text-white" />}
          colorClase="bg-orange-500 text-white"
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
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <ProductosDestacados />
        <VentasRecientes />
      </div>
    </div>
  );
};

export default Dashboard;