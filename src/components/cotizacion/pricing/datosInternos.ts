// Sección 4: DATOS INTERNOS - Fórmulas y Variables para Cálculos de Precios y Cotizaciones

export const MARGEN_GANANCIA_MIN_PERCENT = 15;
export const MARGEN_GANANCIA_DEFAULT_PERCENT = 30;
export const MARGEN_GANANCIA_MAX_PERCENT = 40;

export const TRANSPORTE_LOGISTICA_PERCENT = 1; // 1% del total
export const MANO_OBRA_SUPERVISION_PERCENT = 5; // 5% del total

// Fórmulas de estructura (riel de 19 pies y clamps por unidad)
export const PANELES_POR_PERFIL_ALUMINIO = 2.5; // 1 riel de 19 pies por cada 2.5 paneles
export const END_CLAMPS_POR_STRING = 4; // 2 al inicio + 2 al final de cada string
export const MID_CLAMPS_POR_UNION_PANELES = 2; // 2 en medio de cada 2 paneles

// Estimación de producción solar
export const HORAS_SOL_DIARIAS_PROMEDIO = 4.5; // 4.5 horas de sol diarias promedio
export const DIAS_PROMEDIO_MES = 30; // 30 días por mes
