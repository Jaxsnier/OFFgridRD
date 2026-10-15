import React from 'react';
import { QuoteCalculationResult, QuoteInput } from '../../types';
import { formatCurrency } from '../../utils/pricingCalculator';

interface InternalBudgetKpiCardsProps {
    input: QuoteInput;
    calculation: QuoteCalculationResult;
}

export const InternalBudgetKpiCards: React.FC<InternalBudgetKpiCardsProps> = ({
    input,
    calculation
}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                    Presupuesto Costo Interno Total
                </span>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {formatCurrency(calculation.totalInternalCost, input.currency, input.exchangeRate)}
                </div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    Costo real de compra de materiales y fletes
                </span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                    Precio Total Cotizado al Cliente
                </span>
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
                    {formatCurrency(calculation.totalQuotedPrice, input.currency, input.exchangeRate)}
                </div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    Monto final facturado / contratado
                </span>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-sm">
                <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                        Ganancia Neta Estimada
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-black bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100">
                        {calculation.profitMarginPercent.toFixed(1)}% Margen
                    </span>
                </div>
                <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1">
                    {formatCurrency(calculation.estimatedProfit, input.currency, input.exchangeRate)}
                </div>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
                    Utilidad libre proyectada de la obra
                </span>
            </div>
        </div>
    );
};

export default InternalBudgetKpiCards;
