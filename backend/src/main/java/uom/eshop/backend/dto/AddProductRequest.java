package uom.eshop.backend.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddProductRequest {
    
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;
    
    @NotBlank(message = "Product type is required")
    @Size(max = 100, message = "Type must not exceed 100 characters")
    private String type;
    
    @NotBlank(message = "Brand is required")
    @Size(max = 100, message = "Brand must not exceed 100 characters")
    private String brand;
    
    @NotBlank(message = "Description is required")
    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;
    
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    @Digits(integer = 10, fraction = 2, message = "Price must have at most 10 integer digits and 2 decimal places")
    private BigDecimal price;
    
    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity cannot be negative")
    private Integer stockQuantity;
}