import {
    Producto,
    Cliente,
    Venta,
    EstadisticaVenta,
    Categoria,
    Notificacion,
    Usuario,
    UsuarioFirebase,
    UpdateProducto,
    ClienteEmpresarial,
    ClienteIndividual,
} from "../types";

// import { dbFirestore } from "../lib/firebase/Firebase";
// import {
//     collection,
//     addDoc,
//     getDocs,
//     getDoc,
//     doc,
//     setDoc,
//     updateDoc,
//     deleteDoc,
//     onSnapshot,
//     query,
//     where,
//     orderBy,
// 	getCountFromServer,
// } from "firebase/firestore";

import supabase from "../lib/supabase/Supabase";

// Categorías de productos
export const categorias: Categoria[] = [
    { id: "1", nombre: "Herramientas", icono: "tool", cantidad: 48 },
    { id: "2", nombre: "Pinturas", icono: "paintbrush", cantidad: 32 },
    { id: "3", nombre: "Electricidad", icono: "zap", cantidad: 56 },
    { id: "4", nombre: "Plomería", icono: "droplets", cantidad: 37 },
    { id: "5", nombre: "Materiales", icono: "box", cantidad: 29 },
    { id: "6", nombre: "Jardín", icono: "flower", cantidad: 18 },
];

// Productos destacados
export const productos: Producto[] = [
    {
        id: "1",
        nombre: "Taladro Inalámbrico 18V",
        descripcion:
            "Taladro recargable con batería de larga duración y maletín",
        precio: 59990,
        categoria: "1",
        stock: 0,
        imagen: "src/assets/images/Taladro.webp",
        destacado: true,
    },
    {
        id: "2",
        nombre: "Set de Destornilladores (10 pcs)",
        descripcion: "Juego de destornilladores precisión diferentes tamaños",
        precio: 12990,
        categoria: "1",
        stock: 23,
        imagen: "src/assets/images/Taladro.webp",
        destacado: true,
    },
    {
        id: "3",
        nombre: "Pintura Látex Blanco 1GL",
        descripcion: "Pintura lavable de alta cobertura para interiores",
        precio: 18990,
        categoria: "2",
        stock: 42,
        imagen: "src/assets/images/Taladro.webp",
        destacado: false,
    },
    {
        id: "4",
        nombre: 'Sierra Circular 7 1/4"',
        descripcion: "Sierra eléctrica para cortes precisos en madera",
        precio: 49990,
        categoria: "1",
        stock: 8,
        imagen: "src/assets/images/Taladro.webp",
        destacado: true,
    },
    {
        id: "5",
        nombre: "Cable Eléctrico 12AWG (10m)",
        descripcion: "Cable flexible para instalaciones domésticas",
        precio: 8990,
        categoria: "3",
        stock: 2,
        imagen: "src/assets/images/Taladro.webp",
        destacado: false,
    },
    {
        id: "6",
        nombre: 'Llave Ajustable 10"',
        descripcion: "Llave de alta resistencia para múltiples usos",
        precio: 7990,
        categoria: "1",
        stock: 19,
        imagen: "src/assets/images/Taladro.webp",
        destacado: false,
    },
    {
        id: "7",
        nombre: "Manguera de Jardín 15m",
        descripcion: "Manguera reforzada con conectores incluidos",
        precio: 15990,
        categoria: "6",
        stock: 12,
        imagen: "src/assets/images/Taladro.webp",
        destacado: true,
    },
    {
        id: "8",
        nombre: "Cemento 25kg",
        descripcion: "Cemento de alta resistencia para obras",
        precio: 6990,
        categoria: "5",
        stock: 34,
        imagen: "src/assets/images/Taladro.webp",
        destacado: false,
    },
];

// Clientes recientes
export const clientes: Cliente[] = [
    {
        id: "1",
        nombre: "Juan Pérez",
        email: "juan.perez@gmail.com",
        telefono: "+56 9 1234 5678",
        direccion: "Av. Providencia 1234, Santiago",
        compras: 8,
        ultimaCompra: "2025-04-15",
    },
    {
        id: "2",
        nombre: "María González",
        email: "maria.gon@outlook.com",
        telefono: "+56 9 8765 4321",
        direccion: "Los Leones 567, Providencia",
        compras: 12,
        ultimaCompra: "2025-04-18",
    },
    {
        id: "3",
        nombre: "Carlos Rodríguez",
        email: "crodriguez@empresa.cl",
        telefono: "+56 9 5555 7777",
        direccion: "Av. Las Condes 789, Las Condes",
        compras: 5,
        ultimaCompra: "2025-04-10",
    },
    {
        id: "4",
        nombre: "Ana Silva",
        email: "ana.silva@gmail.com",
        telefono: "+56 9 3333 2222",
        direccion: "Irarrázaval 890, Ñuñoa",
        compras: 3,
        ultimaCompra: "2025-04-16",
    },
];

// Ventas recientes
export const ventas: Venta[] = [
    {
        id: "1",
        fecha: "2025-04-19T14:35:00",
        cliente: "1",
        productos: [
            { id: "1", cantidad: 1, precioUnitario: 59990 },
            { id: "5", cantidad: 2, precioUnitario: 8990 },
        ],
        total: 77970,
        metodoPago: "Tarjeta de crédito",
        estado: "completada",
    },
    {
        id: "2",
        fecha: "2025-04-18T10:15:00",
        cliente: "2",
        productos: [
            { id: "3", cantidad: 3, precioUnitario: 18990 },
            { id: "8", cantidad: 5, precioUnitario: 6990 },
        ],
        total: 91920,
        metodoPago: "Efectivo",
        estado: "completada",
    },
    {
        id: "3",
        fecha: "2025-04-18T16:20:00",
        cliente: "4",
        productos: [
            { id: "7", cantidad: 1, precioUnitario: 15990 },
            { id: "2", cantidad: 1, precioUnitario: 12990 },
        ],
        total: 28980,
        metodoPago: "Tarjeta de débito",
        estado: "completada",
    },
    {
        id: "4",
        fecha: "2025-04-19T09:45:00",
        cliente: "3",
        productos: [{ id: "4", cantidad: 1, precioUnitario: 49990 }],
        total: 49990,
        metodoPago: "Transferencia",
        estado: "pendiente",
    },
];

// Estadísticas de ventas últimos 7 días
export const estadisticasVentas: EstadisticaVenta[] = [
    { fecha: "2025-04-13", ventas: 245000 },
    { fecha: "2025-04-14", ventas: 312000 },
    { fecha: "2025-04-15", ventas: 287000 },
    { fecha: "2025-04-16", ventas: 356000 },
    { fecha: "2025-04-17", ventas: 298000 },
    { fecha: "2025-04-18", ventas: 421000 },
    { fecha: "2025-04-19", ventas: 352000 },
];

// Notificaciones
export const notificaciones: Notificacion[] = [
    {
        id: "1",
        mensaje: "Stock bajo de Taladro Inalámbrico 18V (5 unidades)",
        tipo: "alerta",
        fecha: "2025-04-19T08:30:00",
        leida: false,
    },
    {
        id: "2",
        mensaje: "Nueva orden #4 pendiente de entrega",
        tipo: "info",
        fecha: "2025-04-19T09:45:00",
        leida: false,
    },
    {
        id: "3",
        mensaje: "Actualización de precios completada",
        tipo: "info",
        fecha: "2025-04-18T17:15:00",
        leida: true,
    },
    {
        id: "4",
        mensaje: "Error al procesar pago de orden #5",
        tipo: "error",
        fecha: "2025-04-19T11:20:00",
        leida: false,
    },
];

// Usuarios del sistema
// export const usuarios: Usuario[] = [
//   {
//     id: '1',
//     nombre: 'Administrador Principal',
//     email: 'admin@ferremarket.com',
//     rol: 'admin',
//     estado: 'activo',
//     fechaCreacion: '2024-01-15T10:00:00',
//     ultimaModificacion: '2025-04-19T14:30:00',
//     ultimoAcceso: '2025-04-19T15:45:00',
//     avatar: 'src/assets/images/Taladro.webp'
//   },
//   {
//     id: '2',
//     nombre: 'Carlos Mendoza',
//     email: 'carlos.mendoza@ferremarket.com',
//     rol: 'admin',
//     estado: 'activo',
//     fechaCreacion: '2024-02-20T09:15:00',x
//     ultimaModificacion: '2025-04-18T16:20:00',
//     ultimoAcceso: '2025-04-19T08:30:00',
//     avatar: 'src/assets/images/Taladro.webp'
//   },
//   {
//     id: '3',
//     nombre: 'Ana Rodríguez',
//     email: 'ana.rodriguez@ferremarket.com',
//     rol: 'usuario',
//     estado: 'activo',
//     fechaCreacion: '2024-03-10T11:30:00',
//     ultimaModificacion: '2025-04-17T10:45:00',
//     ultimoAcceso: '2025-04-19T12:15:00',
//     avatar: 'src/assets/images/Taladro.webp'
//   },
//   {
//     id: '4',
//     nombre: 'Luis García',
//     email: 'luis.garcia@ferremarket.com',
//     rol: 'usuario',
//     estado: 'activo',
//     fechaCreacion: '2024-04-05T14:20:00',
//     ultimaModificacion: '2025-04-16T09:30:00',
//     ultimoAcceso: '2025-04-18T17:20:00',
//     avatar: 'src/assets/images/Taladro.webp'
//   },
//   {
//     id: '5',
//     nombre: 'María Fernández',
//     email: 'maria.fernandez@ferremarket.com',
//     rol: 'usuario',
//     estado: 'inactivo',
//     fechaCreacion: '2024-01-30T16:45:00',
//     ultimaModificacion: '2025-04-10T11:15:00',
//     ultimoAcceso: '2025-04-10T11:15:00',
//     avatar: 'src/assets/images/Taladro.webp'
//   },
//   {
//     id: '6',
//     nombre: 'Roberto Silva',
//     email: 'roberto.silva@ferremarket.com',
//     rol: 'usuario',
//     estado: 'activo',
//     fechaCreacion: '2024-05-12T13:10:00',
//     ultimaModificacion: '2025-04-19T08:45:00',
//     ultimoAcceso: '2025-04-19T14:20:00',
//     avatar: 'src/assets/images/Taladro.webp'
//   }
// ];

// export const usuarios: Usuario[] = [];

//   {
//     id: '6',
//     nombre: 'Llave Ajustable 10"',
//     descripcion: 'Llave de alta resistencia para múltiples usos',
//     precio: 7990,
//     categoria: '1',
//     stock: 19,
//     imagen: 'src/assets/images/Taladro.webp',
//     destacado: false
//   },

// DASHBOARD

export const calcularValorInventario = async () => {
    var totalValor = 0;
    const { data: productos, error } = await supabase
    .from("productos")
    .select("precio, stock");

    if (error) {
        console.error("Error al obtener productos:", error);
        throw new Error(`Error al obtener productos: ${error.message}`);
    }

    for (const producto of productos) {
        const valorProducto = producto.precio * (producto.stock || 0);
        totalValor += valorProducto;
    }

    console.log("Valor total del inventario:", totalValor);

    return totalValor;
};

export const calcularStockTotal = async () => {
    var totalProductos = 0;
    const { data: productos, error } = await supabase
    .from("productos")
    .select("stock");
    
    if (error) {
        console.error("Error al obtener productos:", error);
        throw new Error(`Error al obtener productos: ${error.message}`);
    }

    for (const producto of productos) {
        totalProductos += producto.stock || 0;
    }

    console.log("Total de productos en stock:", totalProductos);

    return totalProductos;
};

export const calcularProductosPorCategoria = async (categoriaId: string): Promise<number> => {
	if (!categoriaId || typeof categoriaId !== 'string' || categoriaId.trim() === '') {
		throw new Error('categoriaId must be a non-empty string');
	}

    const { data: productos, error } = await supabase
    .from("productos")
    .select("id")
    .eq("categoria", categoriaId);

    if (error) {
        console.error(`Error fetching products for category ${categoriaId}:`, error);
        throw new Error(`Error fetching products for category: ${error.message}`);
    }

    const cantidadProductos = productos ? productos.length : 0;
    console.log(`Cantidad de productos en la categoría ${categoriaId}:`, cantidadProductos);
    
    return cantidadProductos;
};

// PRODUCTOS

export const agregarProducto = async (producto: Producto) => {
    try {
        const productImage = base64ToFile(producto.imagen, `${producto.sku}.webp`, 'image/webp');

        await fetch(import.meta.env.VITE_CLOUDFLARE_WORKERS_URL + producto.sku + ".webp", {
            method: "PUT",
            headers: {
                "Content-Type": "image/webp",
                "x-api-key": import.meta.env.VITE_CLOUDFLARE_WORKERS_API_KEY,
            },

            body: productImage,
        })

        const productData = {
            sku: producto.sku,
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio: producto.precio,
            categoria: producto.categoria,
            stock: producto.stock,
            imagen: import.meta.env.VITE_CLOUDFLARE_CDN_URL + producto.sku + ".webp",
            destacado: producto.destacado || false,
        };

        const { error } = await supabase
        .from("productos")
        .insert([productData]);
        
        if (error) {
            console.error("Error al agregar producto:", error);
            throw new Error(`Error al agregar producto: ${error.message}`);
        }
        
        console.log("¡Producto agregado correctamente!");
    } catch (err) {
        console.error("Error en la operación:", err);
        throw err;
    }
};

export const actualizarProducto = async (id: string, producto: UpdateProducto) => {
    const updateData = {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        categoria: producto.categoria,
        stock: producto.stock,
        destacado: producto.destacado || false,
    }

    const { error } = await supabase
    .from("productos")
    .update([updateData])
    .eq("id", Number(id));

    if (error) {
        console.error("Error al actualizar producto:", error);
        throw new Error(`Error al actualizar producto: ${error.message}`);
    }

    console.log("¡Producto actualizado correctamente!");
};

export const eliminarProducto = async (id: string) => {
    const { error } = await supabase
    .from("productos")
    .delete()
    .eq("id", Number(id));

    if (error) {
        console.error("Error al eliminar producto:", error);
        throw new Error(`Error al eliminar producto: ${error.message}`);
    }

    console.log("¡Producto eliminado correctamente!");
};

export const obtenerProductos = async (): Promise<Producto[]> => {
    const productosList: Producto[] = [];

    try {
        const { data: productos } = await supabase
            .from("productos")
            .select("*")

        if (productos) {
            for (const producto of productos) {
                productosList.push({
                    id: producto.id,
                    sku: producto.sku,
                    nombre: producto.nombre,
                    descripcion: producto.descripcion,
                    precio: producto.precio,
                    categoria: producto.categoria,
                    stock: producto.stock,
                    imagen: producto.imagen || "src/assets/images/Taladro.webp",
                    destacado: producto.destacado || false,
                } as Producto);
            }
        }

        return productosList;
    } catch (error) {
        console.error("Error al obtener productos:", error);
        throw new Error(`Error al obtener productos: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};

// CLIENTES

export const agregarCliente = async (tipoCliente: string, dataCliente: ClienteIndividual | ClienteEmpresarial) => {
    const tableName = tipoCliente === "empresa" ? "clientes_empresariales" : "clientes_individuales";
    let userData: any = {};

    if (tipoCliente === "individual") {
        userData = {
            nombre: dataCliente.nombre,
            apellidos: (dataCliente as ClienteIndividual).apellidos || "",
            email: dataCliente.email,
            telefono: dataCliente.telefono,
            direccion: (dataCliente as ClienteIndividual).direccion || "",
            run: (dataCliente as ClienteIndividual).run,
            estado: "activo",
            notas: (dataCliente as ClienteIndividual).notas || "",
        };
    } else if (tipoCliente === "empresa") {
        userData = {
            razonsocial: (dataCliente as ClienteEmpresarial).razonSocial,
            nombrecomercial: (dataCliente as ClienteEmpresarial).nombreComercial || "",
            email: dataCliente.email,
            telefono: dataCliente.telefono,
            direccion: (dataCliente as ClienteEmpresarial).direccion || "",
            rut: (dataCliente as ClienteEmpresarial).rut || "",
            giro: (dataCliente as ClienteEmpresarial).giro || "",
            estado: "activo",
            notas: (dataCliente as ClienteEmpresarial).notas || "",
        };
    }

    try {
        const { data: cliente, error } = await supabase
        .from(tableName)
        .insert([userData])

        if (error) {
            console.error("Error al agregar cliente:", error);
            throw new Error(`Error al agregar cliente: ${error.message}`);
        }

        console.log("¡Cliente agregado correctamente!");
        return cliente;
    } catch (err) {
        console.error("Error en la operación:", err);
        throw err;
    }
}


export const obtenerClientes = async (): Promise<Cliente[]> => {
    const clientesList: Cliente[] = [];

    try {
        // Obtener clientes individuales
        const { data: clientesIndividuales } = await supabase
        .from("clientes_individuales")
        .select("*")

        // Obtener clientes empresariales
        const { data: clientesEmpresariales } = await supabase
        .from("clientes_empresariales")
        .select("*")

        // Procesar clientes individuales
        if (clientesIndividuales) {
            for (const cliente of clientesIndividuales) {
                clientesList.push({
                    id: cliente.id,
                    nombre: cliente.nombre + (cliente.apellidos ? ` ${cliente.apellidos}` : ""),
                    email: cliente.email,
                    telefono: cliente.telefono,
                    direccion: cliente.direccion || "",
                    estado: cliente.estado || "activo",
                    notas: cliente.notas || "",
                    compras: 0, // No se maneja en clientes individuales
                    ultimaCompra: cliente.ultimaCompra, // No se maneja en clientes individuales
                    tipoCliente: "individual",
                    fechaCreacion: cliente.fechaCreacion || new Date().toISOString(),
                    ultimaModificacion: cliente.ultimaModificacion || new Date().toISOString(),
                });
            }
        }

        // Procesar clientes empresariales
        if (clientesEmpresariales) {
            for (const cliente of clientesEmpresariales) {
                clientesList.push({
                    id: cliente.id,
                    nombre: cliente.razonsocial,
                    email: cliente.email,
                    telefono: cliente.telefono,
                    direccion: cliente.direccion || "",
                    rut: cliente.rut || "",
                    giro: cliente.giro || "",
                    estado: cliente.estado || "activo",
                    notas: cliente.notas || "",
                    compras: 0, // No se maneja en clientes empresariales
                    ultimaCompra: "", // No se maneja en clientes empresariales
                    tipoCliente: "empresa",
                    fechaCreacion: cliente.fechaCreacion || new Date().toISOString(),
                    ultimaModificacion: cliente.ultimaModificacion || new Date().toISOString(),
                });
            }
        }
        
        console.log("Clientes obtenidos correctamente:", clientesList);        
        return clientesList;
    } catch (error) {
        console.error("Error al obtener clientes:", error);
        throw new Error(`Error al obtener clientes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export const actualizarCliente = async (id: string, cliente: Cliente) => {}

export const eliminarCliente = async (tipoCliente: string, clientId: string) => {
    const tableName = tipoCliente === "empresa" ? "clientes_empresariales" : "clientes_individuales";

    const { error } = await supabase
    .from(tableName)
    .delete()
    .eq("id", Number(clientId));

    if (error) {
        console.error("Error al eliminar cliente:", error);
        throw new Error(`Error al eliminar cliente: ${error.message}`);
    }

    console.log("¡Cliente eliminado correctamente!");
    return true;
}

export const obtenerClientesRegistrados = async () => {
    var totalClientes = 0;

    const { data: clientes, error } = await supabase
    .from("clientes_individuales")
    .select("id");

    if (error) {
        console.error("Error al obtener clientes:", error);
        throw new Error(`Error al obtener clientes: ${error.message}`);
    }

    totalClientes += clientes ? clientes.length : 0;

    const { data: clientesEmpresariales, error: errorEmpresariales } = await supabase
    .from("clientes_empresariales")
    .select("id");

    if (errorEmpresariales) {
        console.error("Error al obtener clientes empresariales:", errorEmpresariales);
        throw new Error(`Error al obtener clientes empresariales: ${errorEmpresariales.message}`);
    }

    totalClientes += clientesEmpresariales ? clientesEmpresariales.length : 0;

    console.log("Total de clientes registrados:", totalClientes);
    return totalClientes;
}


// USUARIOS

export const obtenerUsuarios = async (): Promise<Usuario[]> => {
    const usuariosList: Usuario[] = [];
    return usuariosList;
};

export const obtenerUsuarioPorId = async (id: string) => {}

export const agregarUsuario = async (usuario: UsuarioFirebase) => {};

export const eliminarUsuario = async (id: string) => {};

function base64ToFile(base64: string, filename: string, mimeType: string): File {
  const byteString = atob(base64.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new File([ab], filename, { type: mimeType });
}