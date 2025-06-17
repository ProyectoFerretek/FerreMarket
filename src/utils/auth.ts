// import { usuarioActual } from '../data/mockData';

const usuarioActual = {
  rol : 'admin', // Simulación de rol del usuario actual
  estado: 'activo' // Simulación de estado del usuario actual
}

/**
 * Verifica si el usuario actual tiene permisos de administrador
 */
export const esAdministrador = (): boolean => {
  return usuarioActual.rol === 'admin';
};

/**
 * Verifica si el usuario actual puede acceder a la gestión de usuarios
 */
export const puedeGestionarUsuarios = (): boolean => {
  return esAdministrador() && usuarioActual.estado === 'activo';
};

/**
 * Obtiene el usuario actual
 */
export const obtenerUsuarioActual = () => {
  return usuarioActual;
};

/**
 * Verifica si el usuario puede realizar una acción específica
 */
export const puedeRealizarAccion = (accion: 'crear' | 'editar' | 'eliminar' | 'ver' | 'recuperar'): boolean => {
  if (!esAdministrador()) return false;
  
  switch (accion) {
    case 'ver':
      return true;
    case 'crear':
    case 'editar':
    case 'recuperar':
      return true
    case 'eliminar':
      return usuarioActual.estado === 'activo';
    default:
      return false;
  }
};