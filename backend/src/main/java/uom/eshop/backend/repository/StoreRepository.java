package uom.eshop.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uom.eshop.backend.model.Store;
import uom.eshop.backend.model.User;

import java.util.Optional;

/**
 * Repository interface for managing Store entities in the e-shop application.
 */
@Repository
public interface StoreRepository extends JpaRepository<Store, Long> {
    
    Optional<Store> findByUser(User user);
    
    Optional<Store> findByUserId(Long userId);
    
    boolean existsByTaxId(String taxId);
    
    Optional<Store> findByTaxId(String taxId);
}