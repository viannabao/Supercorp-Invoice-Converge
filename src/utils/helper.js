// Function to round a number to a specified precision
const round = (number, precision) => {
  const multiplier = Math.pow(10, precision); // Calculate the multiplier for rounding
  return Math.round(number * multiplier) / multiplier; // Round the number and return
};

// Function to calculate the total amount in base currency
export const totalCurrencyCalculation = (lines, rates) => {
  return lines.reduce((total, line) => {
    if (line.currency && line.amount) {
      const roundedRate = round(rates[line.currency], 4); // Round the currency rate
      const amountInBase = round(line.amount / roundedRate, 4); // Calculate amount in base currency
      return total + amountInBase;
    } else {
      return total; // Skip if currency or amount is missing
    }
  }, 0); // Initialise total as 0
};
