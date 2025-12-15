import type { Components, Theme } from '@mui/material/styles';
import { tokens } from './tokens';

/**
 * Component Overrides
 * Customizes default MUI component styles
 */
export const components: Components<Theme> = {
  // Button Component
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: tokens.borderRadius.md,
        textTransform: 'none',
        fontWeight: tokens.typography.fontWeight.semibold,
        padding: '10px 24px',
        fontSize: tokens.typography.fontSize.sm,
        transition: `all ${tokens.transitions.fast} ease-in-out`,
        boxShadow: 'none',
        '&:hover': {
          boxShadow: tokens.shadows.md,
        },
      },
      contained: {
        '&:hover': {
          boxShadow: tokens.shadows.md,
        },
      },
      outlined: {
        borderWidth: '2px',
        '&:hover': {
          borderWidth: '2px',
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
        },
      },
      sizeSmall: {
        padding: '6px 16px',
        fontSize: tokens.typography.fontSize.xs,
      },
      sizeLarge: {
        padding: '12px 32px',
        fontSize: tokens.typography.fontSize.base,
      },
    },
  },

  // Card Component
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: tokens.borderRadius.lg,
        boxShadow: tokens.shadows.md,
        transition: `all ${tokens.transitions.normal} ease-in-out`,
        '&:hover': {
          boxShadow: tokens.shadows.lg,
        },
      },
    },
  },

  // Paper Component
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: tokens.borderRadius.md,
      },
      elevation1: {
        boxShadow: tokens.shadows.sm,
      },
      elevation2: {
        boxShadow: tokens.shadows.md,
      },
      elevation3: {
        boxShadow: tokens.shadows.lg,
      },
    },
  },

  // TextField Component
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: tokens.borderRadius.md,
          '& fieldset': {
            borderWidth: '2px',
          },
          '&:hover fieldset': {
            borderColor: tokens.colors.primary[500],
          },
          '&.Mui-focused fieldset': {
            borderWidth: '2px',
          },
        },
      },
    },
  },

  // Chip Component
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: tokens.borderRadius.full,
        fontWeight: tokens.typography.fontWeight.medium,
      },
    },
  },

  // AppBar Component
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: tokens.shadows.sm,
      },
    },
  },

  // Dialog Component
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: tokens.borderRadius.lg,
      },
    },
  },

  // Tooltip Component
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        borderRadius: tokens.borderRadius.sm,
        fontSize: tokens.typography.fontSize.xs,
      },
    },
  },

  // Link Component
  MuiLink: {
    styleOverrides: {
      root: {
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'underline',
        },
      },
    },
  },

  // Container Component
  MuiContainer: {
    styleOverrides: {
      root: {
        paddingLeft: tokens.spacing[2],
        paddingRight: tokens.spacing[2],
      },
    },
  },
};