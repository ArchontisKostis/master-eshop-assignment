import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Receipt,
  Store as StoreIcon,
  ExpandMore,
  ShoppingBag,
} from '@mui/icons-material';
import { getOrderController } from '../api/order-controller/order-controller';
import type { OrderResponse } from '../api/generated.schemas';
import { getApiError } from '../api/api-error';
import { parseJsonFromBlob } from '../api/blob-utils';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const orderController = getOrderController();
      const response = await orderController.getCustomerOrders();
      const ordersData = await parseJsonFromBlob<OrderResponse[]>(response.data);
      // Sort by date (newest first)
      const sortedOrders = ordersData.sort((a: OrderResponse, b: OrderResponse) => {
        return new Date(b.orderDate!).getTime() - new Date(a.orderDate!).getTime();
      });
      setOrders(sortedOrders);
      setError(null);
    } catch (err) {
      const apiError = getApiError(err);
      setError(apiError?.message || 'Failed to load orders');
      console.error('Fetch orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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
          My Orders
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and track your order history
        </Typography>
      </Box>

      {isEmpty ? (
        <Card>
          <CardContent>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Receipt sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
              <Typography variant="h5" color="text.secondary" gutterBottom>
                No orders yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start shopping to see your orders here
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {orders.map((order) => (
            <Accordion key={order.orderId}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', pr: 2 }}>
                  {/* Order Icon */}
                  <Receipt color="primary" />

                  {/* Order Info */}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" fontWeight={600}>
                      Order #{order.orderId}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <StoreIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {order.storeName}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        •
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(order.orderDate!)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Status and Total */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status!) as any}
                      size="small"
                    />
                    <Typography variant="h6" fontWeight={700}>
                      ${order.totalPrice?.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </AccordionSummary>

              <AccordionDetails>
                {/* Order Items Table */}
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
                      {order.items?.map((item) => (
                        <TableRow key={item.orderItemId}>
                          <TableCell>
                            <Typography variant="body2">
                              {item.productTitle}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {item.productBrand}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            ${item.priceAtPurchase?.toFixed(2)}
                          </TableCell>
                          <TableCell align="center">
                            <Chip label={item.quantity} size="small" />
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight={600}>
                              ${item.subtotal?.toFixed(2)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                      {/* Total Row */}
                      <TableRow>
                        <TableCell colSpan={4} align="right">
                          <Typography variant="body1" fontWeight={700}>
                            Total:
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body1" fontWeight={700} color="primary.main">
                            ${order.totalPrice?.toFixed(2)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}
    </Box>
  );
};