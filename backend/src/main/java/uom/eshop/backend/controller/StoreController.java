package uom.eshop.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import uom.eshop.backend.dto.OrderResponse;
import uom.eshop.backend.dto.StoreResponse;
import uom.eshop.backend.dto.StoreStatsResponse;
import uom.eshop.backend.exceptions.NotFoundException;
import uom.eshop.backend.model.Store;
import uom.eshop.backend.repository.StoreRepository;
import uom.eshop.backend.service.StoreService;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Controller for handling store-related endpoints.
 * This controller provides endpoints for retrieving store information, store statistics, and recent orders for store owners.
 */
@RestController
@RequestMapping("/api/stores")
@RequiredArgsConstructor
public class StoreController {

    private final StoreRepository storeRepository;
    private final StoreService storeService;

    /**
     * Endpoint for retrieving a list of all stores.
     * This endpoint returns a list of StoreResponse objects containing basic information about each store, including the number of products they have.
     *
     * @return ResponseEntity containing a list of StoreResponse objects representing all stores
     */
    @GetMapping
    public ResponseEntity<List<StoreResponse>> getAllStores() {
        List<Store> stores = storeRepository.findAll();
        
        List<StoreResponse> response = stores.stream()
                .map(store -> StoreResponse.builder()
                        .id(store.getId())
                        .name(store.getName())
                        .owner(store.getOwner())
                        .productCount(store.getProducts() != null ? store.getProducts().size() : 0)
                        .build())
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint for retrieving details of a specific store by its ID.
     * This endpoint returns a StoreResponse object containing basic information about the store, including the number of products it has.
     *
     * @param id the ID of the store to retrieve
     * @return ResponseEntity containing a StoreResponse object representing the store with the specified ID
     * @throws NotFoundException if no store with the specified ID is found
     */
    @GetMapping("/{id}")
    public ResponseEntity<StoreResponse> getStoreById(@PathVariable Long id) {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Store not found"));
        
        StoreResponse response = StoreResponse.builder()
                .id(store.getId())
                .name(store.getName())
                .owner(store.getOwner())
                .productCount(store.getProducts() != null ? store.getProducts().size() : 0)
                .build();
        
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint for retrieving statistics related to the authenticated store owner.
     * This endpoint is accessible only to users with the STORE role and returns a StoreStatsResponse containing various statistics about the store, such as total sales, number of orders, and average order value.
     *
     * @param authentication the authentication object containing the authenticated user's details
     * @return ResponseEntity containing the StoreStatsResponse with store statistics
     */
    @GetMapping("/stats")
    @PreAuthorize("hasRole('STORE')")
    public ResponseEntity<StoreStatsResponse> getStoreStats(Authentication authentication) {
        StoreStatsResponse stats = storeService.getStoreStats(authentication);
        return ResponseEntity.ok(stats);
    }

    /**
     * Endpoint for retrieving recent orders related to the authenticated store owner.
     * This endpoint is accessible only to users with the STORE role and returns a list of OrderResponse objects representing the most recent orders associated with the store owned by the authenticated user.
     *
     * @param limit the maximum number of recent orders to retrieve (default is 10)
     * @param authentication the authentication object containing the authenticated user's details
     * @return ResponseEntity containing a list of OrderResponse objects representing recent orders related to the store
     */
    @GetMapping("/orders/recent")
    @PreAuthorize("hasRole('STORE')")
    public ResponseEntity<List<OrderResponse>> getRecentOrders(
            @RequestParam(defaultValue = "10") int limit,
            Authentication authentication) {
        List<OrderResponse> orders = storeService.getRecentStoreOrders(authentication, limit);
        return ResponseEntity.ok(orders);
    }
}