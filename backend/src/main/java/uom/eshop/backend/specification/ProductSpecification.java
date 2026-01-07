package uom.eshop.backend.specification;

import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import uom.eshop.backend.dto.ProductSearchRequest;
import uom.eshop.backend.model.Product;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class ProductSpecification {

    public static Specification<Product> filterProducts(ProductSearchRequest request) {
        return Specification
                .where(titleContains(request.getTitle()))
                .and(typeContains(request.getType()))
                .and(brandContains(request.getBrand()))
                .and(minPrice(request.getMinPrice()))
                .and(maxPrice(request.getMaxPrice()))
                .and(storeIdEquals(request.getStoreId()));
    }

    private static Specification<Product> titleContains(String title) {
        return (root, query, cb) ->
                isBlank(title) ? null :
                        cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%");
    }

    private static Specification<Product> typeContains(String type) {
        return (root, query, cb) ->
                isBlank(type) ? null :
                        cb.like(cb.lower(root.get("type")), "%" + type.toLowerCase() + "%");
    }

    private static Specification<Product> brandContains(String brand) {
        return (root, query, cb) ->
                isBlank(brand) ? null :
                        cb.like(cb.lower(root.get("brand")), "%" + brand.toLowerCase() + "%");
    }

    private static Specification<Product> minPrice(BigDecimal minPrice) {
        return (root, query, cb) ->
                minPrice == null ? null :
                        cb.greaterThanOrEqualTo(root.get("price"), minPrice);
    }

    private static Specification<Product> maxPrice(BigDecimal maxPrice) {
        return (root, query, cb) ->
                maxPrice == null ? null :
                        cb.lessThanOrEqualTo(root.get("price"), maxPrice);
    }

    private static Specification<Product> storeIdEquals(Long storeId) {
        return (root, query, cb) ->
                storeId == null ? null :
                        cb.equal(root.get("store").get("id"), storeId);
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}