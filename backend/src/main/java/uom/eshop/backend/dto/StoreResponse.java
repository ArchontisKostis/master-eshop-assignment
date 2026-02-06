package uom.eshop.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for representing a store response.
 * This class contains fields for the store's ID, name, owner, and the count of products available in the store.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoreResponse {
    
    private Long id;
    private String name;
    private String owner;
    private Integer productCount;
}