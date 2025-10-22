import React from 'react';
import { Client } from '../../types';

interface ClientListProps {
    paginatedClients: Client[];
    selectedClientId: string | null;
    onClientSelect: (client: Client | null) => void;
}

const ClientList: React.FC<ClientListProps> = ({ paginatedClients, selectedClientId, onClientSelect }) => {
    if (paginatedClients.length === 0) {
        return <li className="text-center text-slate-500 dark:text-slate-400 py-4">No se encontraron clientes.</li>;
    }

    return (
        <>
            {paginatedClients.map(client => (
                <li
                    key={client.id}
                    id={`client-${client.id}`}
                    onClick={() => onClientSelect(client)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClientSelect(client); }}
                    role="button"
                    tabIndex={0}
                    className={`p-3 rounded-lg shadow-sm transition-all cursor-pointer ${selectedClientId === client.id ? 'bg-blue-100 border-2 border-blue-400 dark:bg-blue-900/50 dark:border-blue-500' : 'bg-white dark:bg-slate-700/50 border dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">{client.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Tel: {client.phone}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Consumo: {client.amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</p>
                    {client.distance !== undefined && (
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mt-1">
                            Distancia: {(client.distance / 1000).toFixed(2)} km
                        </p>
                    )}
                </li>
            ))}
        </>
    );
};

export default ClientList;
