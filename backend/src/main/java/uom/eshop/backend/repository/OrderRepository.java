package uom.eshop.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uom.eshop.backend.model.Customer;
import uom.eshop.backend.model.Order;
import uom.eshop.backend.model.Store;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    List<Order> findByCustomer(Customer customer);
    
    List<Order> findByCustomerId(Long customerId);
    
    List<Order> findByStore(Store store);
    
    List<Order> findByStoreId(Long storeId);
    
    List<Order> findByCustomerOrderByOrderDateDesc(Customer customer);
    
    List<Order> findByStoreOrderByOrderDateDesc(Store store);
}