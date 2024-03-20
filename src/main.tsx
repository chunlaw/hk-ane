import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { AppContextProvider } from "./AppContext.tsx";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import resources from "./translation";

i18n.use(initReactI18next).init({
  resources,
  lng: "zh",
  fallbackLng: "zh",
});

const theme = createTheme({});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AppContextProvider>
        <CssBaseline />
        <App />
      </AppContextProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
