import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { Home, Lock } from '@mui/icons-material';
import { ROUTES } from '../constants/routes';

export const UnauthorizedPage: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 4,
        background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 120,
              height: 120,
              borderRadius: '50%',
              bgcolor: 'warning.light',
              mb: 3,
            }}
          >
            <Lock sx={{ fontSize: 60, color: 'warning.main' }} />
          </Box>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '4rem', md: '6rem' },
              fontWeight: 700,
              background: 'linear-gradient(45deg, #ff9800 30%, #ffa726 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            403
          </Typography>
          
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight={700}
            color="text.primary"
          >
            Access Denied
          </Typography>
          
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
          >
            You don't have permission to access this page.
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
          </Box>
        </Box>
      </Container>
    </Box>
  );
};