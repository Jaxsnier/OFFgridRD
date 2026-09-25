import React from 'react';
import { QuoteInput } from '../../types';

interface ClientInfoSectionProps {
    input: QuoteInput;
    onChange: (updated: Partial<QuoteInput>) => void;
    onClientChange: (field: string, value: string) => void;
}

export const ClientInfoSection: React.FC<ClientInfoSectionProps> = ({
    input,
    onChange,
    onClientChange
}) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        Datos del Cliente y Propuesta
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Información que aparecerá en el encabezado de la cotización formal
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Nombre del Cliente *
                    </label>
                    <input
                        type="text"
                        value={input.client.name}
                        onChange={(e) => onClientChange('name', e.target.value)}
                        placeholder="Ej. Ing. Carlos Martínez"
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Teléfono / WhatsApp
                    </label>
                    <input
                        type="text"
                        value={input.client.phone}
                        onChange={(e) => onClientChange('phone', e.target.value)}
                        placeholder="Ej. (809) 555-0123"
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Ubicación / Ciudad
                    </label>
                    <input
                        type="text"
                        value={input.client.location}
                        onChange={(e) => onClientChange('location', e.target.value)}
                        placeholder="Ej. Santo Domingo Este / Santiago"
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Nº de Cotización
                    </label>
                    <input
                        type="text"
                        value={input.client.quoteNumber}
                        onChange={(e) => onClientChange('quoteNumber', e.target.value)}
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono transition"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Fecha de Emisión
                    </label>
                    <input
                        type="date"
                        value={input.client.date}
                        onChange={(e) => onClientChange('date', e.target.value)}
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Moneda de Presentación
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => onChange({ currency: 'USD' })}
                            className={`py-2 text-xs font-bold rounded-lg border transition ${
                                input.currency === 'USD'
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'
                            }`}
                        >
                            Dólares (USD)
                        </button>
                        <button
                            type="button"
                            onClick={() => onChange({ currency: 'DOP' })}
                            className={`py-2 text-xs font-bold rounded-lg border transition ${
                                input.currency === 'DOP'
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'
                            }`}
                        >
                            Pesos (RD$)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientInfoSection;
