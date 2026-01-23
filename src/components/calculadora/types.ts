
export interface FinancialAnalysis {
    monthlyBill: number;
    annualSpend: number;
    spend25Years: number;
    
    systemSizekWp: number;
    panelCount: number;
    estimatedInvestment: number;
    
    annualSavings: number;
    roiYears: number;
    totalProfit25Years: number;
    
    monthlyConsumptionKwh: number;
}

export interface ChartDataPoint {
    year: number;
    costWithoutSolar: number;
    costWithSolar: number;
}

// Fix: Added missing SystemEstimate interface used in EstimateCard component.
export interface SystemEstimate {
    title: string;
    description: string;
    systemSize: number;
    panelCount: number;
    inverterSize: number;
    batterySize: number;
    estimatedCost: number;
}
