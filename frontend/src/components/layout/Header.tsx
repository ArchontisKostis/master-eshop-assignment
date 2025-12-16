import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Badge,
} from '@mui/material';
import {
  ShoppingCart,
  Store,
  Login,
  PersonAdd,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export const Header: React.FC = () => {
  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: 'space-between', py: 1, px: 4 }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Store sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
          <Typography
            variant="h6"
            component={Link}
            to={ROUTES.HOME}
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
            }}
          >
            E-Shop
          </Typography>
        </Box>

        {/* Empty spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Login />}
            component={Link}
            to={ROUTES.LOGIN}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            Login
          </Button>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            component={Link}
            to={ROUTES.REGISTER}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            Sign Up
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};