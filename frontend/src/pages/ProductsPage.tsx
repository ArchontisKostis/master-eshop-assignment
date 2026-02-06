import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Chip,
} from '@mui/material';
import {
  Inventory,
  ShoppingCart,
} from '@mui/icons-material';
import { getProductController } from '../api/product-controller/product-controller';
import { getShoppingCartController } from '../api/shopping-cart-controller/shopping-cart-controller';
import { getStoreController } from '../api/store-controller/store-controller';
import type { ProductResponse, GetProductsParams, StoreResponse } from '../api/generated.schemas';
import { ProductFilters } from '../components/products/ProductFilters';
import { useToast } from '../contexts/ToastContext';
import { useCart } from '../hooks/useCart';
import { getApiError } from '../api/api-error';
import { parseJsonFromBlob } from '../api/blob-utils';

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [allProducts, setAllProducts] = useState<ProductResponse[]>([]); // For brand extraction
  const [stores, setStores] = useState<StoreResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const { refreshCart } = useCart();
  
  // Filter state (no storeId - all stores)
  const [filters, setFilters] = useState<GetProductsParams>({});

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    if (allProducts.length > 0) {
      fetchProducts();
    }
  }, [filters]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const productController = getProductController();
      const storeController = getStoreController();
      
      // Fetch stores for store filter
      const storesResponse = await storeController.getAllStores();
      const storesData = await parseJsonFromBlob<StoreResponse[]>(storesResponse.data);
      setStores(storesData);
      
      // Fetch ALL products for brand extraction
      const allProductsResponse = await productController.getProducts({});
      const allProductsData = await parseJsonFromBlob<ProductResponse[]>(allProductsResponse.data);
      setAllProducts(allProductsData);
      
      // Fetch filtered products
      const productsResponse = await productController.getProducts(filters);
      const productsData = await parseJsonFromBlob<ProductResponse[]>(productsResponse.data);
      setProducts(productsData);
      
      setError(null);
    } catch (err) {
      const apiError = getApiError(err);
      setError(apiError?.message || 'Failed to load products');
      console.error('Fetch products error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const productController = getProductController();
      const productsResponse = await productController.getProducts(filters);
      const productsData = await parseJsonFromBlob<ProductResponse[]>(productsResponse.data);
      setProducts(productsData);
    } catch (err) {
      const apiError = getApiError(err);
      console.error('Fetch products error:', err);
      setError(apiError?.message || 'Failed to load products');
    }
  };

  const handleFilterChange = (newFilters: GetProductsParams) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleAddToCart = async (productId: number, productTitle: string) => {
    try {
      const cartController = getShoppingCartController();
      await cartController.addToCart({
        productId,
        quantity: 1,
      });
      showToast(`"${productTitle}" added to cart!`, 'success');
      await refreshCart();
    } catch (err) {
      const apiError = getApiError(err);

      if (apiError?.code === 'InsufficientStockException') {
        showToast(apiError.message || 'Insufficient stock for this product.', 'warning');
        await refreshCart();
      } else {
        showToast(
          apiError?.message || 'Failed to add to cart',
          apiError && apiError.status >= 500 ? 'error' : 'warning'
        );
      }

      console.error('Add to cart error:', err);
    }
  };

  // Extract unique brands from all products
  const availableBrands = React.useMemo(() => {
    const brands = allProducts
      .map(p => p.brand)
      .filter((brand): brand is string => !!brand);
    return [...new Set(brands)].sort();
  }, [allProducts]);

  // Format stores for filter
  const availableStores = stores.map(store => ({
    id: store.id!,
    name: store.name!,
  }));

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
          All Products
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse products from all stores in the marketplace
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Products Section Header with Filter */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          {products.length} {products.length === 1 ? 'product' : 'products'} found
        </Typography>
        
        <ProductFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          availableBrands={availableBrands}
          availableStores={availableStores}
        />
      </Box>

      {/* Products Grid */}
      {products.length === 0 ? (
        <Card>
          <CardContent>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Inventory sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Products Found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your filters to see more products
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: 3,
          }}
        >
          {products.map((product) => (
            <Card
              key={product.id}
              sx={{
                transition: 'all 0.3s ease-in-out',
                opacity: (product.stockQuantity || 0) === 0 ? 0.5 : 1,
                '&:hover': {
                  transform: (product.stockQuantity || 0) > 0 ? 'translateY(-4px)' : 'none',
                  boxShadow: (product.stockQuantity || 0) > 0 ? 6 : undefined,
                },
              }}
            >
              <CardContent>
                {/* Product Image Placeholder */}
                <Box
                  sx={{
                    height: 180,
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

                {/* Product Info */}
                <Typography variant="h6" component="h3" gutterBottom noWrap>
                  {product.title}
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {product.brand} • {product.type}
                </Typography>

                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  From: {product.storeName}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" color="primary.main" fontWeight={700}>
                    ${product.price?.toFixed(2)}
                  </Typography>
                  <Chip
                    label={`Stock: ${product.stockQuantity}`}
                    size="small"
                    color={
                      (product.stockQuantity || 0) > 10
                        ? 'success'
                        : (product.stockQuantity || 0) > 0
                        ? 'warning'
                        : 'error'
                    }
                  />
                </Box>

                {/* Add to Cart Button */}
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<ShoppingCart />}
                  disabled={(product.stockQuantity || 0) === 0}
                  onClick={() => handleAddToCart(product.id!, product.title!)}
                >
                  {(product.stockQuantity || 0) > 0 ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};