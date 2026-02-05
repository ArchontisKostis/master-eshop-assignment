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

@RestController
@RequestMapping("/api/stores")
@RequiredArgsConstructor
public class StoreController {

    private final StoreRepository storeRepository;
    private final StoreService storeService;

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

    @GetMapping("/stats")
    @PreAuthorize("hasRole('STORE')")
    public ResponseEntity<StoreStatsResponse> getStoreStats(Authentication authentication) {
        StoreStatsResponse stats = storeService.getStoreStats(authentication);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/orders/recent")
    @PreAuthorize("hasRole('STORE')")
    public ResponseEntity<List<OrderResponse>> getRecentOrders(
            @RequestParam(defaultValue = "10") int limit,
            Authentication authentication) {
        List<OrderResponse> orders = storeService.getRecentStoreOrders(authentication, limit);
        return ResponseEntity.ok(orders);
    }
}