import { QuoteInput } from './types';

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
    inverterCapacityKw: 5,
    peakPowerKwp: 5.5,
    quality: 'normal',
    systemType: 'ongrid',
    conduitMeters: 25,
    mountingType: 'techo_plano',
    includeBatteries: false,
    batteryKwh: 5,
    currency: 'DOP',
    exchangeRate: DEFAULT_EXCHANGE_RATE
};

export interface QuotePreset {
    id: string;
    label: string;
    description: string;
    inverterKw: number;
    kwp: number;
    conduitMeters: number;
    recommendedQuality: 'normal' | 'premium';
}

export const QUOTE_PRESETS: QuotePreset[] = [
    {
        id: 'p3kw',
        label: '3 kW / 3.6 kWp',
        description: 'Consumo pequeño (hogar 300-450 kWh/mes)',
        inverterKw: 3,
        kwp: 3.6,
        conduitMeters: 20,
        recommendedQuality: 'normal'
    },
    {
        id: 'p5kw',
        label: '5 kW / 5.5 kWp',
        description: 'Residencial estándar (500-750 kWh/mes)',
        inverterKw: 5,
        kwp: 5.5,
        conduitMeters: 25,
        recommendedQuality: 'normal'
    },
    {
        id: 'p8kw',
        label: '8 kW / 9.0 kWp',
        description: 'Residencial amplio / villa (850-1,200 kWh/mes)',
        inverterKw: 8,
        kwp: 9.0,
        conduitMeters: 30,
        recommendedQuality: 'premium'
    },
    {
        id: 'p10kw',
        label: '10 kW / 11.5 kWp',
        description: 'Comercial / gran residencia (1,200-1,600 kWh/mes)',
        inverterKw: 10,
        kwp: 11.5,
        conduitMeters: 35,
        recommendedQuality: 'normal'
    },
    {
        id: 'p15kw',
        label: '15 kW / 17.0 kWp',
        description: 'Comercial e industrial trifásico (2,000+ kWh/mes)',
        inverterKw: 15,
        kwp: 17.0,
        conduitMeters: 45,
        recommendedQuality: 'premium'
    }
];

export const QUALITY_DETAILS = {
    normal: {
        name: 'Normal / Estándar',
        badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300 dark:border-blue-700',
        inverterBrand: 'Growatt / Deye / Solis (Tier 1 Global)',
        panelsBrand: 'Paneles Monocristalinos Tier 1 PERC / TopCon 580W',
        warrantyInverter: '5 años de garantía de fábrica',
        warrantyPanels: '12 años garantía de producto / 25 años generación al 80%',
        conduitSpecs: 'Tubería EMT / PVC Conduit pesado + Cable Solar Fotovoltaico XLPO 10AWG',
        protectionsSpecs: 'Tablero DC/AC Suntree/Chint, SPD 600V/1000V, Breakers y puesta a tierra con varilla copperweld',
        panelCostPerKw: 14500,
        inverterCostPerKw: 24000,
        conduitCostPerMeter: 800,
        baseProtectionsCost: 15000,
        mountingCostPerPanel: 2800,
        laborBase: 25000,
        laborPerKw: 3500,
        transportCost: 8000
    },
    premium: {
        name: 'Premium High-End',
        badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300 dark:border-amber-700',
        inverterBrand: 'Victron Energy / SMA / Fronius / Deye High-Efficiency',
        panelsBrand: 'Canadian Solar / Jinko Tiger Neo / Longi N-Type TopCon 600W Bi-facial',
        warrantyInverter: '10 años de garantía extendida',
        warrantyPanels: '25 años garantía integral de producto / 30 años producción al 87.4%',
        conduitSpecs: 'Tubería galvanizada de alta resistencia + Conduit hermético LiquidTight + Cable Solar Helukabel/Top Cable',
        protectionsSpecs: 'Protecciones Dehn / Schneider Electric / ABB Clase I+II, caja estanca IP66, barra equipotencial y pararrayos',
        panelCostPerKw: 19500,
        inverterCostPerKw: 34000,
        conduitCostPerMeter: 1200,
        baseProtectionsCost: 22000,
        mountingCostPerPanel: 4200,
        laborBase: 35000,
        laborPerKw: 4500,
        transportCost: 12000
    }
};
