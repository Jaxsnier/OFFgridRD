import { CalculationResults, SystemEstimate } from '../types';

export const calculateConsumption = (bill: number): number => {
    const TIER1_RATE = 5.97;
    const TIER2_RATE = 8.51;
    const TIER3_RATE = 13.83;
    const FLAT_RATE_KWH_THRESHOLD = 700;
    const TIER1_KWH_LIMIT = 200;
    const TIER2_KWH_LIMIT = 300;

    const tier1MaxCost = TIER1_KWH_LIMIT * TIER1_RATE;
    const tier2MaxCost = (TIER2_KWH_LIMIT - TIER1_KWH_LIMIT) * TIER2_RATE;
    const tier1And2MaxCost = tier1MaxCost + tier2MaxCost;

    let monthlyConsumption = 0;

    const consumptionIfFlatRate = bill / TIER3_RATE;
    if (consumptionIfFlatRate >= FLAT_RATE_KWH_THRESHOLD) {
        monthlyConsumption = consumptionIfFlatRate;
    } else {
        if (bill <= tier1MaxCost) {
            monthlyConsumption = bill / TIER1_RATE;
        } else if (bill <= tier1And2MaxCost) {
            const remainingBill = bill - tier1MaxCost;
            const kwhInTier2 = remainingBill / TIER2_RATE;
            monthlyConsumption = TIER1_KWH_LIMIT + kwhInTier2;
        } else {
            const remainingBill = bill - tier1And2MaxCost;
            const kwhInTier3 = remainingBill / TIER3_RATE;
            monthlyConsumption = TIER2_KWH_LIMIT + kwhInTier3;
        }
    }
    return monthlyConsumption;
};

export const generateEstimates = (dailyConsumption: number): CalculationResults => {
    // Constants
    const PEAK_SUN_HOURS = 4;
    const PANEL_WATTAGE_KW = 0.550;
    const COST_PER_WATT_GRIDTIE_USD = 1.10;
    const COST_PER_WATT_HYBRID_USD = 1.25;
    const COST_PER_WATT_OFFGRID_USD = 1.40;
    const COST_PER_KWH_BATTERY_USD = 450;
    const OFFGRID_SYSTEM_OVERSIZE_FACTOR = 1.4;
    const OFFGRID_AUTONOMY_DAYS = 1; // Set to one day of autonomy
    const HYBRID_AUTONOMY_DAYS = 1;

    // 1. Grid-Tie Calculation
    const baseSystemSize = dailyConsumption / PEAK_SUN_HOURS;
    const gridTiePanelCount = Math.ceil(baseSystemSize / PANEL_WATTAGE_KW);
    const gridTieInverterSize = parseFloat(baseSystemSize.toFixed(1));
    const gridTieCost = baseSystemSize * 1000 * COST_PER_WATT_GRIDTIE_USD;

    const gridTie: SystemEstimate = {
        title: "Inyección a Red (Grid-Tie)",
        description: "Ideal para maximizar el ahorro en tu factura eléctrica, inyectando el excedente de energía a la red. No incluye baterías de respaldo.",
        systemSize: parseFloat(baseSystemSize.toFixed(2)),
        panelCount: gridTiePanelCount,
        inverterSize: gridTieInverterSize,
        batterySize: 0,
        estimatedCost: parseFloat(gridTieCost.toFixed(0)),
    };

    // 2. Hybrid Calculation
    const requiredHybridBatteryBackup = dailyConsumption * HYBRID_AUTONOMY_DAYS;
    
    let finalHybridBatterySize: number;
    if (requiredHybridBatteryBackup <= 5) {
        finalHybridBatterySize = 5;
    } else {
        finalHybridBatterySize = 10;
    }

    const hybridCost = (baseSystemSize * 1000 * COST_PER_WATT_HYBRID_USD) + (finalHybridBatterySize * COST_PER_KWH_BATTERY_USD);

    const hybrid: SystemEstimate = {
        title: "Híbrido con Respaldo",
        description: "Combina el ahorro de la inyección a red con la seguridad de un banco de baterías para tener energía durante apagones.",
        systemSize: parseFloat(baseSystemSize.toFixed(2)),
        panelCount: gridTiePanelCount,
        inverterSize: gridTieInverterSize,
        batterySize: finalHybridBatterySize,
        estimatedCost: parseFloat(hybridCost.toFixed(0)),
    };

    // 3. Off-Grid Calculation
    const offGridSystemSize = baseSystemSize * OFFGRID_SYSTEM_OVERSIZE_FACTOR;
    const offGridPanelCount = Math.ceil(offGridSystemSize / PANEL_WATTAGE_KW);
    const offGridInverterSize = parseFloat(offGridSystemSize.toFixed(1));
    
    // Calculate required battery and round up to the nearest 5kWh
    const requiredOffGridBattery = dailyConsumption * OFFGRID_AUTONOMY_DAYS;
    const finalOffGridBatterySize = Math.ceil(requiredOffGridBattery / 5) * 5;

    const offGridCost = (offGridSystemSize * 1000 * COST_PER_WATT_OFFGRID_USD) + (finalOffGridBatterySize * COST_PER_KWH_BATTERY_USD);

    const offGrid: SystemEstimate = {
        title: "Sistema Aislado (Off-Grid)",
        description: "Independencia total de la red eléctrica. Diseñado para quienes buscan autonomía completa, con baterías para un día de respaldo.",
        systemSize: parseFloat(offGridSystemSize.toFixed(2)),
        panelCount: offGridPanelCount,
        inverterSize: offGridInverterSize,
        batterySize: finalOffGridBatterySize,
        estimatedCost: parseFloat(offGridCost.toFixed(0)),
    };
    
    return {
        dailyConsumption: parseFloat(dailyConsumption.toFixed(2)),
        gridTie,
        hybrid,
        offGrid,
    };
};