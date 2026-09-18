import { BudgetDivisionItem, QuoteCalculationResult, QuoteInput } from '../types';
import { QUALITY_DETAILS } from '../constants';

export const calculateQuote = (
    input: QuoteInput,
    customOverrides: Record<string, { costInternal?: number; priceQuoted?: number }> = {}
): QuoteCalculationResult => {
    const qConfig = QUALITY_DETAILS[input.quality];

    // Estimated panel specs
    const panelWattage = input.quality === 'premium' ? 600 : 580;
    const peakWatts = input.peakPowerKwp * 1000;
    const panelCount = Math.max(1, Math.ceil(peakWatts / panelWattage));

    // 1. Canalización: user example "para canalizacion presupuesto de 20,000 25 metros de canalizacion"
    // At 25m: 25 * 800 = 20,000 DOP internal cost!
    const conduitCostBase = Math.round(input.conduitMeters * qConfig.conduitCostPerMeter);
    const conduitPriceBase = Math.round(conduitCostBase * 1.30); // 30% margin standard

    // 2. Inversor: user example "inversor 120,000"
    // For 5kW inverter in normal: 5 * 24000 = 120,000 DOP! Exactly matches user's mental model!
    const inverterCostBase = Math.round(input.inverterCapacityKw * qConfig.inverterCostPerKw);
    const inverterPriceBase = Math.round(inverterCostBase * 1.25);

    // 3. Placas / Paneles: user example "placas 80,000"
    // 5.5 kWp * 14500 = ~79,750 ≈ 80,000 DOP! Matches user's example!
    const panelsCostBase = Math.round(input.peakPowerKwp * qConfig.panelCostPerKw);
    const panelsPriceBase = Math.round(panelsCostBase * 1.28);

    // 4. Protecciones: user example "proteciones 15,000"
    // Exactly 15,000 base + small scale if > 5kW
    const scaleFactor = Math.max(1, input.inverterCapacityKw / 5);
    const protectionsCostBase = Math.round(qConfig.baseProtectionsCost * (1 + (scaleFactor - 1) * 0.3));
    const protectionsPriceBase = Math.round(protectionsCostBase * 1.35);

    // 5. Estructura y Montaje
    const mountingCostBase = Math.round(panelCount * qConfig.mountingCostPerPanel);
    const mountingPriceBase = Math.round(mountingCostBase * 1.30);

    // 6. Baterías / Almacenamiento (if enabled)
    let batteryCostBase = 0;
    let batteryPriceBase = 0;
    if (input.includeBatteries && input.batteryKwh > 0) {
        const kwhCost = input.quality === 'premium' ? 22000 : 17000;
        batteryCostBase = Math.round(input.batteryKwh * kwhCost);
        batteryPriceBase = Math.round(batteryCostBase * 1.22);
    }

    // 7. Mano de Obra, Instalación & Certificación
    const laborCostBase = Math.round(qConfig.laborBase + (input.peakPowerKwp * qConfig.laborPerKw));
    const laborPriceBase = Math.round(laborCostBase * 1.40);

    // 8. Logística y Transporte
    const transportCostBase = qConfig.transportCost;
    const transportPriceBase = Math.round(transportCostBase * 1.20);

    // Build items array
    const rawItems: Omit<BudgetDivisionItem, 'isCustomOverridden'>[] = [
        {
            id: 'canalizacion',
            category: 'Canalización & Cableado Solar',
            description: `${input.conduitMeters} metros de canalización (${qConfig.conduitSpecs})`,
            unitDetail: `${input.conduitMeters} metros lineales`,
            costInternal: conduitCostBase,
            priceQuoted: conduitPriceBase
        },
        {
            id: 'inversor',
            category: 'Inversor Solar Central',
            description: `Inversor ${input.inverterCapacityKw} kW - ${qConfig.inverterBrand}`,
            unitDetail: `1 unidad (${input.inverterCapacityKw} kW)`,
            costInternal: inverterCostBase,
            priceQuoted: inverterPriceBase
        },
        {
            id: 'placas',
            category: 'Placas / Paneles Solares',
            description: `${panelCount} Paneles de ${panelWattage}W (${input.peakPowerKwp.toFixed(2)} kWp total) - ${qConfig.panelsBrand}`,
            unitDetail: `${panelCount} unidades (${input.peakPowerKwp.toFixed(2)} kWp)`,
            costInternal: panelsCostBase,
            priceQuoted: panelsPriceBase
        },
        {
            id: 'protecciones',
            category: 'Protecciones Eléctricas DC / AC',
            description: `${qConfig.protectionsSpecs}`,
            unitDetail: 'Kit completo protecciones',
            costInternal: protectionsCostBase,
            priceQuoted: protectionsPriceBase
        },
        {
            id: 'estructura',
            category: 'Estructuras de Montaje',
            description: `Montaje de aluminio anodizado estructural para ${input.mountingType.replace('_', ' ')} con herrajes de acero inox`,
            unitDetail: `${panelCount} soportes`,
            costInternal: mountingCostBase,
            priceQuoted: mountingPriceBase
        }
    ];

    if (input.includeBatteries && input.batteryKwh > 0) {
        rawItems.push({
            id: 'baterias',
            category: 'Baterías de Litio LiFePO4',
            description: `Banco de almacenamiento de ${input.batteryKwh} kWh con BMS inteligente`,
            unitDetail: `${input.batteryKwh} kWh capacidad`,
            costInternal: batteryCostBase,
            priceQuoted: batteryPriceBase
        });
    }

    rawItems.push(
        {
            id: 'mano_obra',
            category: 'Mano de Obra & Supervisión',
            description: 'Montaje mecánico, tendido eléctrico, interconexión, pruebas de aislamiento y puesta en marcha técnica',
            unitDetail: 'Servicio llave en mano',
            costInternal: laborCostBase,
            priceQuoted: laborPriceBase
        },
        {
            id: 'transporte',
            category: 'Transporte & Logística',
            description: `Despacho de equipos y traslados técnicos hacia ${input.client.location || 'destino'}`,
            unitDetail: 'Flete y viáticos',
            costInternal: transportCostBase,
            priceQuoted: transportPriceBase
        }
    );

    // Apply custom overrides if any
    const finalItems: BudgetDivisionItem[] = rawItems.map(item => {
        const override = customOverrides[item.id];
        if (override) {
            return {
                ...item,
                costInternal: override.costInternal !== undefined ? override.costInternal : item.costInternal,
                priceQuoted: override.priceQuoted !== undefined ? override.priceQuoted : item.priceQuoted,
                isCustomOverridden: true
            };
        }
        return item;
    });

    const totalInternalCost = finalItems.reduce((acc, curr) => acc + curr.costInternal, 0);
    const totalQuotedPrice = finalItems.reduce((acc, curr) => acc + curr.priceQuoted, 0);
    const estimatedProfit = totalQuotedPrice - totalInternalCost;
    const profitMarginPercent = totalQuotedPrice > 0 ? (estimatedProfit / totalQuotedPrice) * 100 : 0;

    // Monthly generation estimate in Dominican Republic (avg 4.5 peak sun hours * 30 days * 0.82 performance ratio)
    const estimatedMonthlyKwh = Math.round(input.peakPowerKwp * 4.5 * 30 * 0.82);

    return {
        items: finalItems,
        totalInternalCost,
        totalQuotedPrice,
        estimatedProfit,
        profitMarginPercent,
        panelCount,
        panelWattage,
        estimatedMonthlyKwh,
        specs: {
            inverterBrand: qConfig.inverterBrand,
            panelsBrand: qConfig.panelsBrand,
            warrantyInverter: qConfig.warrantyInverter,
            warrantyPanels: qConfig.warrantyPanels,
            conduitSpecs: qConfig.conduitSpecs,
            protectionsSpecs: qConfig.protectionsSpecs
        }
    };
};

export const formatCurrency = (amount: number, currency: 'DOP' | 'USD' = 'DOP', exchangeRate: number = 60): string => {
    if (currency === 'USD') {
        const usdValue = amount / exchangeRate;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(usdValue);
    }

    return new Intl.NumberFormat('es-DO', {
        style: 'currency',
        currency: 'DOP',
        maximumFractionDigits: 0
    }).format(amount).replace('DOP', 'RD$');
};
