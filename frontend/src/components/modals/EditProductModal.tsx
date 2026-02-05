import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Box,
} from '@mui/material';
import { getProductController } from '../../api/product-controller/product-controller';
import type { AddProductRequest, ProductResponse } from '../../api/generated.schemas';
import { useToast } from '../../contexts/ToastContext';
import { getApiError } from '../../api/api-error';

interface EditProductModalProps {
  open: boolean;
  onClose: () => void;
  product: ProductResponse;
  onSuccess: () => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  open,
  onClose,
  product,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    type: '',
    brand: '',
    description: '',
    price: '',
    stockQuantity: '',
  });

  // Initialize form with product data when modal opens
  useEffect(() => {
    if (open && product) {
      setFormData({
        title: product.title || '',
        type: product.type || '',
        brand: product.brand || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        stockQuantity: product.stockQuantity?.toString() || '',
      });
    }
  }, [open, product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = (): boolean => {
    if (!formData.title || formData.title.length === 0) {
      showToast('Title is required', 'error');
      return false;
    }
    if (formData.title.length > 200) {
      showToast('Title must be at most 200 characters', 'error');
      return false;
    }
    if (!formData.type || formData.type.length === 0) {
      showToast('Product type is required', 'error');
      return false;
    }
    if (formData.type.length > 100) {
      showToast('Type must be at most 100 characters', 'error');
      return false;
    }
    if (!formData.brand || formData.brand.length === 0) {
      showToast('Brand is required', 'error');
      return false;
    }
    if (formData.brand.length > 100) {
      showToast('Brand must be at most 100 characters', 'error');
      return false;
    }
    if (!formData.description || formData.description.length === 0) {
      showToast('Description is required', 'error');
      return false;
    }
    if (formData.description.length > 500) {
      showToast('Description must be at most 500 characters', 'error');
      return false;
    }
    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 0.01) {
      showToast('Price must be at least $0.01', 'error');
      return false;
    }
    const stock = parseInt(formData.stockQuantity, 10);
    if (isNaN(stock) || stock < 0) {
      showToast('Stock quantity must be 0 or greater', 'error');
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

      await productController.updateProduct(product.id!, productRequest);
      
      showToast('Product updated successfully!', 'success');
      onSuccess();
      onClose();
    } catch (err) {
      const apiError = getApiError(err);
      showToast(apiError?.message || 'Failed to update product. Please try again.', 'error');
      console.error('Update product error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Product</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
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

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Product Type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                fullWidth
                disabled={loading}
                helperText="e.g., Electronics"
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

            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              fullWidth
              multiline
              rows={3}
              disabled={loading}
              helperText="Max 500 characters"
            />

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
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Update Product'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};