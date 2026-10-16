import React, { useState } from 'react';
import { BudgetDivisionItem, BudgetItemOverride } from '../../types';
import { formatCurrency } from '../../utils/pricingCalculator';
import { InternalBudgetColumnsVisibility } from './budgetColumnsConfig';

interface InternalBudgetTableRowProps {
    item: BudgetDivisionItem;
    currency: 'DOP' | 'USD';
    exchangeRate: number;
    visibleColumns: InternalBudgetColumnsVisibility;
    colSpan: number;
    isEditing: boolean;
    onStartEdit: () => void;
    onCancelEdit: () => void;
    onSaveOverride: (updates: BudgetItemOverride) => void;
    onResetItem?: () => void;
}

export const InternalBudgetTableRow: React.FC<InternalBudgetTableRowProps> = ({
    item,
    currency,
    exchangeRate,
    visibleColumns,
    colSpan,
    isEditing,
    onStartEdit,
    onCancelEdit,
    onSaveOverride,
    onResetItem
}) => {
    // Temporary states while editing
    const [category, setCategory] = useState(item.category);
    const [description, setDescription] = useState(item.description);
    const [unitDetail, setUnitDetail] = useState(item.unitDetail);
    const [costInternal, setCostInternal] = useState(item.costInternal);
    const [priceQuoted, setPriceQuoted] = useState(item.priceQuoted);

    const handleSave = () => {
        onSaveOverride({
            category: category.trim() || item.category,
            description: description.trim(),
            unitDetail: unitDetail.trim(),
            costInternal: Number(costInternal) || 0,
            priceQuoted: Number(priceQuoted) || 0
        });
        onCancelEdit();
    };

    const handleCancel = () => {
        // Reset local state to item's current values
        setCategory(item.category);
        setDescription(item.description);
        setUnitDetail(item.unitDetail);
        setCostInternal(item.costInternal);
        setPriceQuoted(item.priceQuoted);
        onCancelEdit();
    };

    // Calculate profit and margin
    const currentCost = isEditing ? (Number(costInternal) || 0) : item.costInternal;
    const currentPrice = isEditing ? (Number(priceQuoted) || 0) : item.priceQuoted;
    const itemProfit = currentPrice - currentCost;
    const itemMargin = currentCost > 0 ? ((itemProfit / currentCost) * 100).toFixed(0) : '0';

    if (isEditing) {
        return (
            <tr className="bg-amber-50/70 dark:bg-amber-950/40 border-2 border-blue-500/70 transition-all">
                <td colSpan={colSpan} className="p-4">
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-blue-300 dark:border-blue-700 shadow-md space-y-4">
                        <div className="flex items-center justify-between border-b pb-2 dark:border-slate-700">
                            <div className="flex items-center gap-2">
                                <span className="p-1 rounded bg-blue-600 text-white text-xs font-bold">
                                    Ajustar Partida
                                </span>
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                    Modificación Completa de Rubro, Título, Cantidad y Precios
                                </span>
                            </div>
                            {item.isCustomOverridden && onResetItem && (
                                <button
                                    type="button"
                                    onClick={onResetItem}
                                    className="text-[11px] font-semibold text-red-600 hover:text-red-700 dark:text-red-400 hover:underline flex items-center gap-1"
                                    title="Volver a los valores calculados automáticamente"
                                >
                                    ↺ Restablecer partida a valor base
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {/* 1. Nombre de la Partida / Rubro */}
                            <div>
                                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    Nombre de la Partida / Rubro:
                                </label>
                                <input
                                    type="text"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    placeholder="Ej. Inversor Solar Híbrido"
                                    className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            {/* 2. Título / Descripción detallada */}
                            <div>
                                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    Título / Descripción técnica:
                                </label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Ej. Inversor híbrido Deye 6kW ($1,800 USD)"
                                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            {/* 3. Especificación / Cantidad */}
                            <div>
                                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    Especificación / Cantidad:
                                </label>
                                <input
                                    type="text"
                                    value={unitDetail}
                                    onChange={(e) => setUnitDetail(e.target.value)}
                                    placeholder="Ej. 1 uds (6 kW) o 10 paneles"
                                    className="w-full px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Precios y Márgenes */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    Presupuesto Costo Interno ({currency}):
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="any"
                                        min="0"
                                        value={costInternal}
                                        onChange={(e) => setCostInternal(parseFloat(e.target.value) || 0)}
                                        className="w-full px-3 py-1.5 text-xs font-mono font-bold text-right rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                                <span className="text-[10px] text-slate-400 mt-0.5 block">
                                    Valor real de adquisición
                                </span>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-blue-700 dark:text-blue-300 mb-1">
                                    Precio Cotizado al Cliente ({currency}):
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="any"
                                        min="0"
                                        value={priceQuoted}
                                        onChange={(e) => setPriceQuoted(parseFloat(e.target.value) || 0)}
                                        className="w-full px-3 py-1.5 text-xs font-mono font-bold text-right rounded-lg border border-blue-400 bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                                <span className="text-[10px] text-slate-400 mt-0.5 block">
                                    Valor cobrado al cliente
                                </span>
                            </div>

                            <div className="flex flex-col justify-center bg-slate-50 dark:bg-slate-750 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                                    Margen / Utilidad resultante:
                                </span>
                                <div className="flex items-baseline justify-between mt-0.5">
                                    <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                                        +{formatCurrency(itemProfit, currency, exchangeRate)}
                                    </span>
                                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                                        {itemMargin}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Save / Cancel buttons */}
                        <div className="flex items-center justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm flex items-center gap-1.5 transition"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Guardar Ajustes
                            </button>
                        </div>
                    </div>
                </td>
            </tr>
        );
    }

    return (
        <tr
            className={`hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors ${
                item.isCustomOverridden ? 'bg-amber-50/40 dark:bg-amber-950/20' : ''
            }`}
        >
            {visibleColumns.category && (
                <td className="py-3 px-3">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{item.category}</span>
                        {item.isCustomOverridden && (
                            <span className="text-[10px] bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 px-1.5 py-0.2 rounded font-medium">
                                Editado
                            </span>
                        )}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1" title={item.description}>
                        {item.description}
                    </div>
                </td>
            )}

            {visibleColumns.unitDetail && (
                <td className="py-3 px-3 font-medium whitespace-nowrap text-slate-600 dark:text-slate-400">
                    {item.unitDetail}
                </td>
            )}

            {/* Costo Presupuesto Interno */}
            {visibleColumns.costInternal && (
                <td className="py-3 px-3 text-right">
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                        {formatCurrency(item.costInternal, currency, exchangeRate)}
                    </span>
                </td>
            )}

            {/* Precio Cotizado Cliente */}
            {visibleColumns.priceQuoted && (
                <td className="py-3 px-3 text-right">
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(item.priceQuoted, currency, exchangeRate)}
                    </span>
                </td>
            )}

            {/* Margen / Ganancia */}
            {visibleColumns.marginProfit && (
                <td className="py-3 px-3 text-right whitespace-nowrap">
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 block">
                        +{formatCurrency(itemProfit, currency, exchangeRate)}
                    </span>
                    <span className="text-[10px] text-slate-400">
                        ({itemMargin}%)
                    </span>
                </td>
            )}

            {/* Action */}
            <td className="py-3 px-3 text-center print:hidden">
                <button
                    type="button"
                    onClick={onStartEdit}
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline px-2.5 py-1 rounded hover:bg-blue-50 dark:hover:bg-slate-700 transition"
                >
                    Ajustar
                </button>
            </td>
        </tr>
    );
};

export default InternalBudgetTableRow;
