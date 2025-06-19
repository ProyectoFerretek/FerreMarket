/**
 * Formatea un número como precio en Pesos Chilenos (CLP)
 */
export const formatPrecio = (valor: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(valor);
};

/**
 * Formatea una fecha ISO a formato localizado español chileno
 */
export const formatFecha = (fechaIso: string, incluirHora: boolean = false): string => {
  if (!fechaIso) return 'Sin fecha registrada';
  
  try {
    const fecha = new Date(fechaIso);
    
    // Check if the date is invalid
    if (isNaN(fecha.getTime())) {
      return 'Sin fecha registrada';
    }
    
    const opciones: Intl.DateTimeFormatOptions = incluirHora 
      ? { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        } 
      : { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric' 
        };
    
    return fecha.toLocaleDateString('es-CL', opciones);
  } catch (error) {
    return 'Sin fecha registrada';
  }
};

/**
 * Devuelve el nombre del cliente basado en su ID
 */
export const getNombreCliente = (clienteId: string, clientes: any[]): string => {
  const cliente = clientes.find(c => Number(c.id) === Number(clienteId));
  return cliente ? cliente.nombre : 'Cliente no encontrado';
};

/**
 * Calcula el stock total de productos
 */
// export const calcularStockTotal = (productos: any[]): number => {
//   return productos.reduce((total, producto) => total + producto.stock, 0);
// };

/**
 * Calcula el valor total del inventario
 */
export const calcularValorInventario = (productos: any[]): number => {
  return productos.reduce((total, producto) => total + (producto.precio * producto.stock), 0);
};

/**
 * Formatea el estado de una venta con su color correspondiente
 */
export const getEstadoVenta = (estado: string): { label: string, color: string } => {
  switch (estado) {
    case 'completada':
      return { label: 'Completada', color: 'bg-green-100 text-green-800' };
    case 'pendiente':
      return { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' };
    case 'cancelada':
      return { label: 'Cancelada', color: 'bg-red-100 text-red-800' };
    default:
      return { label: estado, color: 'bg-gray-100 text-gray-800' };
  }
};