import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Link as MuiLink,
  Alert,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { PersonAdd, Store as StoreIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { CustomerRegisterForm } from '../components/auth/CustomerRegisterForm';
import { StoreRegisterForm } from '../components/auth/StoreRegisterForm';
import { ROUTES } from '../constants/routes';
import { getApiError, getApiErrorAsync } from '../api/api-error';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`register-tabpanel-${index}`}
      aria-labelledby={`register-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export const RegisterPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError(null);
  };

  const validateRegistrationData = (data: any): boolean => {
    if (!data.username || data.username.length < 3) {
      setError('Username must be at least 3 characters long');
      return false;
    }
    if (data.username.length > 50) {
      setError('Username must be at most 50 characters long');
      return false;
    }
    if (!data.email || !data.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (data.email.length > 100) {
      setError('Email must be at most 100 characters long');
      return false;
    }
    if (!data.password || data.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (data.password.length > 100) {
      setError('Password must be at most 100 characters long');
      return false;
    }
    if (data.taxId && (data.taxId.length < 9 || data.taxId.length > 12)) {
      setError('Tax ID must be between 9 and 12 characters');
      return false;
    }
    return true;
  };

  const handleRegister = async (data: any) => {
    if (!validateRegistrationData(data)) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await register(data);
      // Registration successful - redirect to login page
      // Backend doesn't return token on registration, so user needs to login
      navigate(ROUTES.LOGIN, {
        state: { message: 'Registration successful! Please login to continue.' }
      });
    } catch (err) {
      // Try to parse detailed ApiError from backend (works even when Orval uses responseType "blob")
      const apiError = await getApiErrorAsync(err);

      if (apiError) {
        if (apiError.status === 409 && apiError.code === 'ConflictException') {
          // Username/email/taxId already exists
          setError(apiError.message || 'Username, email or tax ID already exists.');
        } else if (
          apiError.status === 400 &&
          (apiError.code === 'BadRequestException' || apiError.code === 'ValidationException')
        ) {
          // Validation / bad request errors from backend
          setError(apiError.message || 'Please review your input and try again.');
        } else {
          setError(apiError.message || 'Registration failed. Please try again.');
        }
      } else {
        // Fallback – also log the raw error for debugging
        const fallbackMessage = getApiError(err)?.message;
        setError(fallbackMessage || 'Registration failed. Please try again.');
      }

      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 2,
        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
      }}
    >
      <Card
        sx={{
          maxWidth: 850,
          width: '100%',
          boxShadow: 6,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Choose your account type and get started
            </Typography>
          </Box>

          {/* Tabs */}
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ mb: 2 }}
          >
            <Tab
              icon={<PersonAdd />}
              label="Customer"
              iconPosition="start"
              sx={{ textTransform: 'none', fontWeight: 600 }}
            />
            <Tab
              icon={<StoreIcon />}
              label="Store Owner"
              iconPosition="start"
              sx={{ textTransform: 'none', fontWeight: 600 }}
            />
          </Tabs>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Tab Panels */}
          <TabPanel value={tabValue} index={0}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create a customer account to browse and purchase products from multiple stores.
            </Typography>
            <CustomerRegisterForm onSubmit={handleRegister} loading={loading} />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create a store account to list and sell your products on our marketplace.
            </Typography>
            <StoreRegisterForm onSubmit={handleRegister} loading={loading} />
          </TabPanel>

          {/* Footer */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <MuiLink component={Link} to={ROUTES.LOGIN} underline="hover">
                Sign in
              </MuiLink>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};