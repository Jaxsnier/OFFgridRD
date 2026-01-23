import { FinancialAnalysis, ChartDataPoint } from '../types';

/**
 * Tarifas Eléctricas RD (BTS1):
 * 0-200 kWh: 5.97
 * 201-300 kWh: 8.51
 * 301-700 kWh: 13.48
 * > 700 kWh: Todos a 13.48
 */
const T1_LIMIT = 200;
const T1_PRICE = 5.97;
const T2_LIMIT = 300;
const T2_PRICE = 8.51;
const T3_LIMIT = 700;
const T3_PRICE = 13.48;

const PEAK_SUN_HOURS = 4.5;
const PANEL_WATTAGE_W = 600;
const AVG_SYSTEM_COST_PER_W_DOP = 65; 

/**
 * Calcula el consumo en kWh a partir del monto de la factura en DOP
 * siguiendo la estructura tarifaria BTS1.
 */
const calculateKwhFromBill = (bill: number): number => {
    const costT1 = T1_LIMIT * T1_PRICE; // 1194.00
    const costT2 = (T2_LIMIT - T1_LIMIT) * T2_PRICE; // 851.00
    const costT3_threshold = costT1 + costT2 + (T3_LIMIT - T2_LIMIT) * T3_PRICE; // 7437.00
    const costCliff = T3_LIMIT * T3_PRICE; // 9436.00

    // Caso 1: Consumo muy alto (> 700 kWh)
    // Si la factura es mayor al umbral de 700kWh con tarifa plana
    if (bill >= costCliff) {
        return bill / T3_PRICE;
    }

    // Caso 2: Bloque 301 - 700 kWh
    if (bill > (costT1 + costT2)) {
        return T2_LIMIT + (bill - (costT1 + costT2)) / T3_PRICE;
    }

    // Caso 3: Bloque 201 - 300 kWh
    if (bill > costT1) {
        return T1_LIMIT + (bill - costT1) / T2_PRICE;
    }

    // Caso 4: Bloque 0 - 200 kWh
    return bill / T1_PRICE;
};

export const calculateFinancialAnalysis = (monthlyBill: number): FinancialAnalysis => {
    // 1. Consumption calculations based on RD tiered rates
    const monthlyConsumptionKwh = calculateKwhFromBill(monthlyBill);
    const annualSpend = monthlyBill * 12;
    const spend25Years = annualSpend * 25;

    // 2. System sizing
    const dailyKwh = monthlyConsumptionKwh / 30;
    const systemSizekWp = dailyKwh / PEAK_SUN_HOURS;
    const panelCount = Math.ceil((systemSizekWp * 1000) / PANEL_WATTAGE_W);
    const finalSystemSizekWp = (panelCount * PANEL_WATTAGE_W) / 1000;

    // 3. Investment and ROI
    const estimatedInvestment = finalSystemSizekWp * 1000 * AVG_SYSTEM_COST_PER_W_DOP;
    const annualSavings = annualSpend; 
    
    let roiYears = estimatedInvestment / annualSavings;
    
    // Realistic boundaries
    if (roiYears < 2) roiYears = 2;
    if (roiYears > 6) roiYears = 6;

    const totalProfit25Years = spend25Years - estimatedInvestment;

    return {
        monthlyBill,
        annualSpend,
        spend25Years,
        systemSizekWp: parseFloat(finalSystemSizekWp.toFixed(2)),
        panelCount,
        estimatedInvestment: Math.round(estimatedInvestment),
        annualSavings,
        roiYears: parseFloat(roiYears.toFixed(1)),
        totalProfit25Years: Math.round(totalProfit25Years),
        monthlyConsumptionKwh: Math.round(monthlyConsumptionKwh)
    };
};

export const generateChartData = (analysis: FinancialAnalysis): ChartDataPoint[] => {
    const data: ChartDataPoint[] = [];
    for (let year = 1; year <= 15; year++) {
        data.push({
            year,
            costWithoutSolar: analysis.annualSpend * year,
            costWithSolar: analysis.estimatedInvestment 
        });
    }
    return data;
};
