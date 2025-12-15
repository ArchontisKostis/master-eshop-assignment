package uom.eshop.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uom.eshop.backend.dto.AddToCartRequest;
import uom.eshop.backend.dto.CartResponse;
import uom.eshop.backend.model.*;
import uom.eshop.backend.repository.*;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShoppingCartService {

    private final ShoppingCartRepository shoppingCartRepository;
    private final CartItemRepository cartItemRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;

    @Transactional
    public CartResponse addProductToCart(AddToCartRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        
        Customer customer = customerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Customer profile not found"));

        ShoppingCart cart = shoppingCartRepository.findByCustomer(customer)
                .orElseThrow(() -> new RuntimeException("Shopping cart not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Validate stock availability
        if (product.getStockQuantity() < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock. Available: " + product.getStockQuantity());
        }

        // Check if product is already in cart
        CartItem cartItem = cartItemRepository.findByCartAndProduct(cart, product)
                .orElse(null);

        if (cartItem != null) {
            // Update existing cart item
            int newQuantity = cartItem.getQuantity() + request.getQuantity();
            
            if (product.getStockQuantity() < newQuantity) {
                throw new RuntimeException("Insufficient stock. Available: " + product.getStockQuantity() + 
                                         ", In cart: " + cartItem.getQuantity());
            }
            
            cartItem.setQuantity(newQuantity);
            cartItem.calculateSubtotal();
        } else {
            // Create new cart item
            cartItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
            cartItem.calculateSubtotal();
            cart.getItems().add(cartItem);
        }

        cartItemRepository.save(cartItem);
        cart.calculateTotalPrice();
        shoppingCartRepository.save(cart);

        return mapToCartResponse(cart);
    }

    @Transactional(readOnly = true)
    public CartResponse getCart(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        
        Customer customer = customerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Customer profile not found"));

        ShoppingCart cart = shoppingCartRepository.findByCustomer(customer)
                .orElseThrow(() -> new RuntimeException("Shopping cart not found"));

        return mapToCartResponse(cart);
    }

    @Transactional
    public CartResponse updateCartItemQuantity(Long productId, Integer quantity, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        
        Customer customer = customerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Customer profile not found"));

        ShoppingCart cart = shoppingCartRepository.findByCustomer(customer)
                .orElseThrow(() -> new RuntimeException("Shopping cart not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem cartItem = cartItemRepository.findByCartAndProduct(cart, product)
                .orElseThrow(() -> new RuntimeException("Product not in cart"));

        // Validate stock availability
        if (product.getStockQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock. Available: " + product.getStockQuantity());
        }

        cartItem.setQuantity(quantity);
        cartItem.calculateSubtotal();
        cartItemRepository.save(cartItem);

        cart.calculateTotalPrice();
        shoppingCartRepository.save(cart);

        return mapToCartResponse(cart);
    }

    @Transactional
    public CartResponse removeProductFromCart(Long productId, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        
        Customer customer = customerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Customer profile not found"));

        ShoppingCart cart = shoppingCartRepository.findByCustomer(customer)
                .orElseThrow(() -> new RuntimeException("Shopping cart not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem cartItem = cartItemRepository.findByCartAndProduct(cart, product)
                .orElseThrow(() -> new RuntimeException("Product not in cart"));

        cart.getItems().remove(cartItem);
        cartItemRepository.delete(cartItem);

        cart.calculateTotalPrice();
        shoppingCartRepository.save(cart);

        return mapToCartResponse(cart);
    }

    private CartResponse mapToCartResponse(ShoppingCart cart) {
        return CartResponse.builder()
                .cartId(cart.getId())
                .totalPrice(cart.getTotalPrice())
                .items(cart.getItems().stream()
                        .map(this::mapToCartItemResponse)
                        .collect(Collectors.toList()))
                .build();
    }

    private CartResponse.CartItemResponse mapToCartItemResponse(CartItem cartItem) {
        Product product = cartItem.getProduct();
        return CartResponse.CartItemResponse.builder()
                .cartItemId(cartItem.getId())
                .productId(product.getId())
                .productTitle(product.getTitle())
                .productBrand(product.getBrand())
                .productPrice(product.getPrice())
                .quantity(cartItem.getQuantity())
                .subtotal(cartItem.getSubtotal())
                .storeId(product.getStore().getId())
                .storeName(product.getStore().getName())
                .availableStock(product.getStockQuantity())
                .build();
    }
}