import { createContext, useContext, useReducer, useMemo, useEffect, useState } from "react";
import dayjs from "dayjs";
import { getCurrencies } from "../api/currencyService";

const initialState = {
  invoices: [
    {
      currency: "NZD",
      date: "2020-07-07",
      total: "",
      lines: [
        { description: "Intel Core i9", currency: "USD", amount: 700 },
        { description: "ASUS ROG Strix", currency: "AUD", amount: 500 },
      ],
    },
    {
      currency: "EUR",
      date: "2020-07-07",
      total: "",
      lines: [
        { description: "Intel Core i9", currency: "USD", amount: 700 },
        { description: "ASUS ROG Strix", currency: "AUD", amount: 500 },
      ],
    },
  ],
};

const formDataReducer = (state, action) => {
  switch (action.type) {
    case "ADD_INVOICE":
      return {
        ...state,
        invoices: [
          ...state.invoices,
          {
            currency: "",
            date: dayjs().format("YYYY-MM-DD"),
            lines: [{ description: "", currency: "", amount: "" }],
          },
        ],
      };
    case "ADD_LINE":
      return {
        ...state,
        invoices: state.invoices.map((invoice, index) =>
          index === action.payload.invoiceIndex
            ? {
                ...invoice,
                lines: [
                  ...invoice.lines,
                  { description: "", currency: "", amount: "" },
                ],
              }
            : invoice
        ),
      };
    case "REMOVE_LINE":
      return {
        ...state,
        invoices: state.invoices.map((invoice, invoiceIndex) =>
          invoiceIndex === action.payload.invoiceIndex
            ? {
                ...invoice,
                lines: invoice.lines.filter(
                  (_, lineIndex) => lineIndex !== action.payload.lineIndex
                ),
              }
            : invoice
        ),
      };
    case "UPDATE_DATE":
      return {
        ...state,
        invoices: state.invoices.map((invoice, index) =>
          index === action.payload.invoiceIndex
            ? { ...invoice, date: action.payload.date }
            : invoice
        ),
      };
    case "UPDATE_CURRENCY":
      return {
        ...state,
        invoices: state.invoices.map((invoice, index) =>
          index === action.payload.invoiceIndex
            ? { ...invoice, currency: action.payload.currency }
            : invoice
        ),
      };
    case "UPDATE_TOTAL":
      return {
        ...state,
        invoices: state.invoices.map((invoice, index) =>
          index === action.payload.invoiceIndex
            ? { ...invoice, total: action.payload.total }
            : invoice
        ),
      };
    case "UPDATE_LINE":
      return {
        ...state,
        invoices: state.invoices.map((invoice, invoiceIndex) =>
          invoiceIndex === action.payload.invoiceIndex
            ? {
                ...invoice,
                lines: invoice.lines.map((line, lineIndex) =>
                  lineIndex === action.payload.lineIndex
                    ? { ...line, [action.payload.field]: action.payload.value }
                    : line
                ),
              }
            : invoice
        ),
      };
    case "IMPORT_DATA":
      return action.payload.data;
    default:
      return state;
  }
};

export const FormContext = createContext(initialState);

export const FormProvider = ({ children }) => {
  const [formData, formDataDispatch] = useReducer(
    formDataReducer,
    initialState
  );
  const [currencies, setCurrencies] = useState();

  useEffect(() => {
    getCurrencies().then((data) => {
      setCurrencies(data);
    });
  }, []);
  const value = useMemo(() => ({ formData, currencies, formDataDispatch }), [formData, currencies]);

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

const useFormContext = () => useContext(FormContext);
export { useFormContext };
