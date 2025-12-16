package uom.eshop.backend.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uom.eshop.backend.model.Customer;
import uom.eshop.backend.model.Order;
import uom.eshop.backend.model.OrderStatus;
import uom.eshop.backend.model.Store;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    List<Order> findByCustomer(Customer customer);
    
    List<Order> findByCustomerId(Long customerId);
    
    List<Order> findByStore(Store store);
    
    List<Order> findByStoreId(Long storeId);
    
    List<Order> findByCustomerOrderByOrderDateDesc(Customer customer);
    
    List<Order> findByCustomerOrderByOrderDateDesc(Customer customer, Pageable pageable);
    
    List<Order> findByStoreOrderByOrderDateDesc(Store store);
    
    List<Order> findByStoreOrderByOrderDateDesc(Store store, Pageable pageable);
    
    Long countByCustomer(Customer customer);
    
    Long countByCustomerAndStatus(Customer customer, OrderStatus status);
    
    @Query("SELECT COUNT(DISTINCT o.store) FROM Order o WHERE o.customer = :customer")
    Long countDistinctStoresByCustomer(@Param("customer") Customer customer);
    
    @Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Order o WHERE o.customer = :customer")
    BigDecimal sumTotalPriceByCustomer(@Param("customer") Customer customer);
    
    @Query("SELECT COALESCE(SUM(oi.quantity), 0) FROM OrderItem oi WHERE oi.order.customer = :customer")
    Long sumItemQuantitiesByCustomer(@Param("customer") Customer customer);
    
    @Query("SELECT DISTINCT oi.product.id FROM OrderItem oi WHERE oi.order.customer = :customer")
    List<Long> findDistinctProductIdsByCustomer(@Param("customer") Customer customer);
    
    @Query("SELECT DISTINCT oi.product.type FROM OrderItem oi WHERE oi.order.customer = :customer")
    List<String> findDistinctProductTypesByCustomer(@Param("customer") Customer customer);
    
    @Query("SELECT DISTINCT oi.product.brand FROM OrderItem oi WHERE oi.order.customer = :customer")
    List<String> findDistinctProductBrandsByCustomer(@Param("customer") Customer customer);
    
    Long countByStore(Store store);
    
    Long countByStoreAndStatus(Store store, OrderStatus status);
    
    @Query("SELECT COUNT(DISTINCT o.customer) FROM Order o WHERE o.store = :store")
    Long countDistinctCustomersByStore(@Param("store") Store store);
    
    @Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Order o WHERE o.store = :store")
    BigDecimal sumTotalPriceByStore(@Param("store") Store store);
    
    @Query("SELECT COALESCE(SUM(oi.quantity), 0) FROM OrderItem oi WHERE oi.order.store = :store")
    Long sumItemQuantitiesByStore(@Param("store") Store store);
}