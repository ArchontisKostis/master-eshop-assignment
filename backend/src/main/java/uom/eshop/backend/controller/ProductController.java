package uom.eshop.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import uom.eshop.backend.dto.AddProductRequest;
import uom.eshop.backend.dto.ProductResponse;
import uom.eshop.backend.dto.ProductSearchRequest;
import uom.eshop.backend.dto.UpdateProductStockRequest;
import uom.eshop.backend.service.ProductService;

import java.util.List;

/**
 * Controller for handling product-related endpoints.
 * This controller provides endpoints for customers to view products and get recommendations, and for store owners to manage their products.
 */
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    /**
     * Endpoint for retrieving product recommendations for the authenticated customer.
     * This endpoint is accessible only to users with the CUSTOMER role.
     *
     * @param limit the maximum number of recommended products to return (default is 10)
     * @param authentication the authentication object containing the authenticated user's details
     * @return ResponseEntity containing a list of ProductResponse objects representing the recommended products
     */
    @GetMapping("/recommendations")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<ProductResponse>> getRecommendations(
            @RequestParam(defaultValue = "10") int limit,
            Authentication authentication) {
        List<ProductResponse> recommendations = productService.getRecommendedProducts(authentication, limit);
        return ResponseEntity.ok(recommendations);
    }

    /**
     * Endpoint for adding a new product to the authenticated store.
     * This endpoint is accessible only to users with the STORE role.
     *
     * @param request the AddProductRequest containing the details of the product to be added
     * @param authentication the authentication object containing the authenticated user's details
     * @return ResponseEntity containing the ProductResponse representing the added product, with HTTP status 201 Created
     */
    @PostMapping
    @PreAuthorize("hasRole('STORE')")
    public ResponseEntity<ProductResponse> addProduct(
            @Valid @RequestBody AddProductRequest request,
            Authentication authentication) {
        ProductResponse response = productService.addProduct(request, authentication);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Endpoint for updating an existing product in the authenticated store.
     * This endpoint is accessible only to users with the STORE role.
     *
     * @param id the ID of the product to be updated
     * @param request the AddProductRequest containing the updated details of the product
     * @param authentication the authentication object containing the authenticated user's details
     * @return ResponseEntity containing the ProductResponse representing the updated product
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('STORE')")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody AddProductRequest request,
            Authentication authentication) {
        ProductResponse response = productService.updateProduct(id, request, authentication);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint for updating the stock quantity of an existing product in the authenticated store.
     * This endpoint is accessible only to users with the STORE role.
     *
     * @param id the ID of the product whose stock is to be updated
     * @param request the UpdateProductStockRequest containing the new stock quantity
     * @param authentication the authentication object containing the authenticated user's details
     * @return ResponseEntity containing the ProductResponse representing the product with updated stock
     */
    @PatchMapping("/{id}/stock")
    @PreAuthorize("hasRole('STORE')")
    public ResponseEntity<ProductResponse> updateProductStock(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProductStockRequest request,
            Authentication authentication) {
        ProductResponse response = productService.updateProductStock(id, request, authentication);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint for deleting an existing product from the authenticated store.
     * This endpoint is accessible only to users with the STORE role.
     *
     * @param id the ID of the product to be deleted
     * @param authentication the authentication object containing the authenticated user's details
     * @return ResponseEntity with HTTP status 204 No Content if the product is successfully deleted
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('STORE')")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable Long id,
            Authentication authentication) {
        productService.deleteProduct(id, authentication);
        return ResponseEntity.noContent().build();
    }

    /**
     * Endpoint for retrieving all products associated with the authenticated store.
     * This endpoint is accessible only to users with the STORE role.
     *
     * @param authentication the authentication object containing the authenticated user's details
     * @return ResponseEntity containing a list of ProductResponse objects representing the products of the store
     */
    @GetMapping("/store")
    @PreAuthorize("hasRole('STORE')")
    public ResponseEntity<List<ProductResponse>> getStoreProducts(Authentication authentication) {
        List<ProductResponse> products = productService.getStoreProducts(authentication);
        return ResponseEntity.ok(products);
    }

    /**
     * Endpoint for searching products based on various criteria such as title, type, brand, price range, and store ID.
     * This endpoint is accessible to all users.
     *
     * @param title the title of the product to search for (optional)
     * @param type the type of the product to search for (optional)
     * @param brand the brand of the product to search for (optional)
     * @param minPrice the minimum price of the product to search for (optional)
     * @param maxPrice the maximum price of the product to search for (optional)
     * @param storeId the ID of the store whose products to search for (optional)
     * @return ResponseEntity containing a list of ProductResponse objects representing the products that match the search criteria
     */
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getProducts(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) java.math.BigDecimal minPrice,
            @RequestParam(required = false) java.math.BigDecimal maxPrice,
            @RequestParam(required = false) Long storeId) {
        
        ProductSearchRequest request = ProductSearchRequest.builder()
                .title(title)
                .type(type)
                .brand(brand)
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .storeId(storeId)
                .build();
        
        List<ProductResponse> products = productService.searchProducts(request);
        return ResponseEntity.ok(products);
    }

    /**
     * Endpoint for retrieving a product by its ID.
     * This endpoint is accessible to all users.
     *
     * @param id the ID of the product to retrieve
     * @return ResponseEntity containing the ProductResponse representing the product with the specified ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        ProductResponse response = productService.getProductById(id);
        return ResponseEntity.ok(response);
    }
}