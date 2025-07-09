export interface Producto {
  id: string;
  sku: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  stock: number;
  imagen: string;
  destacado: boolean;
}

export interface UpdateProducto {
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  stock: number;
  destacado: boolean;
}

export interface Cliente {
  id?: string;
  estado: 'activo' | 'inactivo';
  fechaCreacion?: string;
  ultimaModificacion?: string;
  notas?: string;
  compras?: number;
  totalCompras?: number;
  ultimaCompra?: string;
  tipoCliente: string;

  nombre?: string;
  apellidos?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  run?: string; // RUN para clientes individuales
  rut?: string; // RUT para clientes empresariales
  giro?: string; // Giro para clientes empresariales
  nombreComercial?: string; // Nombre comercial para clientes empresariales
  razonSocial?: string;
}

export interface Venta {
  id: string;
  fecha: string;
  cliente: string;
  productos: {
    id: string;
    cantidad: number;
    precioUnitario: number;
  }[];
  total: number;
  metodoPago: string;
  estado: string;
}

export interface VentaFormulario {
  fecha: string;
  cliente: string;
  productos: {
    id: string;
    cantidad: number;
    precioUnitario: number;
  }[];
  total: number;
  metodoPago: string;
  estado: 'completada' | 'pendiente' | 'cancelada';
}

export interface EstadisticaVenta {
  fecha: string;
  ventas: number;
}

export interface Categoria {
  id: string;
  nombre: string;
  icono: string;
  cantidad: number;
}

export interface Notificacion {
  id: string;
  mensaje: string;
  tipo: 'info' | 'alerta' | 'error';
  fecha: string;
  leida: boolean;
}

export interface Usuario {
  id: string;
  uid: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'usuario' | 'cliente';
  estado: 'activo' | 'inactivo';
  fechaCreacion: string;
  ultimaModificacion: string;
  ultimoAcceso?: string;
  avatar?: string;
}

export interface UsuarioFormData {
  id?: string; // Opcional para crear nuevos usuarios
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
  rol: 'admin' | 'usuario' | 'cliente';
  estado: 'activo' | 'inactivo';
}

export interface Promocion {
  id: string;
  codigo: string;
  nombre: string;
  tipo: string;
  valor: number;
  valorMaximo?: number;
  montoMinimo: number;
  fechaInicio: string; // ISO 8601
  fechaFin: string; // ISO 8601
  limiteTotalUsos?: number;
  limiteUsosPorCliente?: number;
  usosActuales: number;
  estado: string;
  aplicaA: string;
  productosIncluidos: string[];
  productosExcluidos: string[];
  categoriasIncluidas: string[];
  categoriasExcluidas: string[];
  tipoCliente: string;
  combinable: boolean;
  descripcion?: string;
  fechaCreacion: string; // ISO 8601
  creadoPor: string;
  ingresoGenerado: number;
  valorPromedioCompra: number;
  tasaConversion: number;
  horariosUso: string[];
  productosVendidos: string[];
}