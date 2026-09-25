import React from 'react';
import { QuoteCalculationResult, QuoteInput } from '../../types';

interface ClientQuoteEquipmentTableProps {
    input: QuoteInput;
    calculation: QuoteCalculationResult;
}

export const ClientQuoteEquipmentTable: React.FC<ClientQuoteEquipmentTableProps> = ({
    input,
    calculation
}) => {
    return (
        <div className="my-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Equipamiento y Componentes Incluidos (Llave en Mano)
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px]">
                        <tr>
                            <th className="py-2 px-3">Rubro / Componente</th>
                            <th className="py-2 px-3">Descripción Técnica y Marcas Certificadas</th>
                            <th className="py-2 px-3 text-center">Cantidad</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                        <tr>
                            <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">Inversor Central</td>
                            <td className="py-2.5 px-3 leading-snug">
                                Inversor de {input.inverterCapacityKw} kW nominal. {calculation.specs.inverterBrand}. Monitoreo remoto en tiempo real vía App móvil WiFi.
                            </td>
                            <td className="py-2.5 px-3 text-center font-medium whitespace-nowrap">1 unidad</td>
                        </tr>
                        <tr>
                            <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">Módulos Solares</td>
                            <td className="py-2.5 px-3 leading-snug">
                                {calculation.panelCount} Paneles monocristalinos de {calculation.panelWattage}W ({input.peakPowerKwp.toFixed(2)} kWp total). {calculation.specs.panelsBrand}. Alta eficiencia ante sombras.
                            </td>
                            <td className="py-2.5 px-3 text-center font-medium whitespace-nowrap">{calculation.panelCount} módulos</td>
                        </tr>
                        <tr>
                            <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">Canalización & Cableado</td>
                            <td className="py-2.5 px-3 leading-snug">
                                {input.conduitMeters} metros de canalización profesional. {calculation.specs.conduitSpecs}.
                            </td>
                            <td className="py-2.5 px-3 text-center font-medium whitespace-nowrap">{input.conduitMeters} mts</td>
                        </tr>
                        <tr>
                            <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">Protecciones DC / AC</td>
                            <td className="py-2.5 px-3 leading-snug">
                                {calculation.specs.protectionsSpecs}.
                            </td>
                            <td className="py-2.5 px-3 text-center font-medium whitespace-nowrap">Kit Integral</td>
                        </tr>
                        <tr>
                            <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">Estructura de Montaje</td>
                            <td className="py-2.5 px-3 leading-snug">
                                Estructura de aluminio anodizado AL6005-T5 resistente a vientos de 200+ km/h con herrajes inoxidables.
                            </td>
                            <td className="py-2.5 px-3 text-center font-medium whitespace-nowrap">{calculation.panelCount} soportes</td>
                        </tr>
                        {input.includeBatteries && (
                            <tr>
                                <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">Almacenamiento Litio</td>
                                <td className="py-2.5 px-3 leading-snug">
                                    Batería American 15kW LiFePO4 ({input.batteryKwh} kWh total) con BMS inteligente integrado.
                                </td>
                                <td className="py-2.5 px-3 text-center font-medium whitespace-nowrap">{input.batteryKwh} kWh</td>
                            </tr>
                        )}
                        {(input.includeEdesPermits !== false || input.includeMeterBaseCl200 !== false) && (
                            <tr>
                                <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">Requisitos EDES</td>
                                <td className="py-2.5 px-3 leading-snug">
                                    {[
                                        input.includeEdesPermits !== false ? 'Gestión de permisos de interconexión' : null,
                                        input.includeMeterBaseCl200 !== false ? 'Base CL 200 para medidor bidireccional' : null
                                    ].filter(Boolean).join(' + ')}.
                                </td>
                                <td className="py-2.5 px-3 text-center font-medium whitespace-nowrap">Incluido</td>
                            </tr>
                        )}
                        <tr>
                            <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">Instalación y Puesta en Marcha</td>
                            <td className="py-2.5 px-3 leading-snug">
                                Mano de obra y supervisión técnica, transporte y logística, pruebas y puesta en marcha.
                            </td>
                            <td className="py-2.5 px-3 text-center font-medium whitespace-nowrap">Completo</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClientQuoteEquipmentTable;
