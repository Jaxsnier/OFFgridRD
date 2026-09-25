import {
    ROLLO_CABLE_PV_4MM_USD,
    TUBO_EMT_1_PULGADA_USD,
    TUBO_EMT_METROS_POR_UNIDAD
} from '../../pricing';
import { BudgetDivisionItem, QuoteInput } from '../../types';

export interface ConduitCalculationOutput {
    item: Omit<BudgetDivisionItem, 'isCustomOverridden'>;
    conduitSpecsText: string;
}

export const calculateConduitPartida = (
    input: QuoteInput,
    marginMultiplier: number
): ConduitCalculationOutput => {
    const tubosEmtCount = Math.max(1, Math.ceil(input.conduitMeters / TUBO_EMT_METROS_POR_UNIDAD));
    const rollosCableCount =
        input.cableRollsCount !== undefined
            ? Math.max(1, input.cableRollsCount)
            : Math.max(1, Math.ceil(input.conduitMeters / 50));

    const tubosUsd = tubosEmtCount * TUBO_EMT_1_PULGADA_USD;
    const cableUsd = rollosCableCount * ROLLO_CABLE_PV_4MM_USD;
    const totalUsd = tubosUsd + cableUsd;

    const costInternal = Math.round(totalUsd * input.exchangeRate);
    const priceQuoted = Math.round(costInternal * marginMultiplier);

    const conduitSpecsText = `${tubosEmtCount}x Tubo EMT de 1' ($${TUBO_EMT_1_PULGADA_USD} USD c/u) + ${rollosCableCount}x Rollo de cable PV 4mm ($${ROLLO_CABLE_PV_4MM_USD} USD c/u)`;

    return {
        conduitSpecsText,
        item: {
            id: 'canalizacion',
            category: 'Canalización & Cableado Solar (Extras / Sec. 1)',
            description: `${conduitSpecsText} (${input.conduitMeters}m totales)`,
            unitDetail: `${tubosEmtCount} tubos EMT + ${rollosCableCount} rollo(s) PV`,
            costInternal,
            priceQuoted
        }
    };
};
