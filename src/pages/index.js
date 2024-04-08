import styled from "styled-components";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { FormProvider } from "@/provider/FormProvider";
import Home from "./Home";
import indigo from "@material-ui/core/colors/indigo";

const theme = createTheme({
  palette: {
    primary: {
      main: indigo[500],
    },
  },
});

const AppWrapper = styled("div")({
  padding: "20px",
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <FormProvider>
        <AppWrapper>
          <Home />
        </AppWrapper>
      </FormProvider>
    </ThemeProvider>
  );
}
