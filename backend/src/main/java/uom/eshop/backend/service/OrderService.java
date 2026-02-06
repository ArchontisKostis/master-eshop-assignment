package uom.eshop.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uom.eshop.backend.dto.OrderResponse;
import uom.eshop.backend.exceptions.BadRequestException;
import uom.eshop.backend.exceptions.ForbiddenException;
import uom.eshop.backend.exceptions.InsufficientStockException;
import uom.eshop.backend.exceptions.NotFoundException;
import uom.eshop.backend.model.*;
import uom.eshop.backend.repository.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service responsible for handling order-related business logic.
 * It provides methods to complete orders, retrieve customer orders, and get order details.
 * The service ensures that stock levels are validated and updated accordingly when completing an order.
 */
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CustomerRepository customerRepository;
    private final ShoppingCartRepository shoppingCartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    @Transactional
    public List<OrderResponse> completeOrder(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        
        Customer customer = customerRepository.findByUser(user)
                .orElseThrow(() -> new NotFoundException("Customer profile not found"));

        ShoppingCart cart = shoppingCartRepository.findByCustomer(customer)
                .orElseThrow(() -> new NotFoundException("Shopping cart not found"));

        // Validate cart is not empty
        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        // Group cart items by store
        Map<Store, List<CartItem>> itemsByStore = cart.getItems().stream()
                .collect(Collectors.groupingBy(cartItem -> cartItem.getProduct().getStore()));

        List<Order> createdOrders = new ArrayList<>();

        // Create an order for each store
        for (Map.Entry<Store, List<CartItem>> entry : itemsByStore.entrySet()) {
            Store store = entry.getKey();
            List<CartItem> storeItems = entry.getValue();

            // Validate stock for all items
            for (CartItem cartItem : storeItems) {
                Product product = cartItem.getProduct();
                if (product.getStockQuantity() < cartItem.getQuantity()) {
                    throw new InsufficientStockException(
                        "Insufficient stock for product: " + product.getTitle() + 
                        ". Available: " + product.getStockQuantity() + 
                        ", Requested: " + cartItem.getQuantity()
                    );
                }
            }

            // Calculate total for this store's order
            BigDecimal orderTotal = storeItems.stream()
                    .map(CartItem::getSubtotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            // Create order
            Order order = Order.builder()
                    .customer(customer)
                    .store(store)
                    .totalPrice(orderTotal)
                    .status(OrderStatus.COMPLETED)
                    .build();

            order = orderRepository.save(order);

            // Create order items and update stock
            for (CartItem cartItem : storeItems) {
                Product product = cartItem.getProduct();

                // Create order item with price snapshot
                OrderItem orderItem = OrderItem.builder()
                        .order(order)
                        .product(product)
                        .quantity(cartItem.getQuantity())
                        .priceAtPurchase(product.getPrice())
                        .build();
                orderItem.calculateSubtotal();
                orderItemRepository.save(orderItem);

                // Update product stock
                product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
                productRepository.save(product);
            }

            createdOrders.add(order);
        }

        // Clear the shopping cart
        cartItemRepository.deleteAll(cart.getItems());
        cart.getItems().clear();
        cart.calculateTotalPrice();
        shoppingCartRepository.save(cart);

        // Return order responses
        return createdOrders.stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getCustomerOrders(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        
        Customer customer = customerRepository.findByUser(user)
                .orElseThrow(() -> new NotFoundException("Customer profile not found"));

        List<Order> orders = orderRepository.findByCustomerOrderByOrderDateDesc(customer);
        
        return orders.stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getRecentCustomerOrders(Authentication authentication, int limit) {
        User user = (User) authentication.getPrincipal();
        
        Customer customer = customerRepository.findByUser(user)
                .orElseThrow(() -> new NotFoundException("Customer profile not found"));

        Pageable pageable = PageRequest.of(0, limit);
        List<Order> orders = orderRepository.findByCustomerOrderByOrderDateDesc(customer, pageable);
        
        return orders.stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long orderId, Authentication authentication) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));

        User user = (User) authentication.getPrincipal();

        // Authorization check - verify user has access to this order
        if (user.getRole() == Role.CUSTOMER) {
            Customer customer = customerRepository.findByUser(user)
                    .orElseThrow(() -> new NotFoundException("Customer profile not found"));
            
            if (!order.getCustomer().getId().equals(customer.getId())) {
                throw new ForbiddenException("You don't have permission to view this order");
            }
        }

        return mapToOrderResponse(order);
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
                        .map(this::mapToOrderItemResponse)
                        .collect(Collectors.toList()))
                .build();
    }

    private OrderResponse.OrderItemResponse mapToOrderItemResponse(OrderItem orderItem) {
        return OrderResponse.OrderItemResponse.builder()
                .orderItemId(orderItem.getId())
                .productId(orderItem.getProduct().getId())
                .productTitle(orderItem.getProduct().getTitle())
                .productBrand(orderItem.getProduct().getBrand())
                .quantity(orderItem.getQuantity())
                .priceAtPurchase(orderItem.getPriceAtPurchase())
                .subtotal(orderItem.getSubtotal())
                .build();
    }
}