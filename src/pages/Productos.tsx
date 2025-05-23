import React from 'react';

const Productos: React.FC = () => {
    return (
        <div className="space-y-6">
            <br></br>
            <br></br>
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
                <p className="text-gray-700 mt-1 text-base">
                    Aquí puedes gestionar todos los productos de tu tienda.
                </p>
            </div>

            {/* Aquí puedes agregar más componentes relacionados con productos */}
        </div>
    )
}

export default Productos;