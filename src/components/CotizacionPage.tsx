import React, { useState, useMemo } from 'react';
import { QuoteInput } from './cotizacion/types';
import { DEFAULT_QUOTE_INPUT, QuotePreset } from './cotizacion/constants';
import { calculateQuote } from './cotizacion/utils/pricingCalculator';
import QuotePresets from './cotizacion/components/QuotePresets';
import QuoteForm from './cotizacion/components/QuoteForm';
import QuoteSummaryCard from './cotizacion/components/QuoteSummaryCard';
import ClientQuoteView from './cotizacion/components/ClientQuoteView';
import InternalBudgetView from './cotizacion/components/InternalBudgetView';

export type CotizacionTab = 'config' | 'cliente' | 'interno';

export const CotizacionPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<CotizacionTab>('config');
    const [quoteInput, setQuoteInput] = useState<QuoteInput>(DEFAULT_QUOTE_INPUT);
    const [customOverrides, setCustomOverrides] = useState<
        Record<string, { costInternal?: number; priceQuoted?: number }>
    >({});

    // Calculate quote results
    const calculation = useMemo(() => {
        return calculateQuote(quoteInput, customOverrides);
    }, [quoteInput, customOverrides]);

    // Handlers
    const handleInputChange = (updated: Partial<QuoteInput>) => {
        setQuoteInput((prev) => ({ ...prev, ...updated }));
    };

    const handleClientChange = (field: string, value: string) => {
        setQuoteInput((prev) => ({
            ...prev,
            client: {
                ...prev.client,
                [field]: value
            }
        }));
    };

    const handleSelectPreset = (preset: QuotePreset) => {
        setQuoteInput((prev) => ({
            ...prev,
            inverterCapacityKw: preset.inverterKw,
            peakPowerKwp: preset.kwp,
            conduitMeters: preset.conduitMeters,
            quality: preset.recommendedQuality
        }));
    };

    const handleUpdateOverride = (itemId: string, costInternal?: number, priceQuoted?: number) => {
        setCustomOverrides((prev) => {
            const current = prev[itemId] || {};
            return {
                ...prev,
                [itemId]: {
                    costInternal: costInternal !== undefined ? costInternal : current.costInternal,
                    priceQuoted: priceQuoted !== undefined ? priceQuoted : current.priceQuoted
                }
            };
        });
    };

    const handleResetOverrides = () => {
        setCustomOverrides({});
    };

    return (
        <div className="min-h-full bg-slate-50 dark:bg-slate-900 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 transition-colors">
            <div className="max-w-7xl mx-auto">
                {/* Header Title and Tabs */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="p-1.5 rounded-lg bg-blue-600 text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                Cotizador Rápido & Presupuesto
                            </h1>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Genera propuestas comerciales inmediatas para clientes y tu hoja de costos divididos por partidas.
                        </p>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex items-center bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl self-start md:self-auto border border-slate-300/60 dark:border-slate-700">
                        <button
                            type="button"
                            onClick={() => setActiveTab('config')}
                            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
                                activeTab === 'config'
                                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            1. Parámetros
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('cliente')}
                            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
                                activeTab === 'cliente'
                                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            2. Cotización Cliente
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('interno')}
                            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
                                activeTab === 'interno'
                                    ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            3. Presupuesto Interno
                        </button>
                    </div>
                </div>

                {/* Tab 1: Configuration Form */}
                {activeTab === 'config' && (
                    <div className="space-y-6">
                        {/* Quick Presets Bar */}
                        <QuotePresets
                            onSelectPreset={handleSelectPreset}
                            currentKw={quoteInput.inverterCapacityKw}
                            currentKwp={quoteInput.peakPowerKwp}
                        />

                        {/* Main Grid: Form + Summary Card */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                            <div className="lg:col-span-8">
                                <QuoteForm
                                    input={quoteInput}
                                    onChange={handleInputChange}
                                    onClientChange={handleClientChange}
                                />
                            </div>

                            <div className="lg:col-span-4">
                                <QuoteSummaryCard
                                    calculation={calculation}
                                    currency={quoteInput.currency}
                                    exchangeRate={quoteInput.exchangeRate}
                                    onViewClientQuote={() => setActiveTab('cliente')}
                                    onViewInternalBudget={() => setActiveTab('interno')}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab 2: Client Formal Quote */}
                {activeTab === 'cliente' && (
                    <ClientQuoteView
                        input={quoteInput}
                        calculation={calculation}
                        onBackToEdit={() => setActiveTab('config')}
                        onViewInternalBudget={() => setActiveTab('interno')}
                    />
                )}

                {/* Tab 3: Internal Divided Budget Sheet */}
                {activeTab === 'interno' && (
                    <InternalBudgetView
                        input={quoteInput}
                        calculation={calculation}
                        onUpdateOverride={handleUpdateOverride}
                        onResetOverrides={handleResetOverrides}
                        onBackToEdit={() => setActiveTab('config')}
                        onViewClientQuote={() => setActiveTab('cliente')}
                    />
                )}
            </div>
        </div>
    );
};

export default CotizacionPage;
