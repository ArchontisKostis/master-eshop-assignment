import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Receipt,
  Visibility,
} from '@mui/icons-material';
import { getOrderController } from '../api/order-controller/order-controller';
import type { OrderResponse } from '../api/generated.schemas';
import { parseJsonFromBlob } from '../api/blob-utils';

export const StoreOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Order details dialog
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const orderController = getOrderController();
      const response = await orderController.getStoreOrders();
      const ordersData = await parseJsonFromBlob<OrderResponse[]>(response.data);
      // Sort by date (newest first)
      const sortedOrders = ordersData.sort((a: OrderResponse, b: OrderResponse) => {
        return new Date(b.orderDate!).getTime() - new Date(a.orderDate!).getTime();
      });
      setOrders(sortedOrders);
      setError(null);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Fetch orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'processing':
        return 'info';
      default:
        return 'default';
    }
  };

  const handleViewDetails = (order: OrderResponse) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  const isEmpty = orders.length === 0;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
          Store Orders
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage customer orders for your products
        </Typography>
      </Box>

      {isEmpty ? (
        <Paper sx={{ p: 6 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Receipt sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No orders yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Orders from customers will appear here
            </Typography>
          </Box>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Order #</strong></TableCell>
                <TableCell><strong>Customer</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell align="center"><strong>Items</strong></TableCell>
                <TableCell align="right"><strong>Total</strong></TableCell>
                <TableCell align="center"><strong>Status</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.orderId} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      #{order.orderId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {order.customerName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(order.orderDate!)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={order.items?.length || 0}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={700}>
                      ${order.totalPrice?.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status!) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleViewDetails(order)}
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Order Details Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Order Details #{selectedOrder?.orderId}
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              {/* Order Info */}
              <Box sx={{ mb: 3, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Customer
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {selectedOrder.customerName}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Order Date
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatDate(selectedOrder.orderDate!)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Status
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={selectedOrder.status}
                      color={getStatusColor(selectedOrder.status!) as any}
                      size="small"
                    />
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Order Items */}
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Order Items
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Product</strong></TableCell>
                      <TableCell><strong>Brand</strong></TableCell>
                      <TableCell align="right"><strong>Price</strong></TableCell>
                      <TableCell align="center"><strong>Quantity</strong></TableCell>
                      <TableCell align="right"><strong>Subtotal</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder.items?.map((item) => (
                      <TableRow key={item.orderItemId}>
                        <TableCell>{item.productTitle}</TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {item.productBrand}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          ${item.priceAtPurchase?.toFixed(2)}
                        </TableCell>
                        <TableCell align="center">
                          {item.quantity}
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600}>
                            ${item.subtotal?.toFixed(2)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={4} align="right">
                        <Typography variant="body1" fontWeight={700}>
                          Order Total:
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="h6" fontWeight={700} color="primary.main">
                          ${selectedOrder.totalPrice?.toFixed(2)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};