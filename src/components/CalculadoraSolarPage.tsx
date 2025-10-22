import React, { useState } from 'react';
import { AnimateOnScroll } from './ui/AnimateOnScroll';
import { CalculationResults, SystemEstimate } from './calculadora/types';
import { calculateConsumption, generateEstimates } from './calculadora/utils/solarCalculator';
import CalculatorForm from './calculadora/components/CalculatorForm';
import EstimateCard from './calculadora/components/EstimateCard';

const CalculadoraSolarPage: React.FC = () => {
    const [results, setResults] = useState<CalculationResults | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [monthlyBillForWhatsapp, setMonthlyBillForWhatsapp] = useState('');
    const [selectedEstimate, setSelectedEstimate] = useState<string | null>(null);

    const handleCalculate = (bill: number) => {
        setIsLoading(true);
        setResults(null);
        setSelectedEstimate(null);
        setMonthlyBillForWhatsapp(bill.toString());

        setTimeout(() => {
            const monthlyConsumption = calculateConsumption(bill);
            const dailyConsumption = monthlyConsumption / 30;
            const estimates = generateEstimates(dailyConsumption);
            
            setResults(estimates);
            setSelectedEstimate(estimates.hybrid.title); // Set hybrid as default selection
            setIsLoading(false);
        }, 1500);
    };
    
    const handleEstimateSelect = (title: string) => {
        setSelectedEstimate(title);
    };

    const getWhatsAppMessage = () => {
        if (!results || !selectedEstimate) {
            return `¡Hola!%20Acabo%20de%20usar%20la%20calculadora%20solar%20y%20quisiera%20una%20cotización%20formal.%20Mi%20factura%20es%20de%20RD$${monthlyBillForWhatsapp}.`;
        }

        const estimateDetails = Object.values(results).find(
            (est): est is SystemEstimate => typeof est === 'object' && est.title === selectedEstimate
        );

        if (!estimateDetails) return '';

        const message = `¡Hola! Me interesa una cotización basada en la siguiente estimación de su calculadora:\n\n` +
            `*Factura Mensual:* RD$${monthlyBillForWhatsapp}\n\n` +
            `*SISTEMA SELECCIONADO:*\n` +
            `*- Tipo:* ${estimateDetails.title}\n` +
            `*- Tamaño del Sistema:* ${estimateDetails.systemSize} kWp\n` +
            `*- Paneles:* ${estimateDetails.panelCount} unidades\n` +
            `*- Inversor:* ${estimateDetails.inverterSize} kW\n` +
            `*- Baterías:* ${estimateDetails.batterySize > 0 ? `${estimateDetails.batterySize} kWh` : 'No aplica'}\n` +
            `*- Costo Estimado:* US$${estimateDetails.estimatedCost.toLocaleString('en-US')}\n\n` +
            `¡Espero su contacto para una cotización formal!`;

        return encodeURIComponent(message);
    };

    return (
        <div className="w-full h-full overflow-y-auto bg-slate-100 p-4 sm:p-6 md:p-8">
            <div className="max-w-6xl mx-auto">
                <AnimateOnScroll>
                    <header className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">Calculadora Solar</h1>
                        <p className="text-md md:text-lg text-slate-600 max-w-3xl mx-auto">
                            Estime el sistema solar que necesita y su costo aproximado en solo un paso.
                        </p>
                    </header>
                </AnimateOnScroll>

                <AnimateOnScroll delay={150}>
                    <CalculatorForm onSubmit={handleCalculate} isLoading={isLoading} />
                </AnimateOnScroll>
                
                {results && (
                     <AnimateOnScroll>
                        <div className="mt-12">
                            <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Aquí tienes 3 estimaciones para tu proyecto</h2>
                            <p className="text-center text-slate-600 mb-8">Basado en un consumo diario de <strong className="text-slate-800">{results.dailyConsumption} kWh</strong>. Haz clic en una opción para seleccionarla.</p>
                            
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                                <EstimateCard 
                                    estimate={results.gridTie} 
                                    isSelected={selectedEstimate === results.gridTie.title}
                                    onSelect={handleEstimateSelect}
                                />
                                <EstimateCard 
                                    estimate={results.hybrid} 
                                    isRecommended={true}
                                    isSelected={selectedEstimate === results.hybrid.title}
                                    onSelect={handleEstimateSelect}
                                />
                                <EstimateCard 
                                    estimate={results.offGrid} 
                                    isSelected={selectedEstimate === results.offGrid.title}
                                    onSelect={handleEstimateSelect}
                                />
                            </div>

                            <div className="text-center mt-12 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg max-w-4xl mx-auto">
                                <p className="text-sm text-yellow-800">
                                    <strong>Importante:</strong> Este es un cálculo aproximado. El costo final puede variar según la marca de los equipos, las condiciones de instalación y otros factores.
                                </p>
                            </div>

                             <div className="mt-8 text-center">
                                <a
                                    href={`https://wa.me/18296392616?text=${getWhatsAppMessage()}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 bg-[#25D366] text-white font-bold text-lg px-8 py-3 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.452-4.43-9.887-9.887-9.887-5.452 0-9.886 4.434-9.889 9.886-.001 2.269.655 4.398 1.905 6.101l-1.217 4.432 4.515-1.182z" /></svg>
                                    Contactar por WhatsApp
                                </a>
                            </div>
                        </div>
                     </AnimateOnScroll>
                )}
            </div>
        </div>
    );
};

export default CalculadoraSolarPage;