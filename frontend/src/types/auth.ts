/**
 * Authentication and User Types
 */

export const UserRole = {
  CUSTOMER: 'CUSTOMER',
  STORE: 'STORE',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface User {
  id: number | null;
  username: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}