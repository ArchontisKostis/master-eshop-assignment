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

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<CustomerStatsResponse> getCustomerStats(Authentication authentication) {
        CustomerStatsResponse stats = customerService.getCustomerStats(authentication);
        return ResponseEntity.ok(stats);
    }
}