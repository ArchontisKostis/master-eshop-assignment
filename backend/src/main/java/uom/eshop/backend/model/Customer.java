package uom.eshop.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity representing a customer in the e-commerce system.
 * This class contains fields for the customer's tax ID, first name, last name, associated user account, and shopping cart.
 * The tax ID is unique for each customer, and there is a one-to-one relationship with both the User and ShoppingCart entities.
 */
@Entity
@Table(name = "customers", uniqueConstraints = {
    @UniqueConstraint(columnNames = "tax_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(min = 9, max = 12)
    @Column(name = "tax_id", nullable = false, unique = true)
    private String taxId;

    @NotBlank
    @Size(max = 100)
    @Column(name = "first_name", nullable = false)
    private String firstName;

    @NotBlank
    @Size(max = 100)
    @Column(name = "last_name", nullable = false)
    private String lastName;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @OneToOne(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private ShoppingCart shoppingCart;
}