import React, { useState, useEffect } from 'react';
import { AnimateOnScroll } from './ui/AnimateOnScroll';
import CostSummary from './instalacion/CostSummary';
import { 
    PERMIT_COST, 
    INVERTER_GRIDTIE_COST, 
    INVERTER_HYBRID_COST, 
    PANEL_COST, 
    PANEL_WATTAGE_KW, 
    BATTERY_5KWH_COST, 
    BATTERY_10KWH_COST,
    STRUCTURE_COST_COPLANAR,
    STRUCTURE_COST_SIMPLE,
    STRUCTURE_COST_ELEVATED
} from './instalacion/constants';
import Step1_InverterSelection from './instalacion/steps/Step1_InverterSelection';
import Step2_PanelSelection from './instalacion/steps/Step2_PanelSelection';
import Step3_BatterySelection from './instalacion/steps/Step3_BatterySelection';
import Step4_AdditionalServices from './instalacion/steps/Step4_AdditionalServices';

interface SummaryItem {
    name: string;
    cost: number;
}

const InstalacionPersonalizadaPage: React.FC = () => {
    const [selections, setSelections] = useState<{
        inverter: 'grid-tie' | 'hybrid' | null;
        permits: boolean;
        panelCount: number;
        battery: '5kwh' | '10kwh' | null;
        structureType: 'coplanar' | 'simple' | 'elevated' | null;
    }>({
        inverter: null,
        permits: false,
        panelCount: 0,
        battery: null,
        structureType: null,
    });

    const [totalCost, setTotalCost] = useState(0);
    const [summaryItems, setSummaryItems] = useState<SummaryItem[]>([]);

    useEffect(() => {
        let runningTotal = 0;
        const items: SummaryItem[] = [];

        // INVERTER
        if (selections.inverter === 'grid-tie') {
            runningTotal += INVERTER_GRIDTIE_COST;
            items.push({ name: 'Inversor Grid-Tie 5kW', cost: INVERTER_GRIDTIE_COST });
        } else if (selections.inverter === 'hybrid') {
            runningTotal += INVERTER_HYBRID_COST;
            items.push({ name: 'Inversor Híbrido 5kW', cost: INVERTER_HYBRID_COST });
        }

        // PANELS + STRUCTURE
        let structureCostPerPanel = 0;
        let structureName = '';
        if (selections.structureType === 'elevated') {
            structureCostPerPanel = STRUCTURE_COST_ELEVATED;
            structureName = ' (Elevada)';
        } else if (selections.structureType === 'simple') {
            structureCostPerPanel = STRUCTURE_COST_SIMPLE;
            structureName = ' (Sencilla)';
        } else if (selections.structureType === 'coplanar') {
            structureCostPerPanel = STRUCTURE_COST_COPLANAR;
            structureName = ' (Coplanar)';
        }

        if (selections.panelCount > 0 && selections.inverter && selections.structureType) {
            const panelTotalCost = selections.panelCount * (PANEL_COST + structureCostPerPanel);
            runningTotal += panelTotalCost;
            items.push({ name: `${selections.panelCount} x Paneles Solares${structureName}`, cost: panelTotalCost });
        }
        
        // BATTERY
        if (selections.inverter === 'hybrid') {
            if (selections.battery === '5kwh') {
                runningTotal += BATTERY_5KWH_COST;
                items.push({ name: 'Batería de Litio 5kWh', cost: BATTERY_5KWH_COST });
            } else if (selections.battery === '10kwh') {
                runningTotal += BATTERY_10KWH_COST;
                items.push({ name: 'Batería de Litio 10kWh', cost: BATTERY_10KWH_COST });
            }
        }
        
        // PERMITS
        if (selections.permits && selections.inverter) {
            runningTotal += PERMIT_COST;
            items.push({ name: 'Gestión de Permisos CDEEE', cost: PERMIT_COST });
        }
        
        setTotalCost(runningTotal);
        setSummaryItems(items);

    }, [selections]);
    
    const handleInverterSelect = (type: 'grid-tie' | 'hybrid') => {
        const isDeselecting = selections.inverter === type;
        const newInverter = isDeselecting ? null : type;

        setSelections(prev => ({ 
            ...prev, 
            inverter: newInverter,
            // Reset battery if switching to grid-tie or deselecting inverter
            battery: newInverter === 'hybrid' ? prev.battery : null,
            // Reset downstream selections if inverter is removed
            structureType: newInverter ? prev.structureType : null,
            panelCount: newInverter ? prev.panelCount : 0,
            permits: newInverter ? prev.permits : false,
        }));
    };
    
    const handlePermitToggle = () => {
        setSelections(prev => ({ ...prev, permits: !prev.permits }));
    };

    const handlePanelCountChange = (amount: number) => {
        setSelections(prev => ({ ...prev, panelCount: Math.max(0, prev.panelCount + amount) }));
    };

    const handlePanelInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        setSelections(prev => ({ 
            ...prev, 
            panelCount: (!isNaN(value) && value >= 0) ? value : 0 
        }));
    }

    const handleBatterySelect = (size: '5kwh' | '10kwh') => {
        setSelections(prev => ({
            ...prev,
            battery: prev.battery === size ? null : size,
        }));
    };
    
    const handleStructureSelect = (type: 'coplanar' | 'simple' | 'elevated') => {
        setSelections(prev => ({
            ...prev,
            structureType: prev.structureType === type ? null : type,
        }));
    };

    return (
        <div className="w-full h-full overflow-y-auto bg-slate-50 dark:bg-slate-900/80 p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <AnimateOnScroll>
                    <header className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2">Diseña tu Instalación a Medida</h1>
                        <p className="text-md md:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                            Selecciona los componentes principales y ve el costo estimado de tu sistema solar en tiempo real.
                        </p>
                    </header>
                </AnimateOnScroll>
                
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-10">
                        <AnimateOnScroll delay={150}>
                            <Step1_InverterSelection 
                                selectedInverter={selections.inverter}
                                onSelect={handleInverterSelect}
                            />
                        </AnimateOnScroll>

                        <AnimateOnScroll delay={300}>
                            <Step2_PanelSelection
                                panelCount={selections.panelCount}
                                onCountChange={handlePanelCountChange}
                                onInputChange={handlePanelInputChange}
                                disabled={!selections.inverter}
                                selectedStructure={selections.structureType}
                                onStructureSelect={handleStructureSelect}
                            />
                        </AnimateOnScroll>
                        
                        <AnimateOnScroll delay={450}>
                             <Step3_BatterySelection
                                selectedBattery={selections.battery}
                                onSelect={handleBatterySelect}
                                disabled={selections.inverter !== 'hybrid'}
                             />
                        </AnimateOnScroll>

                        <AnimateOnScroll delay={600}>
                            <Step4_AdditionalServices
                                permitsSelected={selections.permits}
                                onSelect={handlePermitToggle}
                                disabled={!selections.inverter}
                            />
                        </AnimateOnScroll>
                    </div>
                    
                    <div className="lg:col-span-1">
                        <AnimateOnScroll delay={750}>
                            <CostSummary items={summaryItems} total={totalCost} />
                        </AnimateOnScroll>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstalacionPersonalizadaPage;