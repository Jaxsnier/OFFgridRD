import React from 'react';
import { QuoteInput } from '../../types';
import {
    MARGEN_GANANCIA_MIN_PERCENT,
    MARGEN_GANANCIA_MAX_PERCENT,
    TRANSPORTE_LOGISTICA_PERCENT,
    MANO_OBRA_SUPERVISION_PERCENT
} from '../../pricing';

interface InternalMarginSectionProps {
    input: QuoteInput;
    onChange: (updated: Partial<QuoteInput>) => void;
}

export const InternalMarginSection: React.FC<InternalMarginSectionProps> = ({ input, onChange }) => {
    const currentMargin =
        input.profitMarginPercent !== undefined
            ? input.profitMarginPercent
            : input.quality === 'premium'
            ? MARGEN_GANANCIA_MAX_PERCENT
            : MARGEN_GANANCIA_MIN_PERCENT;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[11px] font-black rounded bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
                        SECCIÓN 4
                    </span>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                            Datos Internos (Fórmulas y Variables de Cotización)
                        </h3>
                    </div>
                </div>
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                    Tasa USD: RD${input.exchangeRate}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Control de Margen de Ganancia (Min 15% - Max 30%) */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                            Margen de Ganancia ({MARGEN_GANANCIA_MIN_PERCENT}% min — {MARGEN_GANANCIA_MAX_PERCENT}% max)
                        </label>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300">
                            {currentMargin}%
                        </span>
                    </div>

                    <input
                        type="range"
                        min={MARGEN_GANANCIA_MIN_PERCENT}
                        max={MARGEN_GANANCIA_MAX_PERCENT}
                        step="1"
                        value={currentMargin}
                        onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            onChange({
                                profitMarginPercent: val,
                                quality: val >= 25 ? 'premium' : 'normal'
                            });
                        }}
                        className="w-full accent-emerald-600 cursor-pointer"
                    />

                    <div className="flex justify-between gap-2 mt-2">
                        <button
                            type="button"
                            onClick={() =>
                                onChange({
                                    profitMarginPercent: MARGEN_GANANCIA_MIN_PERCENT,
                                    quality: 'normal'
                                })
                            }
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition ${
                                currentMargin === MARGEN_GANANCIA_MIN_PERCENT
                                    ? 'bg-emerald-600 text-white border-emerald-600'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                            }`}
                        >
                            Mínimo ({MARGEN_GANANCIA_MIN_PERCENT}%)
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                onChange({
                                    profitMarginPercent: 22,
                                    quality: 'normal'
                                })
                            }
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition ${
                                currentMargin === 22
                                    ? 'bg-emerald-600 text-white border-emerald-600'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                            }`}
                        >
                            Medio (22%)
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                onChange({
                                    profitMarginPercent: MARGEN_GANANCIA_MAX_PERCENT,
                                    quality: 'premium'
                                })
                            }
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition ${
                                currentMargin === MARGEN_GANANCIA_MAX_PERCENT
                                    ? 'bg-emerald-600 text-white border-emerald-600'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                            }`}
                        >
                            Máximo ({MARGEN_GANANCIA_MAX_PERCENT}%)
                        </button>
                    </div>
                </div>

                {/* Porcentajes Automáticos de Datos Internos */}
                <div className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-4 border border-slate-200 dark:border-slate-600 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-slate-300 font-medium">
                            Mano de obra y supervisión:
                        </span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-600">
                            {MANO_OBRA_SUPERVISION_PERCENT}% del total
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-slate-300 font-medium">
                            Transporte & Logística:
                        </span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-600">
                            {TRANSPORTE_LOGISTICA_PERCENT}% del total
                        </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-600">
                        <span className="text-slate-600 dark:text-slate-300 font-medium">
                            Tasa de cambio (RD$ / 1 USD):
                        </span>
                        <input
                            type="number"
                            step="0.5"
                            min="40"
                            max="100"
                            value={input.exchangeRate}
                            onChange={(e) => onChange({ exchangeRate: parseFloat(e.target.value) || 60 })}
                            className="w-20 px-2 py-1 text-right font-mono font-bold rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InternalMarginSection;
