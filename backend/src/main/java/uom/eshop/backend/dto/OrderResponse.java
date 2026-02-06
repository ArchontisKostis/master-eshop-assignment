package uom.eshop.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for representing an order response.
 * This class contains fields for the order ID, customer details, store details, total price, order date, status, and a list of items in the order.
 * The OrderItemResponse inner class represents individual items in the order, including product details, quantity, price at purchase, and subtotal.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {
    
    private Long orderId;
    private Long customerId;
    private String customerName;
    private Long storeId;
    private String storeName;
    private BigDecimal totalPrice;
    private LocalDateTime orderDate;
    private String status;
    private List<OrderItemResponse> items;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderItemResponse {
        private Long orderItemId;
        private Long productId;
        private String productTitle;
        private String productBrand;
        private Integer quantity;
        private BigDecimal priceAtPurchase;
        private BigDecimal subtotal;
    }
}