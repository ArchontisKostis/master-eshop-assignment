package uom.eshop.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import uom.eshop.backend.dto.OrderResponse;
import uom.eshop.backend.model.*;
import uom.eshop.backend.repository.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("OrderService Tests")
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private ShoppingCartRepository shoppingCartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private OrderService orderService;

    private User mockCustomerUser;
    private Customer mockCustomer;
    private ShoppingCart mockCart;
    private Store mockStore1;
    private Store mockStore2;
    private Product mockProduct1;
    private Product mockProduct2;
    private CartItem cartItem1;
    private CartItem cartItem2;

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

        mockStore1 = Store.builder()
                .id(1L)
                .name("Tech Store")
                .build();

        mockStore2 = Store.builder()
                .id(2L)
                .name("Electronics Hub")
                .build();

        mockProduct1 = Product.builder()
                .id(1L)
                .title("iPhone 15 Pro")
                .brand("Apple")
                .price(new BigDecimal("999.99"))
                .stockQuantity(50)
                .store(mockStore1)
                .build();

        mockProduct2 = Product.builder()
                .id(2L)
                .title("Samsung Galaxy S24")
                .brand("Samsung")
                .price(new BigDecimal("899.99"))
                .stockQuantity(30)
                .store(mockStore2)
                .build();

        cartItem1 = CartItem.builder()
                .id(1L)
                .product(mockProduct1)
                .quantity(2)
                .subtotal(new BigDecimal("1999.98"))
                .build();

        cartItem2 = CartItem.builder()
                .id(2L)
                .product(mockProduct2)
                .quantity(1)
                .subtotal(new BigDecimal("899.99"))
                .build();

        mockCart = ShoppingCart.builder()
                .id(1L)
                .customer(mockCustomer)
                .items(new ArrayList<>(Arrays.asList(cartItem1, cartItem2)))
                .totalPrice(new BigDecimal("2899.97"))
                .build();

        cartItem1.setCart(mockCart);
        cartItem2.setCart(mockCart);
    }

    @Test
    @DisplayName("Should successfully complete order with multiple stores")
    void testCompleteOrder_MultiStore_Success() {
        // Arrange
        when(authentication.getPrincipal()).thenReturn(mockCustomerUser);
        when(customerRepository.findByUser(mockCustomerUser)).thenReturn(Optional.of(mockCustomer));
        when(shoppingCartRepository.findByCustomer(mockCustomer)).thenReturn(Optional.of(mockCart));
        
        Order order1 = Order.builder()
                .id(1L)
                .customer(mockCustomer)
                .store(mockStore1)
                .totalPrice(new BigDecimal("1999.98"))
                .items(new ArrayList<>())
                .build();

        Order order2 = Order.builder()
                .id(2L)
                .customer(mockCustomer)
                .store(mockStore2)
                .totalPrice(new BigDecimal("899.99"))
                .items(new ArrayList<>())
                .build();

        when(orderRepository.save(any(Order.class)))
                .thenReturn(order1)
                .thenReturn(order2);
        
        when(orderItemRepository.save(any(OrderItem.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        when(productRepository.save(any(Product.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        when(shoppingCartRepository.save(any(ShoppingCart.class))).thenReturn(mockCart);

        // Act
        List<OrderResponse> result = orderService.completeOrder(authentication);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size()); // Two orders (one per store)
        
        // Verify stock was updated
        assertEquals(48, mockProduct1.getStockQuantity()); // 50 - 2
        assertEquals(29, mockProduct2.getStockQuantity()); // 30 - 1

        verify(orderRepository, times(2)).save(any(Order.class));
        verify(orderItemRepository, times(2)).save(any(OrderItem.class));
        verify(productRepository, times(2)).save(any(Product.class));
        verify(cartItemRepository).deleteAll(mockCart.getItems());
    }

    @Test
    @DisplayName("Should throw exception when cart is empty")
    void testCompleteOrder_EmptyCart() {
        // Arrange
        when(authentication.getPrincipal()).thenReturn(mockCustomerUser);
        
        ShoppingCart emptyCart = ShoppingCart.builder()
                .id(1L)
                .customer(mockCustomer)
                .items(new ArrayList<>())
                .build();

        when(customerRepository.findByUser(mockCustomerUser)).thenReturn(Optional.of(mockCustomer));
        when(shoppingCartRepository.findByCustomer(mockCustomer)).thenReturn(Optional.of(emptyCart));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> orderService.completeOrder(authentication));
        
        assertEquals("Cart is empty", exception.getMessage());
        verify(orderRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw exception when insufficient stock during checkout")
    void testCompleteOrder_InsufficientStock() {
        // Arrange
        when(authentication.getPrincipal()).thenReturn(mockCustomerUser);
        mockProduct1.setStockQuantity(1); // Less than cart quantity (2)
        
        when(customerRepository.findByUser(mockCustomerUser)).thenReturn(Optional.of(mockCustomer));
        when(shoppingCartRepository.findByCustomer(mockCustomer)).thenReturn(Optional.of(mockCart));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> orderService.completeOrder(authentication));
        
        assertTrue(exception.getMessage().contains("Insufficient stock"));
        verify(orderRepository, never()).save(any());
        verify(productRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should successfully get customer orders")
    void testGetCustomerOrders_Success() {
        // Arrange
        when(authentication.getPrincipal()).thenReturn(mockCustomerUser);
        
        Order order1 = Order.builder()
                .id(1L)
                .customer(mockCustomer)
                .store(mockStore1)
                .totalPrice(new BigDecimal("1999.98"))
                .items(new ArrayList<>())
                .build();

        when(customerRepository.findByUser(mockCustomerUser)).thenReturn(Optional.of(mockCustomer));
        when(orderRepository.findByCustomerOrderByOrderDateDesc(mockCustomer))
                .thenReturn(Arrays.asList(order1));

        // Act
        List<OrderResponse> result = orderService.getCustomerOrders(authentication);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).getOrderId());
        verify(orderRepository).findByCustomerOrderByOrderDateDesc(mockCustomer);
    }

    @Test
    @DisplayName("Should successfully get order by ID for authorized customer")
    void testGetOrderById_AuthorizedCustomer() {
        // Arrange
        when(authentication.getPrincipal()).thenReturn(mockCustomerUser);
        
        Order order = Order.builder()
                .id(1L)
                .customer(mockCustomer)
                .store(mockStore1)
                .totalPrice(new BigDecimal("1999.98"))
                .items(new ArrayList<>())
                .build();

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(customerRepository.findByUser(mockCustomerUser)).thenReturn(Optional.of(mockCustomer));

        // Act
        OrderResponse result = orderService.getOrderById(1L, authentication);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getOrderId());
        verify(orderRepository).findById(1L);
    }

    @Test
    @DisplayName("Should throw exception when customer tries to view another customer's order")
    void testGetOrderById_UnauthorizedCustomer() {
        // Arrange
        when(authentication.getPrincipal()).thenReturn(mockCustomerUser);
        
        Customer anotherCustomer = Customer.builder()
                .id(2L)
                .firstName("Jane")
                .lastName("Smith")
                .build();

        Order order = Order.builder()
                .id(1L)
                .customer(anotherCustomer) // Different customer
                .store(mockStore1)
                .build();

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(customerRepository.findByUser(mockCustomerUser)).thenReturn(Optional.of(mockCustomer));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> orderService.getOrderById(1L, authentication));
        
        assertEquals("You don't have permission to view this order", exception.getMessage());
    }

    @Test
    @DisplayName("Should throw exception when order not found")
    void testGetOrderById_NotFound() {
        // Arrange
        when(orderRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> orderService.getOrderById(999L, authentication));
        
        assertEquals("Order not found", exception.getMessage());
    }
}