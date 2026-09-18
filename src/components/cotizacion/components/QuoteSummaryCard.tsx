import React from 'react';
import { QuoteCalculationResult } from '../types';
import { formatCurrency } from '../utils/pricingCalculator';

interface QuoteSummaryCardProps {
    calculation: QuoteCalculationResult;
    currency: 'DOP' | 'USD';
    exchangeRate: number;
    onViewClientQuote: () => void;
    onViewInternalBudget: () => void;
}

export const QuoteSummaryCard: React.FC<QuoteSummaryCardProps> = ({
    calculation,
    currency,
    exchangeRate,
    onViewClientQuote,
    onViewInternalBudget
}) => {
    return (
        <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-6 shadow-xl border border-blue-900/50 sticky top-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-300">
                        Presupuesto Total Llave en Mano
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                        {formatCurrency(calculation.totalQuotedPrice, currency, exchangeRate)}
                    </h3>
                </div>
                <div className="text-right">
                    <span className="text-xs text-slate-400 block">Moneda</span>
                    <span className="inline-block px-2.5 py-1 bg-blue-500/30 text-blue-200 border border-blue-400/30 rounded-full text-xs font-bold mt-0.5">
                        {currency}
                    </span>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <span className="text-xs text-slate-400 block">Producción Estimada</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-lg font-bold text-amber-400">
                            ~{calculation.estimatedMonthlyKwh}
                        </span>
                        <span className="text-xs text-slate-300">kWh/mes</span>
                    </div>
                </div>

                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <span className="text-xs text-slate-400 block">Módulos Solares</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-lg font-bold text-blue-400">
                            {calculation.panelCount}
                        </span>
                        <span className="text-xs text-slate-300">de {calculation.panelWattage}W</span>
                    </div>
                </div>
            </div>

            {/* Internal Profit Badge (for contractor glance) */}
            <div className="bg-emerald-950/50 border border-emerald-500/30 rounded-xl p-3 mb-5">
                <div className="flex justify-between items-center text-xs">
                    <span className="text-emerald-300 font-medium">Margen estimado (Interno):</span>
                    <span className="font-bold text-emerald-400">
                        {calculation.profitMarginPercent.toFixed(1)}%
                    </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-slate-300">Ganancia calculada:</span>
                    <span className="text-sm font-bold text-emerald-300">
                        {formatCurrency(calculation.estimatedProfit, currency, exchangeRate)}
                    </span>
                </div>
            </div>

            {/* Dual CTAs */}
            <div className="space-y-2.5">
                <button
                    type="button"
                    onClick={onViewClientQuote}
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Ver Cotización para el Cliente
                </button>

                <button
                    type="button"
                    onClick={onViewInternalBudget}
                    className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Ver Presupuesto Dividido (Interno)
                </button>
            </div>
        </div>
    );
};

export default QuoteSummaryCard;
