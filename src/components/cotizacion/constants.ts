import { QuoteInput } from './types';
import {
    PANEL_SOLAR_610W_USD,
    INVERSOR_HIBRIDO_DEYE_6KW_USD,
    INVERSOR_HIBRIDO_ION_8KW_USD,
    INVERSOR_HIBRIDO_ION_16KW_USD,
    TUBO_EMT_1_PULGADA_USD,
    CAJA_PROTECCION_PV_1_STRING_USD,
    CAJA_PROTECCION_PV_2_STRING_USD,
    PERFIL_ALUMINIO_USD,
    MARGEN_GANANCIA_MIN_PERCENT,
    MARGEN_GANANCIA_MAX_PERCENT,
    MARGEN_GANANCIA_DEFAULT_PERCENT
} from './pricing';

export const DEFAULT_EXCHANGE_RATE = 60.0; // DOP por 1 USD aprox.

export const DEFAULT_QUOTE_INPUT: QuoteInput = {
    client: {
        name: 'Cliente Residencial',
        phone: '829-000-0000',
        location: 'Santo Domingo, D.N.',
        date: new Date().toISOString().split('T')[0],
        quoteNumber: `COT-${Math.floor(1000 + Math.random() * 9000)}`,
        notes: 'Sistema solar fotovoltaico llave en mano con monitoreo WiFi.'
    },
    inverterCapacityKw: 6,
    peakPowerKwp: 6.1,
    quality: 'normal',
    systemType: 'hybrid',
    conduitMeters: 24,
    mountingType: 'techo_plano',
    includeBatteries: false,
    batteryKwh: 15,
    currency: 'USD',
    exchangeRate: DEFAULT_EXCHANGE_RATE,
    profitMarginPercent: MARGEN_GANANCIA_DEFAULT_PERCENT,
    protectionStrings: 1,
    includeEdesPermits: true,
    includeMeterBaseCl200: true,
    includeAdjustableBase: true,
    cableRollsCount: 1
};

export interface QuotePreset {
    id: string;
    label: string;
    description: string;
    inverterKw: number;
    kwp: number;
    conduitMeters: number;
    recommendedQuality: 'normal' | 'premium';
    includeBatteries?: boolean;
    batteryKwh?: number;
    protectionStrings?: 1 | 2;
}

export const QUOTE_PRESETS: QuotePreset[] = [
    {
        id: 'p6kw_deye',
        label: '6 kW / 6.10 kWp',
        description: 'Inversor híbrido Deye 6kW ($1,800) + 10 Paneles 610W',
        inverterKw: 6,
        kwp: 6.1,
        conduitMeters: 21,
        recommendedQuality: 'normal',
        includeBatteries: false,
        batteryKwh: 15,
        protectionStrings: 1
    },
    {
        id: 'p8kw_ion',
        label: '8 kW / 8.54 kWp',
        description: 'Inversor híbrido Ion 8kW ($1,900) + 14 Paneles 610W',
        inverterKw: 8,
        kwp: 8.54,
        conduitMeters: 27,
        recommendedQuality: 'normal',
        includeBatteries: false,
        batteryKwh: 15,
        protectionStrings: 2
    },
    {
        id: 'p8kw_ion_bat',
        label: '8 kW + Batería 15kW',
        description: 'Ion 8kW + 14 Paneles 610W + Batería American 15kW ($2,400)',
        inverterKw: 8,
        kwp: 8.54,
        conduitMeters: 30,
        recommendedQuality: 'premium',
        includeBatteries: true,
        batteryKwh: 15,
        protectionStrings: 2
    },
    {
        id: 'p16kw_ion',
        label: '16 kW / 15.86 kWp',
        description: 'Inversor híbrido Ion 16kW ($2,850) + 26 Paneles 610W',
        inverterKw: 16,
        kwp: 15.86,
        conduitMeters: 36,
        recommendedQuality: 'normal',
        includeBatteries: false,
        batteryKwh: 15,
        protectionStrings: 2
    },
    {
        id: 'p16kw_ion_bat',
        label: '16 kW + Batería 15kW',
        description: 'Ion 16kW ($2,850) + 28 Paneles 610W + Batería American 15kW',
        inverterKw: 16,
        kwp: 17.08,
        conduitMeters: 45,
        recommendedQuality: 'premium',
        includeBatteries: true,
        batteryKwh: 15,
        protectionStrings: 2
    }
];

export const QUALITY_DETAILS = {
    normal: {
        name: `Estándar (Margen Base ${MARGEN_GANANCIA_MIN_PERCENT}% - 20%)`,
        badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300 dark:border-blue-700',
        inverterBrand: 'Inversor Híbrido Deye 6kW ($1,800 USD) / Ion 8kW ($1,900 USD) / Ion 16kW ($2,850 USD)',
        panelsBrand: 'Panel Solar Monocristalino 610W ($110 USD c/u)',
        warrantyInverter: '5 a 10 años de garantía de fábrica',
        warrantyPanels: '12 años garantía de producto / 25 años generación lineal',
        conduitSpecs: 'Tubería EMT de 1" ($10 USD c/u) + Rollo de cable PV 4mm ($100 USD)',
        protectionsSpecs: 'Caja de protección PV para 1 string ($80 USD) / 2 strings ($170 USD)',
        panelCostPerKw: Math.round((PANEL_SOLAR_610W_USD / 0.61) * DEFAULT_EXCHANGE_RATE),
        inverterCostPerKw: Math.round((INVERSOR_HIBRIDO_DEYE_6KW_USD / 6) * DEFAULT_EXCHANGE_RATE),
        conduitCostPerMeter: Math.round((TUBO_EMT_1_PULGADA_USD / 3) * DEFAULT_EXCHANGE_RATE),
        baseProtectionsCost: CAJA_PROTECCION_PV_1_STRING_USD * DEFAULT_EXCHANGE_RATE,
        mountingCostPerPanel: PERFIL_ALUMINIO_USD * DEFAULT_EXCHANGE_RATE,
        laborBase: 0,
        laborPerKw: 0,
        transportCost: 0
    },
    premium: {
        name: `Premium / Completo (Margen hasta ${MARGEN_GANANCIA_MAX_PERCENT}%)`,
        badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300 dark:border-amber-700',
        inverterBrand: 'Inversor Híbrido Ion 8kW ($1,900 USD) / Ion 16kW ($2,850 USD) / Deye 6kW ($1,800 USD)',
        panelsBrand: 'Panel Solar 610W N-Type Alta Eficiencia ($110 USD c/u)',
        warrantyInverter: '10 años de garantía respaldada',
        warrantyPanels: '25 años garantía de producto / 30 años generación lineal',
        conduitSpecs: 'Tubería EMT de 1" ($10 USD c/u) + Rollo de cable PV 4mm ($100 USD)',
        protectionsSpecs: 'Caja de protección PV para 2 strings ($170 USD) / 1 string ($80 USD)',
        panelCostPerKw: Math.round((PANEL_SOLAR_610W_USD / 0.61) * DEFAULT_EXCHANGE_RATE),
        inverterCostPerKw: Math.round((INVERSOR_HIBRIDO_ION_8KW_USD / 8) * DEFAULT_EXCHANGE_RATE),
        conduitCostPerMeter: Math.round((TUBO_EMT_1_PULGADA_USD / 3) * DEFAULT_EXCHANGE_RATE),
        baseProtectionsCost: CAJA_PROTECCION_PV_2_STRING_USD * DEFAULT_EXCHANGE_RATE,
        mountingCostPerPanel: PERFIL_ALUMINIO_USD * DEFAULT_EXCHANGE_RATE,
        laborBase: 0,
        laborPerKw: 0,
        transportCost: 0
    }
};
