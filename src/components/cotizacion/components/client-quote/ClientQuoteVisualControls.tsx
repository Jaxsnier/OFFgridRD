import React, { useState, useRef, useEffect } from 'react';
import { QuoteCalculationResult, QuoteInput } from '../../types';
import { formatCurrency } from '../../utils/pricingCalculator';

interface ClientQuoteVisualControlsProps {
    input: QuoteInput;
    calculation: QuoteCalculationResult;
    onChangeInput: (updated: Partial<QuoteInput>) => void;
    onOpenInlineTotalEdit?: () => void;
}

export const ClientQuoteVisualControls: React.FC<ClientQuoteVisualControlsProps> = ({
    input,
    calculation,
    onChangeInput
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [tempTotal, setTempTotal] = useState<string>(
        input.customClientTotal !== undefined
            ? String(input.customClientTotal)
            : String(calculation.totalQuotedPrice)
    );
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Keep tempTotal in sync if input/calculation changes while closed
    useEffect(() => {
        if (!isOpen) {
            setTempTotal(
                input.customClientTotal !== undefined
                    ? String(input.customClientTotal)
                    : String(calculation.totalQuotedPrice)
            );
        }
    }, [input.customClientTotal, calculation.totalQuotedPrice, isOpen]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const isCustomized =
        input.customClientTotal !== undefined || Boolean(input.showDiscount5PercentBadge);

    const handleApplyTotal = () => {
        const val = parseFloat(tempTotal);
        if (!isNaN(val) && val >= 0) {
            onChangeInput({ customClientTotal: Math.round(val) });
        }
        setIsOpen(false);
    };

    const handleResetTotal = () => {
        onChangeInput({ customClientTotal: undefined });
        setTempTotal(String(calculation.totalQuotedPrice));
    };

    const handleToggleDiscount = () => {
        onChangeInput({
            showDiscount5PercentBadge: !input.showDiscount5PercentBadge
        });
    };

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition shadow-sm ${
                    isCustomized
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-600'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200'
                }`}
                title="Modificar valor total y opciones visuales de la cotización"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                </svg>
                <span>Ajustar Total & Visuales</span>
                {isCustomized && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl z-50 p-4 animate-in fade-in zoom-in-95 duration-100">
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200 dark:border-slate-700">
                        <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>Opciones Visuales de Cotización</span>
                        </span>
                        {isCustomized && (
                            <button
                                type="button"
                                onClick={() => {
                                    onChangeInput({
                                        customClientTotal: undefined,
                                        showDiscount5PercentBadge: false
                                    });
                                    setTempTotal(String(calculation.totalQuotedPrice));
                                }}
                                className="text-[10px] font-semibold text-red-600 dark:text-red-400 hover:underline"
                            >
                                Restablecer todo
                            </button>
                        )}
                    </div>

                    {/* 1. Toggle 5% discount badge */}
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 mb-3">
                        <label className="flex items-start gap-2.5 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={Boolean(input.showDiscount5PercentBadge)}
                                onChange={handleToggleDiscount}
                                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                            />
                            <div>
                                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                    <span>Letrero de 5% Descuento</span>
                                    <span className="px-1.5 py-0.2 text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 font-bold rounded">
                                        (5% descuento aplicado)
                                    </span>
                                </div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                    Muestra el letrero verde promocional junto al monto total cotizado.
                                </div>
                            </div>
                        </label>
                    </div>

                    {/* 2. Custom total modification */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                                Valor Total Cotizado ({input.currency}):
                            </label>
                            {input.customClientTotal !== undefined && (
                                <button
                                    type="button"
                                    onClick={handleResetTotal}
                                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    ↺ Usar calculado
                                </button>
                            )}
                        </div>

                        <div className="relative">
                            <input
                                type="number"
                                min="0"
                                step="any"
                                value={tempTotal}
                                onChange={(e) => setTempTotal(e.target.value)}
                                className="w-full px-3 py-1.5 text-sm font-mono font-bold text-right rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                        </div>

                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-0.5">
                            <span>Total calculado base:</span>
                            <span className="font-mono font-bold">
                                {formatCurrency(calculation.totalQuotedPrice, input.currency, input.exchangeRate)}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                        >
                            Cerrar
                        </button>
                        <button
                            type="button"
                            onClick={handleApplyTotal}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition"
                        >
                            Guardar Total
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientQuoteVisualControls;
