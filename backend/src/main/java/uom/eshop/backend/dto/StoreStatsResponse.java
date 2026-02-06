package uom.eshop.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for representing store statistics response.
 * This class contains fields for various statistics related to a store, including total products, products in stock, products out of stock, total orders, completed orders, unique customers, total revenue, and total items sold. It is used to transfer store statistics data from the backend to the frontend in a structured format.
 */
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