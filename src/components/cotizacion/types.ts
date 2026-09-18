export type EquipmentQuality = 'normal' | 'premium';

export type SystemType = 'ongrid' | 'hybrid' | 'offgrid';

export type MountingType = 'techo_plano' | 'aluzinc' | 'tejas' | 'suelo';

export interface ClientInfo {
    name: string;
    phone: string;
    location: string;
    date: string;
    quoteNumber: string;
    notes: string;
}

export interface QuoteInput {
    client: ClientInfo;
    inverterCapacityKw: number;
    peakPowerKwp: number;
    quality: EquipmentQuality;
    systemType: SystemType;
    conduitMeters: number;
    mountingType: MountingType;
    includeBatteries: boolean;
    batteryKwh: number;
    currency: 'DOP' | 'USD';
    exchangeRate: number;
}

export interface BudgetDivisionItem {
    id: string;
    category: string;
    description: string;
    unitDetail: string;
    costInternal: number;
    priceQuoted: number;
    isCustomOverridden?: boolean;
}

export interface QuoteCalculationResult {
    items: BudgetDivisionItem[];
    totalInternalCost: number;
    totalQuotedPrice: number;
    estimatedProfit: number;
    profitMarginPercent: number;
    panelCount: number;
    panelWattage: number;
    estimatedMonthlyKwh: number;
    specs: {
        inverterBrand: string;
        panelsBrand: string;
        warrantyInverter: string;
        warrantyPanels: string;
        conduitSpecs: string;
        protectionsSpecs: string;
    };
}
