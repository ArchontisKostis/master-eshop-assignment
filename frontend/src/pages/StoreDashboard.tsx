import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Inventory,
  Receipt,
  TrendingUp,
  People,
  Add,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { StatCard } from '../components/common';
import { getProductController } from '../api/product-controller/product-controller';
import { getOrderController } from '../api/order-controller/order-controller';
import type { ProductResponse, OrderResponse } from '../api/generated.schemas';
import { ROUTES } from '../constants/routes';

export const StoreDashboard: React.FC = () => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch store products
      const productController = getProductController();
      const productsResponse = await productController.getStoreProducts();
      setProducts(productsResponse.data);

      // Fetch store orders
      const orderController = getOrderController();
      const ordersResponse = await orderController.getStoreOrders();
      setOrders(ordersResponse.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
  const uniqueCustomers = new Set(orders.map(order => order.customerId)).size;

  // Get recent orders (last 5)
  const recentOrders = orders
    .sort((a, b) => new Date(b.orderDate!).getTime() - new Date(a.orderDate!).getTime())
    .slice(0, 5);

  // Get recent products (last 3)
  const recentProducts = products.slice(0, 3);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Welcome Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
            Store Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your products and orders
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          component={Link}
          to={ROUTES.STORE_ADD_PRODUCT}
          size="large"
        >
          Add Product
        </Button>
      </Box>

      {/* Stats Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 4,
        }}
      >
        <Paper sx={{ p: 3 }}>
          <StatCard
            icon={Inventory}
            value={products.length.toString()}
            label="Total Products"
            iconColor="primary.main"
          />
        </Paper>
        <Paper sx={{ p: 3 }}>
          <StatCard
            icon={Receipt}
            value={orders.length.toString()}
            label="Total Orders"
            iconColor="success.main"
          />
        </Paper>
        <Paper sx={{ p: 3 }}>
          <StatCard
            icon={People}
            value={uniqueCustomers.toString()}
            label="Customers"
            iconColor="info.main"
          />
        </Paper>
        <Paper sx={{ p: 3 }}>
          <StatCard
            icon={TrendingUp}
            value={`$${totalRevenue.toFixed(2)}`}
            label="Total Revenue"
            iconColor="secondary.main"
          />
        </Paper>
      </Box>

      {/* Recent Orders */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2" fontWeight={600}>
            Recent Orders
          </Typography>
          {orders.length > 0 && (
            <Button
              component={Link}
              to={ROUTES.STORE_ORDERS}
              size="small"
              endIcon={<Add />}
            >
              View All
            </Button>
          )}
        </Box>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Order #</strong></TableCell>
                <TableCell><strong>Customer</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell align="right"><strong>Total</strong></TableCell>
                <TableCell align="center"><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography variant="body2" color="text.secondary" align="center">
                      No orders yet. Your orders will appear here.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                recentOrders.map((order) => (
                  <TableRow key={order.orderId} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        #{order.orderId}
                      </Typography>
                    </TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(order.orderDate!).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={700}>
                        ${order.totalPrice?.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={order.status}
                        size="small"
                        color={
                          order.status?.toLowerCase() === 'completed' ? 'success' :
                          order.status?.toLowerCase() === 'pending' ? 'warning' : 'default'
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Products Overview */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2" fontWeight={600}>
            Your Products
          </Typography>
          <Button
            variant="outlined"
            component={Link}
            to={ROUTES.STORE_PRODUCTS}
          >
            View All
          </Button>
        </Box>
        
        {recentProducts.length === 0 ? (
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" align="center">
                No products yet. Add your first product to get started!
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 3,
            }}
          >
            {recentProducts.map((product) => (
              <Card key={product.id}>
                <CardContent>
                  <Box
                    sx={{
                      height: 150,
                      bgcolor: 'grey.200',
                      borderRadius: 2,
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Inventory sx={{ fontSize: 48, color: 'grey.400' }} />
                  </Box>
                  <Typography variant="h6" gutterBottom noWrap>
                    {product.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    ${product.price?.toFixed(2)} • Stock: {product.stockQuantity}
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 1 }}
                    component={Link}
                    to={ROUTES.STORE_PRODUCTS}
                  >
                    Manage
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};