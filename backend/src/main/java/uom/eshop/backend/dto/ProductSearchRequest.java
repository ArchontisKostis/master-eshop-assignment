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
public class ProductSearchRequest {
    
    private String title;
    private String type;
    private String brand;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Long storeId;
}