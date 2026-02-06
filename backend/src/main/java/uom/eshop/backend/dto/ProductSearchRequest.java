package uom.eshop.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for representing a product search request.
 * This class contains fields for the search criteria, including the product title, type, brand, minimum price, maximum price, and store ID. It is used to transfer search parameters from the frontend to the backend when searching for products.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSearchRequest {
    
    private String title;
    private String type;
    private String brand;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Long storeId;
}