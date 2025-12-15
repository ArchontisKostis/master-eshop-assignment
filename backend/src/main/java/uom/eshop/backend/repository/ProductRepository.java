package uom.eshop.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import uom.eshop.backend.model.Product;
import uom.eshop.backend.model.Store;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    
    List<Product> findByStore(Store store);
    
    List<Product> findByStoreId(Long storeId);
    
    List<Product> findByType(String type);
    
    List<Product> findByBrand(String brand);
}