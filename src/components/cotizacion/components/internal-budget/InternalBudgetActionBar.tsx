import React, { useState } from 'react';
import { QuoteCalculationResult, QuoteInput } from '../../types';
import { formatCurrency } from '../../utils/pricingCalculator';
import { InternalBudgetColumnsVisibility } from './budgetColumnsConfig';
import InternalBudgetColumnSelector from './InternalBudgetColumnSelector';

interface InternalBudgetActionBarProps {
    input: QuoteInput;
    calculation: QuoteCalculationResult;
    visibleColumns: InternalBudgetColumnsVisibility;
    onChangeVisibleColumns: (updated: InternalBudgetColumnsVisibility) => void;
    onBackToEdit: () => void;
    onViewClientQuote: () => void;
    onResetOverrides: () => void;
    onPrint: () => void;
}

export const InternalBudgetActionBar: React.FC<InternalBudgetActionBarProps> = ({
    input,
    calculation,
    visibleColumns,
    onChangeVisibleColumns,
    onBackToEdit,
    onViewClientQuote,
    onResetOverrides,
    onPrint
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopyBreakdown = () => {
        let text = `📋 *PRESUPUESTO INTERNO DIVIDIDO - OFFgridRD*\n`;
        text += `Proyecto: ${input.client.name} (${input.inverterCapacityKw} kW / ${input.peakPowerKwp.toFixed(2)} kWp)\n`;
        text += `Fecha: ${input.client.date} | Cotización: ${input.client.quoteNumber}\n\n`;
        text += `PARTIDAS DIVIDIDAS:\n`;

        calculation.items.forEach((item, index) => {
            text += `${index + 1}. ${item.category} (${item.unitDetail}):\n`;
            if (item.description) {
                text += `   Detalle: ${item.description}\n`;
            }
            text += `   - Presupuesto Costo: ${formatCurrency(item.costInternal, input.currency, input.exchangeRate)}\n`;
            text += `   - Precio Cotizado: ${formatCurrency(item.priceQuoted, input.currency, input.exchangeRate)}\n`;
            text += `   - Ganancia: ${formatCurrency(item.priceQuoted - item.costInternal, input.currency, input.exchangeRate)}\n`;
        });

        text += `\n------------------------------------\n`;
        text += `TOTAL COSTO INTERNO: ${formatCurrency(calculation.totalInternalCost, input.currency, input.exchangeRate)}\n`;
        text += `TOTAL VENTA CLIENTE: ${formatCurrency(calculation.totalQuotedPrice, input.currency, input.exchangeRate)}\n`;
        text += `GANANCIA NETA PROYECTADA: ${formatCurrency(calculation.estimatedProfit, input.currency, input.exchangeRate)} (${calculation.profitMarginPercent.toFixed(1)}%)\n`;

        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    return (
        <div className="print:hidden flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={onBackToEdit}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                    ← Volver a Editar Parámetros
                </button>
                <button
                    type="button"
                    onClick={onViewClientQuote}
                    className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                    Ver Cotización del Cliente →
                </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <button
                    type="button"
                    onClick={onResetOverrides}
                    className="px-3 py-1.5 rounded-lg border border-red-300 dark:border-red-800/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-semibold transition"
                    title="Restablecer todas las partidas a sus valores calculados"
                >
                    Restablecer Todos los Ajustes
                </button>
                <InternalBudgetColumnSelector
                    visibleColumns={visibleColumns}
                    onChangeVisibleColumns={onChangeVisibleColumns}
                />
                <button
                    type="button"
                    onClick={handleCopyBreakdown}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
                >
                    {copied ? '✓ ¡Copiado!' : 'Copiar Desglose'}
                </button>
                <button
                    type="button"
                    onClick={onPrint}
                    className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Imprimir Hoja de Presupuesto
                </button>
            </div>
        </div>
    );
};

export default InternalBudgetActionBar;
