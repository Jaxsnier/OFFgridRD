export const formatCurrency = (
    amount: number,
    currency: 'DOP' | 'USD' = 'DOP',
    exchangeRate: number = 60
): string => {
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
    })
        .format(amount)
        .replace('DOP', 'RD$');
};
