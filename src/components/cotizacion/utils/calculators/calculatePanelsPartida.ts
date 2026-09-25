import {
    PANEL_SOLAR_610W_USD,
    PANEL_SOLAR_610W_WATTS
} from '../../pricing';
import { BudgetDivisionItem, QuoteInput } from '../../types';

export interface PanelsCalculationOutput {
    item: Omit<BudgetDivisionItem, 'isCustomOverridden'>;
    panelCount: number;
    panelWattage: number;
    panelsSpecsText: string;
}

export const calculatePanelsPartida = (
    input: QuoteInput,
    marginMultiplier: number
): PanelsCalculationOutput => {
    const panelWattage = PANEL_SOLAR_610W_WATTS;
    const peakWatts = input.peakPowerKwp * 1000;
    const panelCount = Math.max(1, Math.ceil(peakWatts / panelWattage));

    const costUsd = panelCount * PANEL_SOLAR_610W_USD;
    const costInternal = Math.round(costUsd * input.exchangeRate);
    const priceQuoted = Math.round(costInternal * marginMultiplier);

    const actualKwp = ((panelCount * panelWattage) / 1000).toFixed(2);
    const panelsSpecsText = `Panel Solar ${panelWattage}W`;

    return {
        panelCount,
        panelWattage,
        panelsSpecsText,
        item: {
            id: 'placas',
            category: 'Paneles Solares 610W',
            description: `${panelCount}x Panel Solar ${panelWattage}W ($${PANEL_SOLAR_610W_USD} USD c/u) — ${actualKwp} kWp total`,
            unitDetail: `${panelCount} uds × $${PANEL_SOLAR_610W_USD} USD`,
            costInternal,
            priceQuoted
        }
    };
};
