import React from 'react';

interface SummaryItem {
    name: string;
    cost: number;
}

interface CostSummaryProps {
    items: SummaryItem[];
    total: number;
}

const CostSummary: React.FC<CostSummaryProps> = ({ items, total }) => {
    
    const getWhatsAppMessage = () => {
        let message = `¡Hola! He personalizado una instalación en su web y quisiera una cotización formal. Este es mi resumen:\n\n`;
        
        items.forEach(item => {
            const costStr = item.cost === 0 ? 'Por definir' : item.cost.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' });
            message += `* ${item.name}: ${costStr}\n`;
        });
        
        const totalStr = total === 0 ? 'Sujeto a evaluación' : total.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' });
        message += `\n*TOTAL ESTIMADO:* ${totalStr}\n\n`;
        message += `¡Espero su contacto!`;

        return encodeURIComponent(message);
    };

    const hasCustomKit = items.some(item => item.name === 'Kit Personalizado');

    return (
        <div className="sticky top-8 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 border-b pb-3 mb-4 dark:border-slate-600">Resumen de tu Instalación</h3>
            {items.length === 0 ? (
                <div className="text-center py-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Selecciona componentes para ver el resumen aquí.</p>
                </div>

            ) : (
                <ul className="space-y-3 mb-4">
                    {items.map(item => (
                        <li key={item.name} className="flex justify-between items-center text-sm">
                            <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                                {item.cost === 0 ? 'Por definir' : item.cost.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
            <div className="border-t-2 border-dashed pt-4 mt-4 dark:border-slate-600">
                <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-slate-900 dark:text-slate-100">Total Estimado</span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {(total === 0 && hasCustomKit) ? 'Pendiente' : total.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
                    </span>
                </div>
                {hasCustomKit && (
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 italic">
                        * Inversión final sujeta a evaluación técnica del proyecto personalizado.
                    </p>
                )}
            </div>
            <div className="mt-6">
                <a
                    href={`https://wa.me/18296392616?text=${getWhatsAppMessage()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full inline-flex items-center justify-center gap-3 bg-[#25D366] text-white font-bold text-md px-6 py-3 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300 ${items.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={(e) => { if (items.length === 0) e.preventDefault(); }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.452-4.43-9.887-9.887-9.887-5.452 0-9.886 4.434-9.889 9.886-.001 2.269.655 4.398 1.905 6.101l-1.217 4.432 4.515-1.182z" /></svg>
                    Contactar para Cotización
                </a>
            </div>
        </div>
    );
};

export default CostSummary;