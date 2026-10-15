import React from 'react';
import { QuoteInput } from '../../types';

interface InternalBudgetNotesProps {
    input: QuoteInput;
}

export const InternalBudgetNotes: React.FC<InternalBudgetNotesProps> = ({ input }) => {
    return (
        <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
            <h4 className="font-bold text-slate-900 dark:text-white mb-1.5 uppercase tracking-wider">
                Recomendaciones para Compra & Ejecución Técnica:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    • <strong>Canalización:</strong> Para los {input.conduitMeters} metros, verificar si requiere paso por azotea expuesta (usar tubería galvanizada o LiquidTight con protección UV) y cables solares con doble aislamiento 1000V.
                </div>
                <div>
                    • <strong>Inversor & Protecciones:</strong> Colocar caja de protecciones cerca del inversor para fácil desconexión en caso de emergencia; asegurar la varilla de tierra con resistencia &lt; 10 ohms.
                </div>
            </div>
        </div>
    );
};

export default InternalBudgetNotes;
