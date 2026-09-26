import {
    BATERIA_AMERICAN_5KW_KWH,
    BATERIA_AMERICAN_5KW_USD,
    BATERIA_AMERICAN_10KW_KWH,
    BATERIA_AMERICAN_10KW_USD,
    BATERIA_AMERICAN_15KW_KWH,
    BATERIA_AMERICAN_15KW_USD
} from '../../pricing';
import { BudgetDivisionItem, QuoteInput } from '../../types';

export const calculateBatteryPartida = (
    input: QuoteInput,
    marginMultiplier: number
): Omit<BudgetDivisionItem, 'isCustomOverridden'> | null => {
    if (!input.includeBatteries || input.batteryKwh <= 0) {
        return null;
    }

    let modelName = 'Batería American 15kW';
    let unitCapacityKwh = BATERIA_AMERICAN_15KW_KWH;
    let unitPriceUsd = BATERIA_AMERICAN_15KW_USD;
    let batteryUnits = 1;

    if (input.batteryKwh <= 5) {
        modelName = 'Batería American 5kW';
        unitCapacityKwh = BATERIA_AMERICAN_5KW_KWH;
        unitPriceUsd = BATERIA_AMERICAN_5KW_USD;
        batteryUnits = 1;
    } else if (input.batteryKwh <= 10) {
        modelName = 'Batería American 10kW';
        unitCapacityKwh = BATERIA_AMERICAN_10KW_KWH;
        unitPriceUsd = BATERIA_AMERICAN_10KW_USD;
        batteryUnits = 1;
    } else {
        modelName = 'Batería American 15kW';
        unitCapacityKwh = BATERIA_AMERICAN_15KW_KWH;
        unitPriceUsd = BATERIA_AMERICAN_15KW_USD;
        batteryUnits = Math.max(1, Math.ceil(input.batteryKwh / BATERIA_AMERICAN_15KW_KWH));
    }

    const totalCapacityKwh = batteryUnits * unitCapacityKwh;
    const totalUsd = batteryUnits * unitPriceUsd;

    const costInternal = Math.round(totalUsd * input.exchangeRate);
    const priceQuoted = Math.round(costInternal * marginMultiplier);

    return {
        id: 'baterias',
        category: modelName,
        description: `${batteryUnits}x ${modelName} ($${unitPriceUsd.toLocaleString()} USD c/u) — ${totalCapacityKwh} kWh total`,
        unitDetail: `${batteryUnits} ud${batteryUnits > 1 ? 's' : ''} (${totalCapacityKwh} kWh)`,
        costInternal,
        priceQuoted
    };
};
