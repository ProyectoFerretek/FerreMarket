import { Producto, Cliente, Venta, EstadisticaVenta, Categoria, Notificacion } from '../types';

// Categorías de productos
export const categorias: Categoria[] = [
  { id: '1', nombre: 'Herramientas', icono: 'tool', cantidad: 48 },
  { id: '2', nombre: 'Pinturas', icono: 'paintbrush', cantidad: 32 },
  { id: '3', nombre: 'Electricidad', icono: 'zap', cantidad: 56 },
  { id: '4', nombre: 'Plomería', icono: 'droplets', cantidad: 37 },
  { id: '5', nombre: 'Materiales', icono: 'box', cantidad: 29 },
  { id: '6', nombre: 'Jardín', icono: 'flower', cantidad: 18 },
];

// Productos destacados
export const productos: Producto[] = [
  {
    id: '1',
    nombre: 'Taladro Inalámbrico 18V',
    descripcion: 'Taladro recargable con batería de larga duración y maletín',
    precio: 59990,
    categoria: '1',
    stock: 15,
    imagen: 'src/assets/images/Taladro.webp',
    destacado: true
  },
  // {
  //   id: '2',
  //   nombre: 'Set de Destornilladores (10 pcs)',
  //   descripcion: 'Juego de destornilladores precisión diferentes tamaños',
  //   precio: 12990,
  //   categoria: '1',
  //   stock: 23,
  //   imagen: 'https://images.pexels.com/photos/3822843/pexels-photo-3822843.jpeg',
  //   destacado: true
  // },
  // {
  //   id: '3',
  //   nombre: 'Pintura Látex Blanco 1GL',
  //   descripcion: 'Pintura lavable de alta cobertura para interiores',
  //   precio: 18990,
  //   categoria: '2',
  //   stock: 42,
  //   imagen: 'https://images.pexels.com/photos/5582597/pexels-photo-5582597.jpeg',
  //   destacado: false
  // },
  // {
  //   id: '4',
  //   nombre: 'Sierra Circular 7 1/4"',
  //   descripcion: 'Sierra eléctrica para cortes precisos en madera',
  //   precio: 49990,
  //   categoria: '1',
  //   stock: 8,
  //   imagen: 'https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg',
  //   destacado: true
  // },
  // {
  //   id: '5',
  //   nombre: 'Cable Eléctrico 12AWG (10m)',
  //   descripcion: 'Cable flexible para instalaciones domésticas',
  //   precio: 8990,
  //   categoria: '3',
  //   stock: 56,
  //   imagen: 'https://images.pexels.com/photos/2249063/pexels-photo-2249063.jpeg',
  //   destacado: false
  // },
  // {
  //   id: '6',
  //   nombre: 'Llave Ajustable 10"',
  //   descripcion: 'Llave de alta resistencia para múltiples usos',
  //   precio: 7990,
  //   categoria: '1',
  //   stock: 19,
  //   imagen: 'https://images.pexels.com/photos/210881/pexels-photo-210881.jpeg',
  //   destacado: false
  // },
  // {
  //   id: '7',
  //   nombre: 'Manguera de Jardín 15m',
  //   descripcion: 'Manguera reforzada con conectores incluidos',
  //   precio: 15990,
  //   categoria: '6',
  //   stock: 12,
  //   imagen: 'https://images.pexels.com/photos/2292953/pexels-photo-2292953.jpeg',
  //   destacado: true
  // },
  // {
  //   id: '8',
  //   nombre: 'Cemento 25kg',
  //   descripcion: 'Cemento de alta resistencia para obras',
  //   precio: 6990,
  //   categoria: '5',
  //   stock: 34,
  //   imagen: 'https://images.pexels.com/photos/544966/pexels-photo-544966.jpeg',
  //   destacado: false
  // },
];

// Clientes recientes
export const clientes: Cliente[] = [
  {
    id: '1',
    nombre: 'Juan Pérez',
    email: 'juan.perez@gmail.com',
    telefono: '+56 9 1234 5678',
    direccion: 'Av. Providencia 1234, Santiago',
    compras: 8,
    ultimaCompra: '2025-04-15'
  },
  {
    id: '2',
    nombre: 'María González',
    email: 'maria.gon@outlook.com',
    telefono: '+56 9 8765 4321',
    direccion: 'Los Leones 567, Providencia',
    compras: 12,
    ultimaCompra: '2025-04-18'
  },
  {
    id: '3',
    nombre: 'Carlos Rodríguez',
    email: 'crodriguez@empresa.cl',
    telefono: '+56 9 5555 7777',
    direccion: 'Av. Las Condes 789, Las Condes',
    compras: 5,
    ultimaCompra: '2025-04-10'
  },
  {
    id: '4',
    nombre: 'Ana Silva',
    email: 'ana.silva@gmail.com',
    telefono: '+56 9 3333 2222',
    direccion: 'Irarrázaval 890, Ñuñoa',
    compras: 3,
    ultimaCompra: '2025-04-16'
  }
];

// Ventas recientes
export const ventas: Venta[] = [
  {
    id: '1',
    fecha: '2025-04-19T14:35:00',
    cliente: '1',
    productos: [
      { id: '1', cantidad: 1, precioUnitario: 59990 },
      { id: '5', cantidad: 2, precioUnitario: 8990 }
    ],
    total: 77970,
    metodoPago: 'Tarjeta de crédito',
    estado: 'completada'
  },
  {
    id: '2',
    fecha: '2025-04-18T10:15:00',
    cliente: '2',
    productos: [
      { id: '3', cantidad: 3, precioUnitario: 18990 },
      { id: '8', cantidad: 5, precioUnitario: 6990 }
    ],
    total: 91920,
    metodoPago: 'Efectivo',
    estado: 'completada'
  },
  {
    id: '3',
    fecha: '2025-04-18T16:20:00',
    cliente: '4',
    productos: [
      { id: '7', cantidad: 1, precioUnitario: 15990 },
      { id: '2', cantidad: 1, precioUnitario: 12990 }
    ],
    total: 28980,
    metodoPago: 'Tarjeta de débito',
    estado: 'completada'
  },
  {
    id: '4',
    fecha: '2025-04-19T09:45:00',
    cliente: '3',
    productos: [
      { id: '4', cantidad: 1, precioUnitario: 49990 }
    ],
    total: 49990,
    metodoPago: 'Transferencia',
    estado: 'pendiente'
  }
];

// Estadísticas de ventas últimos 7 días
export const estadisticasVentas: EstadisticaVenta[] = [
  { fecha: '2025-04-13', ventas: 245000 },
  { fecha: '2025-04-14', ventas: 312000 },
  { fecha: '2025-04-15', ventas: 287000 },
  { fecha: '2025-04-16', ventas: 356000 },
  { fecha: '2025-04-17', ventas: 298000 },
  { fecha: '2025-04-18', ventas: 421000 },
  { fecha: '2025-04-19', ventas: 352000 }
];

// Notificaciones
export const notificaciones: Notificacion[] = [
  {
    id: '1',
    mensaje: 'Stock bajo de Taladro Inalámbrico 18V (5 unidades)',
    tipo: 'alerta',
    fecha: '2025-04-19T08:30:00',
    leida: false
  },
  {
    id: '2',
    mensaje: 'Nueva orden #4 pendiente de entrega',
    tipo: 'info',
    fecha: '2025-04-19T09:45:00',
    leida: false
  },
  {
    id: '3',
    mensaje: 'Actualización de precios completada',
    tipo: 'info',
    fecha: '2025-04-18T17:15:00',
    leida: true
  },
  {
    id: '4',
    mensaje: 'Error al procesar pago de orden #5',
    tipo: 'error',
    fecha: '2025-04-19T11:20:00',
    leida: false
  }
];