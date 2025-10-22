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

const getNextInverterSize = (requiredSize: number): number => {
    const availableSizes = [3, 5, 7, 10, 12];
    const suitableInverter = availableSizes.find(size => size >= requiredSize);
    // If requiredSize is larger than any available size, return the largest.
    return suitableInverter ?? availableSizes[availableSizes.length - 1];
};


export const generateEstimates = (dailyConsumption: number): CalculationResults => {
    // Constants
    const PEAK_SUN_HOURS = 4;
    const PANEL_WATTAGE_KW = 0.550;
    const COST_PER_WATT_GRIDTIE_USD = 0.99;
    const COST_PER_WATT_HYBRID_USD = 1.05;
    const COST_PER_WATT_OFFGRID_USD = 1.20;
    const COST_PER_KWH_BATTERY_USD = 200;
    const OFFGRID_SYSTEM_OVERSIZE_FACTOR = 1.4;
    const OFFGRID_AUTONOMY_DAYS = 1; // Set to one day of autonomy
    const HYBRID_AUTONOMY_DAYS = 0.5;

    // 1. Grid-Tie Calculation
    let requiredGridTieSize = dailyConsumption / PEAK_SUN_HOURS;
    if (requiredGridTieSize < 3) {
        requiredGridTieSize = 3; // Minimum size for grid-tie is 3 kWp
    }
    const gridTiePanelCount = Math.ceil(requiredGridTieSize / PANEL_WATTAGE_KW);
    const gridTieSystemSize = gridTiePanelCount * PANEL_WATTAGE_KW;
    const gridTieInverterSize = getNextInverterSize(gridTieSystemSize);
    const gridTieCost = gridTieSystemSize * 1000 * COST_PER_WATT_GRIDTIE_USD;

    const gridTie: SystemEstimate = {
        title: "Inyección a Red (Grid-Tie)",
        description: "Ideal para maximizar el ahorro en tu factura eléctrica, inyectando el excedente de energía a la red. No incluye baterías de respaldo.",
        systemSize: parseFloat(gridTieSystemSize.toFixed(2)),
        panelCount: gridTiePanelCount,
        inverterSize: gridTieInverterSize,
        batterySize: 0,
        estimatedCost: parseFloat(gridTieCost.toFixed(0)),
    };

    // 2. Hybrid Calculation
    const requiredHybridSize = dailyConsumption / PEAK_SUN_HOURS;
    const hybridPanelCount = Math.ceil(requiredHybridSize / PANEL_WATTAGE_KW);
    const hybridSystemSize = hybridPanelCount * PANEL_WATTAGE_KW;
    const hybridInverterSize = getNextInverterSize(hybridSystemSize);

    const requiredHybridBatteryBackup = dailyConsumption * HYBRID_AUTONOMY_DAYS;
    let finalHybridBatterySize: number;
    if (requiredHybridBatteryBackup <= 5) {
        finalHybridBatterySize = 5;
    } else {
        finalHybridBatterySize = 10;
    }

    const hybridCost = (hybridSystemSize * 1000 * COST_PER_WATT_HYBRID_USD) + (finalHybridBatterySize * COST_PER_KWH_BATTERY_USD);

    const hybrid: SystemEstimate = {
        title: "Híbrido con Respaldo",
        description: "Combina el ahorro de la inyección a red con la seguridad de un banco de baterías para tener energía durante apagones.",
        systemSize: parseFloat(hybridSystemSize.toFixed(2)),
        panelCount: hybridPanelCount,
        inverterSize: hybridInverterSize,
        batterySize: finalHybridBatterySize,
        estimatedCost: parseFloat(hybridCost.toFixed(0)),
    };

    // 3. Off-Grid Calculation
    const requiredOffGridSize = (dailyConsumption / PEAK_SUN_HOURS) * OFFGRID_SYSTEM_OVERSIZE_FACTOR;
    const offGridPanelCount = Math.ceil(requiredOffGridSize / PANEL_WATTAGE_KW);
    const offGridSystemSize = offGridPanelCount * PANEL_WATTAGE_KW;
    const offGridInverterSize = getNextInverterSize(offGridSystemSize);
    
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
