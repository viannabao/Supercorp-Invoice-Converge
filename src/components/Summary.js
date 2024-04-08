import { useState, useEffect } from "react";
import { Grid, Typography, Button, Box, Modal, TextField } from "@mui/material";
import styled from "styled-components";

import { useFormContext } from "@/provider/FormProvider";
import { jsonValidation } from "@/utils/validations";

const TotalLine = styled("div")({
  display: "flex",
  justifyContent: "space-between",
});

const ImportExportButton = styled(Button)({
  float: "right",
});

const ModalBox = styled(Box)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "500px",
  backgroundColor: "white",
  border: "1px solid #B5B5B5",
  padding: "20px",
});

const ButtonGroup = styled("div")({
  display: "flex",
  justifyContent: "center",
});

export default function Summary() {
  // Get form data and dispatch function from context
  const { formData, formDataDispatch, currencies } = useFormContext();
  const [lineTotals, setLineTotals] = useState({});
  const [invoiceTotals, setInvoiceTotals] = useState({});

  const [openModal, setOpenModal] = useState(false);
  const [importErrorMessage, setImportErrorMessage] = useState();
  const [jsonString, setJsonString] = useState();

  // Convert Json Data for exporting with removing the total props in invoice
  const convertJsonData = (data) => {
    return JSON.stringify(
      {
        ...data,
        invoices: data.invoices.map((invoice) => {
          const { total, ...rest } = invoice;
          return rest;
        }),
      },
      null,
      2
    );
  }

  // Close modal
  const handleModalClose = () => {
    setJsonString(convertJsonData(formData));
    setOpenModal(false);
    setImportErrorMessage(null);
  };

  useEffect(() => {
    setJsonString(convertJsonData(formData));
  }, []);

  // Calculate line and invoice totals
  useEffect(() => {
    const lineGroups = {};
    formData.invoices.forEach((invoice) => {
      invoice.lines.forEach((line) => {
        const { currency, amount } = line;

        if (!lineGroups[currency]) {
          lineGroups[currency] = 0;
        }

        if (amount) {
          lineGroups[currency] += parseFloat(amount);
        }
      });
    });
    setLineTotals(lineGroups);

    const invoiceGroups = {};
    formData.invoices.forEach((invoice) => {
      if (invoice.currency && invoice.total) {
        if (!invoiceGroups[invoice.currency]) {
          invoiceGroups[invoice.currency] = 0;
        }
        invoiceGroups[invoice.currency] += parseFloat(invoice.total);
      }
    });

    setInvoiceTotals(invoiceGroups);
  }, [formData]);

  // Import invoice data
  const importInvoice = () => {
    try {
      jsonValidation(jsonString, currencies);
      setImportErrorMessage(null);
      const data = JSON.parse(jsonString);

      data.invoices.forEach((invoice) => {
        invoice.total = 0;
      });

      formDataDispatch({ type: "IMPORT_DATA", payload: { data } });
      setOpenModal(false);
    } catch (e) {
      setImportErrorMessage(`Invalid Json: ${e.message}`);
    }
  };

  return (
    <Grid item xs={12} md={3}>
      <Grid sx={{ height: "45px" }}>
        <ImportExportButton
          variant="contained"
          onClick={() => setOpenModal(true)}
        >
          IMPORT/EXPORT
        </ImportExportButton>
      </Grid>
      <Grid>
        <Typography variant="subtitle1">TOTALS</Typography>
        <Box
          sx={{
            border: "1px solid #B5B5B5",
            width: "calc(100% - 30px)",
            padding: "15px",
            margin: "10px 0",
          }}
        >
          <Typography variant="caption">INVOICE TOTALS</Typography>
          {currencies &&
            Object.entries(invoiceTotals).map(([currency, total], i) => (
              <TotalLine key={`invoice-total-${i}`}>
                <Typography variant="body1">{currencies[currency]}</Typography>
                <Typography variant="body1" sx={{ fontWeight: "600" }}>
                  {total.toFixed(2)}
                </Typography>
              </TotalLine>
            ))}
        </Box>
        <Box
          sx={{
            border: "1px solid #B5B5B5",
            width: "calc(100% - 30px)",
            padding: "15px",
            margin: "20px 0",
          }}
        >
          <Typography variant="caption">LINE TOTALS</Typography>
          {currencies &&
            Object.entries(lineTotals).map(([currency, total], i) => (
              <TotalLine key={`line-total-${i}`}>
                <Typography variant="body1">{currencies[currency]}</Typography>
                <Typography variant="body1" sx={{ fontWeight: "600" }}>
                  {total.toFixed(2)}
                </Typography>
              </TotalLine>
            ))}
        </Box>
      </Grid>
      <Modal
        open={openModal}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
      >
        <ModalBox>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Import/Export
          </Typography>
          <TextField
            multiline
            error={!!importErrorMessage}
            helperText={importErrorMessage}
            rows={20}
            onChange={(e) => setJsonString(e.target.value)}
            defaultValue={jsonString}
            sx={{ width: "100%", margin: "10px 0" }}
          />
          <ButtonGroup>
            <Button
              variant="contained"
              sx={{ margin: "10px" }}
              onClick={importInvoice}
            >
              OK
            </Button>
            <Button
              variant="outlined"
              sx={{ margin: "10px" }}
              onClick={handleModalClose}
            >
              Cancel
            </Button>
          </ButtonGroup>
        </ModalBox>
      </Modal>
    </Grid>
  );
}
