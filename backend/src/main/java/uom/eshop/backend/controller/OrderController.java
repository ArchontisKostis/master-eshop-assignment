package uom.eshop.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import uom.eshop.backend.dto.CheckoutResponse;
import uom.eshop.backend.dto.OrderResponse;
import uom.eshop.backend.dto.PaymentRequest;
import uom.eshop.backend.exceptions.NotFoundException;
import uom.eshop.backend.model.Store;
import uom.eshop.backend.model.User;
import uom.eshop.backend.repository.OrderRepository;
import uom.eshop.backend.repository.StoreRepository;
import uom.eshop.backend.service.OrderService;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Controller for handling order-related endpoints.
 * This controller provides endpoints for customers to complete orders, view their orders, and for store owners to view orders related to their store.
 */
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final StoreRepository storeRepository;
    private final OrderRepository orderRepository;

    /**
     * Endpoint for checking out and completing an order.
     * This endpoint simulates payment processing and then completes the order for the authenticated customer.
     *
     * @param paymentRequest the payment request containing payment details
     * @param authentication the authentication object containing the authenticated user's details
     * @return ResponseEntity containing the CheckoutResponse with payment status and order details
     */
    @PostMapping("/checkout")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<CheckoutResponse> checkout(
            @Valid @RequestBody PaymentRequest paymentRequest,
            Authentication authentication) {
        // Simulate payment processing
        String transactionId = simulatePaymentProcessing(paymentRequest);
        
        // Process the order
        List<OrderResponse> orders = orderService.completeOrder(authentication);
        
        // Return checkout response with payment simulation
        CheckoutResponse response = CheckoutResponse.builder()
                .paymentStatus("SUCCESS")
                .transactionId(transactionId)
                .message("Payment processed successfully. Orders have been placed.")
                .orders(orders)
                .build();
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Endpoint for completing an order after the payment simulation.
     * This endpoint completes the order for the authenticated customer and returns the order details.
     *
     * @param authentication the authentication object containing the authenticated user's details
     * @return ResponseEntity containing the list of OrderResponse with order details
     */
    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<OrderResponse>> completeOrder(Authentication authentication) {
        List<OrderResponse> orders = orderService.completeOrder(authentication);
        return ResponseEntity.status(HttpStatus.CREATED).body(orders);
    }

    /**
     * Endpoint for retrieving the authenticated customer's orders.
     * This endpoint returns a list of orders associated with the authenticated customer.
     *
     * @param authentication the authentication object containing the authenticated user's details
     * @return ResponseEntity containing the list of OrderResponse with order details
     */
    @GetMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<OrderResponse>> getCustomerOrders(Authentication authentication) {
        List<OrderResponse> orders = orderService.getCustomerOrders(authentication);
        return ResponseEntity.ok(orders);
    }

    /**
     * Endpoint for retrieving the authenticated customer's recent orders.
     * This endpoint returns a list of recent orders associated with the authenticated customer, limited by the specified number.
     *
     * @param limit the maximum number of recent orders to return (default is 5)
     * @param authentication the authentication object containing the authenticated user's details
     * @return ResponseEntity containing the list of OrderResponse with recent order details
     */
    @GetMapping("/recent")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<OrderResponse>> getRecentOrders(
            @RequestParam(defaultValue = "5") int limit,
            Authentication authentication) {
        List<OrderResponse> orders = orderService.getRecentCustomerOrders(authentication, limit);
        return ResponseEntity.ok(orders);
    }

    /**
     * Endpoint for retrieving orders related to the authenticated store owner.
     * This endpoint returns a list of orders associated with the store owned by the authenticated user.
     *
     * @param authentication the authentication object containing the authenticated user's details
     * @return ResponseEntity containing the list of OrderResponse with order details related to the store
     */
    @GetMapping("/store")
    @PreAuthorize("hasRole('STORE')")
    public ResponseEntity<List<OrderResponse>> getStoreOrders(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        
        Store store = storeRepository.findByUser(user)
                .orElseThrow(() -> new NotFoundException("Store profile not found"));

        List<OrderResponse> orders = orderRepository.findByStoreOrderByOrderDateDesc(store)
                .stream()
                .map(order -> OrderResponse.builder()
                        .orderId(order.getId())
                        .customerId(order.getCustomer().getId())
                        .customerName(order.getCustomer().getFirstName() + " " + order.getCustomer().getLastName())
                        .storeId(order.getStore().getId())
                        .storeName(order.getStore().getName())
                        .totalPrice(order.getTotalPrice())
                        .orderDate(order.getOrderDate())
                        .status(order.getStatus().name())
                        .items(order.getItems().stream()
                                .map(orderItem -> OrderResponse.OrderItemResponse.builder()
                                        .orderItemId(orderItem.getId())
                                        .productId(orderItem.getProduct().getId())
                                        .productTitle(orderItem.getProduct().getTitle())
                                        .productBrand(orderItem.getProduct().getBrand())
                                        .quantity(orderItem.getQuantity())
                                        .priceAtPurchase(orderItem.getPriceAtPurchase())
                                        .subtotal(orderItem.getSubtotal())
                                        .build())
                                .collect(Collectors.toList()))
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(orders);
    }

    /**
     * Endpoint for retrieving a specific order by its ID.
     * This endpoint returns the details of the specified order if it belongs to the authenticated customer or is related to the authenticated store.
     *
     * @param id the ID of the order to retrieve
     * @param authentication the authentication object containing the authenticated user's details
     * @return ResponseEntity containing the OrderResponse with order details
     */
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(
            @PathVariable Long id,
            Authentication authentication) {
        OrderResponse order = orderService.getOrderById(id, authentication);
        return ResponseEntity.ok(order);
    }

    /**
     * Helper method that simulates payment processing for the given payment request.
     * This is a dummy implementation that always succeeds and generates a random transaction ID.
     *
     * @param paymentRequest the payment request containing payment details
     * @return a string representing the transaction ID of the simulated payment
     */
    private String simulatePaymentProcessing(PaymentRequest paymentRequest) {
        // Dummy payment simulation - always succeeds!
        // In a real system, this would call a payment gateway
        String transactionId = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        // Simulate payment processing delay (optional)
        try {
            Thread.sleep(500); // 500ms delay for realism
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        return transactionId;
    }
}