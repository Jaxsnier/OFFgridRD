import {
    CAJA_PROTECCION_PV_1_STRING_USD,
    CAJA_PROTECCION_PV_2_STRING_USD
} from '../../pricing';
import { BudgetDivisionItem, QuoteInput } from '../../types';

export interface ProtectionsCalculationOutput {
    item: Omit<BudgetDivisionItem, 'isCustomOverridden'>;
    protectionsSpecsText: string;
}

export const calculateProtectionsPartida = (
    input: QuoteInput,
    panelCount: number,
    marginMultiplier: number
): ProtectionsCalculationOutput => {
    const strings: 1 | 2 =
        input.protectionStrings !== undefined
            ? input.protectionStrings
            : panelCount > 10
            ? 2
            : 1;

    const boxPriceUsd =
        strings === 2 ? CAJA_PROTECCION_PV_2_STRING_USD : CAJA_PROTECCION_PV_1_STRING_USD;
    const boxName =
        strings === 2
            ? `Caja de protección PV para 2 strings ($${CAJA_PROTECCION_PV_2_STRING_USD} USD)`
            : `Caja de protección PV para 1 string ($${CAJA_PROTECCION_PV_1_STRING_USD} USD)`;

    const costInternal = Math.round(boxPriceUsd * input.exchangeRate);
    const priceQuoted = Math.round(costInternal * marginMultiplier);

    return {
        protectionsSpecsText: boxName,
        item: {
            id: 'protecciones',
            category: 'Cajas de Protección PV (Extras)',
            description: boxName,
            unitDetail: `Caja PV ${strings} string${strings > 1 ? 's' : ''} ($${boxPriceUsd} USD)`,
            costInternal,
            priceQuoted
        }
    };
};
