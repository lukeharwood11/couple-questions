export const getPercentageText = (tipPercentage: number) => {
    if (tipPercentage === 0) return '0%';
    else if (tipPercentage < 1) return '<1%';
    else if (tipPercentage > 10000) return '>10,000%';
    else return `${tipPercentage.toFixed(2)}%`;
};