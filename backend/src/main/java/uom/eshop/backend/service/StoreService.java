package uom.eshop.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uom.eshop.backend.dto.OrderResponse;
import uom.eshop.backend.dto.StoreStatsResponse;
import uom.eshop.backend.model.Order;
import uom.eshop.backend.model.OrderStatus;
import uom.eshop.backend.model.Store;
import uom.eshop.backend.model.User;
import uom.eshop.backend.repository.OrderRepository;
import uom.eshop.backend.repository.ProductRepository;
import uom.eshop.backend.repository.StoreRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StoreService {

    private final StoreRepository storeRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    @Transactional(readOnly = true)
    public StoreStatsResponse getStoreStats(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        
        Store store = storeRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Store profile not found"));

        // Get product statistics
        Long totalProducts = productRepository.countByStore(store);
        Long productsInStock = productRepository.countByStoreAndStockQuantityGreaterThan(store, 0);
        Long productsOutOfStock = productRepository.countByStoreAndStockQuantity(store, 0);

        // Get order statistics
        Long totalOrders = orderRepository.countByStore(store);
        Long totalOrdersCompleted = orderRepository.countByStoreAndStatus(store, OrderStatus.COMPLETED);
        Long uniqueCustomers = orderRepository.countDistinctCustomersByStore(store);
        BigDecimal totalRevenue = orderRepository.sumTotalPriceByStore(store);
        Long totalItemsSold = orderRepository.sumItemQuantitiesByStore(store);

        return StoreStatsResponse.builder()
                .totalProducts(totalProducts)
                .productsInStock(productsInStock)
                .productsOutOfStock(productsOutOfStock)
                .totalOrders(totalOrders)
                .totalOrdersCompleted(totalOrdersCompleted)
                .uniqueCustomers(uniqueCustomers)
                .totalRevenue(totalRevenue)
                .totalItemsSold(totalItemsSold)
                .build();
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getRecentStoreOrders(Authentication authentication, int limit) {
        User user = (User) authentication.getPrincipal();
        
        Store store = storeRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Store profile not found"));

        Pageable pageable = PageRequest.of(0, limit);
        List<Order> orders = orderRepository.findByStoreOrderByOrderDateDesc(store, pageable);
        
        return orders.stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    private OrderResponse mapToOrderResponse(Order order) {
        return OrderResponse.builder()
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
                .build();
    }
}