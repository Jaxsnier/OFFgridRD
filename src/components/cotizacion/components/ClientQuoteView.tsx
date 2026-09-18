import React, { useState } from 'react';
import { QuoteCalculationResult, QuoteInput } from '../types';
import { formatCurrency } from '../utils/pricingCalculator';
import { QUALITY_DETAILS } from '../constants';
import { printElementById } from '../utils/printHelper';

interface ClientQuoteViewProps {
    input: QuoteInput;
    calculation: QuoteCalculationResult;
    onBackToEdit: () => void;
    onViewInternalBudget: () => void;
}

export const ClientQuoteView: React.FC<ClientQuoteViewProps> = ({
    input,
    calculation,
    onBackToEdit,
    onViewInternalBudget
}) => {
    const [copied, setCopied] = useState(false);
    const qDetails = QUALITY_DETAILS[input.quality];

    const handlePrint = () => {
        const title = `Cotizacion_${input.client.quoteNumber || 'Solar'}_${input.client.name.replace(/\s+/g, '_')}`;
        printElementById('printable-client-quote-document', title);
    };

    const handleCopyText = () => {
        const text = `☀️ *COTIZACIÓN SOLAR OFFgridRD* ☀️
📄 *Nº Cotización:* ${input.client.quoteNumber}
👤 *Cliente:* ${input.client.name}
📍 *Ubicación:* ${input.client.location || 'República Dominicana'}

⚡ *CARACTERÍSTICAS DEL SISTEMA:*
• Inversor: ${input.inverterCapacityKw} kW (${calculation.specs.inverterBrand})
• Potencia Solar: ${input.peakPowerKwp.toFixed(2)} kWp (${calculation.panelCount} paneles de ${calculation.panelWattage}W)
• Calidad: ${qDetails.name}
• Generación Estimada: ~${calculation.estimatedMonthlyKwh} kWh/mes
• Canalización: ${input.conduitMeters} metros incluidos
• Protecciones: DC/AC de grado industrial + Puesta a tierra
${input.includeBatteries ? `• Batería: ${input.batteryKwh} kWh Litio LiFePO4\n` : ''}
💰 *INVERSIÓN TOTAL LLAVE EN MANO:*
👉 ${formatCurrency(calculation.totalQuotedPrice, input.currency, input.exchangeRate)} ${input.currency}

🛡️ *GARANTÍAS:*
• Inversor: ${calculation.specs.warrantyInverter}
• Paneles: ${calculation.specs.warrantyPanels}
• Instalación y soporte técnico garantizado`;

        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    const handleWhatsApp = () => {
        const cleanPhone = input.client.phone.replace(/[^0-9]/g, '');
        const message = encodeURIComponent(
            `Hola ${input.client.name}, le comparto la cotización formal de su sistema solar con OFFgridRD (${input.inverterCapacityKw}kW / ${input.peakPowerKwp.toFixed(1)}kWp). Inversión total: ${formatCurrency(calculation.totalQuotedPrice, input.currency, input.exchangeRate)}.`
        );
        const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${message}` : `https://wa.me/?text=${message}`;
        window.open(url, '_blank');
    };

    return (
        <div className="space-y-6">
            {/* Action Bar (Hidden when printing) */}
            <div className="print:hidden flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onBackToEdit}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                        ← Modificar Datos
                    </button>
                    <button
                        type="button"
                        onClick={onViewInternalBudget}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                        Ver Presupuesto Interno (Mi Hoja)
                    </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={handleCopyText}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                        {copied ? '✓ ¡Copiado!' : 'Copiar Texto para WhatsApp'}
                    </button>
                    <button
                        type="button"
                        onClick={handleWhatsApp}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                    >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.299.144.347.491 1.2.534 1.288.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.087-.179.181-.077.355.101.173.449.741.964 1.2.662.591 1.221.774 1.394.86.173.087.275.072.376-.044.101-.116.433-.506.549-.679.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z" />
                        </svg>
                        Abrir WhatsApp
                    </button>
                    <button
                        type="button"
                        onClick={handlePrint}
                        className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-md"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Imprimir / Guardar PDF
                    </button>
                </div>
            </div>

            {/* Printable Formal Client Document */}
            <div id="printable-client-quote-document" className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-200 max-w-4xl mx-auto flex flex-col justify-between print:border-none print:shadow-none print:p-0 print:m-0">
                {/* Document Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-blue-600 pb-4 gap-4 mb-3">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl tracking-tighter shadow-sm">
                                OFF
                            </div>
                            <div>
                                <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-tight">
                                    OFFgrid<span className="text-blue-600">RD</span>
                                </h1>
                                <p className="text-xs text-slate-500 font-medium">
                                    Soluciones de Energía Solar Fotovoltaica & Almacenamiento
                                </p>
                            </div>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">
                            RNC: 1-32-XXXXX-X • Santo Domingo, República Dominicana<br />
                            Contacto: (829) 555-SOLAR • info@offgridrd.com
                        </p>
                    </div>

                    <div className="sm:text-right bg-slate-50 sm:bg-transparent p-2.5 sm:p-0 rounded-lg w-full sm:w-auto">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 font-bold text-xs rounded-md uppercase tracking-wider mb-1.5">
                            Propuesta Comercial
                        </span>
                        <div className="text-sm font-bold text-slate-900">
                            Cotización: <span className="font-mono text-blue-600">{input.client.quoteNumber}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                            Fecha: {input.client.date} | Validez: 15 días
                        </div>
                    </div>
                </div>

                {/* Client & System Quick Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/90 text-xs">
                    <div>
                        <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider block">
                            Preparado para el Cliente:
                        </span>
                        <h3 className="text-base font-bold text-slate-900 mt-0.5">
                            {input.client.name || 'Cliente'}
                        </h3>
                        <div className="flex flex-wrap gap-x-4 text-xs text-slate-600 mt-1">
                            {input.client.phone && <span>Tel: {input.client.phone}</span>}
                            {input.client.location && <span>Ubicación: {input.client.location}</span>}
                        </div>
                    </div>

                    <div className="md:border-l md:border-slate-200 md:pl-4">
                        <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider block">
                            Resumen del Sistema Propuesto:
                        </span>
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-1 text-xs">
                            <div>
                                <span className="text-slate-500">Inversor: </span>
                                <span className="font-bold text-slate-900">{input.inverterCapacityKw} kW</span>
                            </div>
                            <div>
                                <span className="text-slate-500">Potencia Solar: </span>
                                <span className="font-bold text-blue-600">{input.peakPowerKwp.toFixed(2)} kWp</span>
                            </div>
                            <div>
                                <span className="text-slate-500">Calidad: </span>
                                <span className="font-bold text-slate-800">{qDetails.name}</span>
                            </div>
                            <div>
                                <span className="text-slate-500">Generación: </span>
                                <span className="font-bold text-emerald-600">~{calculation.estimatedMonthlyKwh} kWh/mes</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Equipment Scope Table */}
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
                                            Banco de baterías LiFePO4 de {input.batteryKwh} kWh, 6,000 ciclos de vida útil al 90% DoD con BMS inteligente integrado.
                                        </td>
                                        <td className="py-2.5 px-3 text-center font-medium whitespace-nowrap">{input.batteryKwh} kWh</td>
                                    </tr>
                                )}
                                <tr>
                                    <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">Instalación y Puesta en Marcha</td>
                                    <td className="py-2.5 px-3 leading-snug">
                                        Mano de obra certificada por técnicos calificados, pruebas de tensión, configuración de monitoreo y entrega operativa.
                                    </td>
                                    <td className="py-2.5 px-3 text-center font-medium whitespace-nowrap">Completo</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Total Investment Block */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 my-3 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div>
                        <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block">
                            Total Inversión del Proyecto Llave en Mano
                        </span>
                        <p className="text-xs text-slate-600 mt-0.5">
                            Incluye equipos, canalización ({input.conduitMeters}m), estructura, transporte e instalación completa.
                        </p>
                    </div>
                    <div className="text-right whitespace-nowrap">
                        <div className="text-3xl font-black text-blue-700 leading-none">
                            {formatCurrency(calculation.totalQuotedPrice, input.currency, input.exchangeRate)}
                        </div>
                        <span className="text-[11px] font-semibold text-slate-500">
                            Precios expresados en {input.currency}
                        </span>
                    </div>
                </div>

                {/* Terms and Warranties */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 border-t border-slate-200 pt-3 my-2">
                    <div>
                        <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-1 text-xs">
                            Garantías del Sistema
                        </h4>
                        <ul className="space-y-1">
                            <li>• <strong>Inversor:</strong> {calculation.specs.warrantyInverter}</li>
                            <li>• <strong>Paneles Solares:</strong> {calculation.specs.warrantyPanels}</li>
                            <li>• <strong>Instalación Eléctrica:</strong> 2 años de garantía en mano de obra y fijaciones</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-1 text-xs">
                            Condiciones Comerciales
                        </h4>
                        <ul className="space-y-1">
                            <li>• <strong>Forma de Pago:</strong> 60% anticipo, 30% llegada de equipos, 10% entrega final</li>
                            <li>• <strong>Tiempo de Ejecución:</strong> 3 a 7 días hábiles tras recibir equipos</li>
                            <li>• <strong>Vigencia:</strong> Precios sujetos a confirmación tras 15 días</li>
                        </ul>
                    </div>
                </div>

                {/* Signatures */}
                <div className="signatures-block grid grid-cols-2 gap-8 mt-auto pt-6 border-t border-slate-200 text-center text-xs text-slate-500">
                    <div>
                        <div className="w-44 mx-auto border-b border-slate-400 mb-1.5"></div>
                        <span className="font-bold text-slate-800 block text-xs">OFFgridRD SRL</span>
                        <span>Ingeniería & Proyectos Fotovoltaicos</span>
                    </div>
                    <div>
                        <div className="w-44 mx-auto border-b border-slate-400 mb-1.5"></div>
                        <span className="font-bold text-slate-800 block text-xs">{input.client.name || 'Cliente'}</span>
                        <span>Aceptado / Conforme</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientQuoteView;
