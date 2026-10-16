export interface InternalBudgetColumnsVisibility {
    category: boolean;      // Partida / Rubro
    unitDetail: boolean;    // Especificación / Cantidad
    costInternal: boolean;  // Presupuesto Costo
    priceQuoted: boolean;   // Precio Cotizado
    marginProfit: boolean;  // Margen / Ganancia
}

export const DEFAULT_COLUMNS_VISIBILITY: InternalBudgetColumnsVisibility = {
    category: true,
    unitDetail: true,
    costInternal: true,
    priceQuoted: true,
    marginProfit: true
};

export interface ColumnDefinition {
    id: keyof InternalBudgetColumnsVisibility;
    label: string;
    description: string;
}

export const BUDGET_COLUMN_DEFINITIONS: ColumnDefinition[] = [
    { id: 'category', label: 'Partida / Rubro', description: 'Nombre y descripción técnica' },
    { id: 'unitDetail', label: 'Especificación / Cantidad', description: 'Cantidades y unidades físicas' },
    { id: 'costInternal', label: 'Presupuesto Costo', description: 'Costo interno de compra' },
    { id: 'priceQuoted', label: 'Precio Cotizado', description: 'Precio contratado al cliente' },
    { id: 'marginProfit', label: 'Margen / Ganancia', description: 'Utilidad en DOP/USD y % de margen' }
];
