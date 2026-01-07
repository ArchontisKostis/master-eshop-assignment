package uom.eshop.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import uom.eshop.backend.dto.AddProductRequest;
import uom.eshop.backend.dto.ProductResponse;
import uom.eshop.backend.dto.ProductSearchRequest;
import uom.eshop.backend.dto.UpdateProductStockRequest;
import uom.eshop.backend.service.ProductService;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping("/recommendations")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<ProductResponse>> getRecommendations(
            @RequestParam(defaultValue = "10") int limit,
            Authentication authentication) {
        List<ProductResponse> recommendations = productService.getRecommendedProducts(authentication, limit);
        return ResponseEntity.ok(recommendations);
    }

    @PostMapping
    @PreAuthorize("hasRole('STORE')")
    public ResponseEntity<ProductResponse> addProduct(
            @Valid @RequestBody AddProductRequest request,
            Authentication authentication) {
        ProductResponse response = productService.addProduct(request, authentication);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('STORE')")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody AddProductRequest request,
            Authentication authentication) {
        ProductResponse response = productService.updateProduct(id, request, authentication);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/stock")
    @PreAuthorize("hasRole('STORE')")
    public ResponseEntity<ProductResponse> updateProductStock(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProductStockRequest request,
            Authentication authentication) {
        ProductResponse response = productService.updateProductStock(id, request, authentication);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('STORE')")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable Long id,
            Authentication authentication) {
        productService.deleteProduct(id, authentication);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/store")
    @PreAuthorize("hasRole('STORE')")
    public ResponseEntity<List<ProductResponse>> getStoreProducts(Authentication authentication) {
        List<ProductResponse> products = productService.getStoreProducts(authentication);
        return ResponseEntity.ok(products);
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getProducts(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) java.math.BigDecimal minPrice,
            @RequestParam(required = false) java.math.BigDecimal maxPrice,
            @RequestParam(required = false) Long storeId) {
        
        ProductSearchRequest request = ProductSearchRequest.builder()
                .title(title)
                .type(type)
                .brand(brand)
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .storeId(storeId)
                .build();
        
        List<ProductResponse> products = productService.searchProducts(request);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        ProductResponse response = productService.getProductById(id);
        return ResponseEntity.ok(response);
    }
}