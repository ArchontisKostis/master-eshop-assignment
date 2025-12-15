package uom.eshop.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import uom.eshop.backend.dto.AddProductRequest;
import uom.eshop.backend.dto.ProductResponse;
import uom.eshop.backend.dto.UpdateProductStockRequest;
import uom.eshop.backend.model.Product;
import uom.eshop.backend.model.Role;
import uom.eshop.backend.model.Store;
import uom.eshop.backend.model.User;
import uom.eshop.backend.repository.ProductRepository;
import uom.eshop.backend.repository.StoreRepository;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ProductService Tests")
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private StoreRepository storeRepository;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private ProductService productService;

    private User mockStoreUser;
    private Store mockStore;
    private Product mockProduct;
    private AddProductRequest addProductRequest;

    @BeforeEach
    void setUp() {
        mockStoreUser = User.builder()
                .id(1L)
                .username("techstore")
                .email("tech@store.com")
                .role(Role.STORE)
                .build();

        mockStore = Store.builder()
                .id(1L)
                .taxId("123456789")
                .name("Tech Store")
                .owner("John Doe")
                .user(mockStoreUser)
                .build();

        mockProduct = Product.builder()
                .id(1L)
                .title("iPhone 15 Pro")
                .type("Smartphone")
                .brand("Apple")
                .description("Latest iPhone")
                .price(new BigDecimal("999.99"))
                .stockQuantity(50)
                .store(mockStore)
                .build();

        addProductRequest = new AddProductRequest();
        addProductRequest.setTitle("iPhone 15 Pro");
        addProductRequest.setType("Smartphone");
        addProductRequest.setBrand("Apple");
        addProductRequest.setDescription("Latest iPhone");
        addProductRequest.setPrice(new BigDecimal("999.99"));
        addProductRequest.setStockQuantity(50);
    }

    @Test
    @DisplayName("Should successfully add a product")
    void testAddProduct_Success() {
        // Arrange
        when(authentication.getPrincipal()).thenReturn(mockStoreUser);
        when(storeRepository.findByUser(mockStoreUser)).thenReturn(Optional.of(mockStore));
        when(productRepository.save(any(Product.class))).thenReturn(mockProduct);

        // Act
        ProductResponse result = productService.addProduct(addProductRequest, authentication);

        // Assert
        assertNotNull(result);
        assertEquals("iPhone 15 Pro", result.getTitle());
        assertEquals("Apple", result.getBrand());
        assertEquals(new BigDecimal("999.99"), result.getPrice());
        assertEquals(50, result.getStockQuantity());
        assertEquals(1L, result.getStoreId());

        verify(storeRepository).findByUser(mockStoreUser);
        verify(productRepository).save(any(Product.class));
    }

    @Test
    @DisplayName("Should throw exception when store profile not found")
    void testAddProduct_StoreNotFound() {
        // Arrange
        when(authentication.getPrincipal()).thenReturn(mockStoreUser);
        when(storeRepository.findByUser(mockStoreUser)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> productService.addProduct(addProductRequest, authentication));
        
        assertEquals("Store profile not found for user", exception.getMessage());
        verify(productRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should successfully update product stock")
    void testUpdateProductStock_Success() {
        // Arrange
        when(authentication.getPrincipal()).thenReturn(mockStoreUser);
        UpdateProductStockRequest request = new UpdateProductStockRequest(100);
        when(storeRepository.findByUser(mockStoreUser)).thenReturn(Optional.of(mockStore));
        when(productRepository.findById(1L)).thenReturn(Optional.of(mockProduct));
        when(productRepository.save(any(Product.class))).thenReturn(mockProduct);

        // Act
        ProductResponse result = productService.updateProductStock(1L, request, authentication);

        // Assert
        assertNotNull(result);
        verify(productRepository).save(any(Product.class));
    }

    @Test
    @DisplayName("Should throw exception when updating another store's product")
    void testUpdateProductStock_UnauthorizedStore() {
        // Arrange
        when(authentication.getPrincipal()).thenReturn(mockStoreUser);
        Store anotherStore = Store.builder().id(2L).name("Another Store").build();
        Product anotherProduct = Product.builder()
                .id(2L)
                .store(anotherStore)
                .build();

        UpdateProductStockRequest request = new UpdateProductStockRequest(100);
        when(storeRepository.findByUser(mockStoreUser)).thenReturn(Optional.of(mockStore));
        when(productRepository.findById(2L)).thenReturn(Optional.of(anotherProduct));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> productService.updateProductStock(2L, request, authentication));
        
        assertEquals("You can only update products from your own store", exception.getMessage());
        verify(productRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should successfully get store products")
    void testGetStoreProducts_Success() {
        // Arrange
        when(authentication.getPrincipal()).thenReturn(mockStoreUser);
        Product product2 = Product.builder()
                .id(2L)
                .title("MacBook Pro")
                .type("Laptop")
                .brand("Apple")
                .price(new BigDecimal("1999.99"))
                .stockQuantity(20)
                .store(mockStore)
                .build();

        when(storeRepository.findByUser(mockStoreUser)).thenReturn(Optional.of(mockStore));
        when(productRepository.findByStore(mockStore)).thenReturn(Arrays.asList(mockProduct, product2));

        // Act
        List<ProductResponse> result = productService.getStoreProducts(authentication);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("iPhone 15 Pro", result.get(0).getTitle());
        assertEquals("MacBook Pro", result.get(1).getTitle());

        verify(productRepository).findByStore(mockStore);
    }

    @Test
    @DisplayName("Should successfully get product by ID")
    void testGetProductById_Success() {
        // Arrange
        when(productRepository.findById(1L)).thenReturn(Optional.of(mockProduct));

        // Act
        ProductResponse result = productService.getProductById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("iPhone 15 Pro", result.getTitle());
        verify(productRepository).findById(1L);
    }

    @Test
    @DisplayName("Should throw exception when product not found")
    void testGetProductById_NotFound() {
        // Arrange
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> productService.getProductById(999L));
        
        assertEquals("Product not found", exception.getMessage());
    }

    @Test
    @DisplayName("Should successfully update entire product")
    void testUpdateProduct_Success() {
        // Arrange
        when(authentication.getPrincipal()).thenReturn(mockStoreUser);
        when(storeRepository.findByUser(mockStoreUser)).thenReturn(Optional.of(mockStore));
        when(productRepository.findById(1L)).thenReturn(Optional.of(mockProduct));
        when(productRepository.save(any(Product.class))).thenReturn(mockProduct);

        // Act
        ProductResponse result = productService.updateProduct(1L, addProductRequest, authentication);

        // Assert
        assertNotNull(result);
        verify(productRepository).save(any(Product.class));
    }

    @Test
    @DisplayName("Should successfully delete product")
    void testDeleteProduct_Success() {
        // Arrange
        when(authentication.getPrincipal()).thenReturn(mockStoreUser);
        when(storeRepository.findByUser(mockStoreUser)).thenReturn(Optional.of(mockStore));
        when(productRepository.findById(1L)).thenReturn(Optional.of(mockProduct));

        // Act
        productService.deleteProduct(1L, authentication);

        // Assert
        verify(productRepository).delete(mockProduct);
    }

    @Test
    @DisplayName("Should throw exception when deleting another store's product")
    void testDeleteProduct_UnauthorizedStore() {
        // Arrange
        when(authentication.getPrincipal()).thenReturn(mockStoreUser);
        Store anotherStore = Store.builder().id(2L).name("Another Store").build();
        Product anotherProduct = Product.builder()
                .id(2L)
                .store(anotherStore)
                .build();

        when(storeRepository.findByUser(mockStoreUser)).thenReturn(Optional.of(mockStore));
        when(productRepository.findById(2L)).thenReturn(Optional.of(anotherProduct));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> productService.deleteProduct(2L, authentication));
        
        assertEquals("You can only delete products from your own store", exception.getMessage());
        verify(productRepository, never()).delete(any(Product.class));
    }
}