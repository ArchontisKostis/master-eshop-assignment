package uom.eshop.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uom.eshop.backend.dto.CustomerStatsResponse;
import uom.eshop.backend.service.CustomerService;

/**
 * Controller for handling customer-related endpoints.
 * This controller provides an endpoint for retrieving customer statistics, which is accessible only to users with the CUSTOMER role.
 */
@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    /**
     * Endpoint for retrieving customer statistics.
     * This endpoint is accessible only to users with the CUSTOMER role.
     *
     * @param authentication the authentication object containing the authenticated user's details
     * @return ResponseEntity containing the CustomerStatsResponse with customer statistics
     */
    @GetMapping("/stats")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<CustomerStatsResponse> getCustomerStats(Authentication authentication) {
        CustomerStatsResponse stats = customerService.getCustomerStats(authentication);
        return ResponseEntity.ok(stats);
    }
}