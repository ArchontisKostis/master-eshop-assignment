import React from 'react';
import { Box, Typography, Container } from '@mui/material';

export const StoresPage: React.FC = () => {
  return (
    <Box sx={{ py: 8, px: 4 }}>
      <Container maxWidth="xl">
        <Typography variant="h2" component="h1" gutterBottom>
          Stores
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover trusted sellers and explore their product offerings.
        </Typography>
      </Container>
    </Box>
  );
};