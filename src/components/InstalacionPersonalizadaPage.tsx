import React, { useState, useEffect } from 'react';
import { AnimateOnScroll } from './ui/AnimateOnScroll';
import CostSummary from './instalacion/CostSummary';
import { 
    PERMIT_COST, 
    SOLAR_KITS,
    SolarKit
} from './instalacion/constants';
import KitSelectionStep from './instalacion/steps/KitSelectionStep';
import Step4_AdditionalServices from './instalacion/steps/Step4_AdditionalServices';

interface SummaryItem {
    name: string;
    cost: number;
}

const InstalacionPersonalizadaPage: React.FC = () => {
    const [selectedKitId, setSelectedKitId] = useState<string | null>(null);
    const [permitsSelected, setPermitsSelected] = useState(false);
    
    const [totalCost, setTotalCost] = useState(0);
    const [summaryItems, setSummaryItems] = useState<SummaryItem[]>([]);

    useEffect(() => {
        let runningTotal = 0;
        const items: SummaryItem[] = [];

        // Find selected kit
        const selectedKit = SOLAR_KITS.find(k => k.id === selectedKitId);

        if (selectedKit) {
            runningTotal += selectedKit.cost;
            items.push({ name: selectedKit.name, cost: selectedKit.cost });
        }
        
        // PERMITS
        if (permitsSelected && selectedKitId) {
            runningTotal += PERMIT_COST;
            items.push({ name: 'Gestión de Permisos CDEEE', cost: PERMIT_COST });
        }
        
        setTotalCost(runningTotal);
        setSummaryItems(items);

    }, [selectedKitId, permitsSelected]);
    
    const handleKitSelect = (id: string) => {
        setSelectedKitId(prev => prev === id ? null : id);
    };
    
    const handlePermitToggle = () => {
        setPermitsSelected(prev => !prev);
    };

    return (
        <div className="w-full h-full overflow-y-auto bg-slate-50 dark:bg-slate-900/80 p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <AnimateOnScroll>
                    <header className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2">Planes de Instalación Solar</h1>
                        <p className="text-md md:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                            Elige uno de nuestros kits pre-configurados diseñados para ofrecerte el mejor rendimiento al costo más competitivo.
                        </p>
                    </header>
                </AnimateOnScroll>
                
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-12">
                        <AnimateOnScroll delay={150}>
                            <KitSelectionStep 
                                selectedKitId={selectedKitId}
                                onSelect={handleKitSelect}
                            />
                        </AnimateOnScroll>

                        <AnimateOnScroll delay={300}>
                            <Step4_AdditionalServices
                                permitsSelected={permitsSelected}
                                onSelect={handlePermitToggle}
                                disabled={!selectedKitId}
                            />
                        </AnimateOnScroll>

                        <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-l-4 border-blue-500">
                             <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-2">¿Necesitas algo más específico?</h3>
                             <p className="text-blue-700 dark:text-blue-400">
                                Nuestros técnicos pueden diseñar una solución totalmente personalizada según la estructura de tu techo o necesidades especiales de consumo. 
                                <strong> Contáctanos directamente</strong> para una visita técnica.
                             </p>
                        </div>
                    </div>
                    
                    <div className="lg:col-span-1">
                        <AnimateOnScroll delay={450}>
                            <CostSummary items={summaryItems} total={totalCost} />
                        </AnimateOnScroll>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstalacionPersonalizadaPage;