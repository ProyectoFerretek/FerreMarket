import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface ClienteModalProps {
    cliente?: any;
    onClose: () => void;
}

const ClienteModal: React.FC<ClienteModalProps> = ({ cliente, onClose }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        notas: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (cliente) {
            setFormData({
                nombre: cliente.nombre,
                email: cliente.email,
                telefono: cliente.telefono,
                direccion: cliente.direccion,
                notas: cliente.notas || ''
            });
        }
    }, [cliente]);

    const validarFormulario = () => {
        const nuevosErrores: Record<string, string> = {};

        if (!formData.nombre.trim()) {
            nuevosErrores.nombre = 'El nombre es obligatorio';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim() || !emailRegex.test(formData.email)) {
            nuevosErrores.email = 'Email inválido';
        }

        const telefonoRegex = /^\+?[\d\s-]{9,}$/;
        if (!formData.telefono.trim() || !telefonoRegex.test(formData.telefono)) {
            nuevosErrores.telefono = 'Teléfono inválido';
        }

        if (!formData.direccion.trim()) {
            nuevosErrores.direccion = 'La dirección es obligatoria';
        }

        setErrors(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validarFormulario()) {
            // Aquí iría la lógica para guardar el cliente
            console.log('Guardando cliente:', formData);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {cliente ? 'Editar Cliente' : 'Nuevo Cliente'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre completo
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

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-600 flex items-center">
                                <AlertCircle size={14} className="mr-1" />
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Teléfono */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Teléfono
                        </label>
                        <input
                            type="tel"
                            value={formData.telefono}
                            onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                            placeholder="+56 9 1234 5678"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.telefono && (
                            <p className="mt-1 text-xs text-red-600 flex items-center">
                                <AlertCircle size={14} className="mr-1" />
                                {errors.telefono}
                            </p>
                        )}
                    </div>

                    {/* Dirección */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Dirección
                        </label>
                        <input
                            type="text"
                            value={formData.direccion}
                            onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.direccion && (
                            <p className="mt-1 text-xs text-red-600 flex items-center">
                                <AlertCircle size={14} className="mr-1" />
                                {errors.direccion}
                            </p>
                        )}
                    </div>

                    {/* Notas */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Notas adicionales
                        </label>
                        <textarea
                            value={formData.notas}
                            onChange={(e) => setFormData(prev => ({ ...prev, notas: e.target.value }))}
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
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
                            {cliente ? 'Guardar cambios' : 'Crear cliente'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClienteModal;