// Sección 1: COMPONENTES Y PRECIOS ESPECÍFICOS (Precios base en USD)

export const PANEL_SOLAR_610W_WATTS = 610;
export const PANEL_SOLAR_610W_USD = 110;

export const INVERSOR_HIBRIDO_DEYE_6KW_USD = 1800;
export const INVERSOR_HIBRIDO_ION_8KW_USD = 1900;
export const INVERSOR_HIBRIDO_ION_16KW_USD = 2850;

export const BATERIA_AMERICAN_15KW_KWH = 15;
export const BATERIA_AMERICAN_15KW_USD = 2400;

export const PERFIL_ALUMINIO_USD = 35;
export const MID_CLAMP_USD = 2;
export const END_CLAMP_USD = 2;
export const BASE_AJUSTABLE_15_GRADOS_ALUMINIO_USD = 8;

export const ROLLO_CABLE_PV_4MM_USD = 100;

export interface CatalogInverterModel {
    id: 'deye_6kw' | 'ion_8kw' | 'ion_16kw';
    name: string;
    brand: string;
    capacityKw: number;
    priceUsd: number;
}

export const CATALOGO_INVERSORES: CatalogInverterModel[] = [
    {
        id: 'deye_6kw',
        name: 'Inversor híbrido Deye 6kW',
        brand: 'Deye Hybrid 6kW',
        capacityKw: 6,
        priceUsd: INVERSOR_HIBRIDO_DEYE_6KW_USD
    },
    {
        id: 'ion_8kw',
        name: 'Inversor híbrido Ion 8kW',
        brand: 'Ion Hybrid 8kW',
        capacityKw: 8,
        priceUsd: INVERSOR_HIBRIDO_ION_8KW_USD
    },
    {
        id: 'ion_16kw',
        name: 'Inversor híbrido Ion 16kW',
        brand: 'Ion Hybrid 16kW',
        capacityKw: 16,
        priceUsd: INVERSOR_HIBRIDO_ION_16KW_USD
    }
];
