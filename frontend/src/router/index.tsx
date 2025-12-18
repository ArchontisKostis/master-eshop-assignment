import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainLayout, DashboardLayout } from '../components/layout';
import {
  LandingPage,
  ProductsPage,
  StoresPage,
  AboutPage,
  NotFoundPage,
  UnauthorizedPage,
  RegisterPage,
  LoginPage,
  CustomerDashboard,
  StoreDashboard,
  AddProductPage,
  StoreProductsPage,
  MarketplacePage,
  CartPage,
  OrdersPage,
  CheckoutPage,
  StoreOrdersPage
} from '../pages';
import { ErrorBoundary } from '../components/common';
import { ProtectedRoute, RoleGuard } from '../components/guards';
import { ROUTES } from '../constants/routes';
import { UserRole } from '../types/auth';

/**
 * Application Router Configuration
 * Defines all routes and their corresponding components
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: ROUTES.HOME,
        element: <LandingPage />,
      },
      {
        path: ROUTES.STORES,
        element: <StoresPage />,
      },
      {
        path: ROUTES.ABOUT,
        element: <AboutPage />,
      },
      // Auth routes
      {
        path: ROUTES.LOGIN,
        element: <LoginPage />,
      },
      {
        path: ROUTES.REGISTER,
        element: <RegisterPage />,
      },
      // Unauthorized page
      {
        path: ROUTES.UNAUTHORIZED,
        element: <UnauthorizedPage />,
      },
      // Catch-all route for 404
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
  // Dashboard routes with separate layout
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      // Customer dashboard and pages
      {
        path: ROUTES.CUSTOMER_DASHBOARD,
        element: (
          <RoleGuard allowedRoles={[UserRole.CUSTOMER]}>
            <CustomerDashboard />
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.MARKETPLACE,
        element: (
          <RoleGuard allowedRoles={[UserRole.CUSTOMER]}>
            <MarketplacePage />
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.PRODUCTS,
        element: (
          <RoleGuard allowedRoles={[UserRole.CUSTOMER]}>
            <ProductsPage />
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.CART,
        element: (
          <RoleGuard allowedRoles={[UserRole.CUSTOMER]}>
            <CartPage />
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.ORDERS,
        element: (
          <RoleGuard allowedRoles={[UserRole.CUSTOMER]}>
            <OrdersPage />
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.CHECKOUT,
        element: (
          <RoleGuard allowedRoles={[UserRole.CUSTOMER]}>
            <CheckoutPage />
          </RoleGuard>
        ),
      },
      // Store dashboard and pages
      {
        path: ROUTES.STORE_DASHBOARD,
        element: (
          <RoleGuard allowedRoles={[UserRole.STORE]}>
            <StoreDashboard />
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.STORE_PRODUCTS,
        element: (
          <RoleGuard allowedRoles={[UserRole.STORE]}>
            <StoreProductsPage />
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.STORE_ADD_PRODUCT,
        element: (
          <RoleGuard allowedRoles={[UserRole.STORE]}>
            <AddProductPage />
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.STORE_ORDERS,
        element: (
          <RoleGuard allowedRoles={[UserRole.STORE]}>
            <StoreOrdersPage />
          </RoleGuard>
        ),
      },
    ],
  },
]);

/**
 * App Router Component
 * Wraps the application with the router provider
 */
export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};