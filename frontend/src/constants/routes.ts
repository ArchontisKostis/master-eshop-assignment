/**
 * Application Routes
 * Centralized route definitions for consistent navigation
 */

export const ROUTES = {
  // Public routes
  HOME: '/',
  ABOUT: '/about',
  
  // Product routes
  PRODUCTS: '/products',
  
  // Store routes
  STORES: '/stores',
  STORE_DETAIL: '/stores/:id',
  
  // Auth routes
  LOGIN: '/login',
  REGISTER: '/register',
  REGISTER_CUSTOMER: '/register/customer',
  REGISTER_STORE: '/register/store',
  
  // Customer routes
  CUSTOMER_DASHBOARD: '/dashboard',
  MARKETPLACE: '/marketplace',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  
  // Store owner routes
  STORE_DASHBOARD: '/store/dashboard',
  STORE_PRODUCTS: '/store/products',
  STORE_ADD_PRODUCT: '/store/products/add',
  STORE_EDIT_PRODUCT: '/store/products/:id/edit',
  STORE_ORDERS: '/store/orders',
  
  // Error pages
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/unauthorized',
} as const;

/**
 * Helper function to generate route with parameters
 * @example getRoute(ROUTES.PRODUCT_DETAIL, { id: '123' }) => '/products/123'
 */
export const getRoute = (route: string, params?: Record<string, string | number>): string => {
  if (!params) return route;
  
  let path = route;
  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`:${key}`, String(value));
  });
  
  return path;
};

/**
 * Route groups for easier management
 */
export const ROUTE_GROUPS = {
  PUBLIC: [
    ROUTES.HOME,
    ROUTES.ABOUT,
    ROUTES.STORES,
    ROUTES.STORE_DETAIL,
  ],
  AUTH: [
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.REGISTER_CUSTOMER,
    ROUTES.REGISTER_STORE,
  ],
  CUSTOMER: [
    ROUTES.CART,
    ROUTES.CHECKOUT,
    ROUTES.ORDERS,
    ROUTES.ORDER_DETAIL,
  ],
  STORE_OWNER: [
    ROUTES.STORE_DASHBOARD,
    ROUTES.STORE_PRODUCTS,
    ROUTES.STORE_ADD_PRODUCT,
    ROUTES.STORE_EDIT_PRODUCT,
    ROUTES.STORE_ORDERS,
  ],
} as const;