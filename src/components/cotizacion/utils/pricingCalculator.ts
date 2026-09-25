import { BudgetDivisionItem, QuoteCalculationResult, QuoteInput } from '../types';
import { QUALITY_DETAILS } from '../constants';
import {
    MARGEN_GANANCIA_MIN_PERCENT,
    MARGEN_GANANCIA_MAX_PERCENT
} from '../pricing';
import { calculatePanelsPartida } from './calculators/calculatePanelsPartida';
import { calculateInverterPartida } from './calculators/calculateInverterPartida';
import { calculateStructurePartida } from './calculators/calculateStructurePartida';
import { calculateConduitPartida } from './calculators/calculateConduitPartida';
import { calculateProtectionsPartida } from './calculators/calculateProtectionsPartida';
import { calculateBatteryPartida } from './calculators/calculateBatteryPartida';
import { calculateEdesPartida } from './calculators/calculateEdesPartida';
import { calculateInternalServicesPartidas } from './calculators/calculateInternalServicesPartida';
export { formatCurrency } from './currencyFormatter';

export const calculateQuote = (
    input: QuoteInput,
    customOverrides: Record<string, { costInternal?: number; priceQuoted?: number }> = {}
): QuoteCalculationResult => {
    const qConfig = QUALITY_DETAILS[input.quality];

    // Determinar margen de ganancia dentro del rango [Margen de ganancia min = 15%, Margen de ganancia max = 30%]
    const defaultMargin =
        input.quality === 'premium' ? MARGEN_GANANCIA_MAX_PERCENT : MARGEN_GANANCIA_MIN_PERCENT;
    const rawMargin =
        input.profitMarginPercent !== undefined ? input.profitMarginPercent : defaultMargin;
    const clampedMarginPercent = Math.min(
        MARGEN_GANANCIA_MAX_PERCENT,
        Math.max(MARGEN_GANANCIA_MIN_PERCENT, rawMargin)
    );
    const marginMultiplier = 1 + clampedMarginPercent / 100;

    // 1. Paneles Solares 610W ($110 USD)
    const panelsResult = calculatePanelsPartida(input, marginMultiplier);
    const { panelCount, panelWattage, panelsSpecsText } = panelsResult;

    // 2. Inversor Solar Híbrido (Deye 6kW $1,800 / Ion 8kW $1,900 / Ion 16kW $2,850)
    const inverterResult = calculateInverterPartida(input, marginMultiplier);

    // 3. Estructura de Montaje (Perfil aluminio $35, Mid clamp $2, End clamp $2, Base ajustable 15° $8)
    const structureItem = calculateStructurePartida(input, panelCount, marginMultiplier);

    // 4. Canalización & Cableado (Tubo EMT 1' $10 + Rollo de cable PV 4mm $100)
    const conduitResult = calculateConduitPartida(input, marginMultiplier);

    // 5. Protecciones PV (Caja 1 string $80 / Caja 2 string $170)
    const protectionsResult = calculateProtectionsPartida(input, panelCount, marginMultiplier);

    // 6. Batería American 15kW ($2,400 USD)
    const batteryItem = calculateBatteryPartida(input, marginMultiplier);

    // 7. Requisitos EDES (Gestión de permisos $500 + Base CL 200 medidor $150)
    const edesItem = calculateEdesPartida(input, marginMultiplier);

    const equipmentAndEdesItems: Omit<BudgetDivisionItem, 'isCustomOverridden'>[] = [
        inverterResult.item,
        panelsResult.item,
        structureItem,
        conduitResult.item,
        protectionsResult.item
    ];

    if (batteryItem) {
        equipmentAndEdesItems.push(batteryItem);
    }

    if (edesItem) {
        equipmentAndEdesItems.push(edesItem);
    }

    // Subtotal de equipos, materiales, extras y requisitos EDES para calcular el 5% y 1% de Datos Internos
    const baseSubtotalCostInternal = equipmentAndEdesItems.reduce(
        (acc, curr) => acc + curr.costInternal,
        0
    );

    // 8. Datos Internos: Mano de obra y supervisión (5% del total) + Transporte & Logística (1% del total)
    const internalServiceItems = calculateInternalServicesPartidas(
        input,
        baseSubtotalCostInternal,
        marginMultiplier
    );

    const rawItems: Omit<BudgetDivisionItem, 'isCustomOverridden'>[] = [
        ...equipmentAndEdesItems,
        ...internalServiceItems
    ];

    // Aplicar ajustes manuales si existen
    const finalItems: BudgetDivisionItem[] = rawItems.map((item) => {
        const override = customOverrides[item.id];
        if (override) {
            return {
                ...item,
                costInternal:
                    override.costInternal !== undefined ? override.costInternal : item.costInternal,
                priceQuoted:
                    override.priceQuoted !== undefined ? override.priceQuoted : item.priceQuoted,
                isCustomOverridden: true
            };
        }
        return item;
    });

    const totalInternalCost = finalItems.reduce((acc, curr) => acc + curr.costInternal, 0);
    const totalQuotedPrice = finalItems.reduce((acc, curr) => acc + curr.priceQuoted, 0);
    const estimatedProfit = totalQuotedPrice - totalInternalCost;
    const profitMarginPercent =
        totalInternalCost > 0 ? (estimatedProfit / totalInternalCost) * 100 : 0;

    // Producción mensual estimada en RD (4.5 HSP * 30 días * 0.82 PR)
    const actualSystemKwp = (panelCount * panelWattage) / 1000;
    const estimatedMonthlyKwh = Math.round(actualSystemKwp * 4.5 * 30 * 0.82);

    return {
        items: finalItems,
        totalInternalCost,
        totalQuotedPrice,
        estimatedProfit,
        profitMarginPercent,
        panelCount,
        panelWattage,
        estimatedMonthlyKwh,
        specs: {
            inverterBrand: inverterResult.inverterBrandText,
            panelsBrand: panelsSpecsText,
            warrantyInverter: qConfig.warrantyInverter,
            warrantyPanels: qConfig.warrantyPanels,
            conduitSpecs: conduitResult.conduitSpecsText,
            protectionsSpecs: protectionsResult.protectionsSpecsText
        }
    };
};
