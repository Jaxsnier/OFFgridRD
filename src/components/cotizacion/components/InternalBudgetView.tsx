import React, { useState } from 'react';
import { BudgetItemOverride, QuoteCalculationResult, QuoteInput } from '../types';
import { formatCurrency } from '../utils/pricingCalculator';
import { printElementById } from '../utils/printHelper';
import InternalBudgetActionBar from './internal-budget/InternalBudgetActionBar';
import InternalBudgetKpiCards from './internal-budget/InternalBudgetKpiCards';
import InternalBudgetTableRow from './internal-budget/InternalBudgetTableRow';
import InternalBudgetNotes from './internal-budget/InternalBudgetNotes';
import {
    DEFAULT_COLUMNS_VISIBILITY,
    InternalBudgetColumnsVisibility
} from './internal-budget/budgetColumnsConfig';

interface InternalBudgetViewProps {
    input: QuoteInput;
    calculation: QuoteCalculationResult;
    onUpdateOverride: (itemId: string, updates: BudgetItemOverride) => void;
    onResetItemOverride?: (itemId: string) => void;
    onResetOverrides: () => void;
    onBackToEdit: () => void;
    onViewClientQuote: () => void;
}

export const InternalBudgetView: React.FC<InternalBudgetViewProps> = ({
    input,
    calculation,
    onUpdateOverride,
    onResetItemOverride,
    onResetOverrides,
    onBackToEdit,
    onViewClientQuote
}) => {
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [visibleColumns, setVisibleColumns] = useState<InternalBudgetColumnsVisibility>(
        DEFAULT_COLUMNS_VISIBILITY
    );

    const handlePrint = () => {
        const title = `Presupuesto_Interno_${input.client.name.replace(/\s+/g, '_')}_${input.inverterCapacityKw}kW`;
        printElementById('printable-internal-budget-document', title);
    };

    // Calculate dynamic column spans for table structure
    const visibleColumnCount =
        (visibleColumns.category ? 1 : 0) +
        (visibleColumns.unitDetail ? 1 : 0) +
        (visibleColumns.costInternal ? 1 : 0) +
        (visibleColumns.priceQuoted ? 1 : 0) +
        (visibleColumns.marginProfit ? 1 : 0) +
        1; // Action column (print:hidden)

    const leadingColSpan = (visibleColumns.category ? 1 : 0) + (visibleColumns.unitDetail ? 1 : 0);

    return (
        <div className="space-y-6">
            {/* Action Bar (Hidden in Print) */}
            <InternalBudgetActionBar
                input={input}
                calculation={calculation}
                visibleColumns={visibleColumns}
                onChangeVisibleColumns={setVisibleColumns}
                onBackToEdit={onBackToEdit}
                onViewClientQuote={onViewClientQuote}
                onResetOverrides={() => {
                    setEditingItemId(null);
                    onResetOverrides();
                }}
                onPrint={handlePrint}
            />

            {/* Profitability Executive KPI Cards */}
            <InternalBudgetKpiCards input={input} calculation={calculation} />

            {/* Main Divided Budget Document */}
            <div
                id="printable-internal-budget-document"
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-md border border-slate-200 dark:border-slate-700 print:shadow-none print:border-none print:p-0"
            >
                {/* Header */}
                <div className="border-b dark:border-slate-700 pb-5 mb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded bg-amber-500 text-slate-900 font-bold text-xs uppercase tracking-wider">
                                Documento Interno de Obra
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                (Uso Exclusivo del Instalador / Contratista)
                            </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
                            Presupuesto Dividido por Partidas
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Desglose de compras, materiales de canalización, equipos, protecciones y márgenes comerciales. Haz clic en <strong>Ajustar</strong> para modificar cualquier partida o usa <strong>Columnas</strong> para mostrar u ocultar campos.
                        </p>
                    </div>

                    <div className="text-right text-xs text-slate-500 dark:text-slate-400">
                        <div><strong>Proyecto:</strong> {input.client.name}</div>
                        <div><strong>Inversor:</strong> {input.inverterCapacityKw} kW | <strong>Placas:</strong> {input.peakPowerKwp.toFixed(2)} kWp</div>
                        <div><strong>Canalización:</strong> {input.conduitMeters} metros</div>
                        <div><strong>Fecha:</strong> {input.client.date}</div>
                    </div>
                </div>

                {/* Divided Budget Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                        <thead className="bg-slate-100 dark:bg-slate-700/70 text-slate-700 dark:text-slate-200 uppercase font-bold text-[11px]">
                            <tr>
                                {visibleColumns.category && (
                                    <th className="py-3 px-3">Partida / Rubro</th>
                                )}
                                {visibleColumns.unitDetail && (
                                    <th className="py-3 px-3">Especificación / Cantidad</th>
                                )}
                                {visibleColumns.costInternal && (
                                    <th className="py-3 px-3 text-right">Presupuesto Costo</th>
                                )}
                                {visibleColumns.priceQuoted && (
                                    <th className="py-3 px-3 text-right">Precio Cotizado</th>
                                )}
                                {visibleColumns.marginProfit && (
                                    <th className="py-3 px-3 text-right">Margen / Ganancia</th>
                                )}
                                <th className="py-3 px-3 text-center print:hidden">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
                            {calculation.items.map((item) => (
                                <InternalBudgetTableRow
                                    key={item.id}
                                    item={item}
                                    currency={input.currency}
                                    exchangeRate={input.exchangeRate}
                                    visibleColumns={visibleColumns}
                                    colSpan={visibleColumnCount}
                                    isEditing={editingItemId === item.id}
                                    onStartEdit={() => setEditingItemId(item.id)}
                                    onCancelEdit={() => setEditingItemId(null)}
                                    onSaveOverride={(updates) => onUpdateOverride(item.id, updates)}
                                    onResetItem={
                                        onResetItemOverride
                                            ? () => {
                                                  onResetItemOverride(item.id);
                                                  setEditingItemId(null);
                                              }
                                            : undefined
                                    }
                                />
                            ))}
                        </tbody>

                        {/* Table Footer Totals */}
                        <tfoot className="bg-slate-100 dark:bg-slate-700/80 font-bold border-t-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white">
                            <tr>
                                {leadingColSpan > 0 && (
                                    <td className="py-3 px-3 uppercase text-xs" colSpan={leadingColSpan}>
                                        Totales Generales de Obra
                                    </td>
                                )}
                                {visibleColumns.costInternal && (
                                    <td className="py-3 px-3 text-right font-mono text-sm">
                                        {formatCurrency(calculation.totalInternalCost, input.currency, input.exchangeRate)}
                                    </td>
                                )}
                                {visibleColumns.priceQuoted && (
                                    <td className="py-3 px-3 text-right font-mono text-sm text-blue-600 dark:text-blue-300">
                                        {formatCurrency(calculation.totalQuotedPrice, input.currency, input.exchangeRate)}
                                    </td>
                                )}
                                {visibleColumns.marginProfit && (
                                    <td className="py-3 px-3 text-right font-mono text-sm text-emerald-600 dark:text-emerald-400">
                                        +{formatCurrency(calculation.estimatedProfit, input.currency, input.exchangeRate)}
                                    </td>
                                )}
                                <td className="print:hidden"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Practical Notes for Field Execution */}
                <InternalBudgetNotes input={input} />
            </div>
        </div>
    );
};

export default InternalBudgetView;
