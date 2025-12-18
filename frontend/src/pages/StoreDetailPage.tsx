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
  Store as StoreIcon,
  Person,
  Inventory,
  ArrowBack,
  ShoppingCart,
} from '@mui/icons-material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getStoreController } from '../api/store-controller/store-controller';
import { getProductController } from '../api/product-controller/product-controller';
import { getShoppingCartController } from '../api/shopping-cart-controller/shopping-cart-controller';
import type { StoreResponse, ProductResponse, GetProductsParams } from '../api/generated.schemas';
import { ProductFilters } from '../components/products/ProductFilters';
import { useToast } from '../contexts/ToastContext';
import { useCart } from '../hooks/useCart';
import { ROUTES } from '../constants/routes';

export const StoreDetailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const storeId = searchParams.get('id');

  const [store, setStore] = useState<StoreResponse | null>(null);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [allProducts, setAllProducts] = useState<ProductResponse[]>([]); // Keep all products for brand list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const { refreshCart } = useCart();
  
  // Filter state
  const [filters, setFilters] = useState<GetProductsParams>({
    storeId: storeId ? parseInt(storeId) : undefined,
  });

  useEffect(() => {
    if (!storeId) {
      setError('Store ID is required');
      setLoading(false);
      return;
    }

    // Update filters when storeId changes
    setFilters(prev => ({ ...prev, storeId: parseInt(storeId) }));
    fetchStoreData();
  }, [storeId]);

  // Fetch products when filters change
  useEffect(() => {
    if (store && storeId) {
      fetchProducts();
    }
  }, [filters]);

  const fetchStoreData = async () => {
    if (!storeId) return;

    try {
      setLoading(true);
      const storeController = getStoreController();
      const productController = getProductController();

      // Fetch store details
      const storeResponse = await storeController.getStoreById(parseInt(storeId));
      setStore(storeResponse.data);

      // Fetch ALL products for this store (for brand extraction)
      const allProductsResponse = await productController.getProducts({
        storeId: parseInt(storeId)
      });
      setAllProducts(allProductsResponse.data);

      // Fetch filtered products
      const productsResponse = await productController.getProducts(filters);
      setProducts(productsResponse.data);

      setError(null);
    } catch (err: any) {
      console.error('Fetch store data error:', err);
      setError(`Failed to load store information: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    if (!storeId) return;

    try {
      const productController = getProductController();
      const productsResponse = await productController.getProducts(filters);
      setProducts(productsResponse.data);
    } catch (err: any) {
      console.error('Fetch products error:', err);
      setError(`Failed to load products: ${err.message || 'Unknown error'}`);
    }
  };

  const handleFilterChange = (newFilters: GetProductsParams) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      storeId: storeId ? parseInt(storeId) : undefined,
    });
  };

  // Extract unique brands from ALL products (not filtered)
  const availableBrands = React.useMemo(() => {
    const brands = allProducts
      .map(p => p.brand)
      .filter((brand): brand is string => !!brand);
    return [...new Set(brands)].sort();
  }, [allProducts]);

  const handleAddToCart = async (productId: number, productTitle: string) => {
    try {
      const cartController = getShoppingCartController();
      await cartController.addToCart({
        productId,
        quantity: 1,
      });
      showToast(`"${productTitle}" added to cart!`, 'success');
      // Refresh cart to update badge count
      await refreshCart();
    } catch (err) {
      showToast('Failed to add to cart', 'error');
      console.error('Add to cart error:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !store) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Store not found'}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(ROUTES.MARKETPLACE)}
        >
          Back to Marketplace
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(ROUTES.MARKETPLACE)}
        sx={{ mb: 3 }}
      >
        Back to Marketplace
      </Button>

      {/* Store Header */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'start', gap: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'primary.light',
              }}
            >
              <StoreIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
                {store.name}
              </Typography>

              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Person sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {store.owner}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Inventory sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {store.productCount || 0} products
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Products Section Header with Filter */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" component="h2" fontWeight={600}>
            Available Products
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {products.length} {products.length === 1 ? 'product' : 'products'} found
          </Typography>
        </Box>
        
        <ProductFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          availableBrands={availableBrands}
        />
      </Box>

      {products.length === 0 ? (
        <Card>
          <CardContent>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Inventory sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Products Available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This store hasn't listed any products yet
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