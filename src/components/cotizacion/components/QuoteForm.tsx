import React from 'react';
import { EquipmentQuality, MountingType, QuoteInput, SystemType } from '../types';
import { QUALITY_DETAILS } from '../constants';

interface QuoteFormProps {
    input: QuoteInput;
    onChange: (updated: Partial<QuoteInput>) => void;
    onClientChange: (field: string, value: string) => void;
}

export const QuoteForm: React.FC<QuoteFormProps> = ({ input, onChange, onClientChange }) => {
    const commonInverterSizes = [3, 5, 6, 8, 10, 12, 15];

    return (
        <div className="space-y-6">
            {/* Section 1: Datos del Cliente y Proyecto */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            Datos del Cliente y Propuesta
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Información que aparecerá en el encabezado de la cotización formal
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Nombre del Cliente *
                        </label>
                        <input
                            type="text"
                            value={input.client.name}
                            onChange={(e) => onClientChange('name', e.target.value)}
                            placeholder="Ej. Ing. Carlos Martínez"
                            className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Teléfono / WhatsApp
                        </label>
                        <input
                            type="text"
                            value={input.client.phone}
                            onChange={(e) => onClientChange('phone', e.target.value)}
                            placeholder="Ej. (809) 555-0123"
                            className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Ubicación / Ciudad
                        </label>
                        <input
                            type="text"
                            value={input.client.location}
                            onChange={(e) => onClientChange('location', e.target.value)}
                            placeholder="Ej. Santo Domingo Este / Santiago"
                            className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Nº de Cotización
                        </label>
                        <input
                            type="text"
                            value={input.client.quoteNumber}
                            onChange={(e) => onClientChange('quoteNumber', e.target.value)}
                            className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Fecha de Emisión
                        </label>
                        <input
                            type="date"
                            value={input.client.date}
                            onChange={(e) => onClientChange('date', e.target.value)}
                            className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Moneda de Presentación
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => onChange({ currency: 'DOP' })}
                                className={`py-2 text-xs font-bold rounded-lg border transition ${
                                    input.currency === 'DOP'
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'
                                }`}
                            >
                                Pesos (RD$)
                            </button>
                            <button
                                type="button"
                                onClick={() => onChange({ currency: 'USD' })}
                                className={`py-2 text-xs font-bold rounded-lg border transition ${
                                    input.currency === 'USD'
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'
                                }`}
                            >
                                Dólares (USD)
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 2: Parámetros del Sistema Solar */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            Dimensionamiento Técnico del Sistema
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Capacidad del inversor, potencia pico de placas y nivel de calidad
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Inverter Capacity */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">
                            Capacidad del Inversor (kW)
                        </label>
                        <div className="flex items-center gap-2 mb-2">
                            <input
                                type="number"
                                step="0.5"
                                min="1"
                                max="100"
                                value={input.inverterCapacityKw}
                                onChange={(e) => onChange({ inverterCapacityKw: parseFloat(e.target.value) || 0 })}
                                className="w-28 px-3 py-2 text-base font-bold text-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">kW</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {commonInverterSizes.map((size) => (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => onChange({ inverterCapacityKw: size })}
                                    className={`px-2.5 py-1 text-xs font-medium rounded-md border transition ${
                                        input.inverterCapacityKw === size
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600'
                                    }`}
                                >
                                    {size} kW
                                </button>
                            ))}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                            Inversor central monofásico o trifásico con MPPT integrado.
                        </p>
                    </div>

                    {/* Peak Power kWp (Escribir los kW pico) */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">
                            Potencia Fotovoltaica Total (kW pico / kWp)
                        </label>
                        <div className="flex items-center gap-2 mb-2">
                            <input
                                type="number"
                                step="0.1"
                                min="0.5"
                                max="150"
                                value={input.peakPowerKwp}
                                onChange={(e) => onChange({ peakPowerKwp: parseFloat(e.target.value) || 0 })}
                                className="w-32 px-3 py-2 text-base font-bold text-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">kWp</span>
                            <div className="flex items-center gap-1 ml-2">
                                <button
                                    type="button"
                                    onClick={() => onChange({ peakPowerKwp: Math.max(0.5, +(input.peakPowerKwp - 0.5).toFixed(1)) })}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 font-bold"
                                >
                                    -
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onChange({ peakPowerKwp: +(input.peakPowerKwp + 0.5).toFixed(1) })}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 font-bold"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/40 p-2.5 rounded-lg border border-slate-200 dark:border-slate-600/50">
                            Equivale aprox. a <span className="font-bold text-blue-600 dark:text-blue-400">{Math.ceil((input.peakPowerKwp * 1000) / (input.quality === 'premium' ? 600 : 580))} módulos</span> de {input.quality === 'premium' ? '600W' : '580W'}.
                            Relación DC/AC: <span className="font-semibold">{(input.peakPowerKwp / (input.inverterCapacityKw || 1)).toFixed(2)}x</span>
                        </div>
                    </div>
                </div>

                {/* Calidad: Normal vs Premium */}
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-3">
                        Nivel de Calidad de los Equipos (Normal o Premium) *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Option Normal */}
                        <div
                            onClick={() => onChange({ quality: 'normal' })}
                            className={`cursor-pointer rounded-xl p-4 border-2 transition-all ${
                                input.quality === 'normal'
                                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/20 shadow-md ring-2 ring-blue-500/20'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-4 h-4 rounded-full border-2 border-blue-600 flex items-center justify-center">
                                        {input.quality === 'normal' && <span className="w-2 h-2 bg-blue-600 rounded-full"></span>}
                                    </span>
                                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                                        Calidad Normal / Estándar
                                    </span>
                                </div>
                                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                                    Excelente Costo-Beneficio
                                </span>
                            </div>
                            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 ml-6">
                                <li>• <strong>Inversor:</strong> {QUALITY_DETAILS.normal.inverterBrand}</li>
                                <li>• <strong>Paneles:</strong> {QUALITY_DETAILS.normal.panelsBrand}</li>
                                <li>• <strong>Garantías:</strong> {QUALITY_DETAILS.normal.warrantyInverter} y {QUALITY_DETAILS.normal.warrantyPanels}</li>
                                <li>• <strong>Protecciones:</strong> {QUALITY_DETAILS.normal.protectionsSpecs}</li>
                            </ul>
                        </div>

                        {/* Option Premium */}
                        <div
                            onClick={() => onChange({ quality: 'premium' })}
                            className={`cursor-pointer rounded-xl p-4 border-2 transition-all ${
                                input.quality === 'premium'
                                    ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-900/20 shadow-md ring-2 ring-amber-500/20'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-4 h-4 rounded-full border-2 border-amber-500 flex items-center justify-center">
                                        {input.quality === 'premium' && <span className="w-2 h-2 bg-amber-500 rounded-full"></span>}
                                    </span>
                                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                                        Calidad Premium High-End
                                    </span>
                                </div>
                                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300">
                                    Máxima Durabilidad & Garantía
                                </span>
                            </div>
                            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 ml-6">
                                <li>• <strong>Inversor:</strong> {QUALITY_DETAILS.premium.inverterBrand}</li>
                                <li>• <strong>Paneles:</strong> {QUALITY_DETAILS.premium.panelsBrand}</li>
                                <li>• <strong>Garantías:</strong> {QUALITY_DETAILS.premium.warrantyInverter} y {QUALITY_DETAILS.premium.warrantyPanels}</li>
                                <li>• <strong>Protecciones:</strong> {QUALITY_DETAILS.premium.protectionsSpecs}</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Section 3: Canalización y Condiciones de Instalación */}
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Canalización */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                            Metros de Canalización
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min="5"
                                max="300"
                                value={input.conduitMeters}
                                onChange={(e) => onChange({ conduitMeters: parseInt(e.target.value, 10) || 0 })}
                                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">mts</span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                            Ej. 25m de tubería y cableado solar DC/AC
                        </p>
                    </div>

                    {/* Tipo de Montaje */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                            Tipo de Techo / Superficie
                        </label>
                        <select
                            value={input.mountingType}
                            onChange={(e) => onChange({ mountingType: e.target.value as MountingType })}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="techo_plano">Techo Plano / Platabanda de Hormigón</option>
                            <option value="aluzinc">Techo de Aluzinc / Metal</option>
                            <option value="tejas">Techo de Tejas</option>
                            <option value="suelo">Montaje en Suelo / Jardín</option>
                        </select>
                    </div>

                    {/* Tipo de Sistema */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                            Modalidad del Sistema
                        </label>
                        <select
                            value={input.systemType}
                            onChange={(e) => {
                                const newType = e.target.value as SystemType;
                                onChange({
                                    systemType: newType,
                                    includeBatteries: newType !== 'ongrid'
                                });
                            }}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="ongrid">Interconectado a Red (On-Grid / Medición Neta)</option>
                            <option value="hybrid">Híbrido (Paneles + Baterías + Red CDEEE/Ede)</option>
                            <option value="offgrid">Aislado 100% Autónomo (Off-Grid)</option>
                        </select>
                    </div>
                </div>

                {/* Optional Battery Expansion */}
                {input.systemType !== 'ongrid' && (
                    <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600">
                        <div className="flex items-center justify-between mb-2">
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={input.includeBatteries}
                                    onChange={(e) => onChange({ includeBatteries: e.target.checked })}
                                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                                />
                                Incluir Banco de Baterías de Litio LiFePO4
                            </label>
                            {input.includeBatteries && (
                                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                                    {input.batteryKwh} kWh
                                </span>
                            )}
                        </div>

                        {input.includeBatteries && (
                            <div className="flex items-center gap-4 mt-2">
                                <input
                                    type="range"
                                    min="2.5"
                                    max="30"
                                    step="2.5"
                                    value={input.batteryKwh}
                                    onChange={(e) => onChange({ batteryKwh: parseFloat(e.target.value) })}
                                    className="flex-grow accent-blue-600"
                                />
                                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                                    {input.batteryKwh} kWh almacenamiento
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuoteForm;
