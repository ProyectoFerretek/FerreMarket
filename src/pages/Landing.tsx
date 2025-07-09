import React, { useState, useEffect } from 'react';
import { 
  Menu, X, ShoppingBag, Clock, MapPin, Phone, Mail,
  User, LogIn, Search, Grid, List,
  Tag, Calendar, Shield, Award, Eye, Heart, Share2,
  CheckCircle, XCircle, AlertCircle, Home,
  Package, CreditCard, Users, Gift, Loader
} from 'lucide-react';
import { categorias, obtenerProductos } from '../data/mockData';
import { formatPrecio, formatFecha } from '../utils/formatters';
import { Producto } from '../types';
import toast from 'react-hot-toast';
import { UserAuth } from '../context/AuthContext';
import { obtenerUsuarioIdByUUID } from '../utils/auth';

// Mock data para promociones de la landing
const promocionesLanding = [
//   {
//     id: 'PROMO001',
//     titulo: 'Descuento 20% en Herramientas',
//     descripcion: 'Aprovecha nuestro descuento especial en toda la línea de herramientas eléctricas y manuales.',
//     descuento: 20,
//     tipo: 'porcentaje',
//     fechaInicio: '2024-01-01',
//     fechaFin: '2024-12-31',
//     imagen: 'https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg',
//     terminos: 'Válido solo en tienda física. No acumulable con otras promociones. Stock limitado.',
//     categoria: 'herramientas'
//   },
//   {
//     id: 'PROMO002',
//     titulo: 'Envío Gratis en Compras +$100.000',
//     descripcion: 'Compra desde $100.000 y recibe envío gratuito a domicilio en Santiago.',
//     descuento: 0,
//     tipo: 'envio_gratis',
//     fechaInicio: '2024-01-01',
//     fechaFin: '2024-12-31',
//     imagen: 'https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg',
//     terminos: 'Válido para Santiago y comunas aledañas. Tiempo de entrega 24-48 horas.',
//     categoria: 'general'
//   },
//   {
//     id: 'PROMO003',
//     titulo: 'Combo Pintura + Rodillos',
//     descripcion: 'Lleva pintura y rodillos con 15% de descuento en el combo completo.',
//     descuento: 15,
//     tipo: 'combo',
//     fechaInicio: '2024-01-15',
//     fechaFin: '2024-02-28',
//     imagen: 'https://images.pexels.com/photos/5582597/pexels-photo-5582597.jpeg',
//     terminos: 'Promoción válida solo en tienda física. Mínimo 2 productos del combo.',
//     categoria: 'pinturas'
//   }
];

// Mock data para historial de compras (usuario logueado)
const historialCompras = [
  {
    id: 'V001',
    fecha: '2024-01-15T14:30:00',
    productos: [
      { nombre: 'Taladro Inalámbrico 18V', cantidad: 1, precio: 59990 },
      { nombre: 'Set de Destornilladores', cantidad: 1, precio: 12990 }
    ],
    total: 72980,
    estado: 'completada',
    garantia: '2024-01-15T14:30:00',
    puntos: 73
  },
  {
    id: 'V002',
    fecha: '2024-01-08T11:15:00',
    productos: [
      { nombre: 'Pintura Látex Blanco 1GL', cantidad: 2, precio: 18990 }
    ],
    total: 37980,
    estado: 'completada',
    garantia: null,
    puntos: 38
  }
];

const Landing: React.FC = () => {
  // Estados principales
  const [menuOpen, setMenuOpen] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState('inicio');
  const [usuarioLogueado, setUsuarioLogueado] = useState(false);
  const [modalLogin, setModalLogin] = useState(false);
  const [modalProducto, setModalProducto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

    const { signInUser, signOut } = UserAuth();
  
  // Estados para productos
  const [busquedaProductos, setBusquedaProductos] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [vistaProductos, setVistaProductos] = useState<'grid' | 'list'>('grid');
  const [productosFavoritos, setProductosFavoritos] = useState<string[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
      
  const cargarProductos = async () => {
      const productosData = await obtenerProductos();
      setProductos(productosData);
  }

  useEffect(() => {
      cargarProductos();
  }, []);

  // Estados responsive
  const [isMobile, setIsMobile] = useState(false);

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Cerrar menú móvil al cambiar sección
  useEffect(() => {
    if (menuOpen && !isMobile) {
      setMenuOpen(false);
    }
  }, [isMobile]);

  // Filtrar productos
  const productosFiltrados = productos.filter(producto => {
    const matchBusqueda = producto.nombre.toLowerCase().includes(busquedaProductos.toLowerCase());
    const matchCategoria = !categoriaSeleccionada || producto.categoria === categoriaSeleccionada;
    return matchBusqueda && matchCategoria;
  });

  // Manejar favoritos
  const toggleFavorito = (productoId: string) => {
    setProductosFavoritos(prev => 
      prev.includes(productoId) 
        ? prev.filter(id => id !== productoId)
        : [...prev, productoId]
    );
  };

  // Abrir modal de detalles del producto
  const abrirModalProducto = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setModalProducto(true);
  };

  // Componente Header
  const Header = () => (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Home size={24} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="text-xl font-bold text-orange-600">Ferre</div>
                <div className="text-xl font-bold text-blue-900">Market</div>
              </div>
            </div>
          </div>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex space-x-8">
            {[
              { id: 'inicio', label: 'Inicio' },
              { id: 'productos', label: 'Productos' },
              { id: 'promociones', label: 'Promociones' },
              { id: 'contacto', label: 'Contacto' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setSeccionActiva(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  seccionActiva === item.id
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Acciones */}
          <div className="flex items-center space-x-4">
            {usuarioLogueado ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSeccionActiva('perfil')}
                  className={`p-2 rounded-lg transition-colors ${
                    seccionActiva === 'perfil'
                      ? 'text-orange-600 bg-orange-50'
                      : 'text-gray-600 hover:text-orange-600 hover:bg-gray-50'
                  }`}
                >
                  <User size={20} />
                </button>
                <button
                  onClick={() => {
                    setUsuarioLogueado(false);
                    signOut();
                  }}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <button
                onClick={() => setModalLogin(true)}
                className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
              >
                <LogIn size={16} />
                <span className="hidden sm:inline">Iniciar Sesión</span>
              </button>
            )}

            {/* Menú hamburguesa móvil */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              {[
                { id: 'inicio', label: 'Inicio' },
                { id: 'productos', label: 'Productos' },
                { id: 'promociones', label: 'Promociones' },
                { id: 'contacto', label: 'Contacto' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSeccionActiva(item.id);
                    setMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    seccionActiva === item.id
                      ? 'text-orange-600 bg-orange-50'
                      : 'text-gray-700 hover:text-orange-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              {usuarioLogueado && (
                <button
                  onClick={() => {
                    setSeccionActiva('perfil');
                    setMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    seccionActiva === 'perfil'
                      ? 'text-orange-600 bg-orange-50'
                      : 'text-gray-700 hover:text-orange-600 hover:bg-gray-50'
                  }`}
                >
                  Mi Perfil
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );

  // Componente Hero Section
  const HeroSection = () => (
    <section className="bg-neutral-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Tu Ferretería de
              <span className="text-orange-400 block">Confianza</span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 leading-relaxed">
              Encuentra todo lo que necesitas para tus proyectos. Herramientas, materiales y asesoría especializada en un solo lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => setSeccionActiva('productos')}
                className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center"
              >
                <ShoppingBag size={20} className="mr-2" />
                Ver Productos
              </button>
              <button
                onClick={() => setSeccionActiva('promociones')}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors flex items-center justify-center"
              >
                <Tag size={20} className="mr-2" />
                Ver Ofertas
              </button>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg"
              alt="Herramientas FerreMarket"
              className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );

  // Componente Características
  const CaracteristicasSection = () => (
    <section className="py-12 lg:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            ¿Por qué elegir FerreMarket?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Más de 20 años de experiencia nos respaldan como la ferretería líder en la región
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Package size={32} className="text-blue-600" />,
              titulo: 'Amplio Catálogo',
              descripcion: 'Más de 5,000 productos disponibles para todos tus proyectos'
            },
            {
              icon: <Shield size={32} className="text-green-600" />,
              titulo: 'Garantía Asegurada',
              descripcion: 'Todos nuestros productos cuentan con garantía del fabricante'
            },
            {
              icon: <Users size={32} className="text-purple-600" />,
              titulo: 'Asesoría Experta',
              descripcion: 'Nuestro equipo te ayuda a encontrar la solución perfecta'
            },
          ].map((caracteristica, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-4">
                {caracteristica.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {caracteristica.titulo}
              </h3>
              <p className="text-gray-600">
                {caracteristica.descripcion}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // Componente Productos
  const ProductosSection = () => (
    <section className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Nuestros Productos
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Explora nuestro catálogo completo de herramientas y materiales
          </p>
          
          {/* Aviso importante */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center">
              <AlertCircle size={20} className="text-blue-600 mr-2" />
              <span className="text-blue-800 font-medium">
                Las compras se realizan únicamente en nuestra tienda física
              </span>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={busquedaProductos}
                onChange={(e) => setBusquedaProductos(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas las categorías</option>
              {categorias.map(categoria => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setVistaProductos('grid')}
                className={`p-2 rounded-lg ${vistaProductos === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setVistaProductos('list')}
                className={`p-2 rounded-lg ${vistaProductos === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Grid de productos */}
        <div className={`grid gap-6 ${
          vistaProductos === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {productosFiltrados.map(producto => {
            const esFavorito = productosFavoritos.includes(producto.id);
            const categoria = categorias.find(c => c.id === producto.categoria);
            
            if (vistaProductos === 'list') {
              return (
                <div key={producto.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 group">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative sm:w-48 sm:flex-shrink-0">
                      <div className="w-full h-48 sm:h-full overflow-hidden">
                        <img
                          src={producto.imagen}
                          alt={producto.nombre}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      
                      {/* Estado del producto */}
                      <div className="absolute top-2 left-2">
                        {producto.stock > 0 ? (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center shadow-sm">
                            <CheckCircle size={12} className="mr-1" />
                            Disponible
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium flex items-center shadow-sm">
                            <XCircle size={12} className="mr-1" />
                            Agotado
                          </span>
                        )}
                      </div>

                      {/* Botón favorito */}
                      <button
                        onClick={() => toggleFavorito(producto.id)}
                        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                      >
                        <Heart 
                          size={16} 
                          className={esFavorito ? 'text-red-500 fill-current' : 'text-gray-400'} 
                        />
                      </button>
                    </div>

                    <div className="p-4 sm:p-6 flex flex-col flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between flex-1">
                        <div className="flex-1 mb-4 sm:mb-0 sm:mr-6">
                          <div className="mb-2">
                            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                              {categoria?.nombre}
                            </span>
                          </div>
                          
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {producto.nombre}
                          </h3>
                          
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {producto.descripcion}
                          </p>

                          <div className="text-xs text-gray-500 mb-4">
                            Stock: {producto.stock} unidades
                          </div>
                        </div>

                        <div className="flex flex-col sm:items-end">
                          <span className="text-2xl font-bold text-gray-900 mb-4">
                            {formatPrecio(producto.precio)}
                          </span>
                          
                          <div className="flex flex-col sm:flex-row gap-2">
                            <div className="flex space-x-1">
                              <button
                                onClick={() => abrirModalProducto(producto)}
                                className={`p-2 rounded-lg font-medium transition-colors ${
                                  producto.stock > 0
                                    ? 'text-orange-500 hover:text-orange-600 hover:bg-orange-50'
                                    : 'text-gray-300 cursor-not-allowed'
                                }`}
                                disabled={producto.stock === 0}
                                title={producto.stock > 0 ? "Ver detalles del producto" : "Producto no disponible"}
                              >
                                <Eye size={18} />
                              </button>
                              
                              {/* <button 
                                onClick={() => toggleFavorito(producto.id)}
                                className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                                title="Agregar a favoritos"
                              >
                                <Heart size={18} className={esFavorito ? 'fill-current text-red-500' : ''} />
                              </button> */}
                              
                              <button 
                                className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                                title="Compartir producto"
                              >
                                <Share2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            
            return (
              <div key={producto.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 group flex flex-col h-full">
                <div className="relative">
                  <div className="w-full h-48 sm:h-56 lg:h-48 overflow-hidden">
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  
                  {/* Estado del producto */}
                  <div className="absolute top-2 left-2">
                    {producto.stock > 0 ? (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center shadow-sm">
                        <CheckCircle size={12} className="mr-1" />
                        Disponible
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium flex items-center shadow-sm">
                        <XCircle size={12} className="mr-1" />
                        Agotado
                      </span>
                    )}
                  </div>

                  {/* Botón favorito */}
                  <button
                    onClick={() => toggleFavorito(producto.id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                  >
                    <Heart 
                      size={16} 
                      className={esFavorito ? 'text-red-500 fill-current' : 'text-gray-400'} 
                    />
                  </button>
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <div className="mb-3">
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {categoria?.nombre}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                    {producto.nombre}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                    {producto.descripcion}
                  </p>

                  {/* Precio siempre visible en la parte inferior */}
                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <span className="text-xl sm:text-2xl font-bold text-gray-900 block">
                          {formatPrecio(producto.precio)}
                        </span>
                        <div className="text-xs text-gray-500">
                          Stock: {producto.stock} unidades
                        </div>
                      </div>
                      
                      <div className="flex space-x-1">
                        <button
                          onClick={() => abrirModalProducto(producto)}
                          className={`p-2 rounded-lg font-medium transition-colors ${
                            producto.stock > 0
                              ? 'text-orange-500 hover:text-orange-600 hover:bg-orange-50'
                              : 'text-gray-300 cursor-not-allowed'
                          }`}
                          disabled={producto.stock === 0}
                          title={producto.stock > 0 ? "Ver detalles del producto" : "Producto no disponible"}
                        >
                          <Eye size={18} />
                        </button>
                        
                        {/* <button 
                          onClick={() => toggleFavorito(producto.id)}
                          className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                          title="Agregar a favoritos"
                        >
                          <Heart size={18} className={esFavorito ? 'fill-current text-red-500' : ''} />
                        </button> */}
                        
                        <button 
                          className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                          title="Compartir producto"
                        >
                          <Share2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {productosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-500">
              Intenta con otros términos de búsqueda o categoría
            </p>
          </div>
        )}
      </div>
    </section>
  );

  // Componente Promociones
  const PromocionesSection = () => (
    <section className="py-12 lg:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Promociones Vigentes
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Aprovecha nuestras ofertas especiales
          </p>
          
          {/* Aviso importante */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center">
              <Gift size={20} className="text-orange-600 mr-2" />
              <span className="text-orange-800 font-medium">
                Promociones válidas exclusivamente en tienda física
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {promocionesLanding.map(promocion => (
            <div key={promocion.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={promocion.imagen}
                  alt={promocion.titulo}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {promocion.tipo === 'porcentaje' ? `${promocion.descuento}% OFF` : 
                     promocion.tipo === 'envio_gratis' ? 'ENVÍO GRATIS' : 'COMBO'}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {promocion.titulo}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {promocion.descripcion}
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar size={16} className="mr-2" />
                    <span>
                      Válido hasta: {formatFecha(promocion.fechaFin)}
                    </span>
                  </div>
                </div>

                {/* Términos y condiciones */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">
                    Términos y Condiciones:
                  </h4>
                  <p className="text-xs text-gray-600">
                    {promocion.terminos}
                  </p>
                </div>

                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>

        {promocionesLanding.length === 0 && (
          <div className="text-center py-12">
            <Gift size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay promociones disponibles
            </h3>
            <p className="text-gray-500">
              ¡Pronto tendremos nuevas ofertas especiales para ti!
            </p>
          </div>
        )}
      </div>
    </section>
  );

  // Componente Perfil (requiere login)
  const PerfilSection = () => {
    if (!usuarioLogueado) {
      return (
        <section className="py-12 lg:py-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <User size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Área Personal
            </h2>
            <p className="text-gray-600 mb-8">
              Inicia sesión para acceder a tu historial de compras y beneficios
            </p>
            <button
              onClick={() => setModalLogin(true)}
              className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Iniciar Sesión
            </button>
          </div>
        </section>
      );
    }

    const totalPuntos = historialCompras.reduce((sum, compra) => sum + compra.puntos, 0);
    const totalGastado = historialCompras.reduce((sum, compra) => sum + compra.total, 0);

    return (
      <section className="py-12 lg:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Mi Área Personal
            </h2>
            <p className="text-lg text-gray-600">
              Gestiona tu historial y beneficios
            </p>
          </div>

          {/* Resumen de cuenta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* <div className="bg-blue-50 rounded-lg p-6 text-center">
              <Award size={32} className="mx-auto text-blue-600 mb-2" />
              <div className="text-2xl font-bold text-blue-900">{totalPuntos}</div>
              <div className="text-blue-700">Puntos Acumulados</div>
            </div> */}
            
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <ShoppingBag size={32} className="mx-auto text-green-600 mb-2" />
              <div className="text-2xl font-bold text-green-900">{historialCompras.length}</div>
              <div className="text-green-700">Compras Realizadas</div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-6 text-center">
              <CreditCard size={32} className="mx-auto text-purple-600 mb-2" />
              <div className="text-2xl font-bold text-purple-900">{formatPrecio(totalGastado)}</div>
              <div className="text-purple-700">Total Gastado</div>
            </div>
          </div>

          {/* Historial de compras */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Historial de Compras
              </h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {historialCompras.map(compra => (
                <div key={compra.id} className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-semibold text-gray-900">
                          Compra #{compra.id}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          compra.estado === 'completada' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {compra.estado === 'completada' ? 'Completada' : 'Pendiente'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatFecha(compra.fecha, true)}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {formatPrecio(compra.total)}
                      </div>
                      <div className="text-sm text-blue-600">
                        +{compra.puntos} puntos
                      </div>
                    </div>
                  </div>

                  {/* Productos */}
                  <div className="space-y-2 mb-4">
                    {compra.productos.map((producto, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">
                          {producto.cantidad}x {producto.nombre}
                        </span>
                        <span className="text-gray-900 font-medium">
                          {formatPrecio(producto.precio * producto.cantidad)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Garantía */}
                  {compra.garantia && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center">
                        <Shield size={16} className="text-green-600 mr-2" />
                        <span className="text-green-800 text-sm font-medium">
                          Garantía vigente hasta: {formatFecha(compra.garantia)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Componente Contacto
  const ContactoSection = () => (
    <section className="py-12 lg:py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Contáctanos
          </h2>
          <p className="text-lg text-gray-600">
            Estamos aquí para ayudarte con tus proyectos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Información de contacto */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Información de Contacto
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin size={20} className="text-blue-600 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900">Dirección</div>
                    <div className="text-gray-600">
                      Av. Providencia 1234, Santiago<br />
                      Región Metropolitana, Chile
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone size={20} className="text-blue-600 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900">Teléfono</div>
                    <div className="text-gray-600">+56 2 2345 6789</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Mail size={20} className="text-blue-600 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900">Email</div>
                    <div className="text-gray-600">contacto@ferremarket.cl</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock size={20} className="text-blue-600 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900">Horarios</div>
                    <div className="text-gray-600">
                      Lunes a Viernes: 8:00 - 19:00<br />
                      Sábados: 8:00 - 17:00<br />
                      Domingos: 9:00 - 15:00
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mapa placeholder */}
            <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin size={48} className="mx-auto mb-2" />
                <div>Mapa de ubicación</div>
              </div>
            </div>
          </div>

          {/* Formulario de contacto */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Envíanos un Mensaje
            </h3>
            
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asunto
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="¿En qué podemos ayudarte?"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Escribe tu mensaje aquí..."
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );

  // Modal de Detalle del Producto
  const ModalDetalleProducto = () => {
    if (!modalProducto || !productoSeleccionado) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">
              Detalle del Producto
            </h2>
            <button
              onClick={() => setModalProducto(false)}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Imagen del producto */}
              <div className="space-y-4">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={productoSeleccionado.imagen}
                    alt={productoSeleccionado.nombre}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {/* Acciones */}
                <div className="flex gap-3">
                  <button
                    onClick={() => toggleFavorito(productoSeleccionado.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                      productosFavoritos.includes(productoSeleccionado.id)
                        ? 'bg-red-50 border-red-200 text-red-600'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Heart 
                      size={20} 
                      className={productosFavoritos.includes(productoSeleccionado.id) ? 'fill-current' : ''} 
                    />
                    {productosFavoritos.includes(productoSeleccionado.id) ? 'Favorito' : 'Agregar a Favoritos'}
                  </button>
                  
                  <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                    <Share2 size={20} />
                    Compartir
                  </button>
                </div>
              </div>

              {/* Información del producto */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {productoSeleccionado.nombre}
                  </h1>
                  <p className="text-sm text-gray-500 mb-4">
                    {productoSeleccionado.sku}
                  </p>
                </div>

                {/* Precio */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="text-3xl font-bold text-orange-600">
                    {formatPrecio(productoSeleccionado.precio)}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Precio incluye IVA
                  </p>
                </div>

                {/* Stock */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {productoSeleccionado.stock > 0 ? (
                      <CheckCircle size={20} className="text-green-500" />
                    ) : (
                      <XCircle size={20} className="text-red-500" />
                    )}
                    <span className={`font-medium ${
                      productoSeleccionado.stock > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {productoSeleccionado.stock > 0 
                        ? `${productoSeleccionado.stock} disponibles`
                        : 'Sin stock'
                      }
                    </span>
                  </div>
                  
                  {productoSeleccionado.stock <= 5 && productoSeleccionado.stock > 0 && (
                    <div className="flex items-center gap-1 text-orange-600">
                      <AlertCircle size={16} />
                      <span className="text-sm">Últimas unidades</span>
                    </div>
                  )}
                </div>

                {/* Descripción */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Descripción
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {productoSeleccionado.descripcion}
                  </p>
                </div>

                {/* Información adicional */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Shield size={20} className="text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">
                        Garantía y Soporte
                      </h4>
                      <p className="text-sm text-blue-800">
                        • Garantía del fabricante incluida<br/>
                        • Soporte técnico especializado<br/>
                        • Devoluciones hasta 30 días
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal de Login/Registro
  const ModalLogin = () => {
    const [tabActiva, setTabActiva] = useState<'login' | 'registro'>('login');
    const [formLogin, setFormLogin] = useState({ email: '', password: '' });
    const [formRegistro, setFormRegistro] = useState({ 
      nombre: '', 
      apellido: '', 
      email: '', 
      telefono: '', 
      password: '', 
      confirmPassword: '' 
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      
      try {
        // Añadir delay de 1.5 segundos para mostrar la animación
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        signInUser(formLogin.email, formLogin.password)
        .then(async (session) => {
            if (session.data.session) {
                const { user } = session.data.session;
                await obtenerUsuarioIdByUUID(user.id)
            }

            await new Promise(resolve => setTimeout(resolve, 500));

            setUsuarioLogueado(true);
            setModalLogin(false);
            setSeccionActiva('perfil');
            toast.success('¡Inicio de sesión exitoso!');
            console.log('Sesión iniciada:', session);
        })
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        toast.error('Error al iniciar sesión. Verifica tus credenciales.');
      } finally {
        setIsLoading(false);
      }
    };

    const handleRegistro = (e: React.FormEvent) => {
      e.preventDefault();
      
      // Validar que las contraseñas coincidan
      if (formRegistro.password !== formRegistro.confirmPassword) {
        // alert('Las contraseñas no coinciden');
        toast.error('Las contraseñas no coinciden');
        return;
      }

      // Simulación de registro exitoso
      setUsuarioLogueado(true);
      setModalLogin(false);
      setSeccionActiva('perfil');
      alert('¡Registro exitoso! Bienvenido a FerreMarket');
    };

    if (!modalLogin) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {tabActiva === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </h2>
            <button
              onClick={() => setModalLogin(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={24} />
            </button>
          </div>

          {/* Pestañas */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1 border">
            <button
              onClick={() => setTabActiva('login')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                tabActiva === 'login'
                  ? 'bg-orange-500 text-white shadow-md transform scale-105'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <LogIn size={16} className="inline mr-2" />
              Iniciar Sesión
            </button>
            <button
              onClick={() => setTabActiva('registro')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                tabActiva === 'registro'
                  ? 'bg-orange-500 text-white shadow-md transform scale-105'
                  : 'text-gray-700 hover:text-amber-700 hover:bg-gray-50'
              }`}
            >
              <User size={16} className="inline mr-2" />
              Crear Cuenta
            </button>
          </div>

          {/* Indicador visual de la pestaña activa */}
          {/* <div className="mb-4 text-center">
            <p className="text-sm text-gray-600">
              {tabActiva === 'login' 
                ? '¿No tienes cuenta? Haz clic en "Crear Cuenta" arriba' 
                : '¿Ya tienes cuenta? Haz clic en "Iniciar Sesión" arriba'
              }
            </p>
          </div> */}

          {/* Formulario de Login */}
          {tabActiva === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formLogin.email}
                  onChange={(e) => setFormLogin(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="tu@email.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={formLogin.password}
                  onChange={(e) => setFormLogin(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 transform ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed scale-95' 
                    : 'bg-orange-500 hover:bg-amber-700 hover:scale-105 active:scale-95'
                } text-white`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader className="animate-spin" size={20} />
                    <span>Iniciando sesión...</span>
                  </div>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </form>
          )}

          {/* Formulario de Registro */}
          {tabActiva === 'registro' && (
            <form onSubmit={handleRegistro} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={formRegistro.nombre}
                    onChange={(e) => setFormRegistro(prev => ({ ...prev, nombre: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Juan"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido
                  </label>
                  <input
                    type="text"
                    value={formRegistro.apellido}
                    onChange={(e) => setFormRegistro(prev => ({ ...prev, apellido: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Pérez"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formRegistro.email}
                  onChange={(e) => setFormRegistro(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="juan@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formRegistro.telefono}
                  onChange={(e) => setFormRegistro(prev => ({ ...prev, telefono: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+56 9 1234 5678"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={formRegistro.password}
                  onChange={(e) => setFormRegistro(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  value={formRegistro.confirmPassword}
                  onChange={(e) => setFormRegistro(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
              </div>

              {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  Al registrarte, aceptas nuestros términos y condiciones. 
                  Tu información personal será protegida según nuestra política de privacidad.
                </p>
              </div> */}

              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-amber-700 transition-colors font-medium"
              >
                Crear Cuenta
              </button>
            </form>
          )}

          {/* Enlaces adicionales solo para login */}
          {tabActiva === 'login' && (
            <div className="mt-4 space-y-3 text-center">
              <button className="text-sm text-blue-600 hover:text-blue-700 block">
                ¿Olvidaste tu contraseña?
              </button>
              <div className="border-t pt-3">
                <p className="text-sm text-gray-600 mb-2">¿No tienes una cuenta?</p>
                <button
                  onClick={() => setTabActiva('registro')}
                  className="text-sm text-orange-500 hover:text-amber-700 font-medium"
                >
                  Crear cuenta gratis →
                </button>
              </div>
            </div>
          )}

          {/* Enlace para volver al login desde registro */}
          {tabActiva === 'registro' && (
            <div className="mt-4 text-center border-t pt-3">
              <p className="text-sm text-gray-600 mb-2">¿Ya tienes una cuenta?</p>
              <button
                onClick={() => setTabActiva('login')}
                className="text-sm text-orange-500 hover:text-amber-700 font-medium"
              >
                Iniciar sesión →
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Footer
  const Footer = () => (
    <footer className="bg-neutral-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Home size={20} className="text-white" />
              </div>
              <div>
                <div className="text-lg font-bold text-orange-400">Ferre</div>
                <div className="text-lg font-bold text-white">Market</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Tu ferretería de confianza desde 2000. Calidad, variedad y el mejor servicio para todos tus proyectos.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => setSeccionActiva('productos')} className="text-gray-400 hover:text-white">Productos</button></li>
              <li><button onClick={() => setSeccionActiva('promociones')} className="text-gray-400 hover:text-white">Promociones</button></li>
              <li><button onClick={() => setSeccionActiva('contacto')} className="text-gray-400 hover:text-white">Contacto</button></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Términos y Condiciones</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Av. Providencia 1234, Santiago</li>
              <li>+56 2 2345 6789</li>
              <li>contacto@ferremarket.cl</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Horarios</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Lun - Vie: 8:00 - 19:00</li>
              <li>Sábados: 8:00 - 17:00</li>
              <li>Domingos: 9:00 - 15:00</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 FerreMarket. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );

  // Renderizado principal
  const renderSeccion = () => {
    switch (seccionActiva) {
      case 'productos':
        return <ProductosSection />;
      case 'promociones':
        return <PromocionesSection />;
      case 'perfil':
        return <PerfilSection />;
      case 'contacto':
        return <ContactoSection />;
      default:
        return (
          <>
            <HeroSection />
            <CaracteristicasSection />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {renderSeccion()}
      </main>
      <Footer />
      <ModalDetalleProducto />
      <ModalLogin />
    </div>
  );
};

export default Landing;