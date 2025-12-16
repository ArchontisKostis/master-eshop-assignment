import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useRouteError, Link, isRouteErrorResponse } from 'react-router-dom';
import { Home, Refresh } from '@mui/icons-material';
import { ROUTES } from '../../constants/routes';

export const ErrorBoundary: React.FC = () => {
  const error = useRouteError();
  
  let errorMessage: string;
  let errorStatus: number | undefined;

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorMessage = error.statusText || error.data?.message || 'An error occurred';
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else {
    errorMessage = 'An unexpected error occurred';
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 4,
        background: 'linear-gradient(135deg, #ffebee 0%, #fce4ec 100%)',
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '3rem', md: '5rem' },
              fontWeight: 700,
              background: 'linear-gradient(45deg, #f44336 30%, #e91e63 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            {errorStatus || 'Oops!'}
          </Typography>
          
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight={700}
            color="text.primary"
          >
            Something went wrong
          </Typography>
          
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
          >
            {errorMessage}
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
              startIcon={<Refresh />}
              onClick={() => window.location.reload()}
              sx={{ px: 4 }}
            >
              Refresh Page
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};