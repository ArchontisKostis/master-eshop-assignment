import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Divider,
  CircularProgress,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Alert,
  InputAdornment,
} from '@mui/material';
import {
  Payment,
  LocalShipping,
  CheckCircle,
  ArrowBack,
  CreditCard,
  Person,
  CalendarMonth,
  Lock,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getOrderController } from '../api/order-controller/order-controller';
import { useCart } from '../hooks/useCart';
import { useToast } from '../contexts/ToastContext';
import { ROUTES } from '../constants/routes';

const steps = ['Review Cart', 'Payment Details', 'Complete Order'];

export const CheckoutPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { cart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Payment form state (mock - not sent to backend)
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentDetails({
      ...paymentDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    if (activeStep === 0) {
      navigate(ROUTES.CART);
    } else {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  const handleCompleteOrder = async () => {
    setLoading(true);

    try {
      // Show "Processing payment..." message
      showToast('Processing payment...', 'info');
      
      // Add delay to simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const orderController = getOrderController();
      await orderController.completeOrder();
      
      setActiveStep(2); // Success step
      showToast('Payment successful! Order placed.', 'success');
      
      // Redirect to orders page after 2 seconds
      setTimeout(() => {
        navigate(ROUTES.ORDERS);
      }, 2000);
    } catch (err) {
      showToast('Payment failed. Please try again.', 'error');
      console.error('Complete order error:', err);
    } finally {
      setLoading(false);
    }
  };

  const isEmpty = !cart?.items || cart.items.length === 0;

  // Group items by store
  const groupedItems = React.useMemo(() => {
    if (!cart?.items) return {};
    
    const groups: Record<number, typeof cart.items> = {};
    cart.items.forEach(item => {
      const storeId = item.storeId || 0;
      if (!groups[storeId]) {
        groups[storeId] = [];
      }
      groups[storeId].push(item);
    });
    
    return groups;
  }, [cart]);

  if (isEmpty) {
    return (
      <Box>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Your cart is empty. Add items before checking out.
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate(ROUTES.MARKETPLACE)}
        >
          Go to Marketplace
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
          Checkout
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Complete your purchase
        </Typography>
      </Box>

      {/* Stepper */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Main Content */}
        <Box sx={{ flex: 1 }}>
          {/* Step 0: Review Cart */}
          {activeStep === 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Review Your Order
                </Typography>

                {Object.entries(groupedItems).map(([storeId, items]) => {
                  const storeName = items[0].storeName || 'Unknown Store';

                  return (
                    <Box key={storeId} sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        From: {storeName}
                      </Typography>
                      {items.map((item) => (
                        <Box
                          key={item.cartItemId}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            py: 1,
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                          }}
                        >
                          <Box>
                            <Typography variant="body2">{item.productTitle}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Qty: {item.quantity} × ${item.productPrice?.toFixed(2)}
                            </Typography>
                          </Box>
                          <Typography variant="body2" fontWeight={600}>
                            ${item.subtotal?.toFixed(2)}
                          </Typography>
                        </Box>
                      ))}
                      <Divider sx={{ my: 1 }} />
                    </Box>
                  );
                })}

                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleNext}
                  sx={{ mt: 2 }}
                >
                  Continue to Payment
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 1: Payment Details */}
          {activeStep === 1 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
                  Payment Information
                </Typography>

                {/* Mock Credit Card Visual */}
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    mb: 4,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: 3,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                    <CreditCard sx={{ fontSize: 40 }} />
                    <Typography variant="h6">DEMO BANK</Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{ mb: 2, letterSpacing: 2, fontFamily: 'monospace' }}
                  >
                    {paymentDetails.cardNumber || '•••• •••• •••• ••••'}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        CARDHOLDER
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {paymentDetails.cardName || 'YOUR NAME'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        EXPIRES
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {paymentDetails.expiryDate || 'MM/YY'}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <TextField
                    label="Card Number"
                    name="cardNumber"
                    value={paymentDetails.cardNumber}
                    onChange={handleInputChange}
                    fullWidth
                    placeholder="1234 5678 9012 3456"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CreditCard color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    label="Cardholder Name"
                    name="cardName"
                    value={paymentDetails.cardName}
                    onChange={handleInputChange}
                    fullWidth
                    placeholder="JOHN DOE"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      label="Expiry Date"
                      name="expiryDate"
                      value={paymentDetails.expiryDate}
                      onChange={handleInputChange}
                      fullWidth
                      placeholder="MM/YY"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarMonth color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      label="CVV"
                      name="cvv"
                      value={paymentDetails.cvv}
                      onChange={handleInputChange}
                      fullWidth
                      placeholder="123"
                      type="password"
                      inputProps={{ maxLength: 3 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleCompleteOrder}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <Payment />}
                    sx={{ mt: 2 }}
                  >
                    {loading ? 'Processing...' : 'Complete Order'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Success */}
          {activeStep === 2 && (
            <Card>
              <CardContent>
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                  <Typography variant="h5" gutterBottom fontWeight={700}>
                    Order Placed Successfully!
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Thank you for your purchase. Redirecting to orders...
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Back Button */}
          {activeStep < 2 && (
            <Button
              startIcon={<ArrowBack />}
              onClick={handleBack}
              sx={{ mt: 2 }}
            >
              {activeStep === 0 ? 'Back to Cart' : 'Back'}
            </Button>
          )}
        </Box>

        {/* Order Summary Sidebar */}
        <Box sx={{ width: { xs: '100%', md: 350 }, flexShrink: 0 }}>
          <Paper sx={{ p: 3, position: 'sticky', top: 88 }}>
            <Typography variant="h6" gutterBottom fontWeight={700}>
              Order Summary
            </Typography>

            <Box sx={{ my: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">
                  Items ({cart?.items?.length || 0}):
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  ${cart?.totalPrice?.toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Shipping:</Typography>
                <Typography variant="body2" color="success.main" fontWeight={600}>
                  FREE
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" fontWeight={700}>
                  Total:
                </Typography>
                <Typography variant="h6" fontWeight={700} color="primary.main">
                  ${cart?.totalPrice?.toFixed(2)}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                bgcolor: 'info.light',
                p: 2,
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <LocalShipping color="info" />
                <Typography variant="body2" fontWeight={600}>
                  Estimated Delivery
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                3-5 business days
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};