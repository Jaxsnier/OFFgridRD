import {
    INVERSOR_HIBRIDO_DEYE_6KW_USD,
    INVERSOR_HIBRIDO_ION_8KW_USD,
    INVERSOR_HIBRIDO_ION_12KW_USD,
    INVERSOR_HIBRIDO_ION_16KW_USD
} from '../../pricing';
import { BudgetDivisionItem, QuoteInput } from '../../types';

export interface InverterCalculationOutput {
    item: Omit<BudgetDivisionItem, 'isCustomOverridden'>;
    inverterBrandText: string;
}

export const calculateInverterPartida = (
    input: QuoteInput,
    marginMultiplier: number
): InverterCalculationOutput => {
    let modelName = 'Inversor híbrido Deye 6kW';
    let unitPriceUsd = INVERSOR_HIBRIDO_DEYE_6KW_USD;
    let quantity = 1;

    if (input.inverterCapacityKw <= 6) {
        modelName = 'Inversor híbrido Deye 6kW';
        unitPriceUsd = INVERSOR_HIBRIDO_DEYE_6KW_USD;
        quantity = 1;
    } else if (input.inverterCapacityKw <= 8) {
        modelName = 'Inversor híbrido Ion 8kW';
        unitPriceUsd = INVERSOR_HIBRIDO_ION_8KW_USD;
        quantity = 1;
    } else if (input.inverterCapacityKw <= 12) {
        modelName = 'Inversor híbrido Ion 12kW';
        unitPriceUsd = INVERSOR_HIBRIDO_ION_12KW_USD;
        quantity = 1;
    } else if (input.inverterCapacityKw <= 16) {
        modelName = 'Inversor híbrido Ion 16kW';
        unitPriceUsd = INVERSOR_HIBRIDO_ION_16KW_USD;
        quantity = 1;
    } else {
        modelName = 'Inversor híbrido Ion 16kW';
        unitPriceUsd = INVERSOR_HIBRIDO_ION_16KW_USD;
        quantity = Math.ceil(input.inverterCapacityKw / 16);
    }

    const totalUsd = unitPriceUsd * quantity;
    const costInternal = Math.round(totalUsd * input.exchangeRate);
    const priceQuoted = Math.round(costInternal * marginMultiplier);

    return {
        inverterBrandText: quantity > 1 ? `${quantity}x ${modelName}` : modelName,
        item: {
            id: 'inversor',
            category: 'Inversor Solar Híbrido',
            description: `${quantity > 1 ? `${quantity}x ` : ''}${modelName} ($${unitPriceUsd.toLocaleString()} USD c/u)`,
            unitDetail: `${quantity} ud${quantity > 1 ? 's' : ''} (${input.inverterCapacityKw} kW)`,
            costInternal,
            priceQuoted
        }
    };
};
