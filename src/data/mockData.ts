import { Producto, Cliente, Venta, EstadisticaVenta, Categoria, Notificacion, Usuario, UpdateProducto, ClienteEmpresarial, ClienteIndividual, VentaFormulario } from "../types";
import { DateTime } from "luxon";
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

export const obtenerProductosDestacados = async (limit: number): Promise<Producto[]> => {
    const productosDestacados: Producto[] = [];

    try {
        const { data: productos } = await supabase
        .from("ventas_productos")
        .select("producto_id, cantidad")
        .order("cantidad", { ascending: false })
        .limit(limit);

        if (productos) {
            for (const producto of productos) {
                const { data: productoData } = await supabase
                .from("productos")
                .select("*")
                .eq("id", producto.producto_id)
                .single();

                if (productoData && !productosDestacados.some(p => p.id === productoData.id)) {
                    productosDestacados.push({
                        id: productoData.id,
                        sku: productoData.sku,
                        nombre: productoData.nombre,
                        descripcion: productoData.descripcion,
                        precio: productoData.precio,
                        categoria: productoData.categoria,
                        stock: productoData.stock,
                        imagen: productoData.imagen,
                        destacado: productoData.destacado || false,
                    });
                }
            }
        }

        return productosDestacados;
    } catch (error) {
        console.error("Error al obtener productos destacados:", error);
        throw new Error(`Error al obtener productos destacados: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

// CLIENTES

export const agregarCliente = async (tipoCliente: string, dataCliente: ClienteIndividual | ClienteEmpresarial) => {
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
            tipo: "individual",
        };
    } else if (tipoCliente === "empresa") {
        userData = {
            razonsocial: (dataCliente as ClienteEmpresarial).razonSocial,
            nombre: (dataCliente as ClienteEmpresarial).nombreComercial || "",
            email: dataCliente.email,
            telefono: dataCliente.telefono,
            direccion: (dataCliente as ClienteEmpresarial).direccion || "",
            rut: (dataCliente as ClienteEmpresarial).rut || "",
            giro: (dataCliente as ClienteEmpresarial).giro || "",
            estado: "activo",
            notas: (dataCliente as ClienteEmpresarial).notas || "",
            tipo: "empresarial",
        };
    }

    try {
        const { data: cliente, error } = await supabase
        .from("clientes")
        .insert([userData])

        if (error) {
            console.error("Error al agregar cliente:", error);
            throw new Error(`Error al agregar cliente: ${error.message}`);
        }

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
        const { data: clientes } = await supabase
        .from("clientes")
        .select("*")

        if (clientes) {
            for (const cliente of clientes) {
                if (cliente.tipo === "individual") {
                    clientesList.push({
                        id: cliente.id,
                        nombre: cliente.nombre + (cliente.apellidos ? ` ${cliente.apellidos}` : ""),
                        email: cliente.email,
                        telefono: cliente.telefono,
                        direccion: cliente.direccion || "",
                        run: cliente.run || "",
                        estado: cliente.estado || "activo",
                        notas: cliente.notas || "",
                        compras: await obtenerTotalComprasClientePorId(cliente.id),
                        ultimaCompra: cliente.ultimacompra || "Sin fecha registrada.",
                        tipoCliente: "individual",
                        fechaCreacion: cliente.fechaCreacion || DateTime.now().setZone("America/Santiago").toISO(),
                        ultimaModificacion: cliente.ultimaModificacion || DateTime.now().setZone("America/Santiago").toISO(),
                    });
                } else if (cliente.tipo === "empresarial") {
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
                        compras: await obtenerTotalComprasClientePorId(cliente.id),
                        ultimaCompra: cliente.ultimacompra || 'Sin fecha registrada.',
                        tipoCliente: "empresa",
                        fechaCreacion: cliente.fechaCreacion || DateTime.now().setZone("America/Santiago").toISO(),
                        ultimaModificacion: cliente.ultimaModificacion || DateTime.now().setZone("America/Santiago").toISO(),
                    });
                }
            }
        }

        return clientesList;
    } catch (error) {
        console.error("Error al obtener clientes:", error);
        throw new Error(`Error al obtener clientes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export const actualizarCliente = async (id: string, cliente: Cliente) => {}

export const eliminarCliente = async (clientId: string) => {
    const { error } = await supabase
    .from("clientes")
    .delete()
    .eq("id", Number(clientId));

    if (error) {
        console.error("Error al eliminar cliente:", error);
        throw new Error(`Error al eliminar cliente: ${error.message}`);
    }

    return true;
}

export const obtenerClientesRegistrados = async () => {
    var totalClientes = 0;

    const { data: clientes, error } = await supabase
    .from("clientes")
    .select("id");

    if (error) {
        console.error("Error al obtener clientes:", error);
        throw new Error(`Error al obtener clientes: ${error.message}`);
    }

    totalClientes += clientes ? clientes.length : 0;
    return totalClientes;
}

export const obtenerTotalComprasClientePorId = async (clienteId: string | number): Promise<number> => {
    if (clienteId === undefined || clienteId === null || 
        (typeof clienteId === 'string' && clienteId.trim() === '')) {
        throw new Error('clienteId must be a non-empty value');
    }

    const { data: ventas, error } = await supabase
    .from("ventas")
    .select("total")
    .eq("cliente", Number(clienteId));

    if (error) {
        console.error(`Error fetching purchases for client ${clienteId}:`, error);
        throw new Error(`Error fetching purchases for client: ${error.message}`);
    }

    const totalCompras = ventas.length    
    return totalCompras;
}

// VENTAS

export const agregarVenta = async (venta: VentaFormulario) => {
    // AGREGAR DATOS INICIALES DE LA VENTA A LA BASE DE DATOS
    const ventaData = {
        fecha: DateTime.now().setZone("America/Santiago").toISO(),
        cliente: venta.cliente,
        total: venta.total,
        metodo_pago: venta.metodoPago,
        estado: venta.estado || "pendiente", // Asignar estado por defecto si no se proporciona
    }

    const { data, error } = await supabase
    .from("ventas")
    .insert([ventaData])
    .select();

    if (error) {
        console.error("Error al agregar venta:", error);
        throw new Error(`Error al agregar venta: ${error.message}`);
    }

    const ventaId = data?.[0]?.id;

    // AGREGAR PRODUCTOS A LA VENTA
    for (const producto of venta.productos) {
        const productoData = {
            venta_id: ventaId,
            producto_id: producto.id,
            cantidad: producto.cantidad,
            precio_unitario: producto.precioUnitario,
        };

        const { error: productoError } = await supabase
        .from("ventas_productos")
        .insert([productoData]);

        if (productoError) {
            console.error("Error al agregar producto a la venta:", productoError);
            throw new Error(`Error al agregar producto a la venta: ${productoError.message}`);
        }
    }

    // ACTUALIZAR STOCK DE LOS PRODUCTOS VENDIDOS
    for (const producto of venta.productos) {
        const { data: currentProduct, error: fetchError } = await supabase
            .from("productos")
            .select("stock")
            .eq("id", producto.id)
            .single();
        
        if (fetchError) {
            console.error("Error al obtener stock del producto:", fetchError);
            throw new Error(`Error al obtener stock del producto: ${fetchError.message}`);
        }
        
        const newStock = (currentProduct?.stock || 0) - producto.cantidad;
        const { error: stockError } = await supabase
            .from("productos")
            .update({ stock: newStock })
            .eq("id", producto.id);

        if (stockError) {
            console.error("Error al actualizar stock del producto:", stockError);
            throw new Error(`Error al actualizar stock del producto: ${stockError.message}`);
        }
    }

    // ACTUALIZAR FECHA DE ULTIMA COMPRA DEL CLIENTE
    const { error: updateClienteError } = await supabase
    .from("clientes")
    .update({ ultimacompra: DateTime.now().setZone("America/Santiago").toISO() })
    .eq("id", venta.cliente);

    if (updateClienteError) {
        console.error("Error al actualizar la última compra del cliente:", updateClienteError);
        throw new Error(`Error al actualizar la última compra del cliente: ${updateClienteError.message}`);
    }

    return true; 
}

export const obtenerVentas = async (): Promise<Venta[]> => {
    const ventasList: Venta[] = [];

    try {
        const { data: ventas, error } = await supabase
        .from("ventas")
        .select("*");

        if (error) {
            console.error("Error al obtener ventas:", error);
            throw new Error(`Error al obtener ventas: ${error.message}`);
        }

        const { data: productosVentas, error: productosError } = await supabase
        .from("ventas_productos")
        .select("*");

        if (productosError) {
            console.error("Error al obtener productos de ventas:", productosError);
            throw new Error(`Error al obtener productos de ventas: ${productosError.message}`);
        }

        for (const venta of ventas) {
            const productos = productosVentas.filter(p => p.venta_id === venta.id).map(p => ({
                id: p.producto_id,
                cantidad: p.cantidad,
                precioUnitario: p.precio_unitario,
            }));

            ventasList.push({
                id: venta.id,
                fecha: venta.fecha,
                cliente: venta.cliente,
                productos: productos,
                total: venta.total,
                metodoPago: venta.metodo_pago,
                estado: venta.estado,
            });
        }

        return ventasList;
    } catch (error) {
        console.error("Error al obtener ventas:", error);
        throw new Error(`Error al obtener ventas: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export const obtenerVentasRecientes = async (cantidad: number): Promise<Venta[]> => {
    const ventasList: Venta[] = [];

    try {
        const { data: ventas, error } = await supabase
        .from("ventas")
        .select("*")
        .order("fecha", { ascending: false })
        .limit(cantidad);

        if (error) {
            console.error("Error al obtener ventas recientes:", error);
            throw new Error(`Error al obtener ventas recientes: ${error.message}`);
        }

        const { data: productosVentas, error: productosError } = await supabase
        .from("ventas_productos")
        .select("*");

        if (productosError) {
            console.error("Error al obtener productos de ventas:", productosError);
            throw new Error(`Error al obtener productos de ventas: ${productosError.message}`);
        }

        // Mapear las ventas y sus productos
        for (const venta of ventas) {
            const productos = productosVentas.filter(p => p.venta_id === venta.id).map(p => ({
                id: p.producto_id,
                cantidad: p.cantidad,
                precioUnitario: p.precio_unitario,
            }));

            ventasList.push({
                id: venta.id,
                fecha: venta.fecha,
                cliente: venta.cliente,
                productos: productos, // Los productos se obtienen aquí
                total: venta.total,
                metodoPago: venta.metodo_pago,
                estado: venta.estado,
            });
        }

        return ventasList;
    } catch (error) {
        console.error("Error al obtener ventas recientes:", error);
        throw new Error(`Error al obtener ventas recientes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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