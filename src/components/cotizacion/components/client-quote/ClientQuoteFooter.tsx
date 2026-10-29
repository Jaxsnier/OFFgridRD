import React, { useState } from 'react';
import { QuoteCalculationResult, QuoteInput } from '../../types';
import { formatCurrency } from '../../utils/pricingCalculator';

interface ClientQuoteFooterProps {
    input: QuoteInput;
    calculation: QuoteCalculationResult;
    onChangeInput?: (updated: Partial<QuoteInput>) => void;
}

export const ClientQuoteFooter: React.FC<ClientQuoteFooterProps> = ({
    input,
    calculation,
    onChangeInput
}) => {
    const [isEditingTotal, setIsEditingTotal] = useState(false);
    const effectiveTotal =
        input.customClientTotal !== undefined
            ? input.customClientTotal
            : calculation.totalQuotedPrice;
    const [tempTotalValue, setTempTotalValue] = useState(String(effectiveTotal));

    const handleSaveTotal = () => {
        if (!onChangeInput) return;
        const val = parseFloat(tempTotalValue);
        if (!isNaN(val) && val >= 0) {
            onChangeInput({ customClientTotal: Math.round(val) });
        }
        setIsEditingTotal(false);
    };

    const handleCancelTotal = () => {
        setTempTotalValue(String(effectiveTotal));
        setIsEditingTotal(false);
    };

    const handleResetCalculated = () => {
        if (onChangeInput) {
            onChangeInput({ customClientTotal: undefined });
        }
        setTempTotalValue(String(calculation.totalQuotedPrice));
        setIsEditingTotal(false);
    };

    return (
        <>
            {/* Total Investment Block */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 my-3 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block">
                            Total Inversión del Proyecto Llave en Mano
                        </span>
                        {input.showDiscount5PercentBadge && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm animate-pulse">
                                (5% descuento aplicado)
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                        Incluye equipos, canalización ({input.conduitMeters}m), estructura, transporte e instalación completa.
                    </p>
                </div>

                <div className="text-right whitespace-nowrap">
                    {isEditingTotal ? (
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min="0"
                                step="any"
                                value={tempTotalValue}
                                onChange={(e) => setTempTotalValue(e.target.value)}
                                className="w-36 px-2.5 py-1 text-base font-mono font-bold text-right rounded border border-blue-400 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={handleSaveTotal}
                                className="px-2.5 py-1 text-xs font-bold rounded bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                            >
                                Guardar
                            </button>
                            <button
                                type="button"
                                onClick={handleCancelTotal}
                                className="px-2 py-1 text-xs font-semibold rounded bg-slate-200 hover:bg-slate-300 text-slate-700"
                            >
                                Cancelar
                            </button>
                            {input.customClientTotal !== undefined && (
                                <button
                                    type="button"
                                    onClick={handleResetCalculated}
                                    className="text-[10px] text-blue-600 underline font-medium hover:text-blue-800"
                                    title="Restablecer al total calculado por el sistema"
                                >
                                    Restablecer
                                </button>
                            )}
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center justify-end gap-2">
                                <div className="text-3xl font-black text-blue-700 leading-none">
                                    {formatCurrency(effectiveTotal, input.currency, input.exchangeRate)}
                                </div>
                                {onChangeInput && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setTempTotalValue(String(effectiveTotal));
                                            setIsEditingTotal(true);
                                        }}
                                        className="print:hidden p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-100/50 transition"
                                        title="Modificar valor total de la cotización"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                            />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center justify-end gap-1.5 mt-0.5">
                                {input.customClientTotal !== undefined && (
                                    <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
                                        Total personalizado
                                    </span>
                                )}
                                <span className="text-[11px] font-semibold text-slate-500">
                                    Precios expresados en {input.currency}
                                </span>
                            </div>
                        </div>
                    )}
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
                    <p className="text-[10px] text-slate-500 italic mt-1.5">
                        * Esta garantía está sujeta a variantes según el fabricante.
                    </p>
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
