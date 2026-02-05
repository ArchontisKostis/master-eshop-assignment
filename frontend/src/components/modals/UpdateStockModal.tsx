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
  Typography,
} from '@mui/material';
import { getProductController } from '../../api/product-controller/product-controller';
import type { UpdateProductStockRequest } from '../../api/generated.schemas';
import { useToast } from '../../contexts/ToastContext';
import { getApiError } from '../../api/api-error';

interface UpdateStockModalProps {
  open: boolean;
  onClose: () => void;
  productId: number;
  productTitle: string;
  currentStock: number;
  onSuccess: () => void;
}

export const UpdateStockModal: React.FC<UpdateStockModalProps> = ({
  open,
  onClose,
  productId,
  productTitle,
  currentStock,
  onSuccess,
}) => {
  const [stockQuantity, setStockQuantity] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setStockQuantity(currentStock.toString());
    }
  }, [open, currentStock]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newStock = parseInt(stockQuantity, 10);

    if (isNaN(newStock) || newStock < 0) {
      showToast('Stock quantity must be 0 or greater', 'error');
      return;
    }

    setLoading(true);

    try {
      const productController = getProductController();
      const request: UpdateProductStockRequest = {
        stockQuantity: newStock,
      };

      await productController.updateProductStock(productId, request);
      
      showToast('Stock updated successfully!', 'success');
      onSuccess();
      onClose();
    } catch (err) {
      const apiError = getApiError(err);
      showToast(apiError?.message || 'Failed to update stock. Please try again.', 'error');
      console.error('Update stock error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Stock Quantity</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Product: <strong>{productTitle}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Current Stock: <strong>{currentStock}</strong>
            </Typography>
          </Box>

          <TextField
            label="New Stock Quantity"
            type="number"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            required
            fullWidth
            disabled={loading}
            inputProps={{
              min: '0',
            }}
            helperText="Enter the new stock quantity"
            autoFocus
          />
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
            {loading ? <CircularProgress size={24} /> : 'Update Stock'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};