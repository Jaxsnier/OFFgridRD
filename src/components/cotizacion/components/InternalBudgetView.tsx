import React, { useState } from 'react';
import { BudgetDivisionItem, QuoteCalculationResult, QuoteInput } from '../types';
import { formatCurrency } from '../utils/pricingCalculator';
import { printElementById } from '../utils/printHelper';

interface InternalBudgetViewProps {
    input: QuoteInput;
    calculation: QuoteCalculationResult;
    onUpdateOverride: (itemId: string, costInternal?: number, priceQuoted?: number) => void;
    onResetOverrides: () => void;
    onBackToEdit: () => void;
    onViewClientQuote: () => void;
}

export const InternalBudgetView: React.FC<InternalBudgetViewProps> = ({
    input,
    calculation,
    onUpdateOverride,
    onResetOverrides,
    onBackToEdit,
    onViewClientQuote
}) => {
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handlePrint = () => {
        const title = `Presupuesto_Interno_${input.client.name.replace(/\s+/g, '_')}_${input.inverterCapacityKw}kW`;
        printElementById('printable-internal-budget-document', title);
    };

    const handleCopyBreakdown = () => {
        let text = `📋 *PRESUPUESTO INTERNO DIVIDIDO - OFFgridRD*\n`;
        text += `Proyecto: ${input.client.name} (${input.inverterCapacityKw} kW / ${input.peakPowerKwp.toFixed(2)} kWp)\n`;
        text += `Fecha: ${input.client.date} | Cotización: ${input.client.quoteNumber}\n\n`;
        text += `PARTIDAS DIVIDIDAS:\n`;

        calculation.items.forEach((item, index) => {
            text += `${index + 1}. ${item.category} (${item.unitDetail}):\n`;
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
        <div className="space-y-6">
            {/* Action Bar (Hidden in Print) */}
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
                        title="Restablecer importes a los valores automáticos"
                    >
                        Restablecer Valores Base
                    </button>
                    <button
                        type="button"
                        onClick={handleCopyBreakdown}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
                    >
                        {copied ? '✓ ¡Copiado!' : 'Copiar Desglose'}
                    </button>
                    <button
                        type="button"
                        onClick={handlePrint}
                        className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Imprimir Hoja de Presupuesto
                    </button>
                </div>
            </div>

            {/* Profitability Executive KPI Cards */}
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

            {/* Main Divided Budget Document */}
            <div id="printable-internal-budget-document" className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-md border border-slate-200 dark:border-slate-700 print:shadow-none print:border-none print:p-0">
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
                            Desglose de compras, materiales de canalización, equipos, protecciones y márgenes comerciales.
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
                                <th className="py-3 px-3">Partida / Rubro</th>
                                <th className="py-3 px-3">Especificación / Cantidad</th>
                                <th className="py-3 px-3 text-right">Presupuesto Costo</th>
                                <th className="py-3 px-3 text-right">Precio Cotizado</th>
                                <th className="py-3 px-3 text-right">Margen / Ganancia</th>
                                <th className="py-3 px-3 text-center print:hidden">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
                            {calculation.items.map((item) => {
                                const isEditing = editingItemId === item.id;
                                const itemProfit = item.priceQuoted - item.costInternal;
                                const itemMargin = item.priceQuoted > 0 ? ((itemProfit / item.priceQuoted) * 100).toFixed(0) : '0';

                                return (
                                    <tr 
                                        key={item.id}
                                        className={`hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors ${
                                            item.isCustomOverridden ? 'bg-amber-50/40 dark:bg-amber-950/20' : ''
                                        }`}
                                    >
                                        <td className="py-3 px-3">
                                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                                <span>{item.category}</span>
                                                {item.isCustomOverridden && (
                                                    <span className="text-[10px] bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 px-1.5 py-0.2 rounded">
                                                        Editado
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                                                {item.description}
                                            </div>
                                        </td>

                                        <td className="py-3 px-3 font-medium whitespace-nowrap text-slate-600 dark:text-slate-400">
                                            {item.unitDetail}
                                        </td>

                                        {/* Costo Presupuesto Interno */}
                                        <td className="py-3 px-3 text-right">
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    defaultValue={item.costInternal}
                                                    onBlur={(e) => {
                                                        const val = parseFloat(e.target.value) || 0;
                                                        onUpdateOverride(item.id, val, undefined);
                                                    }}
                                                    className="w-24 px-2 py-1 text-right text-xs font-mono font-bold rounded border border-blue-400 bg-white dark:bg-slate-700 dark:text-white"
                                                />
                                            ) : (
                                                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                                                    {formatCurrency(item.costInternal, input.currency, input.exchangeRate)}
                                                </span>
                                            )}
                                        </td>

                                        {/* Precio Cotizado Cliente */}
                                        <td className="py-3 px-3 text-right">
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    defaultValue={item.priceQuoted}
                                                    onBlur={(e) => {
                                                        const val = parseFloat(e.target.value) || 0;
                                                        onUpdateOverride(item.id, undefined, val);
                                                    }}
                                                    className="w-24 px-2 py-1 text-right text-xs font-mono font-bold rounded border border-blue-400 bg-white dark:bg-slate-700 dark:text-white"
                                                />
                                            ) : (
                                                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                                                    {formatCurrency(item.priceQuoted, input.currency, input.exchangeRate)}
                                                </span>
                                            )}
                                        </td>

                                        {/* Margen */}
                                        <td className="py-3 px-3 text-right whitespace-nowrap">
                                            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 block">
                                                +{formatCurrency(itemProfit, input.currency, input.exchangeRate)}
                                            </span>
                                            <span className="text-[10px] text-slate-400">
                                                ({itemMargin}%)
                                            </span>
                                        </td>

                                        {/* Action */}
                                        <td className="py-3 px-3 text-center print:hidden">
                                            <button
                                                type="button"
                                                onClick={() => setEditingItemId(isEditing ? null : item.id)}
                                                className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-slate-700"
                                            >
                                                {isEditing ? 'Listo' : 'Ajustar'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>

                        {/* Table Footer Totals */}
                        <tfoot className="bg-slate-100 dark:bg-slate-700/80 font-bold border-t-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white">
                            <tr>
                                <td className="py-3 px-3 uppercase text-xs" colSpan={2}>
                                    Totales Generales de Obra
                                </td>
                                <td className="py-3 px-3 text-right font-mono text-sm">
                                    {formatCurrency(calculation.totalInternalCost, input.currency, input.exchangeRate)}
                                </td>
                                <td className="py-3 px-3 text-right font-mono text-sm text-blue-600 dark:text-blue-300">
                                    {formatCurrency(calculation.totalQuotedPrice, input.currency, input.exchangeRate)}
                                </td>
                                <td className="py-3 px-3 text-right font-mono text-sm text-emerald-600 dark:text-emerald-400">
                                    +{formatCurrency(calculation.estimatedProfit, input.currency, input.exchangeRate)}
                                </td>
                                <td className="print:hidden"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Practical Notes for Field Execution */}
                <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600 text-xs text-slate-600 dark:text-slate-300">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1.5 uppercase tracking-wider">
                        Recomendaciones para Compra & Ejecución Técnica:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            • <strong>Canalización:</strong> Para los {input.conduitMeters} metros, verificar si requiere paso por azotea expuesta (usar tubería galvanizada o LiquidTight con protección UV) y cables solares con doble aislamiento 1000V.
                        </div>
                        <div>
                            • <strong>Inversor & Protecciones:</strong> Colocar caja de protecciones cerca del inversor para fácil desconexión en caso de emergencia; asegurar la varilla de tierra con resistencia &lt; 10 ohms.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InternalBudgetView;
