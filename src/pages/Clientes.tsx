import React from 'react';

const Clientes: React.FC = () => {
    return (
        <div className="space-y-6">
            <br></br>
            <br></br>
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
                <p className="text-gray-700 mt-1 text-base">
                    Aquí puedes gestionar todos los clientes de tu tienda.
                </p>
            </div>

            {/* Aquí puedes agregar más componentes relacionados con clientes */}
        </div>
    )
}

export default Clientes;