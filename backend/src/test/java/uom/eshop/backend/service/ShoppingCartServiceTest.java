package uom.eshop.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import uom.eshop.backend.dto.AddToCartRequest;
import uom.eshop.backend.dto.CartResponse;
import uom.eshop.backend.exceptions.InsufficientStockException;
import uom.eshop.backend.model.*;
import uom.eshop.backend.repository.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ShoppingCartService Tests")
class ShoppingCartServiceTest {

    @Mock
    private ShoppingCartRepository shoppingCartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private ShoppingCartService shoppingCartService;

    private User mockCustomerUser;
    private Customer mockCustomer;
    private ShoppingCart mockCart;
    private Product mockProduct;
    private Store mockStore;

    @BeforeEach
    void setUp() {
        mockCustomerUser = User.builder()
                .id(1L)
                .username("johndoe")
                .email("john@example.com")
                .role(Role.CUSTOMER)
                .build();

        mockCustomer = Customer.builder()
                .id(1L)
                .taxId("123456789")
                .firstName("John")
                .lastName("Doe")
                .user(mockCustomerUser)
                .build();

        mockStore = Store.builder()
                .id(1L)
                .name("Tech Store")
                .build();

        mockProduct = Product.builder()
                .id(1L)
                .title("iPhone 15 Pro")
                .brand("Apple")
                .price(new BigDecimal("999.99"))
                .stockQuantity(50)
                .store(mockStore)
                .build();

        mockCart = ShoppingCart.builder()
                .id(1L)
                .customer(mockCustomer)
                .items(new ArrayList<>())
                .totalPrice(BigDecimal.ZERO)
                .build();

        when(authentication.getPrincipal()).thenReturn(mockCustomerUser);
    }

    @Test
    @DisplayName("Should successfully add product to cart")
    void testAddProductToCart_Success() {
        // Arrange
        AddToCartRequest request = AddToCartRequest.builder()
                .productId(1L)
                .quantity(2)
                .build();

        when(customerRepository.findByUser(mockCustomerUser)).thenReturn(Optional.of(mockCustomer));
        when(shoppingCartRepository.findByCustomer(mockCustomer)).thenReturn(Optional.of(mockCart));
        when(productRepository.findById(1L)).thenReturn(Optional.of(mockProduct));
        when(cartItemRepository.findByCartAndProduct(mockCart, mockProduct)).thenReturn(Optional.empty());
        when(cartItemRepository.save(any(CartItem.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(shoppingCartRepository.save(any(ShoppingCart.class))).thenReturn(mockCart);

        // Act
        CartResponse result = shoppingCartService.addProductToCart(request, authentication);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getCartId());
        verify(cartItemRepository).save(any(CartItem.class));
        verify(shoppingCartRepository).save(mockCart);
    }

    @Test
    @DisplayName("Should throw exception when insufficient stock")
    void testAddProductToCart_InsufficientStock() {
        // Arrange
        AddToCartRequest request = new AddToCartRequest(1L, 100); // More than available
        
        when(customerRepository.findByUser(mockCustomerUser)).thenReturn(Optional.of(mockCustomer));
        when(shoppingCartRepository.findByCustomer(mockCustomer)).thenReturn(Optional.of(mockCart));
        when(productRepository.findById(1L)).thenReturn(Optional.of(mockProduct));

        // Act & Assert
        InsufficientStockException exception = assertThrows(InsufficientStockException.class,
            () -> shoppingCartService.addProductToCart(request, authentication));
        
        assertTrue(exception.getMessage().contains("Insufficient stock"));
        verify(cartItemRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should merge quantity when adding existing product to cart")
    void testAddProductToCart_MergeQuantity() {
        // Arrange
        AddToCartRequest request = new AddToCartRequest(1L, 2);
        
        CartItem existingItem = CartItem.builder()
                .id(1L)
                .cart(mockCart)
                .product(mockProduct)
                .quantity(3)
                .subtotal(new BigDecimal("2999.97"))
                .build();

        when(customerRepository.findByUser(mockCustomerUser)).thenReturn(Optional.of(mockCustomer));
        when(shoppingCartRepository.findByCustomer(mockCustomer)).thenReturn(Optional.of(mockCart));
        when(productRepository.findById(1L)).thenReturn(Optional.of(mockProduct));
        when(cartItemRepository.findByCartAndProduct(mockCart, mockProduct)).thenReturn(Optional.of(existingItem));
        when(cartItemRepository.save(any(CartItem.class))).thenReturn(existingItem);
        when(shoppingCartRepository.save(any(ShoppingCart.class))).thenReturn(mockCart);

        // Act
        CartResponse result = shoppingCartService.addProductToCart(request, authentication);

        // Assert
        assertNotNull(result);
        assertEquals(5, existingItem.getQuantity()); // 3 + 2
        verify(cartItemRepository).save(existingItem);
    }

    @Test
    @DisplayName("Should successfully get cart")
    void testGetCart_Success() {
        // Arrange
        when(customerRepository.findByUser(mockCustomerUser)).thenReturn(Optional.of(mockCustomer));
        when(shoppingCartRepository.findByCustomer(mockCustomer)).thenReturn(Optional.of(mockCart));

        // Act
        CartResponse result = shoppingCartService.getCart(authentication);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getCartId());
        verify(shoppingCartRepository).findByCustomer(mockCustomer);
    }

    @Test
    @DisplayName("Should successfully update cart item quantity")
    void testUpdateCartItemQuantity_Success() {
        // Arrange
        CartItem existingItem = CartItem.builder()
                .id(1L)
                .cart(mockCart)
                .product(mockProduct)
                .quantity(2)
                .build();

        when(customerRepository.findByUser(mockCustomerUser)).thenReturn(Optional.of(mockCustomer));
        when(shoppingCartRepository.findByCustomer(mockCustomer)).thenReturn(Optional.of(mockCart));
        when(productRepository.findById(1L)).thenReturn(Optional.of(mockProduct));
        when(cartItemRepository.findByCartAndProduct(mockCart, mockProduct)).thenReturn(Optional.of(existingItem));
        when(cartItemRepository.save(any(CartItem.class))).thenReturn(existingItem);
        when(shoppingCartRepository.save(any(ShoppingCart.class))).thenReturn(mockCart);

        // Act
        CartResponse result = shoppingCartService.updateCartItemQuantity(1L, 5, authentication);

        // Assert
        assertNotNull(result);
        assertEquals(5, existingItem.getQuantity());
        verify(cartItemRepository).save(existingItem);
    }

    @Test
    @DisplayName("Should throw exception when updating with insufficient stock")
    void testUpdateCartItemQuantity_InsufficientStock() {
        // Arrange
        CartItem existingItem = CartItem.builder()
                .id(1L)
                .cart(mockCart)
                .product(mockProduct)
                .quantity(2)
                .build();

        when(customerRepository.findByUser(mockCustomerUser)).thenReturn(Optional.of(mockCustomer));
        when(shoppingCartRepository.findByCustomer(mockCustomer)).thenReturn(Optional.of(mockCart));
        when(productRepository.findById(1L)).thenReturn(Optional.of(mockProduct));
        when(cartItemRepository.findByCartAndProduct(mockCart, mockProduct)).thenReturn(Optional.of(existingItem));

        // Act & Assert
        InsufficientStockException exception = assertThrows(InsufficientStockException.class,
            () -> shoppingCartService.updateCartItemQuantity(1L, 100, authentication));
        
        assertTrue(exception.getMessage().contains("Insufficient stock"));
        verify(cartItemRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should successfully remove product from cart")
    void testRemoveProductFromCart_Success() {
        // Arrange
        CartItem existingItem = CartItem.builder()
                .id(1L)
                .cart(mockCart)
                .product(mockProduct)
                .quantity(2)
                .build();

        mockCart.getItems().add(existingItem);

        when(customerRepository.findByUser(mockCustomerUser)).thenReturn(Optional.of(mockCustomer));
        when(shoppingCartRepository.findByCustomer(mockCustomer)).thenReturn(Optional.of(mockCart));
        when(productRepository.findById(1L)).thenReturn(Optional.of(mockProduct));
        when(cartItemRepository.findByCartAndProduct(mockCart, mockProduct)).thenReturn(Optional.of(existingItem));
        when(shoppingCartRepository.save(any(ShoppingCart.class))).thenReturn(mockCart);

        // Act
        CartResponse result = shoppingCartService.removeProductFromCart(1L, authentication);

        // Assert
        assertNotNull(result);
        verify(cartItemRepository).delete(existingItem);
        verify(shoppingCartRepository).save(mockCart);
    }

    @Test
    @DisplayName("Should throw exception when product not in cart")
    void testRemoveProductFromCart_ProductNotInCart() {
        // Arrange
        when(customerRepository.findByUser(mockCustomerUser)).thenReturn(Optional.of(mockCustomer));
        when(shoppingCartRepository.findByCustomer(mockCustomer)).thenReturn(Optional.of(mockCart));
        when(productRepository.findById(1L)).thenReturn(Optional.of(mockProduct));
        when(cartItemRepository.findByCartAndProduct(mockCart, mockProduct)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> shoppingCartService.removeProductFromCart(1L, authentication));
        
        assertEquals("Product not in cart", exception.getMessage());
        verify(cartItemRepository, never()).delete(any());
    }
}