import React, { useState } from 'react';
import { Box, TextField, Button, CircularProgress } from '@mui/material';
import { RegisterRequestRole } from '../../api/generated.schemas';

interface StoreRegisterFormProps {
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
}

export const StoreRegisterForm: React.FC<StoreRegisterFormProps> = ({
  onSubmit,
  loading,
}) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    taxId: '',
    storeName: '',
    ownerName: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const registerData: any = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: RegisterRequestRole.STORE,
    };

    // Add optional fields if provided
    if (formData.taxId) registerData.taxId = formData.taxId;
    if (formData.storeName) registerData.storeName = formData.storeName;
    if (formData.ownerName) registerData.ownerName = formData.ownerName;

    await onSubmit(registerData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Store Name and Owner Name in same row */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Store Name (Optional)"
            name="storeName"
            value={formData.storeName}
            onChange={handleInputChange}
            fullWidth
            disabled={loading}
          />

          <TextField
            label="Owner Name (Optional)"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleInputChange}
            fullWidth
            disabled={loading}
          />
        </Box>

        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          fullWidth
          autoComplete="email"
          disabled={loading}
        />

        <TextField
          label="Tax ID (Optional)"
          name="taxId"
          value={formData.taxId}
          onChange={handleInputChange}
          fullWidth
          disabled={loading}
          helperText="9-12 characters"
        />

        <TextField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          required
          fullWidth
          autoComplete="username"
          disabled={loading}
          helperText="3-50 characters"
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          required
          fullWidth
          autoComplete="new-password"
          disabled={loading}
          helperText="At least 6 characters"
        />

        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          required
          fullWidth
          autoComplete="new-password"
          disabled={loading}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Sign Up as Store Owner'
          )}
        </Button>
      </Box>
    </form>
  );
};