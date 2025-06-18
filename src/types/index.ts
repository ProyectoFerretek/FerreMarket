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
  id: string;
  tipo: 'individual' | 'empresarial';
  datos: ClienteIndividual | ClienteEmpresarial;
  estado: 'activo' | 'inactivo';
  fechaCreacion: string;
  ultimaModificacion: string;
  notas?: string;
  compras?: number;
  ultimaCompra?: string;
  tipoCliente: string;
}

export interface ClienteIndividual {
  nombre: string;
  apellidos?: string;
  email: string;
  telefono: string;
  direccion?: string;
  run: string;
  estado: 'activo' | 'inactivo';
  notas?: string;
  ultimaCompra?: string;
}

export interface ClienteEmpresarial {
  razonSocial: string; // NOMBRE LEGAL DE LA EMPRESA
  nombreComercial?: string; // NOMBRE COMERCIAL DE LA EMPRESA
  email: string;
  telefono: string;
  direccion?: string;
  rut?: string;
  giro?: string;
  estado: 'activo' | 'inactivo';
  notas?: string;
  ultimaCompra?: string;
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
  rol: 'admin' | 'usuario';
  estado: 'activo' | 'inactivo';
  fechaCreacion: string;
  ultimaModificacion: string;
  ultimoAcceso?: string;
  avatar?: string;
}

export interface UsuarioFormData {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
  rol: 'admin' | 'usuario';
  estado: 'activo' | 'inactivo';
}