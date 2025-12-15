import React from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightPalette, darkPalette } from './palette';
import { typography } from './typography';
import { components } from './components';
import { tokens } from './tokens';

/**
 * Light Theme Configuration
 */
export const lightTheme = createTheme({
  palette: lightPalette,
  typography,
  components,
  spacing: 8, // Base spacing unit (8px)
  shape: {
    borderRadius: tokens.borderRadius.md,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

/**
 * Dark Theme Configuration (Placeholder)
 * To be fully implemented in future iteration
 */
export const darkTheme = createTheme({
  palette: darkPalette,
  typography,
  components,
  spacing: 8,
  shape: {
    borderRadius: tokens.borderRadius.md,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

/**
 * Theme Provider Component
 * Wraps the application with MUI theme and baseline styles
 * 
 * @param children - React children to wrap
 * @param mode - Theme mode ('light' or 'dark'), defaults to 'light'
 */
interface ThemeProviderProps {
  children: React.ReactNode;
  mode?: 'light' | 'dark';
}

export function ThemeProvider({ children, mode = 'light' }: ThemeProviderProps) {
  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

// Re-export tokens for use in components
export { tokens };