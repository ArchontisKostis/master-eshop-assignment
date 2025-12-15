package uom.eshop.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartResponse {
    
    private Long cartId;
    private List<CartItemResponse> items;
    private BigDecimal totalPrice;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CartItemResponse {
        private Long cartItemId;
        private Long productId;
        private String productTitle;
        private String productBrand;
        private BigDecimal productPrice;
        private Integer quantity;
        private BigDecimal subtotal;
        private Long storeId;
        private String storeName;
        private Integer availableStock;
    }
}