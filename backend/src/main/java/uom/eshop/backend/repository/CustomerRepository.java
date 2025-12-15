package uom.eshop.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uom.eshop.backend.model.Customer;
import uom.eshop.backend.model.User;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    
    Optional<Customer> findByUser(User user);
    
    Optional<Customer> findByUserId(Long userId);
    
    boolean existsByTaxId(String taxId);
    
    Optional<Customer> findByTaxId(String taxId);
}