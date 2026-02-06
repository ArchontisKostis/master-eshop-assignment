package uom.eshop.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for representing the response of a checkout operation.
 * This class contains fields for the payment status, transaction ID, a message about the checkout result, and a list of orders that were processed during the checkout.
 */
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