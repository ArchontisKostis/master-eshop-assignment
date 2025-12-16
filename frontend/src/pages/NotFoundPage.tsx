import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { Home, Search } from '@mui/icons-material';
import { ROUTES } from '../constants/routes';

export const NotFoundPage: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 4,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '4rem', md: '6rem' },
              fontWeight: 700,
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            404
          </Typography>
          
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight={700}
            color="text.primary"
          >
            Page Not Found
          </Typography>
          
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
          >
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </Typography>
          
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<Home />}
              component={Link}
              to={ROUTES.HOME}
              sx={{ px: 4 }}
            >
              Go to Home
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              startIcon={<Search />}
              component={Link}
              to={ROUTES.STORES}
              sx={{ px: 4 }}
            >
              Browse Stores
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};