import {
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

    const batteryUnits = Math.max(1, Math.ceil(input.batteryKwh / BATERIA_AMERICAN_15KW_KWH));
    const totalCapacityKwh = batteryUnits * BATERIA_AMERICAN_15KW_KWH;
    const totalUsd = batteryUnits * BATERIA_AMERICAN_15KW_USD;

    const costInternal = Math.round(totalUsd * input.exchangeRate);
    const priceQuoted = Math.round(costInternal * marginMultiplier);

    return {
        id: 'baterias',
        category: 'Batería American 15kW',
        description: `${batteryUnits}x Batería American 15kW ($${BATERIA_AMERICAN_15KW_USD.toLocaleString()} USD c/u) — ${totalCapacityKwh} kWh total`,
        unitDetail: `${batteryUnits} ud${batteryUnits > 1 ? 's' : ''} (${totalCapacityKwh} kWh)`,
        costInternal,
        priceQuoted
    };
};
