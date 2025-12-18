import React from 'react';
import { Box, Typography, Container } from '@mui/material';

export const AboutPage: React.FC = () => {
  return (
    <Box sx={{ py: 8, px: 4 }}>
      <Container maxWidth="xl">
        <Typography variant="h2" component="h1" gutterBottom>
          About E-Shop
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Learn more about our multi-vendor marketplace platform.
        </Typography>
      </Container>
    </Box>
  );
};