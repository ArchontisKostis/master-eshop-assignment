package uom.eshop.backend.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
    
    @Query("SELECT p FROM Product p WHERE p.type IN :types AND p.stockQuantity > 0 ORDER BY p.id DESC")
    List<Product> findByTypeInAndStockQuantityGreaterThanZero(@Param("types") List<String> types, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.brand IN :brands AND p.stockQuantity > 0 ORDER BY p.id DESC")
    List<Product> findByBrandInAndStockQuantityGreaterThanZero(@Param("brands") List<String> brands, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE (p.type IN :types OR p.brand IN :brands) AND p.id NOT IN :excludeIds AND p.stockQuantity > 0 ORDER BY p.id DESC")
    List<Product> findRecommendedProducts(@Param("types") List<String> types, @Param("brands") List<String> brands, @Param("excludeIds") List<Long> excludeIds, Pageable pageable);
    
    Long countByStore(Store store);
    
    Long countByStoreAndStockQuantityGreaterThan(Store store, Integer stockQuantity);
    
    Long countByStoreAndStockQuantity(Store store, Integer stockQuantity);
}