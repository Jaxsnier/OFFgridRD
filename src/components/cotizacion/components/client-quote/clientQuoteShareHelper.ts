import { QuoteCalculationResult, QuoteInput } from '../../types';
import { formatCurrency } from '../../utils/pricingCalculator';
import { QUALITY_DETAILS } from '../../constants';

export const buildClientQuoteShareText = (
    input: QuoteInput,
    calculation: QuoteCalculationResult
): string => {
    const qDetails = QUALITY_DETAILS[input.quality];

    return `☀️ *COTIZACIÓN SOLAR OFFgridRD* ☀️
📄 *Nº Cotización:* ${input.client.quoteNumber}
👤 *Cliente:* ${input.client.name}
📍 *Ubicación:* ${input.client.location || 'República Dominicana'}

⚡ *CARACTERÍSTICAS DEL SISTEMA:*
• Inversor: ${input.inverterCapacityKw} kW (${calculation.specs.inverterBrand})
• Potencia Solar: ${input.peakPowerKwp.toFixed(2)} kWp (${calculation.panelCount} paneles de ${calculation.panelWattage}W)
• Calidad: ${qDetails.name}
• Generación Estimada: ~${calculation.estimatedMonthlyKwh} kWh/mes
• Canalización: ${input.conduitMeters} metros incluidos
• Protecciones: DC/AC de grado industrial + Puesta a tierra
${input.includeBatteries ? `• Batería: ${input.batteryKwh} kWh Litio LiFePO4\n` : ''}
💰 *INVERSIÓN TOTAL LLAVE EN MANO:*
👉 ${formatCurrency(calculation.totalQuotedPrice, input.currency, input.exchangeRate)} ${input.currency}

🛡️ *GARANTÍAS:*
• Inversor: ${calculation.specs.warrantyInverter}
• Paneles: ${calculation.specs.warrantyPanels}
• Instalación y soporte técnico garantizado`;
};

export const buildClientWhatsAppUrl = (
    input: QuoteInput,
    calculation: QuoteCalculationResult
): string => {
    const cleanPhone = input.client.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
        `Hola ${input.client.name}, le comparto la cotización formal de su sistema solar con OFFgridRD (${input.inverterCapacityKw}kW / ${input.peakPowerKwp.toFixed(1)}kWp). Inversión total: ${formatCurrency(calculation.totalQuotedPrice, input.currency, input.exchangeRate)}.`
    );
    return cleanPhone
        ? `https://wa.me/${cleanPhone}?text=${message}`
        : `https://wa.me/?text=${message}`;
};
