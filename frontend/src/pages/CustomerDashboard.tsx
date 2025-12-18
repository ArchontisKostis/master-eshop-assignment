import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Paper,
  CircularProgress,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  ShoppingCart,
  Receipt,
  TrendingUp,
  Store as StoreIcon,
  ArrowForward,
  Inventory,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { StatCard } from '../components/common';
import { useCart } from '../hooks/useCart';
import { getOrderController } from '../api/order-controller/order-controller';
import { getProductController } from '../api/product-controller/product-controller';
import type { OrderResponse, ProductResponse } from '../api/generated.schemas';
import { ROUTES } from '../constants/routes';

export const CustomerDashboard: React.FC = () => {
  const { cart, itemCount } = useCart();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch orders
      const orderController = getOrderController();
      const ordersResponse = await orderController.getCustomerOrders();
      setOrders(ordersResponse.data);

      // Fetch recommended products (latest 3 products from all stores)
      const productController = getProductController();
      const productsResponse = await productController.getProducts({});
      // Get first 3 products as "recommended"
      setRecommendedProducts(productsResponse.data.slice(0, 3));
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const totalSpent = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
  const totalItemsOrdered = orders.reduce(
    (sum, order) => sum + (order.items?.reduce((itemSum, item) => itemSum + (item.quantity || 0), 0) || 0),
    0
  );
  const uniqueStores = new Set(orders.map(order => order.storeId)).size;

  // Get recent orders (last 3)
  const recentOrders = orders
    .sort((a, b) => new Date(b.orderDate!).getTime() - new Date(a.orderDate!).getTime())
    .slice(0, 3);

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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
          Welcome Back!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's an overview of your shopping activity
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 4,
        }}
      >
        <Paper sx={{ p: 3 }}>
          <StatCard
            icon={ShoppingCart}
            value={itemCount.toString()}
            label="Items in Cart"
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
            icon={StoreIcon}
            value={uniqueStores.toString()}
            label="Stores Shopped"
            iconColor="info.main"
          />
        </Paper>
        <Paper sx={{ p: 3 }}>
          <StatCard
            icon={TrendingUp}
            value={`$${totalSpent.toFixed(2)}`}
            label="Total Spent"
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
              to={ROUTES.ORDERS}
              size="small"
              endIcon={<ArrowForward />}
            >
              View All
            </Button>
          )}
        </Box>
        
        {recentOrders.length === 0 ? (
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                No orders yet. Start shopping to see your orders here!
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Order #</strong></TableCell>
                  <TableCell><strong>Store</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell align="right"><strong>Total</strong></TableCell>
                  <TableCell align="center"><strong>Status</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow
                    key={order.orderId}
                    hover
                    component={Link}
                    to={ROUTES.ORDERS}
                    sx={{ cursor: 'pointer', textDecoration: 'none' }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        #{order.orderId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {order.storeName}
                      </Typography>
                    </TableCell>
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
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Recommended Products */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2" fontWeight={600}>
            Recommended for You
          </Typography>
          <Button
            component={Link}
            to={ROUTES.MARKETPLACE}
            size="small"
            endIcon={<ArrowForward />}
          >
            Browse All
          </Button>
        </Box>
        
        {recommendedProducts.length === 0 ? (
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                No products available yet
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
            {recommendedProducts.map((product) => (
              <Card
                key={product.id}
                sx={{
                  transition: 'all 0.3s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
                }}
              >
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
                    {product.brand}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="primary.main" fontWeight={700}>
                      ${product.price?.toFixed(2)}
                    </Typography>
                    <Button
                      size="small"
                      component={Link}
                      to={`${ROUTES.MARKETPLACE}?id=${product.storeId}`}
                    >
                      View
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};