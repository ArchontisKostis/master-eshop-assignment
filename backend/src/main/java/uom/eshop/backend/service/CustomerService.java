package uom.eshop.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uom.eshop.backend.dto.CustomerStatsResponse;
import uom.eshop.backend.exceptions.NotFoundException;
import uom.eshop.backend.model.Customer;
import uom.eshop.backend.model.OrderStatus;
import uom.eshop.backend.model.ShoppingCart;
import uom.eshop.backend.model.User;
import uom.eshop.backend.repository.CustomerRepository;
import uom.eshop.backend.repository.OrderRepository;
import uom.eshop.backend.repository.ShoppingCartRepository;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;
    private final ShoppingCartRepository shoppingCartRepository;

    @Transactional(readOnly = true)
    public CustomerStatsResponse getCustomerStats(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        
        Customer customer = customerRepository.findByUser(user)
                .orElseThrow(() -> new NotFoundException("Customer profile not found"));

        // Get shopping cart stats
        ShoppingCart cart = shoppingCartRepository.findByCustomer(customer)
                .orElse(null);
        
        Integer itemsInCart = 0;
        BigDecimal cartTotalPrice = BigDecimal.ZERO;
        
        if (cart != null) {
            itemsInCart = cart.getItems().stream()
                    .mapToInt(item -> item.getQuantity())
                    .sum();
            cartTotalPrice = cart.getTotalPrice();
        }

        // Get order statistics
        Long totalOrders = orderRepository.countByCustomer(customer);
        Long totalOrdersCompleted = orderRepository.countByCustomerAndStatus(customer, OrderStatus.COMPLETED);
        Long uniqueStoresPurchasedFrom = orderRepository.countDistinctStoresByCustomer(customer);
        BigDecimal totalAmountSpent = orderRepository.sumTotalPriceByCustomer(customer);
        Long totalItemsPurchased = orderRepository.sumItemQuantitiesByCustomer(customer);

        return CustomerStatsResponse.builder()
                .itemsInCart(itemsInCart)
                .cartTotalPrice(cartTotalPrice)
                .totalOrders(totalOrders)
                .totalOrdersCompleted(totalOrdersCompleted)
                .uniqueStoresPurchasedFrom(uniqueStoresPurchasedFrom)
                .totalAmountSpent(totalAmountSpent)
                .totalItemsPurchased(totalItemsPurchased)
                .build();
    }
}