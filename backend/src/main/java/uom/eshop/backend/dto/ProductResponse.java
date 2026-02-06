package uom.eshop.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for representing a product response.
 * This class contains fields for the product's ID, title, type, brand, description, price, stock quantity, store ID, and store name. It is used to transfer product data from the backend to the frontend in a structured format.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {
    
    private Long id;
    private String title;
    private String type;
    private String brand;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    private Long storeId;
    private String storeName;
}