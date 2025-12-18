import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import {
  Store as StoreIcon,
  Inventory,
  ArrowForward,
  Person,
} from '@mui/icons-material';
import { Link, useSearchParams } from 'react-router-dom';
import { getStoreController } from '../api/store-controller/store-controller';
import type { StoreResponse } from '../api/generated.schemas';
import { StoreDetailPage } from './StoreDetailPage';
import { ROUTES } from '../constants/routes';

export const MarketplacePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const storeId = searchParams.get('id');
  
  const [stores, setStores] = useState<StoreResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!storeId) {
      fetchStores();
    }
  }, [storeId]);
  
  // If store ID is provided, show store detail page
  if (storeId) {
    return <StoreDetailPage />;
  }

  const fetchStores = async () => {
    try {
      setLoading(true);
      const storeController = getStoreController();
      const response = await storeController.getAllStores();
      setStores(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load stores');
      console.error('Fetch stores error:', err);
    } finally {
      setLoading(false);
    }
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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
          Marketplace
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse stores and discover their products
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stores Grid */}
      {stores.length === 0 ? (
        <Card>
          <CardContent>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <StoreIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Stores Available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Check back later for new stores
              </Typography>
            </Box>
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
          {stores.map((store) => (
            <Card
              key={store.id}
              sx={{
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                {/* Store Icon */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    bgcolor: 'primary.light',
                    mb: 2,
                  }}
                >
                  <StoreIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                </Box>

                {/* Store Name */}
                <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
                  {store.name}
                </Typography>

                {/* Store Info */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                    <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {store.owner}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Inventory sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {store.productCount || 0} products
                    </Typography>
                  </Box>
                </Box>

                {/* View Store Button */}
                <Button
                  variant="contained"
                  fullWidth
                  endIcon={<ArrowForward />}
                  component={Link}
                  to={`${ROUTES.MARKETPLACE}?id=${store.id}`}
                >
                  View Store
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};