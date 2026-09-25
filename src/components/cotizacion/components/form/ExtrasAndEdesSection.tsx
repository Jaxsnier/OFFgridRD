import React from 'react';
import { MountingType, QuoteInput } from '../../types';
import {
    PERFIL_ALUMINIO_USD,
    MID_CLAMP_USD,
    END_CLAMP_USD,
    BASE_AJUSTABLE_15_GRADOS_ALUMINIO_USD,
    ROLLO_CABLE_PV_4MM_USD,
    GESTION_PERMISOS_EDES_USD,
    BASE_CL_200_MEDIDOR_USD,
    CAJA_PROTECCION_PV_1_STRING_USD,
    CAJA_PROTECCION_PV_2_STRING_USD,
    TUBO_EMT_1_PULGADA_USD,
    TUBO_EMT_METROS_POR_UNIDAD
} from '../../pricing';

interface ExtrasAndEdesSectionProps {
    input: QuoteInput;
    onChange: (updated: Partial<QuoteInput>) => void;
}

export const ExtrasAndEdesSection: React.FC<ExtrasAndEdesSectionProps> = ({ input, onChange }) => {
    const tubosCount = Math.max(1, Math.ceil(input.conduitMeters / TUBO_EMT_METROS_POR_UNIDAD));
    const cableRolls = input.cableRollsCount ?? 1;
    const protectionStrings = input.protectionStrings ?? 1;
    const includeEdesPermits = input.includeEdesPermits ?? true;
    const includeMeterBaseCl200 = input.includeMeterBaseCl200 ?? true;
    const includeAdjustableBase = input.includeAdjustableBase ?? (input.mountingType === 'techo_plano');

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            {/* Sección 2: REQUISITOS EDES */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 text-[11px] font-black rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300">
                        SECCIÓN 2
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                        Requisitos EDES
                    </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/40 cursor-pointer">
                        <div className="flex items-center gap-2.5">
                            <input
                                type="checkbox"
                                checked={includeEdesPermits}
                                onChange={(e) => onChange({ includeEdesPermits: e.target.checked })}
                                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                            />
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                Gestión de permisos
                            </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            ${GESTION_PERMISOS_EDES_USD} USD
                        </span>
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/40 cursor-pointer">
                        <div className="flex items-center gap-2.5">
                            <input
                                type="checkbox"
                                checked={includeMeterBaseCl200}
                                onChange={(e) => onChange({ includeMeterBaseCl200: e.target.checked })}
                                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                            />
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                Base CL 200 para medidor
                            </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            ${BASE_CL_200_MEDIDOR_USD} USD
                        </span>
                    </label>
                </div>
            </div>

            {/* Sección 3: EXTRAS (Canalizaciones y Cajas de Protecciones) */}
            <div className="pt-5 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 text-[11px] font-black rounded bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300">
                        SECCIÓN 3
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                        Extras (Canalizaciones y Cajas de Protección PV)
                    </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Caja de protección PV */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                            Caja de Protección PV
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => onChange({ protectionStrings: 1 })}
                                className={`p-2 rounded-lg border text-xs font-bold transition ${
                                    protectionStrings === 1
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'
                                }`}
                            >
                                1 String (${CAJA_PROTECCION_PV_1_STRING_USD})
                            </button>
                            <button
                                type="button"
                                onClick={() => onChange({ protectionStrings: 2 })}
                                className={`p-2 rounded-lg border text-xs font-bold transition ${
                                    protectionStrings === 2
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'
                                }`}
                            >
                                2 Strings (${CAJA_PROTECCION_PV_2_STRING_USD})
                            </button>
                        </div>
                    </div>

                    {/* Tubo EMT de 1' */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                            Canalización (Tubo EMT 1' = ${TUBO_EMT_1_PULGADA_USD} USD)
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min="3"
                                max="300"
                                step="3"
                                value={input.conduitMeters}
                                onChange={(e) => onChange({ conduitMeters: parseInt(e.target.value, 10) || 3 })}
                                className="w-full px-3 py-1.5 text-sm font-bold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                            />
                            <span className="text-xs text-slate-500 font-semibold">mts</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                            Equivale a <strong>{tubosCount} tubos EMT de 1'</strong> (${tubosCount * TUBO_EMT_1_PULGADA_USD} USD)
                        </p>
                    </div>

                    {/* Rollo de cable PV 4mm */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                            Rollo de cable PV 4mm (${ROLLO_CABLE_PV_4MM_USD} USD)
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min="1"
                                max="20"
                                value={cableRolls}
                                onChange={(e) =>
                                    onChange({ cableRollsCount: Math.max(1, parseInt(e.target.value, 10) || 1) })
                                }
                                className="w-full px-3 py-1.5 text-sm font-bold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                            />
                            <span className="text-xs text-slate-500 font-semibold">rollo(s)</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                            Total cable PV: <strong>${cableRolls * ROLLO_CABLE_PV_4MM_USD} USD</strong>
                        </p>
                    </div>
                </div>
            </div>

            {/* Estructura de Montaje y Fijación (Sección 1) */}
            <div className="pt-5 border-t border-slate-200 dark:border-slate-700">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase">
                            Estructura de Montaje (Sección 1)
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Perfil de aluminio (${PERFIL_ALUMINIO_USD} USD) • Mid clamp (${MID_CLAMP_USD} USD) • End clamp (${END_CLAMP_USD} USD) • Base ajustable 15° (${BASE_AJUSTABLE_15_GRADOS_ALUMINIO_USD} USD)
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <select
                            value={input.mountingType}
                            onChange={(e) => {
                                const newMounting = e.target.value as MountingType;
                                onChange({
                                    mountingType: newMounting,
                                    includeAdjustableBase: newMounting === 'techo_plano'
                                });
                            }}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                        >
                            <option value="techo_plano">Techo Plano / Hormigón</option>
                            <option value="aluzinc">Techo de Aluzinc / Metal</option>
                            <option value="tejas">Techo de Tejas</option>
                            <option value="suelo">Montaje en Suelo</option>
                        </select>

                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={includeAdjustableBase}
                                onChange={(e) => onChange({ includeAdjustableBase: e.target.checked })}
                                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                            />
                            <span>Incluir Base ajustable 15° (${BASE_AJUSTABLE_15_GRADOS_ALUMINIO_USD} USD)</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExtrasAndEdesSection;
