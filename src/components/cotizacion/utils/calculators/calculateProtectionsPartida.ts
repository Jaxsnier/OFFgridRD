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
    const clientBoxName =
        strings === 2
            ? 'Caja de protección PV para 2 strings'
            : 'Caja de protección PV para 1 string';
    const internalBoxName = `${clientBoxName} ($${boxPriceUsd} USD)`;

    const costInternal = Math.round(boxPriceUsd * input.exchangeRate);
    const priceQuoted = Math.round(costInternal * marginMultiplier);

    return {
        protectionsSpecsText: clientBoxName,
        item: {
            id: 'protecciones',
            category: 'Cajas de Protección PV (Extras)',
            description: internalBoxName,
            unitDetail: `Caja PV ${strings} string${strings > 1 ? 's' : ''} ($${boxPriceUsd} USD)`,
            costInternal,
            priceQuoted
        }
    };
};
