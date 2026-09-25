import {
    PERFIL_ALUMINIO_USD,
    MID_CLAMP_USD,
    END_CLAMP_USD,
    BASE_AJUSTABLE_15_GRADOS_ALUMINIO_USD
} from '../../pricing';
import { BudgetDivisionItem, QuoteInput } from '../../types';

export const calculateStructurePartida = (
    input: QuoteInput,
    panelCount: number,
    marginMultiplier: number
): Omit<BudgetDivisionItem, 'isCustomOverridden'> => {
    const perfilesCount = Math.max(1, Math.ceil(panelCount / 2));
    const midClampsCount = Math.max(2, (panelCount - 1) * 2);
    const endClampsCount = Math.max(4, Math.ceil(panelCount / 5) * 4);

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
    const costInternal = Math.round(totalUsd * input.exchangeRate);
    const priceQuoted = Math.round(costInternal * marginMultiplier);

    const partsDescription = [
        `${perfilesCount}x Perfil de aluminio ($${PERFIL_ALUMINIO_USD} USD)`,
        `${midClampsCount}x Mid clamp ($${MID_CLAMP_USD} USD)`,
        `${endClampsCount}x End clamp ($${END_CLAMP_USD} USD)`
    ];

    if (basesAjustablesCount > 0) {
        partsDescription.push(
            `${basesAjustablesCount}x Base ajustable 15° aluminio ($${BASE_AJUSTABLE_15_GRADOS_ALUMINIO_USD} USD)`
        );
    }

    return {
        id: 'estructura',
        category: 'Estructura de Montaje y Fijación',
        description: partsDescription.join(' + '),
        unitDetail: `${perfilesCount} perfiles / ${panelCount} paneles`,
        costInternal,
        priceQuoted
    };
};
