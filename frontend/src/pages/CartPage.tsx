import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  Paper,
  Chip,
} from '@mui/material';
import {
  ShoppingCart,
  Add,
  Remove,
  Delete,
  Store as StoreIcon,
  ArrowForward,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { getShoppingCartController } from '../api/shopping-cart-controller/shopping-cart-controller';
import type { CartItemResponse } from '../api/generated.schemas';
import { useToast } from '../contexts/ToastContext';
import { useCart } from '../hooks/useCart';
import { ROUTES } from '../constants/routes';

export const CartPage: React.FC = () => {
  const { cart, loading, refreshCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      const cartController = getShoppingCartController();
      await cartController.updateCartItem(productId, { quantity: newQuantity });
      await refreshCart();
      showToast('Cart updated', 'success');
    } catch (err) {
      showToast('Failed to update cart', 'error');
      console.error('Update cart error:', err);
    }
  };

  const handleRemoveItem = async (productId: number, productTitle: string) => {
    if (!window.confirm(`Remove "${productTitle}" from cart?`)) {
      return;
    }

    try {
      const cartController = getShoppingCartController();
      await cartController.removeFromCart(productId);
      await refreshCart();
      showToast('Item removed from cart', 'success');
    } catch (err) {
      showToast('Failed to remove item', 'error');
      console.error('Remove from cart error:', err);
    }
  };

  // Group cart items by store
  const groupedItems = React.useMemo(() => {
    if (!cart?.items) return {};
    
    const groups: Record<number, CartItemResponse[]> = {};
    cart.items.forEach(item => {
      const storeId = item.storeId || 0;
      if (!groups[storeId]) {
        groups[storeId] = [];
      }
      groups[storeId].push(item);
    });
    
    return groups;
  }, [cart]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  const isEmpty = !cart?.items || cart.items.length === 0;

  return (
    <Box>
      {/* Header */}
      <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
        Shopping Cart
      </Typography>

      {isEmpty ? (
        <Card>
          <CardContent>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <ShoppingCart sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
              <Typography variant="h5" color="text.secondary" gutterBottom>
                Your cart is empty
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Start shopping to add items to your cart
              </Typography>
              <Button
                variant="contained"
                component={Link}
                to={ROUTES.MARKETPLACE}
                size="large"
              >
                Browse Marketplace
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Cart Items */}
          <Box sx={{ flex: 1 }}>
            {Object.entries(groupedItems).map(([storeId, items]) => {
              const storeName = items[0].storeName || 'Unknown Store';
              const storeTotal = items.reduce((sum, item) => sum + (item.subtotal || 0), 0);

              return (
                <Card key={storeId} sx={{ mb: 3 }}>
                  <CardContent>
                    {/* Store Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                      <StoreIcon color="primary" />
                      <Typography variant="h6" fontWeight={600}>
                        {storeName}
                      </Typography>
                      <Chip
                        label={`$${storeTotal.toFixed(2)}`}
                        color="primary"
                        size="small"
                        sx={{ ml: 'auto' }}
                      />
                    </Box>

                    {/* Cart Items */}
                    {items.map((item, index) => (
                      <Box key={item.cartItemId}>
                        {index > 0 && <Divider sx={{ my: 2 }} />}
                        
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          {/* Product Image Placeholder */}
                          <Box
                            sx={{
                              width: 100,
                              height: 100,
                              bgcolor: 'grey.200',
                              borderRadius: 2,
                              flexShrink: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <ShoppingCart sx={{ fontSize: 40, color: 'grey.400' }} />
                          </Box>

                          {/* Product Info */}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="h6" gutterBottom noWrap>
                              {item.productTitle}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {item.productBrand}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              ${item.productPrice?.toFixed(2)} each
                            </Typography>
                            
                            {/* Quantity Controls */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                              <IconButton
                                size="small"
                                onClick={() => handleUpdateQuantity(item.productId!, item.quantity! - 1)}
                                disabled={item.quantity === 1}
                              >
                                <Remove fontSize="small" />
                              </IconButton>
                              
                              <Typography variant="body1" fontWeight={600} sx={{ minWidth: 30, textAlign: 'center' }}>
                                {item.quantity}
                              </Typography>
                              
                              <IconButton
                                size="small"
                                onClick={() => handleUpdateQuantity(item.productId!, item.quantity! + 1)}
                                disabled={item.quantity! >= item.availableStock!}
                              >
                                <Add fontSize="small" />
                              </IconButton>

                              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                {item.availableStock! <= 5 && (
                                  <Chip 
                                    label={`Only ${item.availableStock} left`} 
                                    size="small" 
                                    color="warning"
                                  />
                                )}
                              </Typography>
                            </Box>
                          </Box>

                          {/* Price and Remove */}
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                            <Typography variant="h6" fontWeight={700}>
                              ${item.subtotal?.toFixed(2)}
                            </Typography>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleRemoveItem(item.productId!, item.productTitle!)}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </Box>

          {/* Order Summary */}
          <Box sx={{ width: { xs: '100%', md: 350 }, flexShrink: 0 }}>
            <Paper sx={{ p: 3, position: 'sticky', top: 88 }}>
              <Typography variant="h6" gutterBottom fontWeight={700}>
                Order Summary
              </Typography>

              <Box sx={{ my: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">Subtotal:</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    ${cart?.totalPrice?.toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">Shipping:</Typography>
                  <Typography variant="body2" color="success.main" fontWeight={600}>
                    FREE
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" fontWeight={700}>
                    Total:
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="primary.main">
                    ${cart?.totalPrice?.toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                endIcon={<ArrowForward />}
                onClick={() => navigate(ROUTES.CHECKOUT)}
                sx={{ mb: 2 }}
              >
                Proceed to Checkout
              </Button>

              <Button
                variant="outlined"
                fullWidth
                component={Link}
                to={ROUTES.MARKETPLACE}
              >
                Continue Shopping
              </Button>
            </Paper>
          </Box>
        </Box>
      )}
    </Box>
  );
};