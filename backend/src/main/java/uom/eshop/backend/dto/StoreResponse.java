package uom.eshop.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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