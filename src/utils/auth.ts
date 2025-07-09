import supabase from "../lib/supabase/Supabase";

const usuarioActual = {
	id: "",
	rol: "",
	estado: "",
	nombre: "",
}


export const obtenerUsuarioIdByUUID = async (uuid: string): Promise<number | null> => {
	const { data, error } = await supabase
		.from('usuarios')
		.select('id')
		.eq('uid', uuid)
		.single();

	console.log('UUID del usuario:', uuid);

	if (error) {
		console.error('Error al obtener el ID del usuario por UUID:', error);
		return null;
	}

	return data ? data.id : null;
}

export const cargarPermisosTrabajador = async () => {
	const session = await supabase.auth.getSession();
	if (session.data.session) {
		const { user } = session.data.session;
		const { data, error } = await supabase
			.from('usuarios')
			.select('*')
			.eq('uid', user.id)
			.single();

		if (error) {
			console.error('Error al cargar los permisos del usuario:', error);
			return;
		}
		if (data) {
			usuarioActual.rol = capitalizeWords(data.rol) || 'Usuario';
			usuarioActual.estado = capitalizeWords(data.estado) || 'Activo';
			usuarioActual.nombre = capitalizeWords(data.nombre) || 'Usuario';
		}
	} else {
		console.warn('No hay sesión activa para cargar permisos del usuario.');
	}
}

/**
 * Verifica si el usuario actual tiene permisos de administrador
 */
export const esAdministrador = (): boolean => {
  return usuarioActual.rol === 'Admin';
};

/**
 * Verifica si el usuario actual puede acceder a la gestión de usuarios
 */
export const puedeGestionarUsuarios = (): boolean => {
  return esAdministrador() && usuarioActual.estado === 'Activo';
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
		if (usuarioActual.estado === 'Activo' && usuarioActual.rol === 'Admin') {
			return true;
		}
    default:
      return false;
  }
};

const capitalizeWords = (str: string): string => {
  return str.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};