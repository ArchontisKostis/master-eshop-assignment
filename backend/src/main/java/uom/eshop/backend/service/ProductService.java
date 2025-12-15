package uom.eshop.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uom.eshop.backend.dto.AddProductRequest;
import uom.eshop.backend.dto.ProductResponse;
import uom.eshop.backend.dto.ProductSearchRequest;
import uom.eshop.backend.dto.UpdateProductStockRequest;
import uom.eshop.backend.model.Product;
import uom.eshop.backend.model.Store;
import uom.eshop.backend.model.User;
import uom.eshop.backend.repository.ProductRepository;
import uom.eshop.backend.repository.StoreRepository;
import uom.eshop.backend.specification.ProductSpecification;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;

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
        List<Product> products = productRepository.findAll(ProductSpecification.filterProducts(request));
        
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