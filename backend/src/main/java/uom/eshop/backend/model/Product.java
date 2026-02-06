package uom.eshop.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Entity class representing a product in the e-commerce application.
 * This class is annotated with JPA annotations to define the mapping between the class and the database table. It includes fields for the product's title, type, brand, description, price, stock quantity, and a reference to the store it belongs to. Validation annotations are used to ensure that the data is valid when creating or updating a product.
 */
@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 200)
    @Column(nullable = false)
    private String title;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false)
    private String type;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false)
    private String brand;

    @NotBlank
    @Size(max = 500)
    @Column(nullable = false)
    private String description;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Digits(integer = 10, fraction = 2)
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @NotNull
    @Min(0)
    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;
}