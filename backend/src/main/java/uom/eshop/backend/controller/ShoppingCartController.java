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
import uom.eshop.backend.exceptions.BadRequestException;
import uom.eshop.backend.service.ShoppingCartService;

/**
 * Controller for handling shopping cart-related endpoints.
 * This controller provides endpoints for customers to manage their shopping cart, including adding items, viewing the cart, updating item quantities, and removing items.
 */
@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CUSTOMER')")
public class ShoppingCartController {

    private final ShoppingCartService shoppingCartService;

    /**
     * Endpoint for adding a product to the shopping cart.
     * This endpoint accepts an AddToCartRequest containing the product ID and quantity, and returns a CartResponse with the updated cart details.
     *
     * @param request the AddToCartRequest containing the product ID and quantity to add to the cart
     * @param authentication the authentication object containing the authenticated user's details
     * @return ResponseEntity containing the CartResponse with the updated cart details, with HTTP status 201 Created
     */
    @PostMapping("/items")
    public ResponseEntity<CartResponse> addToCart(
            @Valid @RequestBody AddToCartRequest request,
            Authentication authentication) {

        CartResponse response = shoppingCartService
                .addProductToCart(request, authentication);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    /**
     * Endpoint for retrieving the current shopping cart details for the authenticated customer.
     * This endpoint returns a CartResponse containing the items in the cart, total price, and other relevant information.
     *
     * @param authentication the authentication object containing the authenticated user's details
     * @return ResponseEntity containing the CartResponse with the current cart details
     */
    @GetMapping
    public ResponseEntity<CartResponse> getCart(Authentication authentication) {
        CartResponse response = shoppingCartService.getCart(authentication);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint for updating the quantity of a specific product in the shopping cart.
     * This endpoint accepts the product ID as a path variable and the new quantity as a request parameter, and returns a CartResponse with the updated cart details.
     *
     * @param productId the ID of the product to update in the cart
     * @param quantity the new quantity for the specified product (must be at least 1)
     * @param authentication the authentication object containing the authenticated user's details
     * @return ResponseEntity containing the CartResponse with the updated cart details
     * @throws BadRequestException if the provided quantity is less than 1
     */
    @PutMapping("/items/{productId}")
    public ResponseEntity<CartResponse> updateCartItem(
            @PathVariable Long productId,
            @RequestParam Integer quantity,
            Authentication authentication) {

        if (quantity < 1) {
            throw new BadRequestException("Quantity must be at least 1");
        }
        
        CartResponse response = shoppingCartService.updateCartItemQuantity(productId, quantity, authentication);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint for removing a specific product from the shopping cart.
     * This endpoint accepts the product ID as a path variable and returns a CartResponse with the updated cart details after the item has been removed.
     *
     * @param productId the ID of the product to remove from the cart
     * @param authentication the authentication object containing the authenticated user's details
     * @return ResponseEntity containing the CartResponse with the updated cart details after item removal
     */
    @DeleteMapping("/items/{productId}")
    public ResponseEntity<CartResponse> removeFromCart(
            @PathVariable Long productId,
            Authentication authentication) {
        CartResponse response = shoppingCartService.removeProductFromCart(productId, authentication);
        return ResponseEntity.ok(response);
    }
}