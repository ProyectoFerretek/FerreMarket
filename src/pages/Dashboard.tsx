import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingCart, DollarSign, Package, Users, Library } from 'lucide-react';
import { formatPrecio } from '../utils/formatters';
import { 
  calcularValorInventario, 
  calcularStockTotal, 
  obtenerClientesRegistrados,
  obtenerVentas 
} from '../data/mockData';

import EstadisticaCard from '../components/dashboard/EstadisticaCard';
import GraficoVentas from '../components/dashboard/GraficoVentas';
import ProductosDestacados from '../components/dashboard/ProductosDestacados';
import VentasRecientes from '../components/dashboard/VentasRecientes';
import CategoriasProductos from '../components/dashboard/CategoriasProductos';
import { DateTime } from 'luxon';

const Dashboard: React.FC = () => {
  // Estado para estadísticas
  const [valorInventario, setValorInventario] = useState<number>(0);
  const [stockInventario, setStockInventario] = useState<number>(0);
  const [totalClientes, setTotalClientes] = useState<number>(0);
  const [totalVentas, setTotalVentas] = useState<number>(0);
  const [incrementoVentas, setIncrementoVentas] = useState<number>(0);
  const [ventasPorDia, setVentasPorDia] = useState<{ fecha: string; ventas: number }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Función para cargar datos
  const cargarDatos = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Cargar todos los datos necesarios en paralelo
      const [valor, totalProductos, clientesRegistrados, ventas] = await Promise.all([
        calcularValorInventario(),
        calcularStockTotal(),
        obtenerClientesRegistrados(),
        obtenerVentas()
      ]);
      
      setValorInventario(valor);
      setStockInventario(totalProductos);
      setTotalClientes(clientesRegistrados);
      
      // Calcular el total de ventas
      const totalDeVentas = ventas.reduce((total, venta) => total + venta.total, 0);
      setTotalVentas(totalDeVentas);
      
      // Calcular las ventas por día para el gráfico
      const ventasPorDiaMap = new Map<string, number>();
      
      // Obtener los últimos 30 días
      const hoy = new Date();
      const fechas = Array.from({ length: 30 }, (_, i) => {
        const fecha = new Date();
        fecha.setDate(hoy.getDate() - (29 - i));
        return fecha.toISOString().split('T')[0];
      });
      
      // Inicializar todas las fechas con 0 ventas
      fechas.forEach(fecha => ventasPorDiaMap.set(fecha, 0));
      
      // Sumar las ventas por día
      ventas.forEach(venta => {
        const fechaVenta = venta.fecha.split('T')[0];
        if (ventasPorDiaMap.has(fechaVenta)) {
          ventasPorDiaMap.set(fechaVenta, ventasPorDiaMap.get(fechaVenta)! + venta.total);
        }
      });
      
      // Convertir el mapa a un array para el gráfico
      const ventasPorDiaArray = Array.from(ventasPorDiaMap.entries())
        .map(([fecha, ventas]) => ({ fecha, ventas }))
        .sort((a, b) => a.fecha.localeCompare(b.fecha));
      
      setVentasPorDia(ventasPorDiaArray);
      
      // Calcular incremento de ventas (comparando el último día con el penúltimo)
      if (ventasPorDiaArray.length >= 2) {
        const ultimoDia = ventasPorDiaArray[ventasPorDiaArray.length - 1].ventas;
        const penultimoDia = ventasPorDiaArray[ventasPorDiaArray.length - 2].ventas;
        
        // Evitar división por cero
        if (penultimoDia !== 0) {
          const incremento = Math.round((ultimoDia - penultimoDia) / penultimoDia * 100);
          setIncrementoVentas(incremento);
        } else if (ultimoDia > 0) {
          // Si no hubo ventas el día anterior, pero sí hoy
          setIncrementoVentas(100);
        } else {
          setIncrementoVentas(0);
        }
      }
    } catch (error) {
      console.error("Error cargando datos del dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  return (
    <div className="space-y-4 sm:space-y-6 mt-0">
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
          valor={isLoading ? "Cargando..." : formatPrecio(totalVentas)}
          icono={<ShoppingCart size={20} className="text-white" />}
          colorClase="bg-orange-500 text-white"
          incremento={incrementoVentas}
          comparacionTexto="vs. ayer"
        />

        <EstadisticaCard
          titulo="Valor del Inventario"
          valor={isLoading ? "Cargando..." : formatPrecio(valorInventario)}
          icono={<DollarSign size={20} className="text-white" />}
          colorClase="bg-orange-500 text-white"
        />

        <EstadisticaCard
          titulo="Total de Productos"
          valor={isLoading ? "Cargando..." : stockInventario}
          icono={<Package size={20} className="text-white" />}
          colorClase="bg-orange-500 text-white"
        />

        <EstadisticaCard
          titulo="Clientes Registrados"
          valor={isLoading ? "Cargando..." : totalClientes}
          icono={<Users size={20} className="text-white" />}
          colorClase="bg-orange-500 text-white"
        />
      </div>

      {/* Gráfico de ventas y categorías */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GraficoVentas datos={ventasPorDia} isLoading={isLoading} />
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