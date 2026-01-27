import React from 'react';
import { SOLAR_KITS } from '../constants';

interface KitSelectionStepProps {
    selectedKitId: string | null;
    onSelect: (id: string) => void;
}

const KitSelectionStep: React.FC<KitSelectionStepProps> = ({ selectedKitId, onSelect }) => {
    return (
        <section>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">Elige tu Kit Solar</h2>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
                {SOLAR_KITS.map((kit) => (
                    <button
                        key={kit.id}
                        onClick={() => onSelect(kit.id)}
                        className={`text-left border-2 rounded-2xl p-6 transition-all duration-300 flex flex-col h-full relative group ${
                            selectedKitId === kit.id
                                ? 'border-blue-500 bg-white dark:bg-slate-800 shadow-xl ring-4 ring-blue-500/10'
                                : 'border-slate-200 bg-white hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600'
                        }`}
                    >
                        {selectedKitId === kit.id && (
                            <div className="absolute -top-3 -right-3 bg-blue-500 text-white p-1 rounded-full shadow-lg z-10">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{kit.name}</h3>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-[10px] font-bold uppercase tracking-wide">
                                        Potencia: {kit.power}
                                    </span>
                                    <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-full text-[10px] font-bold uppercase tracking-wide">
                                        Generación: {kit.id === 'kit-custom' ? kit.estimatedProduction : `~${kit.estimatedProduction}`}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 flex-grow">
                            {kit.description}
                        </p>

                        <div className="space-y-2 mb-6">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">¿Qué incluye?</h4>
                            <ul className="grid grid-cols-1 gap-1">
                                {kit.features.map((feature, idx) => (
                                    <li key={idx} className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-auto pt-4 border-t border-dashed dark:border-slate-700">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Inversión Estimada</p>
                            {kit.id === 'kit-custom' ? (
                                <p className="text-sm italic font-medium text-blue-600 dark:text-blue-400 mt-1 leading-snug">
                                    La inversión estimada es la inversión de un kit más las modificaciones.
                                </p>
                            ) : (
                                <p className="text-3xl font-black text-blue-600 dark:text-blue-400">
                                    {kit.cost.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
                                </p>
                            )}
                        </div>
                    </button>
                ))}
            </div>
        </section>
    );
};

export default KitSelectionStep;