"use client";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

// Approximate brand colors
const theme = createTheme({
  palette: {
    primary: {
      main: "#F05A28", // bright orange for buttons, toggles, etc.
    },
    secondary: {
      main: "#1C3A33", // dark green background
    },
    background: {
      default: "#1C3A33", // global page background
      paper: "#1C3A33",   // MUI containers default background
    },
    text: {
      primary: "#ffffff", // white text on dark background
    },
  },
  typography: {
    // Optional: adjust fonts if desired
    fontFamily: "'Roboto', sans-serif",
  },
});

export default function ThemeRegistry({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
