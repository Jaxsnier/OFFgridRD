import React, { useState, useRef, useEffect } from 'react';
import {
    BUDGET_COLUMN_DEFINITIONS,
    DEFAULT_COLUMNS_VISIBILITY,
    InternalBudgetColumnsVisibility
} from './budgetColumnsConfig';

interface InternalBudgetColumnSelectorProps {
    visibleColumns: InternalBudgetColumnsVisibility;
    onChangeVisibleColumns: (updated: InternalBudgetColumnsVisibility) => void;
}

export const InternalBudgetColumnSelector: React.FC<InternalBudgetColumnSelectorProps> = ({
    visibleColumns,
    onChangeVisibleColumns
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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

    const visibleCount = Object.values(visibleColumns).filter(Boolean).length;
    const totalCount = BUDGET_COLUMN_DEFINITIONS.length;
    const isAnyHidden = visibleCount < totalCount;

    const handleToggle = (columnId: keyof InternalBudgetColumnsVisibility) => {
        // Prevent hiding all columns
        if (visibleColumns[columnId] && visibleCount <= 1) {
            return;
        }
        onChangeVisibleColumns({
            ...visibleColumns,
            [columnId]: !visibleColumns[columnId]
        });
    };

    const handleReset = () => {
        onChangeVisibleColumns(DEFAULT_COLUMNS_VISIBILITY);
    };

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition shadow-sm ${
                    isAnyHidden
                        ? 'border-amber-400 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-600'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200'
                }`}
                title="Configurar columnas visibles en la tabla y en la hoja de impresión"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                    />
                </svg>
                <span>Columnas ({visibleCount}/{totalCount})</span>
                {isAnyHidden && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                )}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-3 w-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl z-50 p-3 animate-in fade-in zoom-in-95 duration-100">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-700">
                        <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>Ver / Ocultar Columnas</span>
                        </span>
                        {isAnyHidden && (
                            <button
                                type="button"
                                onClick={handleReset}
                                className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                Mostrar todas
                            </button>
                        )}
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2.5">
                        Selecciona las columnas que deseas mostrar tanto en pantalla como al imprimir:
                    </p>

                    <div className="space-y-1.5">
                        {BUDGET_COLUMN_DEFINITIONS.map((col) => {
                            const isChecked = visibleColumns[col.id];
                            return (
                                <label
                                    key={col.id}
                                    className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition select-none ${
                                        isChecked
                                            ? 'bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700'
                                            : 'opacity-60 hover:opacity-100 hover:bg-slate-50 dark:hover:bg-slate-700/30'
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => handleToggle(col.id)}
                                        className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                                    />
                                    <div className="min-w-0">
                                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                            {col.label}
                                        </div>
                                        <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                            {col.description}
                                        </div>
                                    </div>
                                </label>
                            );
                        })}
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/80 flex justify-end">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InternalBudgetColumnSelector;
