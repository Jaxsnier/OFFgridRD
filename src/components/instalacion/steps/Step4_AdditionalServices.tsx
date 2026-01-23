import React from 'react';
import OptionCard from '../OptionCard';
import { PERMIT_COST } from '../constants';

interface Props {
    permitsSelected: boolean;
    onSelect: () => void;
    disabled: boolean;
}

const Step4_AdditionalServices: React.FC<Props> = ({ permitsSelected, onSelect, disabled }) => {
    return (
        <section>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Servicios Adicionales</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">¿Quieres formalizar tu instalación con la distribuidora eléctrica? Te ayudamos con todo el papeleo.</p>
            <div className="grid sm:grid-cols-2 gap-6">
                <OptionCard
                    title="Gestión de Permisos (CDEEE)"
                    description="Nos encargamos de todo el proceso para obtener tu contrato de interconexión con la red, permitiéndote vender tu energía excedente."
                    cost={PERMIT_COST}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                    isSelected={permitsSelected}
                    onSelect={onSelect}
                    disabled={disabled}
                />
            </div>
            {disabled && <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Debes seleccionar un inversor para habilitar esta opción.</p>}
        </section>
    );
};

export default Step4_AdditionalServices;