import React from 'react';
import { Box, Typography } from '@mui/material';
import type { SvgIconComponent } from '@mui/icons-material';

interface StatCardProps {
  icon: SvgIconComponent;
  value: string;
  label: string;
  iconColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  value,
  label,
  iconColor = 'primary.main',
}) => {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Icon sx={{ fontSize: 48, color: iconColor, mb: 1 }} />
      <Typography variant="h3" color={iconColor} fontWeight={700}>
        {value}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
};