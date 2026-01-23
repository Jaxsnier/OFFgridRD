import React from 'react';
import { FinancialAnalysis } from '../types';

interface ROIDashboardProps {
    analysis: FinancialAnalysis;
}

const ROIDashboard: React.FC<ROIDashboardProps> = ({ analysis }) => {
    
    const formattedCurrency = (val: number) => 
        val.toLocaleString('es-DO', { style: 'currency', currency: 'DOP', maximumFractionDigits: 0 });

    const whatsAppMessage = encodeURIComponent(
        `¡Hola OFFgridRD! He analizado mi factura de ${formattedCurrency(analysis.monthlyBill)} en su web.\n\n` +
        `Resultados proyectados:\n` +
        `- Consumo: ${analysis.monthlyConsumptionKwh} kWh/mes\n` +
        `- Sistema necesario: ${analysis.systemSizekWp} kWp (${analysis.panelCount} paneles)\n` +
        `- Retorno de inversión: ${analysis.roiYears} años\n` +
        `- Ahorro a 25 años: ${formattedCurrency(analysis.totalProfit25Years)}\n\n` +
        `Quisiera una visita técnica para validar estos datos.`
    );

    return (
        <div className="space-y-8 mt-8">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    label="Consumo Estimado" 
                    value={`${analysis.monthlyConsumptionKwh} kWh`} 
                    subText="Al mes"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                />
                <StatCard 
                    label="Gasto Anual Actual" 
                    value={formattedCurrency(analysis.annualSpend)} 
                    subText="Sin paneles solares"
                    color="text-red-500"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 12v-1m0 1v.01M12 16v-1m0 1v.01" /></svg>}
                />
                <StatCard 
                    label="Recuperación (ROI)" 
                    value={`${analysis.roiYears} años`} 
                    subText="Tiempo de amortización"
                    color="text-blue-600"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <StatCard 
                    label="Ganancia a 25 años" 
                    value={formattedCurrency(analysis.totalProfit25Years)} 
                    subText="Ahorro neto total"
                    color="text-green-600"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Visual Chart Area */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                        </svg>
                        Comparativa de Gasto Acumulado (15 años)
                    </h3>
                    
                    <div className="relative h-72 w-full flex items-end justify-between gap-1 pt-10">
                        <SimpleBarChart analysis={analysis} />
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-slate-400 dark:bg-slate-600 rounded-sm"></span>
                            <span className="text-slate-600 dark:text-slate-400">Gasto Red Eléctrica</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-orange-400 rounded-sm"></span>
                            <span className="text-slate-600 dark:text-slate-400">En período de ROI</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-green-500 rounded-sm"></span>
                            <span className="text-slate-600 dark:text-slate-400">Inversión Recuperada (Ahorro Puro)</span>
                        </div>
                    </div>
                </div>

                {/* Investment Breakdown */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border dark:border-slate-700 h-full flex flex-col">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Detalle del Proyecto</h3>
                    <div className="space-y-4 flex-grow">
                        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Capacidad Sugerida</p>
                            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{analysis.systemSizekWp} kWp</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{analysis.panelCount} paneles de 600W</p>
                        </div>
                        
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600 dark:text-slate-400">Inversión Estimada:</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{formattedCurrency(analysis.estimatedInvestment)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600 dark:text-slate-400">Ahorro Mensual:</span>
                                <span className="font-bold text-green-600">{formattedCurrency(analysis.monthlyBill)}</span>
                            </div>
                            <div className="flex justify-between text-sm border-t dark:border-slate-700 pt-2 mt-2">
                                <span className="text-slate-600 dark:text-slate-400 italic text-xs">Tarifa Aplicada:</span>
                                <span className="text-slate-500 dark:text-slate-400 text-xs">BTS1 (Escalonada)</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <a
                            href={`https://wa.me/18296392616?text=${whatsAppMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-green-500/20 transition-all hover:scale-[1.02]"
                        >
                            Validar con un técnico
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard: React.FC<{label: string, value: string, subText: string, color?: string, icon: React.ReactNode}> = ({ label, value, subText, color = "text-slate-800 dark:text-slate-100", icon }) => (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border dark:border-slate-700">
        <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400">
                {icon}
            </div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">{label}</span>
        </div>
        <div className={`text-2xl font-black ${color}`}>{value}</div>
        <div className="text-xs text-slate-400 mt-1">{subText}</div>
    </div>
);

const SimpleBarChart: React.FC<{analysis: FinancialAnalysis}> = ({ analysis }) => {
    // Generamos años del 1 al 15
    const years = Array.from({ length: 15 }, (_, i) => i + 1);
    const maxVal = analysis.annualSpend * 15;
    
    return (
        <div className="w-full h-full flex items-end justify-between px-1">
            {years.map(year => {
                const costWithout = (analysis.annualSpend * year);
                const isPaid = year >= analysis.roiYears;
                
                const heightWithout = (costWithout / maxVal) * 100;
                // La inversión es constante en el tiempo para la comparación visual
                const costWith = analysis.estimatedInvestment;
                const heightWith = (costWith / maxVal) * 100;

                return (
                    <div key={year} className="flex flex-col items-center flex-1 gap-1 group relative">
                        {/* Tooltip simple al hacer hover */}
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none whitespace-nowrap">
                            Año {year}: {isPaid ? '¡Recuperado!' : 'Pagando ROI'}
                        </div>
                        
                        <div className="relative w-full flex justify-center items-end gap-[1px] h-48">
                            {/* Barra Gasto Red */}
                            <div 
                                className="w-[6px] md:w-3 bg-slate-400 dark:bg-slate-600 rounded-t-sm"
                                style={{ height: `${heightWithout}%` }}
                            />
                            {/* Barra Solar */}
                            <div 
                                className={`w-[6px] md:w-3 rounded-t-sm transition-all duration-700 ${isPaid ? 'bg-green-500' : 'bg-orange-400'}`}
                                style={{ height: `${heightWith}%` }}
                            />
                        </div>
                        <span className={`text-[8px] md:text-[10px] font-bold ${year % 2 === 0 ? 'text-slate-400' : 'text-slate-500'}`}>
                            {year}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default ROIDashboard;