package uom.eshop.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Entity representing an item in the shopping cart.
 * This class contains fields for the cart item ID, the associated shopping cart, the product being added to the cart, the quantity of the product, and the subtotal price for that item. It also includes a helper method to calculate the subtotal based on the product price and quantity.
 */
@Entity
@Table(name = "cart_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private ShoppingCart cart;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @NotNull
    @Min(1)
    @Column(nullable = false)
    private Integer quantity;

    @Column(precision = 12, scale = 2)
    private BigDecimal subtotal;

    // Helper method to calculate subtotal
    public void calculateSubtotal() {
        if (product != null && product.getPrice() != null && quantity != null) {
            this.subtotal = product.getPrice().multiply(new BigDecimal(quantity));
        }
    }
}