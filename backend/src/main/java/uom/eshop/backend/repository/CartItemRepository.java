package uom.eshop.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uom.eshop.backend.model.CartItem;
import uom.eshop.backend.model.Product;
import uom.eshop.backend.model.ShoppingCart;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for managing CartItem entities.
 */
@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    
    List<CartItem> findByCart(ShoppingCart cart);
    
    List<CartItem> findByCartId(Long cartId);
    
    Optional<CartItem> findByCartAndProduct(ShoppingCart cart, Product product);
    
    Optional<CartItem> findByCartIdAndProductId(Long cartId, Long productId);
    
    void deleteByCartAndProduct(ShoppingCart cart, Product product);
    
    void deleteByCartIdAndProductId(Long cartId, Long productId);
}