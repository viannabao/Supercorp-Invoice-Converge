const HOST = "api.frankfurter.app";

export async function getCurrencies() {
  try {
    const response = await fetch(`https://${HOST}/currencies`);
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Error on getting currencies: ", error);
  }
}

export async function getCurrencyConversions(date, from, to) {
  try {
    const response = await fetch(`https://${HOST}/${date}?from=${from}&to=${to.join(",")}`);
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Error on convert currencies: ", error);
  }
}
