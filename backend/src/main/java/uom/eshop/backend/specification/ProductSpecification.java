package uom.eshop.backend.specification;

import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import uom.eshop.backend.dto.ProductSearchRequest;
import uom.eshop.backend.model.Product;

import java.util.ArrayList;
import java.util.List;

public class ProductSpecification {

    public static Specification<Product> filterProducts(ProductSearchRequest request) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Filter by title (case-insensitive partial match)
            if (request.getTitle() != null && !request.getTitle().isBlank()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("title")),
                        "%" + request.getTitle().toLowerCase() + "%"
                ));
            }

            // Filter by type (case-insensitive partial match)
            if (request.getType() != null && !request.getType().isBlank()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("type")),
                        "%" + request.getType().toLowerCase() + "%"
                ));
            }

            // Filter by brand (case-insensitive partial match)
            if (request.getBrand() != null && !request.getBrand().isBlank()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("brand")),
                        "%" + request.getBrand().toLowerCase() + "%"
                ));
            }

            // Filter by minimum price
            if (request.getMinPrice() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                        root.get("price"),
                        request.getMinPrice()
                ));
            }

            // Filter by maximum price
            if (request.getMaxPrice() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                        root.get("price"),
                        request.getMaxPrice()
                ));
            }

            // Filter by store ID
            if (request.getStoreId() != null) {
                predicates.add(criteriaBuilder.equal(
                        root.get("store").get("id"),
                        request.getStoreId()
                ));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}