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
import uom.eshop.backend.dto.UpdateProductStockRequest;
import uom.eshop.backend.service.ProductService;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    @PreAuthorize("hasRole('STORE')")
    public ResponseEntity<ProductResponse> addProduct(
            @Valid @RequestBody AddProductRequest request,
            Authentication authentication) {
        ProductResponse response = productService.addProduct(request, authentication);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
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

    @GetMapping("/store")
    @PreAuthorize("hasRole('STORE')")
    public ResponseEntity<List<ProductResponse>> getStoreProducts(Authentication authentication) {
        List<ProductResponse> products = productService.getStoreProducts(authentication);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        ProductResponse response = productService.getProductById(id);
        return ResponseEntity.ok(response);
    }
}