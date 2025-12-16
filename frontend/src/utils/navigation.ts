import { ROUTES } from '../constants/routes';
import type { UserRole } from '../types/auth';

/**
 * Get the dashboard route based on user role
 */
export const getDashboardRoute = (role: UserRole): string => {
  switch (role) {
    case 'CUSTOMER':
      return ROUTES.CUSTOMER_DASHBOARD;
    case 'STORE':
      return ROUTES.STORE_DASHBOARD;
    default:
      return ROUTES.HOME;
  }
};