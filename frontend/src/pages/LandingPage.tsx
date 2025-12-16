import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
} from '@mui/material';
import {
  ShoppingCart,
  Store,
  TrendingUp,
  Verified,
  LocalShipping,
  Security,
  Support,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { FeatureCard, StatCard } from '../components/common';
import { ROUTES } from '../constants/routes';

export const LandingPage: React.FC = () => {
  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 10,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }}
      >
        <Box sx={{ px: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Chip
              label="Multi-Vendor Marketplace"
              color="primary"
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Typography
              variant="h1"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3,
              }}
            >
              Welcome to E-Shop
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ mb: 4, maxWidth: 700, mx: 'auto', lineHeight: 1.6 }}
            >
              Your trusted marketplace connecting stores and customers. Shop from
              multiple vendors, compare prices, and find the best deals all in one
              place.
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<ShoppingCart />}
                sx={{ px: 4, py: 1.5 }}
                component={Link}
                to={ROUTES.LOGIN}
              >
                Start Shopping
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                startIcon={<Store />}
                sx={{ px: 4, py: 1.5 }}
                component={Link}
                to={ROUTES.REGISTER}
              >
                Become a Seller
              </Button>
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 10, px: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" component="h2" gutterBottom fontWeight={700}>
            Why Choose E-Shop?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Experience the future of online shopping with our comprehensive platform
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 4,
            maxWidth: 1400,
            mx: 'auto',
          }}
        >
          <FeatureCard
            icon={Store}
            title="Multi-Vendor Platform"
            description="Browse products from multiple stores in one place. Compare prices, read reviews, and find the best deals from trusted sellers."
            iconColor="#1976d2aa"
            iconBgColor="#64b4f63c"
          />
          <FeatureCard
            icon={Verified}
            title="Trusted Sellers"
            description="Shop with confidence from verified stores. All sellers are vetted to ensure quality products and reliable service."
            iconColor="#388e3cb7"
            iconBgColor="#c8e6c994"
          />
          <FeatureCard
            icon={LocalShipping}
            title="Fast Delivery"
            description="Quick and reliable shipping from stores near you. Track your orders in real-time and get updates at every step."
            iconColor="#ff9900cb"
            iconBgColor="#ffb84d37"
          />
          <FeatureCard
            icon={Security}
            title="Secure Payments"
            description="Your transactions are protected with industry-standard encryption. Shop safely with multiple payment options."
            iconColor="#0289d186"
            iconBgColor="#b3e5fc4c"
          />
          <FeatureCard
            icon={Support}
            title="24/7 Support"
            description="Our customer support team is always ready to help. Get assistance anytime, anywhere with any questions."
            iconColor="#ffb300b8"
            iconBgColor="#ffecb370"
          />
          <FeatureCard
            icon={TrendingUp}
            title="Best Prices"
            description="Compare prices from multiple sellers and get the best deals. Save money with our competitive marketplace."
            iconColor="#d32f2fa4"
            iconBgColor="#ef9a9a38"
          />
        </Box>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 10, px: 4 }}>
        <Card
          sx={{
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            color: 'white',
            maxWidth: 1200,
            mx: 'auto',
          }}
        >
          <CardContent sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="h2" component="h2" gutterBottom fontWeight={700}>
              Ready to Get Started?
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, opacity: 0.95 }}>
              Join thousands of customers and stores on our platform today
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                variant="contained"
                size="large"
                component={Link}
                to={ROUTES.REGISTER}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'grey.100',
                  },
                }}
              >
                Create Customer Account
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to={ROUTES.REGISTER}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Register as Store
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};