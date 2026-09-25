import React from 'react';
import { QuoteCalculationResult, QuoteInput } from '../../types';
import { formatCurrency } from '../../utils/pricingCalculator';

interface ClientQuoteFooterProps {
    input: QuoteInput;
    calculation: QuoteCalculationResult;
}

export const ClientQuoteFooter: React.FC<ClientQuoteFooterProps> = ({
    input,
    calculation
}) => {
    return (
        <>
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
        </>
    );
};

export default ClientQuoteFooter;
