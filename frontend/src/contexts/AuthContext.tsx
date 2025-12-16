import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, AuthState, LoginCredentials, RegisterData } from '../types/auth';
import { UserRole } from '../types/auth';
import { getAuthController } from '../api/auth-controller/auth-controller';
import type { RegisterRequest, LoginRequest } from '../api/generated.schemas';
import { ROUTES } from '../constants/routes';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Provider Component
 * Manages authentication state and provides auth methods
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (token && userStr) {
          const user: User = JSON.parse(userStr);
          setAuthState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();
  }, []);

  /**
   * Login user
   */
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const authController = getAuthController();
      const loginRequest: LoginRequest = {
        username: credentials.username,
        password: credentials.password,
      };
      
      const response = await authController.login(loginRequest);
      
      const user: User = {
        id: '1', // Backend doesn't return ID in LoginResponse, using placeholder
        username: response.data.username || credentials.username,
        email: response.data.email || '',
        role: response.data.role as UserRole || UserRole.CUSTOMER,
      };
      
      const token = response.data.token || '';

      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, []);

  /**
   * Register new user
   */
  const register = useCallback(async (data: RegisterData) => {
    try {
      const authController = getAuthController();
      const registerRequest: RegisterRequest = data as RegisterRequest;
      
      const response = await authController.register(registerRequest);
      
      // After successful registration, automatically log in
      // Note: Backend returns user info but not token in RegisterResponse
      // You may want to automatically call login or handle this differently
      const user: User = {
        id: '1', // Backend doesn't return ID
        username: response.data.username || data.username,
        email: response.data.email || data.email,
        role: response.data.role as UserRole || data.role,
      };

      // Since backend doesn't return token on register, we store user without token
      // User will need to login after registration
      localStorage.setItem('user', JSON.stringify(user));

      setAuthState({
        user,
        token: null, // No token yet, user needs to login
        isAuthenticated: false, // Not fully authenticated until login
        isLoading: false,
      });
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use auth context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};