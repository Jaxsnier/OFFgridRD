import React from 'react';

interface OptionCardProps {
    title: string;
    description: string;
    cost: number;
    icon: React.ReactNode;
    isSelected: boolean;
    onSelect: () => void;
    disabled?: boolean;
}

const OptionCard: React.FC<OptionCardProps> = ({ title, description, cost, icon, isSelected, onSelect, disabled = false }) => {
    return (
        <button
            onClick={onSelect}
            disabled={disabled}
            className={`text-left border-2 rounded-xl p-6 w-full flex flex-col h-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
                isSelected 
                    ? 'border-blue-500 bg-white dark:bg-slate-800 shadow-xl ring-2 ring-blue-500/50' 
                    : 'border-slate-200 bg-white hover:shadow-md hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600'
            } ${
                disabled ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-800/50' : 'cursor-pointer'
            }`}
        >
            <div className="flex items-start gap-4 mb-4">
                <div className={`flex-shrink-0 transition-colors ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>{icon}</div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 flex-grow">{description}</p>
                </div>
            </div>
            <div className="mt-auto pt-4 border-t border-dashed dark:border-slate-600 text-right">
                <p className={`text-xl font-bold transition-colors ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-slate-100'}`}>
                    {cost.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
                </p>
            </div>
        </button>
    );
};

export default OptionCard;
