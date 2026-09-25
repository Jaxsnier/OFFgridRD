import React from 'react';
import { QuoteInput } from '../../types';
import {
    CATALOGO_INVERSORES,
    PANEL_SOLAR_610W_WATTS,
    PANEL_SOLAR_610W_USD,
    BATERIA_AMERICAN_15KW_USD,
    BATERIA_AMERICAN_15KW_KWH
} from '../../pricing';

interface SystemSizingSectionProps {
    input: QuoteInput;
    onChange: (updated: Partial<QuoteInput>) => void;
}

export const SystemSizingSection: React.FC<SystemSizingSectionProps> = ({ input, onChange }) => {
    const panelCount = Math.max(1, Math.ceil((input.peakPowerKwp * 1000) / PANEL_SOLAR_610W_WATTS));
    const batteryUnits = Math.max(1, Math.ceil(input.batteryKwh / BATERIA_AMERICAN_15KW_KWH));

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        1. Componentes y Precios Específicos
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Inversores híbridos, Panel Solar 610W ($110 USD) y Batería American 15kW ($2,400 USD)
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Selección de Inversor de la Lista de Precios */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">
                        Inversor Híbrido (Catálogo Oficial)
                    </label>
                    <div className="space-y-2 mb-3">
                        {CATALOGO_INVERSORES.map((inv) => {
                            const isSelected = input.inverterCapacityKw === inv.capacityKw;
                            return (
                                <button
                                    key={inv.id}
                                    type="button"
                                    onClick={() => onChange({ inverterCapacityKw: inv.capacityKw })}
                                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-left transition ${
                                        isSelected
                                            ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-600 text-blue-900 dark:text-blue-100 ring-2 ring-blue-500/20'
                                            : 'bg-slate-50 dark:bg-slate-700/60 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    <div>
                                        <div className="text-xs font-bold">{inv.name}</div>
                                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                            Capacidad nominal: {inv.capacityKw} kW
                                        </div>
                                    </div>
                                    <span className="text-xs font-black text-blue-600 dark:text-blue-400 font-mono">
                                        ${inv.priceUsd.toLocaleString()} USD
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 dark:text-slate-400">Otra capacidad (kW):</span>
                        <input
                            type="number"
                            step="1"
                            min="1"
                            max="100"
                            value={input.inverterCapacityKw}
                            onChange={(e) => onChange({ inverterCapacityKw: parseFloat(e.target.value) || 6 })}
                            className="w-24 px-2.5 py-1.5 text-xs font-bold text-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                        />
                    </div>
                </div>

                {/* Paneles Solares 610W ($110 USD) */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">
                        Panel Solar {PANEL_SOLAR_610W_WATTS}W (${PANEL_SOLAR_610W_USD} USD c/u)
                    </label>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="flex-1">
                            <span className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                                Cantidad de Paneles ({PANEL_SOLAR_610W_WATTS}W)
                            </span>
                            <div className="flex items-center gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const nextCount = Math.max(1, panelCount - 1);
                                        onChange({
                                            peakPowerKwp: +((nextCount * PANEL_SOLAR_610W_WATTS) / 1000).toFixed(2),
                                            protectionStrings: nextCount > 10 ? 2 : 1
                                        });
                                    }}
                                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 font-bold"
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    min="1"
                                    max="250"
                                    value={panelCount}
                                    onChange={(e) => {
                                        const count = Math.max(1, parseInt(e.target.value, 10) || 1);
                                        onChange({
                                            peakPowerKwp: +((count * PANEL_SOLAR_610W_WATTS) / 1000).toFixed(2),
                                            protectionStrings: count > 10 ? 2 : 1
                                        });
                                    }}
                                    className="w-20 px-2 py-1.5 text-base font-bold text-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const nextCount = panelCount + 1;
                                        onChange({
                                            peakPowerKwp: +((nextCount * PANEL_SOLAR_610W_WATTS) / 1000).toFixed(2),
                                            protectionStrings: nextCount > 10 ? 2 : 1
                                        });
                                    }}
                                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 font-bold"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="flex-1">
                            <span className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                                Potencia Pico (kWp)
                            </span>
                            <input
                                type="number"
                                step="0.61"
                                min="0.61"
                                max="150"
                                value={input.peakPowerKwp}
                                onChange={(e) => onChange({ peakPowerKwp: parseFloat(e.target.value) || 0.61 })}
                                className="w-full px-3 py-1.5 text-base font-bold text-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/40 p-3 rounded-xl border border-slate-200 dark:border-slate-600/50 space-y-1">
                        <div className="flex justify-between">
                            <span>Módulos de {PANEL_SOLAR_610W_WATTS}W:</span>
                            <span className="font-bold text-blue-600 dark:text-blue-400">
                                {panelCount} paneles ({((panelCount * PANEL_SOLAR_610W_WATTS) / 1000).toFixed(2)} kWp)
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Costo base paneles (${PANEL_SOLAR_610W_USD} USD c/u):</span>
                            <span className="font-mono font-bold text-slate-900 dark:text-white">
                                ${(panelCount * PANEL_SOLAR_610W_USD).toLocaleString()} USD
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Batería American 15kW ($2,400 USD) */}
            <div className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-700">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <label className="flex items-center gap-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={input.includeBatteries}
                            onChange={(e) =>
                                onChange({
                                    includeBatteries: e.target.checked,
                                    batteryKwh: e.target.checked ? Math.max(15, input.batteryKwh) : input.batteryKwh
                                })
                            }
                            className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                        />
                        <span>
                            Incluir Batería American 15kW (${BATERIA_AMERICAN_15KW_USD.toLocaleString()} USD por unidad de 15 kWh)
                        </span>
                    </label>

                    {input.includeBatteries && (
                        <div className="flex items-center gap-2">
                            {[1, 2, 3].map((units) => {
                                const kwh = units * BATERIA_AMERICAN_15KW_KWH;
                                const isSelected = batteryUnits === units;
                                return (
                                    <button
                                        key={units}
                                        type="button"
                                        onClick={() => onChange({ batteryKwh: kwh })}
                                        className={`px-3 py-1 rounded-lg text-xs font-bold border transition ${
                                            isSelected
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'
                                        }`}
                                    >
                                        {units}x ({kwh} kWh — ${(units * BATERIA_AMERICAN_15KW_USD).toLocaleString()} USD)
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SystemSizingSection;
