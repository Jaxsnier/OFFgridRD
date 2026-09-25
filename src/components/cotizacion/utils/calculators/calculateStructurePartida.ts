import {
    PERFIL_ALUMINIO_USD,
    MID_CLAMP_USD,
    END_CLAMP_USD,
    BASE_AJUSTABLE_15_GRADOS_ALUMINIO_USD,
    PANELES_POR_PERFIL_ALUMINIO,
    END_CLAMPS_POR_STRING,
    MID_CLAMPS_POR_UNION_PANELES
} from '../../pricing';
import { BudgetDivisionItem, QuoteInput } from '../../types';

export interface StructureBreakdown {
    perfilesCount: number;
    midClampsCount: number;
    endClampsCount: number;
    basesAjustablesCount: number;
    stringsCount: number;
    totalUsd: number;
}

export const getStructureUnitsBreakdown = (
    input: QuoteInput,
    panelCount: number
): StructureBreakdown => {
    const stringsCount: 1 | 2 =
        input.protectionStrings !== undefined
            ? input.protectionStrings
            : panelCount > 10
            ? 2
            : 1;

    // Perfil de aluminio (riel de 19 pies): 1 riel por cada 2.5 paneles
    const perfilesCount = Math.max(1, Math.ceil(panelCount / PANELES_POR_PERFIL_ALUMINIO));

    // End clamp: 2 al inicio de cada string + 2 al final de cada string (4 por string)
    const activeStrings = Math.min(panelCount, stringsCount);
    const endClampsCount = activeStrings * END_CLAMPS_POR_STRING;

    // Mid clamp: 2 en medio de cada 2 paneles dentro de cada string
    const internalPanelJunctions = Math.max(0, panelCount - activeStrings);
    const midClampsCount = internalPanelJunctions * MID_CLAMPS_POR_UNION_PANELES;

    const includeAdjustableBase =
        input.includeAdjustableBase !== undefined
            ? input.includeAdjustableBase
            : input.mountingType === 'techo_plano';

    const basesAjustablesCount = includeAdjustableBase ? panelCount * 2 : 0;

    const perfilesUsd = perfilesCount * PERFIL_ALUMINIO_USD;
    const midClampsUsd = midClampsCount * MID_CLAMP_USD;
    const endClampsUsd = endClampsCount * END_CLAMP_USD;
    const basesUsd = basesAjustablesCount * BASE_AJUSTABLE_15_GRADOS_ALUMINIO_USD;

    const totalUsd = perfilesUsd + midClampsUsd + endClampsUsd + basesUsd;

    return {
        perfilesCount,
        midClampsCount,
        endClampsCount,
        basesAjustablesCount,
        stringsCount: activeStrings,
        totalUsd
    };
};

export const calculateStructurePartida = (
    input: QuoteInput,
    panelCount: number,
    marginMultiplier: number
): Omit<BudgetDivisionItem, 'isCustomOverridden'> => {
    const {
        perfilesCount,
        midClampsCount,
        endClampsCount,
        basesAjustablesCount,
        stringsCount,
        totalUsd
    } = getStructureUnitsBreakdown(input, panelCount);

    const costInternal = Math.round(totalUsd * input.exchangeRate);
    const priceQuoted = Math.round(costInternal * marginMultiplier);

    const partsDescription = [
        `${perfilesCount}x Perfil aluminio 19' ($${PERFIL_ALUMINIO_USD} USD c/u)`,
        `${midClampsCount}x Mid clamp ($${MID_CLAMP_USD} USD c/u)`,
        `${endClampsCount}x End clamp (${stringsCount} string${stringsCount > 1 ? 's' : ''} × 4, $${END_CLAMP_USD} USD c/u)`
    ];

    if (basesAjustablesCount > 0) {
        partsDescription.push(
            `${basesAjustablesCount}x Base ajustable 15° aluminio ($${BASE_AJUSTABLE_15_GRADOS_ALUMINIO_USD} USD c/u)`
        );
    }

    return {
        id: 'estructura',
        category: 'Estructura de Montaje y Fijación',
        description: partsDescription.join(' + '),
        unitDetail: `${perfilesCount} rieles 19' / ${midClampsCount} mid / ${endClampsCount} end`,
        costInternal,
        priceQuoted
    };
};
