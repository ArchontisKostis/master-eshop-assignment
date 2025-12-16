import React from 'react';
import {
  Box,
  Typography,
  Link as MuiLink,
  Divider,
  IconButton,
  Stack,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Store,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.100',
        py: 6,
        px: 4,
        mt: 'auto',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(5, 1fr)' },
          gap: 4,
          mb: 4,
        }}
      >
        {/* Brand Section */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Store sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
            <Typography variant="h6" color="primary.main" fontWeight={700}>
              E-Shop
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" paragraph>
            Your trusted multi-vendor marketplace connecting stores and customers
            across the globe.
          </Typography>
          <Stack direction="row" spacing={1}>
            <IconButton size="small" color="primary" aria-label="Facebook">
              <Facebook />
            </IconButton>
            <IconButton size="small" color="primary" aria-label="Twitter">
              <Twitter />
            </IconButton>
            <IconButton size="small" color="primary" aria-label="Instagram">
              <Instagram />
            </IconButton>
            <IconButton size="small" color="primary" aria-label="LinkedIn">
              <LinkedIn />
            </IconButton>
          </Stack>
        </Box>

        {/* Quick Links */}
        <Box>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Shop
          </Typography>
          <Stack spacing={1}>
            <MuiLink
              component={Link}
              to={ROUTES.MARKETPLACE}
              color="text.secondary"
              underline="hover"
            >
              All Products
            </MuiLink>
            <MuiLink
              component={Link}
              to={ROUTES.MARKETPLACE}
              color="text.secondary"
              underline="hover"
            >
              Categories
            </MuiLink>
            <MuiLink
              component={Link}
              to={ROUTES.STORES}
              color="text.secondary"
              underline="hover"
            >
              Stores
            </MuiLink>
            <MuiLink
              component={Link}
              to={ROUTES.MARKETPLACE}
              color="text.secondary"
              underline="hover"
            >
              Deals
            </MuiLink>
          </Stack>
        </Box>

        {/* Company */}
        <Box>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Company
          </Typography>
          <Stack spacing={1}>
            <MuiLink
              component={Link}
              to={ROUTES.ABOUT}
              color="text.secondary"
              underline="hover"
            >
              About Us
            </MuiLink>
            <MuiLink
              component={Link}
              to={ROUTES.ABOUT}
              color="text.secondary"
              underline="hover"
            >
              Contact
            </MuiLink>
            <MuiLink
              component={Link}
              to={ROUTES.ABOUT}
              color="text.secondary"
              underline="hover"
            >
              Careers
            </MuiLink>
            <MuiLink
              component={Link}
              to={ROUTES.ABOUT}
              color="text.secondary"
              underline="hover"
            >
              Blog
            </MuiLink>
          </Stack>
        </Box>

        {/* Support */}
        <Box>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Support
          </Typography>
          <Stack spacing={1}>
            <MuiLink
              component={Link}
              to={ROUTES.ABOUT}
              color="text.secondary"
              underline="hover"
            >
              Help Center
            </MuiLink>
            <MuiLink
              component={Link}
              to={ROUTES.ABOUT}
              color="text.secondary"
              underline="hover"
            >
              Shipping Info
            </MuiLink>
            <MuiLink
              component={Link}
              to={ROUTES.ABOUT}
              color="text.secondary"
              underline="hover"
            >
              Returns
            </MuiLink>
            <MuiLink
              component={Link}
              to={ROUTES.ORDERS}
              color="text.secondary"
              underline="hover"
            >
              Track Order
            </MuiLink>
          </Stack>
        </Box>

        {/* Legal */}
        <Box>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Legal
          </Typography>
          <Stack spacing={1}>
            <MuiLink
              component={Link}
              to={ROUTES.ABOUT}
              color="text.secondary"
              underline="hover"
            >
              Privacy Policy
            </MuiLink>
            <MuiLink
              component={Link}
              to={ROUTES.ABOUT}
              color="text.secondary"
              underline="hover"
            >
              Terms of Service
            </MuiLink>
            <MuiLink
              component={Link}
              to={ROUTES.ABOUT}
              color="text.secondary"
              underline="hover"
            >
              Cookie Policy
            </MuiLink>
            <MuiLink
              component={Link}
              to={ROUTES.ABOUT}
              color="text.secondary"
              underline="hover"
            >
              Licenses
            </MuiLink>
          </Stack>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Copyright */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} E-Shop. All rights reserved.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Built with ❤️ for better shopping
        </Typography>
      </Box>
    </Box>
  );
};