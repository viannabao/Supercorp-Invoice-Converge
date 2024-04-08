// Function to validate JSON data
export const jsonValidation = (jsonString, currencies) => {
  const jsonData = JSON.parse(jsonString);

  // Check if the parsed data contains an 'invoices' array
  if (!jsonData || !Array.isArray(jsonData.invoices)) {
    throw new Error('Invalid JSON format: Missing "invoices" array');
  }

  jsonData.invoices.forEach((invoice, index) => {
    // Check if each invoice object has required properties such as 'currency', 'date', and 'lines'
    if (
      !invoice.currency ||
      !invoice.date ||
      !invoice.lines ||
      !Array.isArray(invoice.lines)
    ) {
      throw new Error(
        `Invalid invoice at index ${index}: Missing required properties`
      );
    }

    // Check if the currency code of each invoice is valid
    if (!currencies[invoice.currency]) {
      throw new Error(`Invalid currency code at invoice index ${index}`);
    }

    invoice.lines.forEach((line, lineIndex) => {
      // Check if each line object has required properties such as 'description', 'currency', and 'amount'
      if (!line.description || !line.currency || !line.amount) {
        throw new Error(
          `Invalid line in invoice at index ${index}, line ${lineIndex}: Missing required properties`
        );
      }

      // Check if the currency code of each line is valid
      if (!currencies[line.currency]) {
        throw new Error(
          `Invalid currency code at invoice index ${index}, line ${lineIndex}`
        );
      }
    });
  });
};

// Function to check for duplicates in an array of line items
export const checkDuplicates = (lines) => {
  // Create an array of strings representing each line item using description, currency, and amount
  const lineStrings = lines.map(
    (line) => `${line.description}${line.currency}${line.amount}`
  );

  // Create a set from the array of line item strings to identify duplicates
  const lineSet = new Set([...lineStrings]);

  // Check if the set size is equal to the length of the original array, indicating no duplicates
  if (lineSet.size !== lines.length) {
    // Find the index of the first duplicated line item
    const duplicatedIndex = lineStrings.findIndex(
      (elem, idx, arr) => arr.indexOf(elem) !== idx
    );

    throw { index: duplicatedIndex };
  }
};

// Function to validate numeric input
export const checkNumberInput = (input) => {
  if (input <= 0) {
    throw new Error("Amount must be greater than 0");
  }
};
