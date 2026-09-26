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
    // Variables conectadas con LISTA_PRECIOS_Y_COMPONENTES_SOLAR.txt
    profitMarginPercent?: number; // Rango 15% (min) a 30% (max)
    protectionStrings?: 1 | 2; // 1 string ($80 USD) o 2 strings ($170 USD)
    includeEdesPermits?: boolean; // Gestión de permisos ($500 USD)
    includeMeterBaseCl200?: boolean; // Base CL 200 para medidor ($150 USD)
    includeAdjustableBase?: boolean; // Base ajustable 15° de aluminio ($8 USD)
    cableRollsCount?: number; // Rollo de cable PV 4mm ($100 USD)
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
    estimatedDailyKwh: number;
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
