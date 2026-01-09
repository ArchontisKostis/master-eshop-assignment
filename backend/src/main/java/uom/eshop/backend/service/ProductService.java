package uom.eshop.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uom.eshop.backend.dto.AddProductRequest;
import uom.eshop.backend.dto.ProductResponse;
import uom.eshop.backend.dto.ProductSearchRequest;
import uom.eshop.backend.dto.UpdateProductStockRequest;
import uom.eshop.backend.model.Customer;
import uom.eshop.backend.model.Product;
import uom.eshop.backend.model.Store;
import uom.eshop.backend.model.User;
import uom.eshop.backend.repository.CustomerRepository;
import uom.eshop.backend.repository.OrderRepository;
import uom.eshop.backend.repository.ProductRepository;
import uom.eshop.backend.repository.StoreRepository;
import uom.eshop.backend.specification.ProductSpecification;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;

    @Transactional
    public ProductResponse addProduct(AddProductRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        
        Store store = storeRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Store profile not found for user"));

        Product product = Product.builder()
                .title(request.getTitle())
                .type(request.getType())
                .brand(request.getBrand())
                .description(request.getDescription())
                .price(request.getPrice())
                .stockQuantity(request.getStockQuantity())
                .store(store)
                .build();

        product = productRepository.save(product);
        
        return mapToResponse(product);
    }

    @Transactional
    public ProductResponse updateProductStock(Long productId, UpdateProductStockRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        
        Store store = storeRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Store profile not found for user"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Verify that the product belongs to the authenticated store
        if (!product.getStore().getId().equals(store.getId())) {
            throw new RuntimeException("You can only update products from your own store");
        }

        product.setStockQuantity(request.getStockQuantity());
        product = productRepository.save(product);
        
        return mapToResponse(product);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getStoreProducts(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        
        Store store = storeRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Store profile not found for user"));

        List<Product> products = productRepository.findByStore(store);
        
        return products.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        return mapToResponse(product);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> searchProducts(ProductSearchRequest request) {
        Specification<Product> specification = ProductSpecification.filterProducts(request);
        List<Product> products = productRepository.findAll(specification);
        
        return products.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductResponse updateProduct(Long productId, AddProductRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        
        Store store = storeRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Store profile not found for user"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Verify that the product belongs to the authenticated store
        if (!product.getStore().getId().equals(store.getId())) {
            throw new RuntimeException("You can only update products from your own store");
        }

        product.setTitle(request.getTitle());
        product.setType(request.getType());
        product.setBrand(request.getBrand());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());

        product = productRepository.save(product);
        
        return mapToResponse(product);
    }

    @Transactional
    public void deleteProduct(Long productId, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        
        Store store = storeRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Store profile not found for user"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Verify that the product belongs to the authenticated store
        if (!product.getStore().getId().equals(store.getId())) {
            throw new RuntimeException("You can only delete products from your own store");
        }

        productRepository.delete(product);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getRecommendedProducts(Authentication authentication, int limit) {
        User user = (User) authentication.getPrincipal();
        
        Customer customer = customerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Customer profile not found"));

        // Get customer's purchase history
        List<String> purchasedTypes = orderRepository.findDistinctProductTypesByCustomer(customer);
        List<String> purchasedBrands = orderRepository.findDistinctProductBrandsByCustomer(customer);
        List<Long> purchasedProductIds = orderRepository.findDistinctProductIdsByCustomer(customer);

        // If customer has no purchase history, return popular/recent products
        if (purchasedTypes.isEmpty() && purchasedBrands.isEmpty()) {
            Pageable pageable = PageRequest.of(0, limit);
            List<Product> products = productRepository.findAll(pageable).getContent();
            return products.stream()
                    .filter(p -> p.getStockQuantity() > 0)
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        }

        // Ensure we have valid lists for the query
        if (purchasedTypes.isEmpty()) {
            purchasedTypes = new ArrayList<>();
            purchasedTypes.add(""); // Add empty string to avoid SQL errors
        }
        if (purchasedBrands.isEmpty()) {
            purchasedBrands = new ArrayList<>();
            purchasedBrands.add(""); // Add empty string to avoid SQL errors
        }
        if (purchasedProductIds.isEmpty()) {
            purchasedProductIds = new ArrayList<>();
            purchasedProductIds.add(-1L); // Add non-existent ID
        }

        // Find products based on customer's preferred types and brands
        Pageable pageable = PageRequest.of(0, limit);
        List<Product> recommendedProducts = productRepository.findRecommendedProducts(
                purchasedTypes,
                purchasedBrands,
                purchasedProductIds,
                pageable
        );

        return recommendedProducts.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ProductResponse mapToResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .title(product.getTitle())
                .type(product.getType())
                .brand(product.getBrand())
                .description(product.getDescription())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .storeId(product.getStore().getId())
                .storeName(product.getStore().getName())
                .build();
    }
}