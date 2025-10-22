export interface SystemEstimate {
    title: string;
    description: string;
    systemSize: number;
    panelCount: number;
    inverterSize: number;
    batterySize: number; // 0 for grid-tie
    estimatedCost: number;
}

export interface CalculationResults {
    gridTie: SystemEstimate;
    hybrid: SystemEstimate;
    offGrid: SystemEstimate;
    dailyConsumption: number;
}
