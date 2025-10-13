import React from 'react';

const LoadingOverlay: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-[9999]">
            <div className="bg-white p-8 rounded-lg shadow-xl text-center">
                <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <h2 className="text-xl font-bold text-slate-800 mt-4">Procesando Archivo...</h2>
                <p className="text-slate-600 mt-2">Esto puede tardar unos segundos, por favor espere.</p>
            </div>
        </div>
    );
};

export default LoadingOverlay;
