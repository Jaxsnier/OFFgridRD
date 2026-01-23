import React, { useState } from 'react';
import { AnimateOnScroll } from './ui/AnimateOnScroll';
import { FinancialAnalysis } from './calculadora/types';
import { calculateFinancialAnalysis } from './calculadora/utils/solarCalculator';
import CalculatorForm from './calculadora/components/CalculatorForm';
import ROIDashboard from './calculadora/components/ROIDashboard';

const CalculadoraSolarPage: React.FC = () => {
    const [analysis, setAnalysis] = useState<FinancialAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleCalculate = (bill: number) => {
        setIsLoading(true);
        setAnalysis(null);

        // Simulate calculation time for UX
        setTimeout(() => {
            const results = calculateFinancialAnalysis(bill);
            setAnalysis(results);
            setIsLoading(false);
        }, 1200);
    };

    return (
        <div className="w-full h-full overflow-y-auto bg-slate-50 dark:bg-slate-900/80 p-4 sm:p-6 md:p-8">
            <div className="max-w-6xl mx-auto">
                <AnimateOnScroll>
                    <header className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2">Calculadora de ROI Solar</h1>
                        <p className="text-md md:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                            Descubre cuánto dinero estás perdiendo cada año y qué tan rápido puedes recuperar tu inversión al cambiarte al sol.
                        </p>
                    </header>
                </AnimateOnScroll>

                <AnimateOnScroll delay={150}>
                    <CalculatorForm onSubmit={handleCalculate} isLoading={isLoading} />
                </AnimateOnScroll>
                
                {analysis && (
                    <AnimateOnScroll>
                        <ROIDashboard analysis={analysis} />
                    </AnimateOnScroll>
                )}
                
                {!analysis && !isLoading && (
                    <div className="mt-12 text-center p-12 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
                        <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                             </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Ingresa el monto de tu factura</h3>
                        <p className="text-slate-500 dark:text-slate-500 max-w-sm mx-auto mt-2">Usaremos la tarifa de RD$13.48/kWh para proyectar tus ahorros y tiempo de recuperación.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalculadoraSolarPage;