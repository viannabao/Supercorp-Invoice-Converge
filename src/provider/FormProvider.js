import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useEffect,
  useState,
} from "react";
import dayjs from "dayjs";
import { getCurrencies } from "../api/currencyService";

// Define the initial state for the form
const initialState = {
  invoices: [
    {
      currency: "NZD",
      date: "2020-07-07",
      total: "", // Placeholder for total, to be calculated later
      lines: [
        { description: "Intel Core i9", currency: "USD", amount: 700 },
        { description: "ASUS ROG Strix", currency: "AUD", amount: 500 },
      ],
    },
    {
      currency: "EUR",
      date: "2020-07-07",
      total: "", // Placeholder for total, to be calculated later
      lines: [
        { description: "Intel Core i9", currency: "USD", amount: 700 },
        { description: "ASUS ROG Strix", currency: "AUD", amount: 500 },
      ],
    },
  ],
};

// Reducer function to handle form data updates
const formDataReducer = (state, action) => {
  switch (action.type) {
    case "ADD_INVOICE":
      // Add a new invoice to the list
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
      // Add a new line to a specific invoice
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
      // Remove a line from a specific invoice
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
      // Update the date of a specific invoice
      return {
        ...state,
        invoices: state.invoices.map((invoice, index) =>
          index === action.payload.invoiceIndex
            ? { ...invoice, date: action.payload.date }
            : invoice
        ),
      };
    case "UPDATE_CURRENCY":
      // Update the currency of a specific invoice
      return {
        ...state,
        invoices: state.invoices.map((invoice, index) =>
          index === action.payload.invoiceIndex
            ? { ...invoice, currency: action.payload.currency }
            : invoice
        ),
      };
    case "UPDATE_TOTAL":
      // Update the total of a specific invoice
      return {
        ...state,
        invoices: state.invoices.map((invoice, index) =>
          index === action.payload.invoiceIndex
            ? { ...invoice, total: action.payload.total }
            : invoice
        ),
      };
    case "UPDATE_LINE":
      // Update a specific line of a specific invoice
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
      // Import data from an external source
      return action.payload.data;
    default:
      return state;
  }
};

// Create context for the form data
export const FormContext = createContext(initialState);

// Form provider component to manage form state and currency data
export const FormProvider = ({ children }) => {
  const [formData, formDataDispatch] = useReducer(
    formDataReducer,
    initialState
  );
  const [currencies, setCurrencies] = useState();

  // Fetch currencies data when component mounts
  useEffect(() => {
    getCurrencies().then((data) => {
      setCurrencies(data);
    });
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({ formData, currencies, formDataDispatch }),
    [formData, currencies]
  );

  // Provide form context to children components
  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

// Custom hook to use form context
export const useFormContext = () => useContext(FormContext);
