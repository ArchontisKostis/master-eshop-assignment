import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import type { SvgIconComponent } from '@mui/icons-material';

interface FeatureCardProps {
  icon: SvgIconComponent;
  title: string;
  description: string;
  iconColor?: string;
  iconBgColor?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  iconColor = 'primary.main',
  iconBgColor = 'primary.light',
}) => {
  return (
    <Card
      sx={{
        height: '100%',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: 6,
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            borderRadius: 2,
            bgcolor: iconBgColor,
            mb: 2,
          }}
        >
          <Icon sx={{ fontSize: 32, color: iconColor }} />
        </Box>
        <Typography variant="h5" component="h3" gutterBottom fontWeight={600}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};