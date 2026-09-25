import {
    GESTION_PERMISOS_EDES_USD,
    BASE_CL_200_MEDIDOR_USD
} from '../../pricing';
import { BudgetDivisionItem, QuoteInput } from '../../types';

export const calculateEdesPartida = (
    input: QuoteInput,
    marginMultiplier: number
): Omit<BudgetDivisionItem, 'isCustomOverridden'> | null => {
    const includePermits = input.includeEdesPermits !== undefined ? input.includeEdesPermits : true;
    const includeMeterBase = input.includeMeterBaseCl200 !== undefined ? input.includeMeterBaseCl200 : true;

    if (!includePermits && !includeMeterBase) {
        return null;
    }

    const parts: string[] = [];
    let totalUsd = 0;

    if (includePermits) {
        parts.push(`Gestión de permisos ($${GESTION_PERMISOS_EDES_USD} USD)`);
        totalUsd += GESTION_PERMISOS_EDES_USD;
    }

    if (includeMeterBase) {
        parts.push(`Base CL 200 para medidor ($${BASE_CL_200_MEDIDOR_USD} USD)`);
        totalUsd += BASE_CL_200_MEDIDOR_USD;
    }

    const costInternal = Math.round(totalUsd * input.exchangeRate);
    const priceQuoted = Math.round(costInternal * marginMultiplier);

    return {
        id: 'requisitos_edes',
        category: 'Requisitos EDES',
        description: parts.join(' + '),
        unitDetail: `$${totalUsd} USD total EDES`,
        costInternal,
        priceQuoted
    };
};
