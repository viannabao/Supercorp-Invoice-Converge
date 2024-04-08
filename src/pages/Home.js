import { Grid, Typography, Button } from "@mui/material";

import Invoice from "@/components/Invoice";
import { useFormContext } from "@/provider/FormProvider";
import Summary from "@/components/Summary";

export default function Home() {
  const { formData, formDataDispatch } = useFormContext(); 
  const addInvoice = () => {
    formDataDispatch({ type: "ADD_INVOICE" });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={9}>
        <Typography variant="h5" color="primary">
          Supercorp Invoice Converge
        </Typography>
        {formData &&
          formData.invoices.map((_, invoiceIndex) => (
            <Invoice
              invoiceIndex={invoiceIndex}
              key={`invoice-${invoiceIndex}`}
            />
          ))}
        <Button variant="contained" onClick={addInvoice}>
          + ADD INVOICE
        </Button>
      </Grid>
      <Summary />
    </Grid>
  );
}
