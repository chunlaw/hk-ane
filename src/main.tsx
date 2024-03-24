import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { CssBaseline, ThemeProvider, createTheme, StyledEngineProvider } from "@mui/material";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
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

const emotionCache = createCache({
  key: "ane-hk",
  speedy: !(import.meta.env.DEV || navigator.userAgent === "prerendering"),
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CacheProvider value={emotionCache}>
          <AppContextProvider>
            <CssBaseline />
            <App />
          </AppContextProvider>
        </CacheProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>,
);