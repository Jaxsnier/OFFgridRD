import React from 'react';
import { QUOTE_PRESETS, QuotePreset } from '../constants';
import { QuoteInput } from '../types';

interface QuotePresetsProps {
    onSelectPreset: (preset: QuotePreset) => void;
    currentKw: number;
    currentKwp: number;
}

export const QuotePresets: React.FC<QuotePresetsProps> = ({ onSelectPreset, currentKw, currentKwp }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500"></span>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                        Configuraciones Rápidas Frecuentes
                    </h3>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">1-clic para autocompletar</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {QUOTE_PRESETS.map((preset) => {
                    const isSelected = currentKw === preset.inverterKw && currentKwp === preset.kwp;
                    return (
                        <button
                            key={preset.id}
                            type="button"
                            onClick={() => onSelectPreset(preset)}
                            className={`text-left p-3 rounded-lg border transition-all duration-200 ${
                                isSelected
                                    ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-900 dark:text-blue-100 ring-2 ring-blue-500/20'
                                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200'
                            }`}
                        >
                            <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
                                <span>{preset.label}</span>
                                {isSelected && (
                                    <span className="text-blue-600 dark:text-blue-400 text-xs">✓</span>
                                )}
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                                {preset.description}
                            </p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default QuotePresets;
