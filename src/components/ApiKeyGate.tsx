import React from 'react';

interface ApiKeyGateProps {
    onSubmit: (apiKey: string) => void;
    error: string;
    isLoading: boolean;
}

const ApiKeyGate: React.FC<ApiKeyGateProps> = ({ onSubmit, error, isLoading }) => {

    const handleKeySubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const input = (e.currentTarget.elements.namedItem('apiKey') as HTMLInputElement);
        if (input && input.value.trim()) {
            onSubmit(input.value.trim());
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-slate-50 dark:bg-slate-900">
                <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-slate-800 rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Cargando Mapa...</h2>
                    <p className="text-slate-600 dark:text-slate-400">Validando la clave de API y preparando el entorno. Por favor, espere.</p>
                    <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mt-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            </div>
        );
    }
    
    return (
        <div className="flex items-center justify-center h-full bg-slate-50 dark:bg-slate-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-200">Configuración Requerida</h2>
                <p className="text-center text-slate-600 dark:text-slate-400">
                    Para visualizar el mapa, por favor ingresa tu clave de API de Google Maps.
                </p>
                <form onSubmit={handleKeySubmit}>
                    <div>
                        <label htmlFor="apiKey" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Google Maps API Key
                        </label>
                        <input
                            id="apiKey"
                            name="apiKey"
                            type="password"
                            required
                            className="w-full px-3 py-2 mt-1 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:placeholder-slate-400"
                            placeholder="Pega tu clave aquí (comienza con AIza...)"
                        />
                    </div>
                    {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="w-full px-4 py-2 mt-6 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cargar Mapa
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ApiKeyGate;