import { useState, useEffect } from "react";
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";
import styled from "styled-components";
import { useFormContext } from "@/provider/FormProvider";
import { checkNumberInput } from "@/utils/validations";

const FormField = styled(FormControl)({
  marginRight: "15px",
  width: "30%",
});

const FormLine = styled("div")({
  display: "flex",
  marginBottom: "15px",
});

// Error message for duplicated line item
const DUPLICATED_ERROR_MESSAGE = "Line item must be unique.";

export default function LineItem({ invoiceIndex, lineIndex, isDuplicated }) {
  // Get form data and dispatch function from context
  const { formData, formDataDispatch, currencies } = useFormContext();
  const line = formData.invoices[invoiceIndex].lines[lineIndex];
  const [fieldErrorMessage, setFieldErrorMessage] = useState({});

  // Handler to remove line item
  const handleRemoveLine = () => {
    formDataDispatch({
      type: "REMOVE_LINE",
      payload: { invoiceIndex, lineIndex },
    });
  };

  // Handler for input change
  const handleInputChange = (field, value) => {
    try {
      if (field === "amount") {
        checkNumberInput(value);
      }
      setFieldErrorMessage({});
    } catch (e) {
      setFieldErrorMessage({ ...fieldErrorMessage, [field]: e.message });
    }
    formDataDispatch({
      type: "UPDATE_LINE",
      payload: { invoiceIndex, lineIndex, field, value },
    });
  };

  // Effect to handle duplicated line items
  useEffect(() => {
    setFieldErrorMessage(
      isDuplicated
        ? {
            description: DUPLICATED_ERROR_MESSAGE,
            currency: DUPLICATED_ERROR_MESSAGE,
            amount: DUPLICATED_ERROR_MESSAGE,
          }
        : {}
    );
  }, [isDuplicated]);

  return (
    <FormLine>
      {/* Description field */}
      <FormField>
        <TextField
          required
          error={!!fieldErrorMessage.description}
          helperText={fieldErrorMessage.description}
          label="Description"
          size="small"
          value={line.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
        />
      </FormField>
      {/* Currency field */}
      <FormField size="small">
        <InputLabel>Currency</InputLabel>
        <Select
          error={!!fieldErrorMessage.currency}
          helperText={fieldErrorMessage.currency}
          value={line.currency}
          defaultValue={""}
          label="Currency"
          onChange={(e) => handleInputChange("currency", e.target.value)}
        >
          {currencies &&
            Object.entries(currencies).map(([currencyCode, currencyName]) => (
              <MenuItem key={currencyCode} value={currencyCode}>
                {currencyName}
              </MenuItem>
            ))}
        </Select>
      </FormField>
      {/* Amount field */}
      <FormField>
        <TextField
          required
          error={!!fieldErrorMessage.amount}
          helperText={fieldErrorMessage.amount}
          label="Amount"
          size="small"
          value={line.amount}
          type="number"
          onChange={(e) => handleInputChange("amount", e.target.value)}
        />
      </FormField>
      {/* Remove button */}
      <Button
        variant="outlined"
        onClick={handleRemoveLine}
        disabled={formData.invoices[invoiceIndex].lines.length === 1}
        color="error"
      >
        REMOVE
      </Button>
    </FormLine>
  );
}
