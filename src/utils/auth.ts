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

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { authFirebase } from '../lib/firebase/Firebase';

export const registrarCuenta = async (email: string, password: string) => {
  console.log('Intentando registrar usuario con email:', email, ' y password:', password);
  return await createUserWithEmailAndPassword(authFirebase, email, password);
};

export const iniciarSesion = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(authFirebase, email, password).then((userCredential) => {
    console.log('Usuario autenticado:', userCredential.user);
    return userCredential.user;
  })
};

export const cerrarSesion = async () => {
  return await signOut(authFirebase);
};