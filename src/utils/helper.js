const round = (number, precision) => {
  const multiplier = Math.pow(10, precision);
  return Math.round(number * multiplier) / multiplier;
};

export const totalCurrencyCalculation = (lines, rates) => {
  return lines.reduce((total, line) => {
    if (line.currency && line.amount) {
      const roundedRate = round(rates[line.currency], 4);
      const amountInBase = round(line.amount / roundedRate, 4);
      return total + amountInBase;
    } else {
      return total;
    }
  }, 0);
};
