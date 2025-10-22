import React from 'react';
import { SystemEstimate } from '../types';

interface EstimateCardProps {
    estimate: SystemEstimate;
    isRecommended?: boolean;
    isSelected?: boolean;
    onSelect?: (title: string) => void;
}

const EstimateCard: React.FC<EstimateCardProps> = ({ estimate, isRecommended = false, isSelected = false, onSelect }) => (
    <button
        type="button"
        onClick={() => onSelect && onSelect(estimate.title)}
        className={`relative text-left border-2 rounded-xl p-6 flex flex-col h-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
            isSelected 
                ? 'border-blue-500 bg-white dark:bg-slate-800 shadow-xl ring-blue-500/50' 
                : isRecommended 
                ? 'border-green-500 bg-green-50 dark:border-green-500/50 dark:bg-green-900/20 shadow-lg' 
                : 'border-slate-200 bg-white hover:shadow-md hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600'
        }`}
    >
        {isRecommended && (
            <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Recomendado
            </div>
        )}
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2 text-center">{estimate.title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 flex-grow text-center">{estimate.description}</p>
        
        <ul className="space-y-3 text-sm mb-6">
            <li className="flex items-center justify-between border-b dark:border-slate-600 pb-2"><span className="text-slate-600 dark:text-slate-400">Sistema:</span> <strong className="text-slate-800 dark:text-slate-200">{estimate.systemSize} kWp</strong></li>
            <li className="flex items-center justify-between border-b dark:border-slate-600 pb-2"><span className="text-slate-600 dark:text-slate-400">Paneles Solares:</span> <strong className="text-slate-800 dark:text-slate-200">{estimate.panelCount} unidades</strong></li>
            <li className="flex items-center justify-between border-b dark:border-slate-600 pb-2"><span className="text-slate-600 dark:text-slate-400">Inversor:</span> <strong className="text-slate-800 dark:text-slate-200">{estimate.inverterSize} kW</strong></li>
            <li className="flex items-center justify-between"><span className="text-slate-600 dark:text-slate-400">Baterías:</span> <strong className="text-slate-800 dark:text-slate-200">{estimate.batterySize > 0 ? `${estimate.batterySize} kWh` : 'No incluye'}</strong></li>
        </ul>

        <div className="mt-auto pt-4 border-t-2 border-dashed dark:border-slate-600">
            <p className="text-sm text-slate-600 dark:text-slate-400 text-center">Costo Estimado (USD)</p>
            <p className={`text-3xl font-bold text-center ${
                isSelected 
                    ? 'text-blue-600 dark:text-blue-400'
                    : isRecommended
                    ? 'text-green-700 dark:text-green-400'
                    : 'text-slate-900 dark:text-slate-100'
            }`}>
                ${estimate.estimatedCost.toLocaleString('en-US')}
            </p>
        </div>
    </button>
);

export default EstimateCard;