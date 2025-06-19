# FerreMarket

![FerreMarket Logo](src/assets/images/logo.png)

## Introducción

FerreMarket es un sistema de gestión completo para ferreterías y tiendas de materiales de construcción. Diseñado para simplificar las operaciones diarias, desde el control de inventario hasta la gestión de ventas y clientes, FerreMarket ofrece una interfaz moderna e intuitiva que se adapta tanto a pequeños negocios como a cadenas comerciales.

## Características Principales

- **Gestión de Inventario**: Control completo de productos, categorías y stock
- **Ventas y Facturación**: Proceso de ventas rápido con generación de facturas en PDF
- **Gestión de Clientes**: Base de datos de clientes detallada con historial de compras
- **Informes y Estadísticas**: Análisis de ventas, inventario y rendimiento comercial
- **Gestión de Proveedores**: Control de órdenes de compra y reposición de stock
- **Promociones y Descuentos**: Creación y gestión de ofertas especiales
- **Panel Administrativo**: Control total del sistema con roles de usuario

## Requisitos del Sistema

- Node.js (v16 o superior)
- npm (v8 o superior)
- Navegador web moderno (Chrome, Firefox, Safari, Edge)

## Instalación

Sigue estos pasos para instalar y configurar el proyecto en tu entorno local:

1. **Clonar el repositorio**

```bash
git clone https://github.com/tuusuario/FerreMarket.git
cd FerreMarket
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Instalar dependencias específicas para generación de PDF**

```bash
npm install jspdf html2canvas
```

4. **Configurar variables de entorno**

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```
# Auth0
VITE_AUTH0_DOMAIN_NAME = ""
VITE_AUTH0_CLIENT_ID = ""

# Supabase
VITE_SUPABASE_URL = ""
VITE_SUPABASE_ANON_KEY = ""

# R2 y Workers
VITE_CLOUDFLARE_CDN_URL = ""
VITE_CLOUDFLARE_WORKERS_URL = ""
VITE_CLOUDFLARE_WORKERS_API_KEY = ""
```

5. **Iniciar el servidor de desarrollo**

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` (o el puerto que Vite asigne).

## Uso

### Acceso al Sistema

1. Abre tu navegador y accede a `http://localhost:5173`

### Módulos Principales

#### Dashboard

El panel principal muestra un resumen de la actividad reciente, incluyendo:
- Ventas del día y estadísticas comparativas
- Productos con stock bajo
- Últimas transacciones
- Gráficos de rendimiento

#### Productos

Gestiona el catálogo de productos con las siguientes funciones:
- Añadir, editar y eliminar productos
- Asignar categorías y proveedores
- Controlar niveles de stock
- Establecer precios y descuentos

#### Ventas

Procesa ventas de manera eficiente:
- Crear nuevas ventas con selección de productos
- Aplicar descuentos y promociones
- Generar facturas en PDF
- Enviar comprobantes por email

Para generar PDFs de facturas:
1. Selecciona una venta individual y haz clic en el botón "PDF"
2. Para múltiples facturas, selecciona varias ventas con las casillas de verificación
3. Usa el botón "PDF" en la barra de herramientas para generar documentos en lote

#### Clientes

Administra la información de tus clientes:
- Registro de clientes individuales y empresas
- Historial de compras
- Datos de contacto y seguimiento

#### Proveedores y Compras

Gestiona tus proveedores y órdenes de compra:
- Catálogo de proveedores
- Generación de órdenes de reposición
- Seguimiento de entregas

#### Promociones

Crea y administra ofertas especiales:
- Descuentos por porcentaje o monto fijo
- Promociones por categoría o producto
- Códigos promocionales

#### Reportes

Analiza el rendimiento de tu negocio:
- Reportes de ventas por período
- Análisis de inventario
- Rentabilidad por categoría y producto

## Estructura del Proyecto

```
FerreMarket/
├── public/           # Archivos públicos estáticos
├── src/              # Código fuente de la aplicación
│   ├── assets/       # Imágenes, iconos y recursos
│   ├── components/   # Componentes reutilizables
│   ├── data/         # Datos mockup y servicios
│   ├── layouts/      # Estructuras de página
│   ├── pages/        # Páginas principales
│   ├── types/        # Definiciones de TypeScript
│   ├── utils/        # Utilidades y helpers
│   ├── App.tsx       # Componente principal
│   └── main.tsx      # Punto de entrada
├── .env              # Variables de entorno
├── index.html        # HTML principal
├── package.json      # Dependencias y scripts
├── tsconfig.json     # Configuración de TypeScript
└── vite.config.ts    # Configuración de Vite
```

## Tecnologías Utilizadas

- **Frontend**: React, TypeScript, Tailwind CSS
- **Construcción**: Vite
- **Gráficos**: Recharts
- **PDF**: jsPDF, html2canvas
- **Iconos**: Lucide React
- **Fecha/Hora**: date-fns

## Personalización

### Temas y Estilos

El proyecto utiliza Tailwind CSS para los estilos. Puedes personalizar el aspecto modificando:

- `tailwind.config.js` para colores, fuentes y otros valores base
- `src/index.css` para estilos globales

### Datos Mock

Durante el desarrollo, la aplicación utiliza datos mockup ubicados en `src/data/mockData.ts`. En producción, conecta la aplicación a tu API o backend preferido.

## Despliegue

Para generar la versión de producción:

```bash
npm run build
```

Los archivos de producción se generarán en la carpeta `dist`, que puedes desplegar en cualquier servidor web estático.

## Solución de Problemas

### Problemas Comunes

- **Error de generación de PDF**: Asegúrate de tener instaladas las dependencias jsPDF y html2canvas.
- **Imágenes no visibles**: Verifica que las rutas a las imágenes sean correctas y que los archivos existan.
- **Errores de TypeScript**: Ejecuta `npm run typecheck` para verificar errores de tipo.

## Contribuir

Las contribuciones son bienvenidas. Para contribuir:

1. Haz fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/amazing-feature`)
3. Realiza tus cambios y haz commit (`git commit -m 'Add some amazing feature'`)
4. Sube tus cambios (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

© 2025 FerreMarket. Todos los derechos reservados.
