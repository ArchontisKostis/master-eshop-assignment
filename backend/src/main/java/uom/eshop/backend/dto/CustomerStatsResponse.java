package uom.eshop.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerStatsResponse {
    
    private Integer itemsInCart;
    private BigDecimal cartTotalPrice;
    private Long totalOrders;
    private Long totalOrdersCompleted;
    private Long uniqueStoresPurchasedFrom;
    private BigDecimal totalAmountSpent;
    private Long totalItemsPurchased;
}