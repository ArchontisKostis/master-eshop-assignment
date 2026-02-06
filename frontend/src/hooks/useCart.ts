import { useState, useEffect, useCallback } from 'react';
import { getShoppingCartController } from '../api/shopping-cart-controller/shopping-cart-controller';
import type { CartResponse, CartItemResponse } from '../api/generated.schemas';
import { getApiError } from '../api/api-error';
import { parseJsonFromBlob } from '../api/blob-utils';

/**
 * Custom hook for cart management
 * Provides cart data and item count
 */
export const useCart = () => {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const cartController = getShoppingCartController();
      const response = await cartController.getCart();
      const cartData = await parseJsonFromBlob<CartResponse | null>(response.data);
      setCart(cartData);

      // Calculate total item count
      const count =
        (cartData?.items ?? []).reduce((sum: number, item: CartItemResponse) => {
          return sum + (item.quantity || 0);
        }, 0) || 0;
      setItemCount(count);
    } catch (err) {
      const apiError = getApiError(err);

      // If the backend reports "cart not found", treat it as an empty cart without noisy logging
      if (apiError?.status === 404 && apiError.code === 'NotFoundException') {
        setCart(null);
        setItemCount(0);
      } else {
        console.error('Fetch cart error:', err);
        setCart(null);
        setItemCount(0);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    cart,
    itemCount,
    loading,
    refreshCart: fetchCart,
  };
};