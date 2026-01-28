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
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{client.name}</h3>
                        {client.visto === 1 && (
                            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-green-500 mt-1.5 ml-2" title="Visto"></span>
                        )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2 leading-tight">
                        {client.address}
                    </p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                            <strong>Tel:</strong> {client.phone}
                        </span>
                        <span className="flex items-center gap-1">
                            <strong>Consumo:</strong> {client.amount.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
                        </span>
                    </div>
                    {client.distance !== undefined && (
                        <p className="text-[11px] font-bold text-blue-700 dark:text-blue-400 mt-1.5 flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {(client.distance / 1000).toFixed(2)} km de distancia
                        </p>
                    )}
                </li>
            ))}
        </>
    );
};

export default ClientList;