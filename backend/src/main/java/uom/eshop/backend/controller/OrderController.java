package uom.eshop.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import uom.eshop.backend.dto.OrderResponse;
import uom.eshop.backend.model.Store;
import uom.eshop.backend.model.User;
import uom.eshop.backend.repository.OrderRepository;
import uom.eshop.backend.repository.StoreRepository;
import uom.eshop.backend.service.OrderService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final StoreRepository storeRepository;
    private final OrderRepository orderRepository;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<OrderResponse>> completeOrder(Authentication authentication) {
        List<OrderResponse> orders = orderService.completeOrder(authentication);
        return ResponseEntity.status(HttpStatus.CREATED).body(orders);
    }

    @GetMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<OrderResponse>> getCustomerOrders(Authentication authentication) {
        List<OrderResponse> orders = orderService.getCustomerOrders(authentication);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/store")
    @PreAuthorize("hasRole('STORE')")
    public ResponseEntity<List<OrderResponse>> getStoreOrders(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        
        Store store = storeRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Store profile not found"));

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

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(
            @PathVariable Long id,
            Authentication authentication) {
        OrderResponse order = orderService.getOrderById(id, authentication);
        return ResponseEntity.ok(order);
    }
}