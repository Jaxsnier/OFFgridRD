import React from 'react';
import { QuoteCalculationResult, QuoteInput } from '../../types';
import { QUALITY_DETAILS } from '../../constants';
import { DATOS_EMPRESA } from '../../pricing';

interface ClientQuoteHeaderProps {
    input: QuoteInput;
    calculation: QuoteCalculationResult;
}

export const ClientQuoteHeader: React.FC<ClientQuoteHeaderProps> = ({
    input,
    calculation
}) => {
    const qDetails = QUALITY_DETAILS[input.quality];

    return (
        <>
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
                                {DATOS_EMPRESA.eslogan}
                            </p>
                        </div>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">
                        <strong>RNC:</strong> {DATOS_EMPRESA.rnc} • <strong>Tel/WhatsApp:</strong> {DATOS_EMPRESA.telefonoWhatsapp}<br />
                        <strong>Dirección:</strong> {DATOS_EMPRESA.direccion}<br />
                        <strong>Correo:</strong> {DATOS_EMPRESA.correoTexto} • <strong>Web:</strong> {DATOS_EMPRESA.sitioWeb}
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
                            <span className="font-bold text-emerald-600">
                                ~{calculation.estimatedMonthlyKwh} kWh/mes (~{calculation.estimatedDailyKwh} kWh/día)
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ClientQuoteHeader;
