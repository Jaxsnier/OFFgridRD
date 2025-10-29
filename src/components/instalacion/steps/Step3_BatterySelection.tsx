import React from 'react';
import OptionCard from '../OptionCard';
import { BATTERY_5KWH_COST, BATTERY_10KWH_COST } from '../constants';

interface Props {
    selectedBattery: '5kwh' | '10kwh' | null;
    onSelect: (size: '5kwh' | '10kwh') => void;
    disabled: boolean;
}

const Step3_BatterySelection: React.FC<Props> = ({ selectedBattery, onSelect, disabled }) => {
    return (
        <section>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Paso 3: Elige tus Baterías</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Asegura tu energía durante los apagones. Las baterías de litio (LiFePO4) ofrecen la mejor durabilidad y rendimiento.</p>
            <div className="grid sm:grid-cols-2 gap-6">
                <OptionCard
                    title="Batería de Litio 5kWh"
                    description="Ideal para cubrir consumos esenciales durante la noche o apagones de corta duración. Larga vida útil y sin mantenimiento."
                    cost={BATTERY_5KWH_COST}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    isSelected={selectedBattery === '5kwh'}
                    onSelect={() => onSelect('5kwh')}
                    disabled={disabled}
                />
                <OptionCard
                    title="Batería de Litio 10kWh"
                    description="Para una autonomía extendida y mayor tranquilidad. Cubre la mayoría de las necesidades de un hogar promedio durante un apagón."
                    cost={BATTERY_10KWH_COST}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    isSelected={selectedBattery === '10kwh'}
                    onSelect={() => onSelect('10kwh')}
                    disabled={disabled}
                />
            </div>
            {disabled && <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Debes seleccionar un inversor <strong className="dark:text-slate-300">Híbrido</strong> para agregar baterías.</p>}
        </section>
    );
};

export default Step3_BatterySelection;
