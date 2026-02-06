package uom.eshop.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for representing customer statistics.
 * This class contains fields for various statistics related to a customer's shopping behavior, including the number of items in the cart, total price of the cart, total orders, completed orders, unique stores purchased from, total amount spent, and total items purchased.
 */
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