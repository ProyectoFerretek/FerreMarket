import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
    titulo: string;
    mensaje: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    titulo,
    mensaje,
    onConfirm,
    onCancel,
    isLoading = false
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-md w-full mx-4">
                <div className="p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-lg font-medium text-gray-900">{titulo}</h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">{mensaje}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Eliminando...
                            </>
                        ) : (
                            'Eliminar'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;