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
        className={`relative text-left border-2 rounded-xl p-6 flex flex-col h-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 ${
            isSelected 
                ? 'border-blue-500 bg-white shadow-xl ring-blue-500/50' 
                : isRecommended 
                ? 'border-green-500 bg-green-50 shadow-lg' 
                : 'border-slate-200 bg-white hover:shadow-md hover:border-slate-300'
        }`}
    >
        {isRecommended && (
            <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Recomendado
            </div>
        )}
        <h3 className="text-xl font-bold text-slate-800 mb-2 text-center">{estimate.title}</h3>
        <p className="text-sm text-slate-600 mb-6 flex-grow text-center">{estimate.description}</p>
        
        <ul className="space-y-3 text-sm mb-6">
            <li className="flex items-center justify-between border-b pb-2"><span className="text-slate-600">Sistema:</span> <strong className="text-slate-800">{estimate.systemSize} kWp</strong></li>
            <li className="flex items-center justify-between border-b pb-2"><span className="text-slate-600">Paneles Solares:</span> <strong className="text-slate-800">{estimate.panelCount} unidades</strong></li>
            <li className="flex items-center justify-between border-b pb-2"><span className="text-slate-600">Inversor:</span> <strong className="text-slate-800">{estimate.inverterSize} kW</strong></li>
            <li className="flex items-center justify-between"><span className="text-slate-600">Baterías:</span> <strong className="text-slate-800">{estimate.batterySize > 0 ? `${estimate.batterySize} kWh` : 'No incluye'}</strong></li>
        </ul>

        <div className="mt-auto pt-4 border-t-2 border-dashed">
            <p className="text-sm text-slate-600 text-center">Costo Estimado (USD)</p>
            <p className={`text-3xl font-bold text-center ${
                isSelected 
                    ? 'text-blue-600'
                    : isRecommended
                    ? 'text-green-700'
                    : 'text-slate-900'
            }`}>
                ${estimate.estimatedCost.toLocaleString('en-US')}
            </p>
        </div>
    </button>
);

export default EstimateCard;