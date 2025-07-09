import { Producto, Cliente, Venta, EstadisticaVenta, Categoria, Notificacion, Usuario, UpdateProducto, VentaFormulario, UsuarioFormData } from "../types";
import { DateTime } from "luxon";
import supabase from "../lib/supabase/Supabase";
import toast from "react-hot-toast";


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
];

// Clientes recientes
export const clientes: Cliente[] = [
];

// Ventas recientes
export const ventas: Venta[] = [
];

// Estadísticas de ventas últimos 7 días
export const estadisticasVentas: EstadisticaVenta[] = [
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

export const obtenerNombreProductoById = async (id: string | number): Promise<string | null> => {
    if (id === undefined || id === null || 
        (typeof id === 'string' && id.trim() === '')) {
        throw new Error('id must be a non-empty value');
    }

    const { data, error } = await supabase
    .from("productos")
    .select("nombre")
    .eq("id", Number(id))
    .single();

    if (error) {
        console.error("Error al obtener el nombre del producto por ID:", error);
        throw new Error(`Error al obtener el nombre del producto por ID: ${error.message}`);
    }

    if (data) {
        return data.nombre;
    } else {
        console.warn("No se encontró un producto con el ID proporcionado:", id);
        return null; // Si no se encuentra el producto, retornamos null
    }
}

// CLIENTES

export const agregarCliente = async (tipoCliente: string, dataCliente: Cliente) => {
    let userData: any = {};

    if (tipoCliente === "individual") {
        userData = {
            nombre: dataCliente.nombre,
            apellidos: dataCliente.apellidos || "",
            email: dataCliente.email,
            telefono: dataCliente.telefono,
            direccion: dataCliente.direccion || "",
            run: dataCliente.run,
            estado: "activo",
            notas: dataCliente.notas || "",
            tipo: "individual",
        };
    } else if (tipoCliente === "empresa") {
        userData = {
            razonsocial: dataCliente.razonSocial,
            nombre: dataCliente.nombreComercial || "",
            email: dataCliente.email,
            telefono: dataCliente.telefono,
            direccion: dataCliente.direccion || "",
            rut: dataCliente.rut || "",
            giro: dataCliente.giro || "",
            estado: "activo",
            notas: dataCliente.notas || "",
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
                        compras: await obtenerCantidadComprasClientePorId(cliente.id),
                        totalCompras: await obtenerTotalComprasClientePorId(cliente.id),
                        ultimaCompra: cliente.ultimacompra || "Sin fecha registrada.",
                        tipoCliente: "individual",
                        fechaCreacion: cliente.fechaCreacion || DateTime.now().setZone("America/Santiago").toISO(),
                        ultimaModificacion: cliente.ultimaModificacion || DateTime.now().setZone("America/Santiago").toISO(),
                    });
                } else if (cliente.tipo === "empresarial") {
                    clientesList.push({
                        id: cliente.id,
                        nombre: cliente.nombre,
                        razonSocial: cliente.razonsocial || "",
                        email: cliente.email,
                        telefono: cliente.telefono,
                        direccion: cliente.direccion || "",
                        rut: cliente.rut || "",
                        giro: cliente.giro || "",
                        estado: cliente.estado || "activo",
                        notas: cliente.notas || "",
                        compras: await obtenerCantidadComprasClientePorId(cliente.id),
                        totalCompras: await obtenerTotalComprasClientePorId(cliente.id),
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

export const actualizarCliente = async () => {}

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

export const obtenerCantidadComprasClientePorId = async (clienteId: string | number): Promise<number> => {
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

    
    // SUMAMOS EL TOTAL DE LAS COMPRAS DEL CLIENTE
    if (!ventas || ventas.length === 0) {
        return 0; // Si no hay compras, retornamos 0
    }

    // Sumamos los totales de las compras del cliente
    const totalCompras = ventas.length;
    return totalCompras;
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
        console.error(`Error fetching total purchases for client ${clienteId}:`, error);
        throw new Error(`Error fetching total purchases for client: ${error.message}`);
    }

    // SUMAMOS EL TOTAL DE LAS COMPRAS DEL CLIENTE
    if (!ventas || ventas.length === 0) {
        return 0; // Si no hay compras, retornamos 0
    }

    // Sumamos los totales de las compras del cliente
    const totalCompras = ventas.reduce((acc, venta) => acc + (venta.total || 0), 0);
    return totalCompras;
}

export const obtenerClienteIdByMail = async (email: string): Promise<number | null> => {
    if (!email || typeof email !== 'string' || email.trim() === '') {
        throw new Error('email must be a non-empty string');
    }

    const { data, error } = await supabase
    .from("clientes")
    .select("id")
    .eq("email", email)
    .single();

    if (error) {
        console.error("Error al obtener el ID del cliente por email:", error);
        throw new Error(`Error al obtener el ID del cliente por email: ${error.message}`);
    }

    if (data) {
        return data.id;
    } else {
        console.warn("No se encontró un cliente con el email proporcionado:", email);
        return null; // Si no se encuentra el cliente, retornamos null
    }
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

export const obtenerVentasPorCliente = async (clienteId: number): Promise<Venta[]> => {
    const ventasList: Venta[] = [];
    console.log("Obteniendo ventas para el cliente:", clienteId);
    try {
        const { data: ventas, error } = await supabase
        .from("ventas")
        .select("*")
        .eq("cliente", Number(clienteId));

        console.log(ventas);

        if (error) {
            console.error("Error al obtener ventas por cliente:", error);
            throw new Error(`Error al obtener ventas por cliente: ${error.message}`);
        }

        const { data: productosVentas, error: productosError } = await supabase
        .from("ventas_productos")
        .select("*");

        if (productosError) {
            console.error("Error al obtener productos de ventas:", productosError);
            throw new Error(`Error al obtener productos de ventas: ${productosError.message}`);
        }

        for (const venta of ventas) {
            // Create array of promises and resolve them all at once
            const productosPromises = productosVentas
                .filter(p => p.venta_id === venta.id)
                .map(async p => {
                    console.log("Obteniendo nombre del producto para el ID:", p.producto_id);
                    const nombre = await obtenerNombreProductoById(p.producto_id);
                    return {
                        id: p.producto_id,
                        cantidad: p.cantidad,
                        nombre: nombre || "Producto no encontrado",
                        precioUnitario: p.precio_unitario
                    };
                });
            
            // Await all promises
            const productos = await Promise.all(productosPromises);
            
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
        console.error("Error al obtener ventas por cliente:", error);
        throw new Error(`Error al obtener ventas por cliente: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}


// PROMOCIONES

export const agregarPromocion = async (promocion: any) => {
    const promocionData = {
        codigo: promocion.codigo,
        nombre: promocion.nombre,
        tipo: promocion.tipo,
        valor: promocion.valor,
        valor_maximo: promocion.valorMaximo || 0,
        monto_minimo: promocion.montoMinimo || 0,
        fecha_inicio: DateTime.fromISO(promocion.fechaInicio).setZone("America/Santiago").toISO(),
        fecha_fin: DateTime.fromISO(promocion.fechaFin).setZone("America/Santiago").toISO(),
        limite_total_usos: promocion.limiteTotalUsos || 0,
        limite_usos_por_cliente: promocion.limiteUsosPorCliente || 1,
        usos_actuales: 0,
        estado: promocion.estado || "activo",
        aplica_a: promocion.aplicaA || "todos",
        productos_incluidos: promocion.productosIncluidos || [],
        productos_excluidos: promocion.productosExcluidos || [],
        categorias_incluidas: promocion.categoriasIncluidas || [],
        categorias_excluidas: promocion.categoriasExcluidas || [],
        tipo_cliente: promocion.tipoCliente || "todos",
        combinable: promocion.combinable || false,
        descripcion: promocion.descripcion || "",
        fecha_creacion: DateTime.now().setZone("America/Santiago").toISO(),
        creado_por: promocion.creadoPor || "Admin",
        ingreso_generado: promocion.ingresoGenerado || 0,
        valor_promedio_compra: promocion.valorPromedioCompra || 0,
        tasa_conversion: promocion.tasaConversion || 0,
        horarios_uso: promocion.horariosUso || [],
        productos_vendidos: promocion.productosVendidos || [],
    }

    try {
        const { data, error } = await supabase
        .from("promociones")
        .insert([promocionData])
        .select();

        if (error) {
            toast.error("Error al agregar promoción: " + (error instanceof Error ? error.message : 'Unknown error'));
            console.error("Error al agregar promoción:", error);
            throw new Error(`Error al agregar promoción: ${error.message}`);
        }

        toast.success("Promoción agregada exitosamente");
        return data;
    } catch (err) {
        console.error("Error en la operación:", err);
        toast.error("Error al agregar promoción: " + (err instanceof Error ? err.message : 'Unknown error'));
        throw err;
    }
}

export const obtenerPromociones = async (): Promise<any[]> => {
    const promocionesList: any[] = [];

    try {
        const { data: promociones, error } = await supabase
        .from("promociones")
        .select("*");

        if (error) {
            console.error("Error al obtener promociones:", error);
            throw new Error(`Error al obtener promociones: ${error.message}`);
        }

        for (const promocion of promociones) {
            promocionesList.push({
                id: promocion.id,
                codigo: promocion.codigo,
                nombre: promocion.nombre,
                tipo: promocion.tipo,
                valor: promocion.valor,
                valorMaximo: promocion.valor_maximo || 0,
                montoMinimo: promocion.monto_minimo || 0,
                fechaInicio: promocion.fecha_inicio || DateTime.now().setZone("America/Santiago").toISO(),
                fechaFin: promocion.fecha_fin || DateTime.now().setZone("America/Santiago").toISO(),
                limiteTotalUsos: promocion.limite_total_usos || 0,
                limiteUsosPorCliente: promocion.limite_usos_por_cliente || 1,
                usosActuales: promocion.usos_actuales || 0,
                estado: promocion.estado || "activo",
                aplicaA: promocion.aplica_a || "todos",
                productosIncluidos: promocion.productos_incluidos || [],
                productosExcluidos: promocion.productos_excluidos || [],
                categoriasIncluidas: promocion.categorias_incluidas || [],
                categoriasExcluidas: promocion.categorias_excluidas || [],
                tipoCliente: promocion.tipo_cliente || "todos",
                combinable: promocion.combinable || false,
                descripcion: promocion.descripcion || "",
                fechaCreacion: promocion.fecha_creacion || DateTime.now().setZone("America/Santiago").toISO(),
                creadoPor: promocion.creado_por || "Admin",
                ingresoGenerado: promocion.ingreso_generado || 0,
                valorPromedioCompra: promocion.valor_promedio_compra || 0,
                tasaConversion: promocion.tasa_conversion || 0,
                horariosUso: promocion.horarios_uso || [],
                productosVendidos: promocion.productos_vendidos || [],
            });
        }

        return promocionesList;
    } catch (error) {
        console.error("Error al obtener promociones:", error);
        throw new Error(`Error al obtener promociones: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

// USUARIOS

export const obtenerUsuarios = async (): Promise<Usuario[]> => {
    const usuariosList: Usuario[] = [];

    try {
        const { data: usuarios, error } = await supabase
        .from("usuarios")
        .select("*");

        if (error) {
            console.error("Error al obtener usuarios:", error);
            throw new Error(`Error al obtener usuarios: ${error.message}`);
        }

        for (const usuario of usuarios) {
            usuariosList.push({
                id: usuario.id,
                uid: usuario.uid,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol || "usuario",
                estado: usuario.estado || "activo",
                fechaCreacion: usuario.fecha_creacion || DateTime.now().setZone("America/Santiago").toISO(),
                ultimaModificacion: usuario.ultima_modificacion || DateTime.now().setZone("America/Santiago").toISO(),
                ultimoAcceso: usuario.ultimo_acceso || DateTime.now().setZone("America/Santiago").toISO(),
            });
        }

        return usuariosList;
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        throw new Error(`Error al obtener usuarios: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};

export const obtenerUsuarioPorId = async () => {}
export const agregarUsuario = async (NuevoUsuario: { uid: string; nombre: string; email: string; rol: "admin" | "usuario" | "cliente"; estado: "activo" | "inactivo"; fecha_creacion: string; ultima_modificacion: string; ultimo_acceso: string; }) => {
    try {
        const { data, error } = await supabase
        .from("usuarios")
        .insert([NuevoUsuario])
        .select();

        if (error) {
            console.error("Error al agregar usuario:", error);
            throw new Error(`Error al agregar usuario: ${error.message}`);
        }

        return data;
    } catch (err) {
        console.error("Error en la operación:", err);
        throw err;
    }
};

export const actualizarUsuario = async (userId: string, userData: { nombre: string; email: string; rol: "admin" | "usuario"; estado: "activo" | "inactivo"; }) => {
    try {
        const { data, error } = await supabase
        .from("usuarios")
        .update(userData)
        .eq("id", Number(userId))
        .select();

        if (error) {
            console.error("Error al actualizar usuario:", error);
            throw new Error(`Error al actualizar usuario: ${error.message}`);
        }

        return data;
    } catch (err) {
        console.error("Error en la operación:", err);
        throw err;
    }
}

export const eliminarUsuario = async (userId: string) => {
    try {
        const { data, error } = await supabase
        .from("usuarios")
        .delete()
        .eq("id", Number(userId))
        .select();

        if (error) {
            console.error("Error al eliminar usuario:", error);
            throw new Error(`Error al eliminar usuario: ${error.message}`);
        }

        return data;
    } catch (err) {
        console.error("Error en la operación:", err);
        throw err;
    }
};

function base64ToFile(base64: string, filename: string, mimeType: string): File {
  const byteString = atob(base64.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new File([ab], filename, { type: mimeType });
}