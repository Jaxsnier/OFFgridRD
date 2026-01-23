// All costs are in Dominican Pesos (DOP)

// Services
export const PERMIT_COST = 30000;

// Hardware costs for individual selection steps
// Fix: Added missing constants required by Step1_InverterSelection.tsx, Step2_PanelSelection.tsx, and Step3_BatterySelection.tsx
export const INVERTER_GRIDTIE_COST = 45000;
export const INVERTER_HYBRID_COST = 85000;
export const PANEL_WATTAGE_KW = 0.600;
export const BATTERY_5KWH_COST = 95000;
export const BATTERY_10KWH_COST = 180000;

// Kits Definition
export interface SolarKit {
    id: string;
    name: string;
    description: string;
    cost: number;
    features: string[];
    power: string;
}

export const SOLAR_KITS: SolarKit[] = [
    {
        id: 'kit-3kw',
        name: 'Kit Esencial 3kW',
        description: 'Ideal para hogares con consumo moderado que buscan iniciar su independencia energética.',
        cost: 165000,
        power: '3.6 kWp',
        features: [
            '6 Paneles solares de 600W',
            'Inversor Growatt 3kW',
            'Canalización completa',
            'Protecciones AC/DC',
            'Estructura de aluminio',
            'Instalación profesional'
        ]
    },
    {
        id: 'kit-5kw',
        name: 'Kit Estándar 5kW',
        description: 'Nuestra opción más popular. Diseñada para cubrir el consumo de un hogar dominicano promedio.',
        cost: 225000,
        power: '5.4 kWp',
        features: [
            '9 Paneles solares de 600W',
            'Inversor Growatt 5kW',
            'Canalización completa',
            'Protecciones AC/DC',
            'Estructura de aluminio',
            'Instalación profesional'
        ]
    },
    {
        id: 'kit-10kw',
        name: 'Kit Premium 10kW',
        description: 'Para hogares grandes o negocios con alto consumo. Máxima potencia y ahorro garantizado.',
        cost: 410000,
        power: '10.8 kWp',
        features: [
            '18 Paneles solares de 600W',
            'Inversor Growatt 10kW',
            'Canalización completa',
            'Protecciones AC/DC',
            'Estructura de aluminio',
            'Instalación profesional'
        ]
    }
];
