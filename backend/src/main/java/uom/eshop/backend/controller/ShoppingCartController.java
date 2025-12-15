package uom.eshop.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import uom.eshop.backend.dto.AddToCartRequest;
import uom.eshop.backend.dto.CartResponse;
import uom.eshop.backend.service.ShoppingCartService;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CUSTOMER')")
public class ShoppingCartController {

    private final ShoppingCartService shoppingCartService;

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addToCart(
            @Valid @RequestBody AddToCartRequest request,
            Authentication authentication) {
        CartResponse response = shoppingCartService.addProductToCart(request, authentication);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart(Authentication authentication) {
        CartResponse response = shoppingCartService.getCart(authentication);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/items/{productId}")
    public ResponseEntity<CartResponse> updateCartItem(
            @PathVariable Long productId,
            @RequestParam Integer quantity,
            Authentication authentication) {
        
        if (quantity < 1) {
            throw new RuntimeException("Quantity must be at least 1");
        }
        
        CartResponse response = shoppingCartService.updateCartItemQuantity(productId, quantity, authentication);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<CartResponse> removeFromCart(
            @PathVariable Long productId,
            Authentication authentication) {
        CartResponse response = shoppingCartService.removeProductFromCart(productId, authentication);
        return ResponseEntity.ok(response);
    }
}