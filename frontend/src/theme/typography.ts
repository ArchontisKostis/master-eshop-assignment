import type { ThemeOptions } from '@mui/material/styles';
import { tokens } from './tokens';

/**
 * Typography Configuration
 * Defines font families, sizes, weights, and text styles
 */
export const typography: ThemeOptions['typography'] = {
  fontFamily: tokens.typography.fontFamily.primary,
  
  // Heading Styles
  h1: {
    fontSize: tokens.typography.fontSize['4xl'],
    fontWeight: tokens.typography.fontWeight.bold,
    lineHeight: tokens.typography.lineHeight.tight,
    letterSpacing: '-0.02em',
  },
  
  h2: {
    fontSize: tokens.typography.fontSize['3xl'],
    fontWeight: tokens.typography.fontWeight.bold,
    lineHeight: tokens.typography.lineHeight.tight,
    letterSpacing: '-0.01em',
  },
  
  h3: {
    fontSize: tokens.typography.fontSize['2xl'],
    fontWeight: tokens.typography.fontWeight.semibold,
    lineHeight: tokens.typography.lineHeight.tight,
  },
  
  h4: {
    fontSize: tokens.typography.fontSize.xl,
    fontWeight: tokens.typography.fontWeight.semibold,
    lineHeight: tokens.typography.lineHeight.normal,
  },
  
  h5: {
    fontSize: tokens.typography.fontSize.lg,
    fontWeight: tokens.typography.fontWeight.medium,
    lineHeight: tokens.typography.lineHeight.normal,
  },
  
  h6: {
    fontSize: tokens.typography.fontSize.base,
    fontWeight: tokens.typography.fontWeight.medium,
    lineHeight: tokens.typography.lineHeight.normal,
  },
  
  // Body Styles
  body1: {
    fontSize: tokens.typography.fontSize.base,
    fontWeight: tokens.typography.fontWeight.regular,
    lineHeight: tokens.typography.lineHeight.relaxed,
  },
  
  body2: {
    fontSize: tokens.typography.fontSize.sm,
    fontWeight: tokens.typography.fontWeight.regular,
    lineHeight: tokens.typography.lineHeight.normal,
  },
  
  // Special Styles
  subtitle1: {
    fontSize: tokens.typography.fontSize.base,
    fontWeight: tokens.typography.fontWeight.medium,
    lineHeight: tokens.typography.lineHeight.normal,
  },
  
  subtitle2: {
    fontSize: tokens.typography.fontSize.sm,
    fontWeight: tokens.typography.fontWeight.medium,
    lineHeight: tokens.typography.lineHeight.normal,
  },
  
  caption: {
    fontSize: tokens.typography.fontSize.xs,
    fontWeight: tokens.typography.fontWeight.regular,
    lineHeight: tokens.typography.lineHeight.normal,
    color: 'text.secondary',
  },
  
  overline: {
    fontSize: tokens.typography.fontSize.xs,
    fontWeight: tokens.typography.fontWeight.medium,
    lineHeight: tokens.typography.lineHeight.normal,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  
  button: {
    fontSize: tokens.typography.fontSize.sm,
    fontWeight: tokens.typography.fontWeight.semibold,
    lineHeight: tokens.typography.lineHeight.normal,
    textTransform: 'none',
  },
};