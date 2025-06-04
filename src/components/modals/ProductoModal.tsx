import React, { useState, useEffect } from 'react';
import { X, Upload, AlertCircle } from 'lucide-react';
import { Categoria } from '../../types';

interface ProductoModalProps {
    producto?: any;
    onClose: () => void;
    categorias: Categoria[];
}

const ProductoModal: React.FC<ProductoModalProps> = ({ producto, onClose, categorias }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        categoria: '',
        precio: '',
        stock: '',
        estado: true,
        imagen: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [imagenPreview, setImagenPreview] = useState('');

    useEffect(() => {
        if (producto) {
            setFormData({
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                categoria: producto.categoria,
                precio: producto.precio.toString(),
                stock: producto.stock.toString(),
                estado: producto.destacado,
                imagen: producto.imagen
            });
            setImagenPreview(producto.imagen);
        }
    }, [producto]);

    const validarFormulario = () => {
        const nuevosErrores: Record<string, string> = {};

        if (!formData.nombre.trim()) {
            nuevosErrores.nombre = 'El nombre es obligatorio';
        }
        if (!formData.descripcion.trim()) {
            nuevosErrores.descripcion = 'La descripción es obligatoria';
        }
        if (!formData.categoria) {
            nuevosErrores.categoria = 'La categoría es obligatoria';
        }
        if (!formData.precio || isNaN(Number(formData.precio)) || Number(formData.precio) <= 0) {
            nuevosErrores.precio = 'Ingrese un precio válido';
        }
        if (!formData.stock || isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
            nuevosErrores.stock = 'Ingrese un stock válido';
        }
        if (!formData.imagen) {
            nuevosErrores.imagen = 'La imagen es obligatoria';
        }

        setErrors(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validarFormulario()) {
            // Aquí iría la lógica para guardar el producto
            console.log('Guardando producto:', formData);
            onClose();
        }
    };

    const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Aquí iría la lógica para subir la imagen
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagenPreview(reader.result as string);
                setFormData(prev => ({ ...prev, imagen: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {producto ? 'Editar Producto' : 'Nuevo Producto'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Imagen */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Imagen del producto
                        </label>
                        <div className="flex items-center space-x-4">
                            <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                                {imagenPreview ? (
                                    <img
                                        src={imagenPreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-center">
                                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                        <span className="mt-2 block text-xs text-gray-600">
                                            Subir imagen
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImagenChange}
                                    className="hidden"
                                    id="imagen-producto"
                                />
                                <label
                                    htmlFor="imagen-producto"
                                    className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                                >
                                    Seleccionar archivo
                                </label>
                                {errors.imagen && (
                                    <p className="mt-1 text-xs text-red-600 flex items-center">
                                        <AlertCircle size={14} className="mr-1" />
                                        {errors.imagen}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre
                        </label>
                        <input
                            type="text"
                            value={formData.nombre}
                            onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.nombre && (
                            <p className="mt-1 text-xs text-red-600 flex items-center">
                                <AlertCircle size={14} className="mr-1" />
                                {errors.nombre}
                            </p>
                        )}
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Descripción
                        </label>
                        <textarea
                            value={formData.descripcion}
                            onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.descripcion && (
                            <p className="mt-1 text-xs text-red-600 flex items-center">
                                <AlertCircle size={14} className="mr-1" />
                                {errors.descripcion}
                            </p>
                        )}
                    </div>

                    {/* Categoría */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Categoría
                        </label>
                        <select
                            value={formData.categoria}
                            onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="">Seleccionar categoría</option>
                            {categorias.map(categoria => (
                                <option key={categoria.id} value={categoria.id}>
                                    {categoria.nombre}
                                </option>
                            ))}
                        </select>
                        {errors.categoria && (
                            <p className="mt-1 text-xs text-red-600 flex items-center">
                                <AlertCircle size={14} className="mr-1" />
                                {errors.categoria}
                            </p>
                        )}
                    </div>

                    {/* Precio y Stock */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Precio
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">$</span>
                                </div>
                                <input
                                    type="text"
                                    value={formData.precio}
                                    onChange={(e) => setFormData(prev => ({ ...prev, precio: e.target.value }))}
                                    className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            {errors.precio && (
                                <p className="mt-1 text-xs text-red-600 flex items-center">
                                    <AlertCircle size={14} className="mr-1" />
                                    {errors.precio}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Stock
                            </label>
                            <input
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            {errors.stock && (
                                <p className="mt-1 text-xs text-red-600 flex items-center">
                                    <AlertCircle size={14} className="mr-1" />
                                    {errors.stock}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Estado */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={formData.estado}
                            onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.checked }))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">
                            Producto activo
                        </label>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {producto ? 'Guardar cambios' : 'Crear producto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductoModal;