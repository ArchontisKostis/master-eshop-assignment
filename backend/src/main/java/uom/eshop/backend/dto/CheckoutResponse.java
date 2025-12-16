package uom.eshop.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckoutResponse {
    
    private String paymentStatus;
    private String transactionId;
    private String message;
    private List<OrderResponse> orders;
}