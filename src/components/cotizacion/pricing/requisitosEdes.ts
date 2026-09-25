// Sección 2: REQUISITOS EDES (Precios base en USD)

export const GESTION_PERMISOS_EDES_USD = 500;
export const BASE_CL_200_MEDIDOR_USD = 150;

export const REQUISITOS_EDES_CATALOG = {
    gestionPermisos: {
        id: 'gestion_permisos',
        name: 'Gestión de permisos',
        priceUsd: GESTION_PERMISOS_EDES_USD
    },
    baseCl200Medidor: {
        id: 'base_cl200_medidor',
        name: 'Base CL 200 para medidor',
        priceUsd: BASE_CL_200_MEDIDOR_USD
    }
};
