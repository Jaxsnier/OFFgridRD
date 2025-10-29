import React from 'react';
import OptionCard from '../OptionCard';
import { INVERTER_GRIDTIE_COST, INVERTER_HYBRID_COST } from '../constants';

interface Props {
    selectedInverter: 'grid-tie' | 'hybrid' | null;
    onSelect: (type: 'grid-tie' | 'hybrid') => void;
}

const Step1_InverterSelection: React.FC<Props> = ({ selectedInverter, onSelect }) => {
    return (
        <section>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Paso 1: Elige tu Inversor</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">El inversor es el corazón de tu sistema. Decide si quieres solo inyectar a la red para ahorrar o también tener respaldo con baterías.</p>
            <div className="grid sm:grid-cols-2 gap-6">
                <OptionCard
                    title="Inversor Grid-Tie (5kW)"
                    description="Optimizado para inyectar el excedente de energía a la red y maximizar tu ahorro. No es compatible con baterías."
                    cost={INVERTER_GRIDTIE_COST}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                    isSelected={selectedInverter === 'grid-tie'}
                    onSelect={() => onSelect('grid-tie')}
                />
                <OptionCard
                    title="Inversor Híbrido (5kW)"
                    description="La opción más completa. Inyecta a la red y además permite conectar baterías para tener energía durante apagones."
                    cost={INVERTER_HYBRID_COST}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0 4.142-3.358 7.5-7.5 7.5s-7.5-3.358-7.5-7.5c0-4.142 3.358-7.5 7.5-7.5s7.5 3.358 7.5 7.5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 12h7.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v7.5" /><path d="M12 1v1M12 22v1M23 12h-1M2 12H1" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    isSelected={selectedInverter === 'hybrid'}
                    onSelect={() => onSelect('hybrid')}
                />
            </div>
        </section>
    );
};

export default Step1_InverterSelection;
