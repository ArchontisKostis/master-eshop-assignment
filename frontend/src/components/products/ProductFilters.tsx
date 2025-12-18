import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Popover,
  Typography,
  IconButton,
  Badge,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { FilterList, Clear } from '@mui/icons-material';
import type { GetProductsParams } from '../../api/generated.schemas';

interface ProductFiltersProps {
  filters: GetProductsParams;
  onFilterChange: (filters: GetProductsParams) => void;
  onClearFilters: () => void;
  availableBrands: string[];
  availableStores?: { id: number; name: string }[];
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  availableBrands,
  availableStores = [],
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [customBrand, setCustomBrand] = useState('');
  const [showCustomBrand, setShowCustomBrand] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleInputChange = (field: keyof GetProductsParams, value: string) => {
    const newFilters = { ...filters };
    
    if (field === 'minPrice' || field === 'maxPrice') {
      const numValue = value === '' ? undefined : parseFloat(value);
      newFilters[field] = numValue as any;
    } else if (field === 'storeId') {
      const numValue = value === '' ? undefined : parseInt(value);
      newFilters[field] = numValue as any;
    } else {
      newFilters[field] = (value === '' ? undefined : value) as any;
    }
    
    onFilterChange(newFilters);
  };

  const handleBrandChange = (value: string) => {
    if (value === '__other__') {
      setShowCustomBrand(true);
      setCustomBrand('');
      handleInputChange('brand', '');
    } else {
      setShowCustomBrand(false);
      setCustomBrand('');
      handleInputChange('brand', value);
    }
  };

  const handleCustomBrandChange = (value: string) => {
    setCustomBrand(value);
    handleInputChange('brand', value);
  };

  // Count active filters (excluding storeId)
  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => key !== 'storeId' && value !== undefined && value !== ''
  ).length;

  return (
    <>
      <IconButton
        onClick={handleClick}
        color="primary"
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        <Badge badgeContent={activeFilterCount} color="primary">
          <FilterList />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ p: 3, minWidth: 400 }}>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Filter Products
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Search by Title */}
            <TextField
              label="Search by Title"
              value={filters.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              fullWidth
              size="small"
              placeholder="Enter product name..."
            />

            {/* Filter by Store (only if stores provided) */}
            {availableStores.length > 0 && (
              <FormControl fullWidth size="small">
                <InputLabel>Store</InputLabel>
                <Select
                  value={filters.storeId?.toString() || ''}
                  onChange={(e) => handleInputChange('storeId', e.target.value)}
                  label="Store"
                >
                  <MenuItem value="">
                    <em>All Stores</em>
                  </MenuItem>
                  {availableStores.map((store) => (
                    <MenuItem key={store.id} value={store.id.toString()}>
                      {store.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {/* Filter by Type */}
            <TextField
              label="Product Type"
              value={filters.type || ''}
              onChange={(e) => handleInputChange('type', e.target.value)}
              fullWidth
              size="small"
              placeholder="e.g., Electronics"
            />

            {/* Filter by Brand */}
            <FormControl fullWidth size="small">
              <InputLabel>Brand</InputLabel>
              <Select
                value={showCustomBrand ? '__other__' : (filters.brand || '')}
                onChange={(e) => handleBrandChange(e.target.value)}
                label="Brand"
              >
                <MenuItem value="">
                  <em>All Brands</em>
                </MenuItem>
                {availableBrands.map((brand) => (
                  <MenuItem key={brand} value={brand}>
                    {brand}
                  </MenuItem>
                ))}
                <MenuItem value="__other__">
                  <em>Other (Specify)</em>
                </MenuItem>
              </Select>
            </FormControl>

            {/* Custom Brand Input (shown when "Other" is selected) */}
            {showCustomBrand && (
              <TextField
                label="Specify Brand"
                value={customBrand}
                onChange={(e) => handleCustomBrandChange(e.target.value)}
                fullWidth
                size="small"
                placeholder="Enter brand name..."
                autoFocus
              />
            )}

            {/* Price Range */}
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Price Range
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Min"
                  type="number"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleInputChange('minPrice', e.target.value)}
                  fullWidth
                  size="small"
                  inputProps={{ min: 0, step: 0.01 }}
                />
                <TextField
                  label="Max"
                  type="number"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                  fullWidth
                  size="small"
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Button
                variant="outlined"
                startIcon={<Clear />}
                onClick={() => {
                  onClearFilters();
                  setShowCustomBrand(false);
                  setCustomBrand('');
                  handleClose();
                }}
                fullWidth
              >
                Clear
              </Button>
              <Button
                variant="contained"
                onClick={handleClose}
                fullWidth
              >
                Apply
              </Button>
            </Box>
          </Box>
        </Box>
      </Popover>
    </>
  );
};