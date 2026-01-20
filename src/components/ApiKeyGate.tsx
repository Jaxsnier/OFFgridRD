
import React, { useState, useEffect } from 'react';

interface ApiKeyGateProps {
    onSubmit: (apiKey: string) => void;
    error: string;
    isLoading: boolean;
    initialValue?: string;
}

const ApiKeyGate: React.FC<ApiKeyGateProps> = ({ onSubmit, error, isLoading, initialValue = '' }) => {
    const [inputValue, setInputValue] = useState(initialValue);

    // Update internal state if initialValue changes (e.g. after DB fetch)
    useEffect(() => {
        if (initialValue) {
            setInputValue(initialValue);
        }
    }, [initialValue]);

    const handleKeySubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onSubmit(inputValue.trim());
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-slate-50 dark:bg-slate-900">
                <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-slate-800 rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Procesando...</h2>
                    <p className="text-slate-600 dark:text-slate-400">Validando la clave de API y preparando el entorno. Por favor, espere.</p>
                    <div className="relative mt-4">
                        <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="flex items-center justify-center h-full bg-slate-50 dark:bg-slate-900 p-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl transition-all duration-300">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Configuración del Mapa</h2>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                        Ingresa tu clave de Google Maps para habilitar las funciones de geolocalización.
                    </p>
                </div>

                <form onSubmit={handleKeySubmit} className="space-y-4">
                    <div>
                        <label htmlFor="apiKey" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            Google Maps API Key
                        </label>
                        <input
                            id="apiKey"
                            name="apiKey"
                            type="password"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            required
                            className={`w-full px-4 py-3 border rounded-xl shadow-sm outline-none transition-all dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500 ${
                                error 
                                    ? 'border-red-300 focus:ring-2 focus:ring-red-500/20 focus:border-red-500' 
                                    : 'border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:border-slate-600'
                            }`}
                            placeholder="AIza..."
                        />
                    </div>
                    
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm font-medium animate-[fadeIn_0.3s_ease-out]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full flex justify-center items-center gap-2 px-6 py-3.5 font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg hover:shadow-blue-500/30"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Cargar Mapa
                    </button>
                    
                    <p className="text-center text-xs text-slate-500 dark:text-slate-500 mt-4">
                        Tu clave se guardará de forma segura en tu perfil una vez validada.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default ApiKeyGate;
