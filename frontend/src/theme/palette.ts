import type { PaletteOptions } from '@mui/material/styles';
import { tokens } from './tokens';

/**
 * Light Mode Palette
 */
export const lightPalette: PaletteOptions = {
  mode: 'light',
  
  primary: {
    main: tokens.colors.primary[500],
    light: tokens.colors.primary[300],
    dark: tokens.colors.primary[700],
    contrastText: '#ffffff',
  },
  
  secondary: {
    main: tokens.colors.secondary[500],
    light: tokens.colors.secondary[300],
    dark: tokens.colors.secondary[700],
    contrastText: '#ffffff',
  },
  
  success: {
    main: tokens.colors.success[500],
    light: tokens.colors.success[100],
    dark: tokens.colors.success[700],
    contrastText: '#ffffff',
  },
  
  error: {
    main: tokens.colors.error[500],
    light: tokens.colors.error[100],
    dark: tokens.colors.error[700],
    contrastText: '#ffffff',
  },
  
  warning: {
    main: tokens.colors.warning[500],
    light: tokens.colors.warning[100],
    dark: tokens.colors.warning[700],
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  
  info: {
    main: tokens.colors.info[500],
    light: tokens.colors.info[100],
    dark: tokens.colors.info[700],
    contrastText: '#ffffff',
  },
  
  background: {
    default: '#ffffff',
    paper: '#ffffff',
  },
  
  text: {
    primary: tokens.colors.gray[900],
    secondary: tokens.colors.gray[600],
    disabled: tokens.colors.gray[400],
  },
  
  divider: tokens.colors.gray[200],
  
  action: {
    active: tokens.colors.gray[600],
    hover: 'rgba(0, 0, 0, 0.04)',
    selected: 'rgba(0, 0, 0, 0.08)',
    disabled: tokens.colors.gray[300],
    disabledBackground: tokens.colors.gray[100],
    focus: 'rgba(0, 0, 0, 0.12)',
  },
};

/**
 * Dark Mode Palette (Placeholder - Not yet implemented)
 * To be completed in future iteration
 */
export const darkPalette: PaletteOptions = {
  mode: 'dark',
  
  primary: {
    main: tokens.colors.primary[400],
    light: tokens.colors.primary[300],
    dark: tokens.colors.primary[600],
    contrastText: '#ffffff',
  },
  
  secondary: {
    main: tokens.colors.secondary[400],
    light: tokens.colors.secondary[300],
    dark: tokens.colors.secondary[600],
    contrastText: '#ffffff',
  },
  
  background: {
    default: '#121212',
    paper: '#1e1e1e',
  },
  
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.7)',
    disabled: 'rgba(255, 255, 255, 0.5)',
  },
  
  divider: 'rgba(255, 255, 255, 0.12)',
  
  // TODO: Complete dark mode palette implementation
};