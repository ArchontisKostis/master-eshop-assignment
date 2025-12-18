import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, Add } from '@mui/icons-material';
import { getProductController } from '../api/product-controller/product-controller';
import type { AddProductRequest } from '../api/generated.schemas';
import { ROUTES } from '../constants/routes';

export const AddProductPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    type: '',
    brand: '',
    description: '',
    price: '',
    stockQuantity: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.title || formData.title.length === 0) {
      setError('Title is required');
      return false;
    }
    if (formData.title.length > 200) {
      setError('Title must be at most 200 characters');
      return false;
    }
    if (!formData.type || formData.type.length === 0) {
      setError('Product type is required');
      return false;
    }
    if (formData.type.length > 100) {
      setError('Type must be at most 100 characters');
      return false;
    }
    if (!formData.brand || formData.brand.length === 0) {
      setError('Brand is required');
      return false;
    }
    if (formData.brand.length > 100) {
      setError('Brand must be at most 100 characters');
      return false;
    }
    if (!formData.description || formData.description.length === 0) {
      setError('Description is required');
      return false;
    }
    if (formData.description.length > 500) {
      setError('Description must be at most 500 characters');
      return false;
    }
    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 0.01) {
      setError('Price must be at least $0.01');
      return false;
    }
    const stock = parseInt(formData.stockQuantity, 10);
    if (isNaN(stock) || stock < 0) {
      setError('Stock quantity must be 0 or greater');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const productController = getProductController();
      
      const productRequest: AddProductRequest = {
        title: formData.title,
        type: formData.type,
        brand: formData.brand,
        description: formData.description,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity, 10),
      };

      await productController.addProduct(productRequest);

      setSuccess(true);
      
      // Reset form
      setFormData({
        title: '',
        type: '',
        brand: '',
        description: '',
        price: '',
        stockQuantity: '',
      });

      // Redirect to products page after 2 seconds
      setTimeout(() => {
        navigate(ROUTES.STORE_PRODUCTS);
      }, 2000);
    } catch (err) {
      setError('Failed to add product. Please try again.');
      console.error('Add product error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(ROUTES.STORE_DASHBOARD)}
          variant="outlined"
        >
          Back
        </Button>
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700}>
            Add New Product
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fill in the details to list a new product
          </Typography>
        </Box>
      </Box>

      {/* Alerts */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Product added successfully! Redirecting...
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Form */}
      <Paper sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Title */}
            <TextField
              label="Product Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              fullWidth
              disabled={loading}
              helperText="Max 200 characters"
            />

            {/* Type and Brand in same row */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Product Type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                fullWidth
                disabled={loading}
                helperText="e.g., Electronics, Clothing"
              />

              <TextField
                label="Brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                required
                fullWidth
                disabled={loading}
                helperText="Max 100 characters"
              />
            </Box>

            {/* Description */}
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              fullWidth
              multiline
              rows={4}
              disabled={loading}
              helperText="Max 500 characters"
            />

            {/* Price and Stock in same row */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                required
                fullWidth
                disabled={loading}
                helperText="Minimum $0.01"
                inputProps={{
                  step: '0.01',
                  min: '0.01',
                }}
              />

              <TextField
                label="Stock Quantity"
                name="stockQuantity"
                type="number"
                value={formData.stockQuantity}
                onChange={handleInputChange}
                required
                fullWidth
                disabled={loading}
                helperText="Available units"
                inputProps={{
                  min: '0',
                }}
              />
            </Box>

            {/* Submit Button */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate(ROUTES.STORE_DASHBOARD)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<Add />}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Add Product'}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};