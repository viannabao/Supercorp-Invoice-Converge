import { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import styled from "styled-components";
import dayjs from "dayjs";

import LineItem from "./LineItem";
import { useFormContext } from "@/provider/FormProvider";
import { getCurrencyConversions } from "../api/currencyService";
import { totalCurrencyCalculation } from "@/utils/helper";
import { checkDuplicates } from "@/utils/validations";

const FormField = styled(FormControl)({
  marginRight: "15px",
  width: "30%",
});

const FormLine = styled("div")({
  display: "flex",
  marginBottom: "15px",
});

export default function Invoice({ invoiceIndex }) {
  const { formData, formDataDispatch, currencies } = useFormContext();
  const invoice = formData.invoices[invoiceIndex];
  const [isLineComplete, setIsLineComplete] = useState(false);
  const [duplicatedLine, setDuplicatedLine] = useState();
  const [apiErrorMessage, setApiErrorMessage] = useState();

  useEffect(() => {
    try {
      checkDuplicates(formData.invoices[invoiceIndex].lines);
      setDuplicatedLine(null);

      setIsLineComplete(
        invoice.lines.every(
          (line) =>
            line.description !== "" && line.currency && line.amount !== ""
        )
      );
    } catch (e) {
      setDuplicatedLine(e.index);
      setIsLineComplete(false);
    }
  }, [invoice.lines]);

  useEffect(() => {
    if (isLineComplete && invoice.currency && invoice.date) {
      getCurrencyConversions(
        invoice.date,
        invoice.currency,
        invoice.lines.map((line) => line.currency)
      )
        .then((data) => {
          const total = totalCurrencyCalculation(invoice.lines, data.rates);
          formDataDispatch({
            type: "UPDATE_TOTAL",
            payload: { invoiceIndex, total: total.toFixed(2) },
          });
        })
        .catch((e) => {
          setApiErrorMessage(e.message);
        });
    }
  }, [invoice.lines, isLineComplete, invoice.currency, invoice.date]);

  useEffect(() => {
    if (formData.invoices.length === 0) {
      formDataDispatch({ type: "ADD_INVOICE" });
    }
  }, [formData]);

  const addLine = () => {
    formDataDispatch({ type: "ADD_LINE", payload: { invoiceIndex } });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {apiErrorMessage && <Alert severity="error">{apiErrorMessage}</Alert>}
      <Box
        sx={{
          border: "1px solid #B5B5B5",
          width: "calc(100% - 30px)",
          padding: "15px",
          margin: "20px 0",
        }}
      >
        <Typography variant="subtitle1" sx={{ marginBottom: "15px" }}>
          INVOICE #{invoiceIndex + 1}
        </Typography>
        <FormLine>
          <FormField>
            <DatePicker
              label="Invoice issue date"
              value={dayjs(invoice.date)}
              onChange={(d) =>
                formDataDispatch({
                  type: "UPDATE_DATE",
                  payload: { invoiceIndex, date: d },
                })
              }
              format={"DD/MM/YYYY"}
              slotProps={{ textField: { size: "small" } }}
            />
          </FormField>
          <FormField size="small">
            <InputLabel>Base currency</InputLabel>
            <Select
              value={invoice.currency}
              defaultValue={""}
              label="Base currency"
              onChange={(e) =>
                formDataDispatch({
                  type: "UPDATE_CURRENCY",
                  payload: { invoiceIndex, currency: e.target.value },
                })
              }
            >
              {currencies &&
                Object.entries(currencies).map(
                  ([currencyCode, currencyName]) => (
                    <MenuItem key={currencyCode} value={currencyCode}>
                      {currencyName}
                    </MenuItem>
                  )
                )}
            </Select>
          </FormField>
          <div>
            <Typography variant="caption">TOTAL</Typography>
            <Typography variant="h6" sx={{ fontWeight: "600" }}>
              {invoice.total}
            </Typography>
          </div>
        </FormLine>
        <div style={{ margin: "20px 0" }}>
          <Typography variant="caption">LINE ITEMS</Typography>
        </div>
        {invoice.lines.map((line, lineIndex) => (
          <LineItem
            key={`line-${lineIndex}`}
            invoiceIndex={invoiceIndex}
            lineIndex={lineIndex}
            isDuplicated={lineIndex === duplicatedLine}
          />
        ))}
        <Button
          variant="outlined"
          onClick={() => addLine(invoiceIndex)}
          disabled={!isLineComplete}
          color="primary"
        >
          + ADD LINE ITEM
        </Button>
      </Box>
    </LocalizationProvider>
  );
}
