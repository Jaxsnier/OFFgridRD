import {
    MANO_OBRA_SUPERVISION_PERCENT,
    TRANSPORTE_LOGISTICA_PERCENT
} from '../../pricing';
import { BudgetDivisionItem, QuoteInput } from '../../types';

export const calculateInternalServicesPartidas = (
    input: QuoteInput,
    baseSubtotalCostInternal: number,
    marginMultiplier: number
): Omit<BudgetDivisionItem, 'isCustomOverridden'>[] => {
    // Mano de obra y supervisión = 5% del total
    const laborCostInternal = Math.round(
        baseSubtotalCostInternal * (MANO_OBRA_SUPERVISION_PERCENT / 100)
    );
    const laborPriceQuoted = Math.round(laborCostInternal * marginMultiplier);

    // Transporte & Logística = 1% del total
    const transportCostInternal = Math.round(
        baseSubtotalCostInternal * (TRANSPORTE_LOGISTICA_PERCENT / 100)
    );
    const transportPriceQuoted = Math.round(transportCostInternal * marginMultiplier);

    return [
        {
            id: 'mano_obra',
            category: 'Mano de Obra & Supervisión',
            description: `Instalación técnica, montaje y supervisión (${MANO_OBRA_SUPERVISION_PERCENT}% del total según Datos Internos)`,
            unitDetail: `${MANO_OBRA_SUPERVISION_PERCENT}% del total`,
            costInternal: laborCostInternal,
            priceQuoted: laborPriceQuoted
        },
        {
            id: 'transporte',
            category: 'Transporte & Logística',
            description: `Flete y traslado de equipos hacia ${input.client.location || 'destino'} (${TRANSPORTE_LOGISTICA_PERCENT}% del total según Datos Internos)`,
            unitDetail: `${TRANSPORTE_LOGISTICA_PERCENT}% del total`,
            costInternal: transportCostInternal,
            priceQuoted: transportPriceQuoted
        }
    ];
};
