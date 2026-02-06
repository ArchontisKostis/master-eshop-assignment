package uom.eshop.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for updating the stock quantity of a product.
 * This class contains a field for the new stock quantity, along with validation annotations to ensure that the quantity is provided and is not negative.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateProductStockRequest {
    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity cannot be negative")
    private Integer stockQuantity;

}