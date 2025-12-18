import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Inventory,
  TrendingUp,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { getProductController } from '../api/product-controller/product-controller';
import type { ProductResponse } from '../api/generated.schemas';
import { UpdateStockModal } from '../components/modals/UpdateStockModal';
import { EditProductModal } from '../components/modals/EditProductModal';
import { ROUTES } from '../constants/routes';

export const StoreProductsPage: React.FC = () => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Update stock modal state
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);
  
  // Edit product modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<ProductResponse | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productController = getProductController();
      const response = await productController.getStoreProducts();
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load products');
      console.error('Fetch products error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const productController = getProductController();
      await productController.deleteProduct(productId);
      // Refresh product list
      await fetchProducts();
    } catch (err) {
      setError('Failed to delete product');
      console.error('Delete product error:', err);
    }
  };

  const handleOpenStockModal = (product: ProductResponse) => {
    setSelectedProduct(product);
    setStockModalOpen(true);
  };

  const handleCloseStockModal = () => {
    setStockModalOpen(false);
    setSelectedProduct(null);
  };

  const handleStockUpdateSuccess = async () => {
    await fetchProducts();
  };

  const handleOpenEditModal = (product: ProductResponse) => {
    setEditProduct(product);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditProduct(null);
  };

  const handleEditSuccess = async () => {
    await fetchProducts();
  };

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
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
            My Products
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your product inventory
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

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Products Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Type</strong></TableCell>
              <TableCell><strong>Brand</strong></TableCell>
              <TableCell align="right"><strong>Price</strong></TableCell>
              <TableCell align="right"><strong>Stock</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Inventory sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No Products Yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Start adding products to your store
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      component={Link}
                      to={ROUTES.STORE_ADD_PRODUCT}
                    >
                      Add Your First Product
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {product.title}
                    </Typography>
                  </TableCell>
                  <TableCell>{product.type}</TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={600}>
                      ${product.price?.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={product.stockQuantity}
                      size="small"
                      color={
                        (product.stockQuantity || 0) > 10
                          ? 'success'
                          : (product.stockQuantity || 0) > 0
                          ? 'warning'
                          : 'error'
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Update Stock">
                      <IconButton
                        size="small"
                        color="secondary"
                        onClick={() => handleOpenStockModal(product)}
                      >
                        <TrendingUp fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Product">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenEditModal(product)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Product">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(product.id!)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Update Stock Modal */}
      {selectedProduct && (
        <UpdateStockModal
          open={stockModalOpen}
          onClose={handleCloseStockModal}
          productId={selectedProduct.id!}
          productTitle={selectedProduct.title!}
          currentStock={selectedProduct.stockQuantity!}
          onSuccess={handleStockUpdateSuccess}
        />
      )}

      {/* Edit Product Modal */}
      {editProduct && (
        <EditProductModal
          open={editModalOpen}
          onClose={handleCloseEditModal}
          product={editProduct}
          onSuccess={handleEditSuccess}
        />
      )}
    </Box>
  );
};