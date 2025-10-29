import React from 'react';
import { PANEL_WATTAGE_KW } from '../constants';

interface Props {
    panelCount: number;
    onCountChange: (amount: number) => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled: boolean;
    selectedStructure: 'coplanar' | 'simple' | 'elevated' | null;
    onStructureSelect: (type: 'coplanar' | 'simple' | 'elevated') => void;
}

const StructureButton: React.FC<{label: string, isSelected: boolean, onClick: () => void, disabled: boolean}> = ({ label, isSelected, onClick, disabled }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`w-full text-center px-4 py-3 rounded-lg border-2 font-semibold transition-all duration-200 ${
            isSelected
                ? 'bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900/50 dark:border-blue-400 dark:text-blue-300'
                : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300 dark:hover:border-slate-500'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        {label}
    </button>
);

const Step2_PanelSelection: React.FC<Props> = ({ 
    panelCount, 
    onCountChange, 
    onInputChange, 
    disabled,
    selectedStructure,
    onStructureSelect
}) => {
    const panelCounterDisabled = disabled || !selectedStructure;

    return (
        <section>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Paso 2: Define Paneles y Estructura</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Primero, elige el tipo de estructura según tu techo. Luego, define la cantidad de paneles para tu sistema.</p>
            
            <div className={`p-6 rounded-xl bg-white dark:bg-slate-800 border dark:border-slate-700 transition-opacity ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-3">Tipo de Estructura</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <StructureButton label="Coplanar (+RD$ 0)" isSelected={selectedStructure === 'coplanar'} onClick={() => onStructureSelect('coplanar')} disabled={disabled} />
                            <StructureButton label="Sencilla (+RD$ 1,000)" isSelected={selectedStructure === 'simple'} onClick={() => onStructureSelect('simple')} disabled={disabled} />
                            <StructureButton label="Elevada (+RD$ 3,000)" isSelected={selectedStructure === 'elevated'} onClick={() => onStructureSelect('elevated')} disabled={disabled} />
                        </div>
                    </div>
                
                    <div className={`border-t dark:border-slate-600 pt-6 transition-opacity ${panelCounterDisabled ? 'opacity-50' : ''}`}>
                        <h3 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-3">Cantidad de Paneles</h3>
                        <div className="grid sm:grid-cols-2 gap-6 items-center">
                            <div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onCountChange(-1)}
                                        disabled={panelCounterDisabled}
                                        className="px-4 py-2 text-lg font-bold rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 transition-colors"
                                        aria-label="Disminuir paneles"
                                    >
                                        -
                                    </button>
                                    <input
                                        id="panel-count"
                                        type="number"
                                        value={panelCount}
                                        onChange={onInputChange}
                                        disabled={panelCounterDisabled}
                                        className="w-20 text-center font-bold text-lg p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F76814] dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 disabled:bg-slate-100 dark:disabled:bg-slate-700/50"
                                    />
                                    <button
                                        onClick={() => onCountChange(1)}
                                        disabled={panelCounterDisabled}
                                        className="px-4 py-2 text-lg font-bold rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 transition-colors"
                                        aria-label="Aumentar paneles"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-slate-600 dark:text-slate-400">Potencia Total</p>
                                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                    {(panelCount * PANEL_WATTAGE_KW).toFixed(2)} kWp
                                </p>
                            </div>
                        </div>
                         {panelCounterDisabled && !disabled && <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Debes seleccionar un tipo de estructura para agregar paneles.</p>}
                    </div>
                </div>
            </div>
            {disabled && <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Debes seleccionar un inversor para continuar.</p>}
        </section>
    );
};

export default Step2_PanelSelection;