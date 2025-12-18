import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Collapse,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  ShoppingCart,
  Receipt,
  Person,
  Store,
  Inventory,
  ExitToApp,
  ExpandLess,
  ExpandMore,
  Storefront,
} from '@mui/icons-material';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../hooks/useCart';
import { ROUTES } from '../../constants/routes';
import { UserRole } from '../../types/auth';

const DRAWER_WIDTH = 260;

interface NavItem {
  label: string;
  path?: string;
  icon: React.ReactElement;
  roles: UserRole[];
  children?: NavItem[];
}

const NAV_ITEMS: NavItem[] = [
  // Customer navigation
  {
    label: 'Dashboard',
    path: ROUTES.CUSTOMER_DASHBOARD,
    icon: <Dashboard />,
    roles: [UserRole.CUSTOMER],
  },
  {
    label: 'Marketplace',
    icon: <Store />,
    roles: [UserRole.CUSTOMER],
    children: [
      {
        label: 'Stores',
        path: ROUTES.MARKETPLACE,
        icon: <Storefront />,
        roles: [UserRole.CUSTOMER],
      },
      {
        label: 'All Products',
        path: ROUTES.PRODUCTS,
        icon: <Inventory />,
        roles: [UserRole.CUSTOMER],
      },
    ],
  },
  {
    label: 'My Cart',
    path: ROUTES.CART,
    icon: <ShoppingCart />,
    roles: [UserRole.CUSTOMER],
  },
  {
    label: 'My Orders',
    path: ROUTES.ORDERS,
    icon: <Receipt />,
    roles: [UserRole.CUSTOMER],
  },
  // Store navigation
  {
    label: 'Dashboard',
    path: ROUTES.STORE_DASHBOARD,
    icon: <Dashboard />,
    roles: [UserRole.STORE],
  },
  {
    label: 'Products',
    path: ROUTES.STORE_PRODUCTS,
    icon: <Inventory />,
    roles: [UserRole.STORE],
  },
  {
    label: 'Orders',
    path: ROUTES.STORE_ORDERS,
    icon: <Receipt />,
    roles: [UserRole.STORE],
  },
];

export const DashboardLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate(ROUTES.HOME);
  };

  // Filter nav items based on user role
  const navItems = user ? NAV_ITEMS.filter(item => item.roles.includes(user.role)) : [];

  const handleGroupToggle = (label: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Sidebar Header */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Store sx={{ fontSize: 32, color: 'primary.main' }} />
        <Typography variant="h6" color="primary.main" fontWeight={700}>
          E-Shop
        </Typography>
      </Box>

      <Divider />

      {/* Navigation Items */}
      <List sx={{ px: 2, py: 1, flexGrow: 1 }}>
        {navItems.map((item) => (
          <React.Fragment key={item.label}>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              {item.children ? (
                // Group item (expandable)
                <ListItemButton
                  onClick={() => handleGroupToggle(item.label)}
                  sx={{
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: 'primary.light',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: 500,
                    }}
                  />
                  {expandedGroups[item.label] ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              ) : (
                // Regular item
                <ListItemButton
                  component={Link}
                  to={item.path!}
                  sx={{
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: 'primary.light',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
                    {item.path === ROUTES.CART && user?.role === UserRole.CUSTOMER ? (
                      <Badge badgeContent={itemCount > 9 ? '9+' : itemCount} color="error">
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: 500,
                    }}
                  />
                </ListItemButton>
              )}
            </ListItem>
            
            {/* Nested items */}
            {item.children && (
              <Collapse in={expandedGroups[item.label]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((child) => (
                    <ListItem key={child.path} disablePadding sx={{ mb: 0.5 }}>
                      <ListItemButton
                        component={Link}
                        to={child.path!}
                        sx={{
                          pl: 4,
                          borderRadius: 2,
                          '&:hover': {
                            bgcolor: 'primary.light',
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
                          {child.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={child.label}
                          primaryTypographyProps={{
                            fontSize: '0.875rem',
                            fontWeight: 400,
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>

      {/* User Profile Section at Bottom */}
      <Box>
        <Divider />
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 1.5,
              borderRadius: 2,
              bgcolor: 'grey.100',
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'grey.200',
              },
            }}
            onClick={handleMenuOpen}
          >
            <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
              {user?.username.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="body2" fontWeight={600} noWrap>
                {user?.username}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {user?.role === UserRole.CUSTOMER ? 'Customer' : 'Store Owner'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {user?.role === UserRole.CUSTOMER ? 'Customer Dashboard' : 'Store Dashboard'}
          </Typography>

          {/* Cart Button (for customers) */}
          {user?.role === UserRole.CUSTOMER && (
            <IconButton
              color="inherit"
              component={Link}
              to={ROUTES.CART}
            >
              <Badge badgeContent={itemCount > 9 ? '9+' : itemCount} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>
          )}

          {/* User Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          minWidth: 0,
          overflow: 'auto',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};