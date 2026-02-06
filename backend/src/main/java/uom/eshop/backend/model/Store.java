package uom.eshop.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Entity representing a store in the e-commerce application.
 * Each store has a unique tax ID, a name, an owner, and is associated with a user account.
 * A store can have multiple products, which are represented by the Product entity.
 */
@Entity
@Table(name = "stores", uniqueConstraints = {
    @UniqueConstraint(columnNames = "tax_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Store {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(min = 9, max = 12)
    @Column(name = "tax_id", nullable = false, unique = true)
    private String taxId;

    @NotBlank
    @Size(max = 200)
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Size(max = 200)
    @Column(nullable = false)
    private String owner;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @OneToMany(mappedBy = "store", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Product> products = new ArrayList<>();
}