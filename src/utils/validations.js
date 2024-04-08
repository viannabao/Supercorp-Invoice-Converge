export const jsonValidation = (jsonString, currencies) => {
  const jsonData = JSON.parse(jsonString);
  if (!jsonData || !Array.isArray(jsonData.invoices)) {
    throw new Error('Invalid JSON format: Missing "invoices" array');
  }

  jsonData.invoices.forEach((invoice, index) => {
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

    if (!currencies[invoice.currency]) {
      throw new Error(`Invalid currency code at invoice index ${index}`);
    }
    invoice.lines.forEach((line, lineIndex) => {
      if (!line.description || !line.currency || !line.amount) {
        throw new Error(
          `Invalid line in invoice at index ${index}, line ${lineIndex}: Missing required properties`
        );
      }
      if (!currencies[line.currency]) {
        throw new Error(
          `Invalid currency code at invoice index ${index}, line ${lineIndex}`
        );
      }
    });
  });
};

export const checkDuplicates = (lines) => {
  const lineStrings = lines.map(
    (line) => `${line.description}${line.currency}${line.amount}`
  );
  const lineSet = new Set([...lineStrings]);
  if (lineSet.size !== lines.length) {
    const duplicatedIndex = lineStrings.findIndex(
      (elem, idx, arr) => arr.indexOf(elem) !== idx
    );
    throw { index: duplicatedIndex };
  }
};

export const checkNumberInput = (input) => {
  if(input <= 0) {
    throw new Error("Amount must be greater than 0");
  }
}
