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