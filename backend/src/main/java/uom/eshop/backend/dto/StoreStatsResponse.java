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
public class StoreStatsResponse {
    
    private Long totalProducts;
    private Long productsInStock;
    private Long productsOutOfStock;
    private Long totalOrders;
    private Long totalOrdersCompleted;
    private Long uniqueCustomers;
    private BigDecimal totalRevenue;
    private Long totalItemsSold;
}