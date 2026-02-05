package uom.eshop.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import uom.eshop.backend.dto.RegisterRequest;
import uom.eshop.backend.exceptions.BadRequestException;
import uom.eshop.backend.exceptions.ConflictException;
import uom.eshop.backend.model.Customer;
import uom.eshop.backend.model.Role;
import uom.eshop.backend.model.Store;
import uom.eshop.backend.model.User;
import uom.eshop.backend.repository.CustomerRepository;
import uom.eshop.backend.repository.ShoppingCartRepository;
import uom.eshop.backend.repository.StoreRepository;
import uom.eshop.backend.repository.UserRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserService Tests")
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private StoreRepository storeRepository;

    @Mock
    private ShoppingCartRepository shoppingCartRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private RegisterRequest customerRequest;
    private RegisterRequest storeRequest;
    private User mockUser;

    @BeforeEach
    void setUp() {
        // Setup customer registration request
        customerRequest = RegisterRequest.builder()
                .username("johndoe")
                .email("john@example.com")
                .password("password123")
                .role(Role.CUSTOMER)
                .taxId("123456789")
                .firstName("John")
                .lastName("Doe")
                .build();

        // Setup store registration request
        storeRequest = RegisterRequest.builder()
                .username("techstore")
                .email("tech@store.com")
                .password("password123")
                .role(Role.STORE)
                .taxId("987654321")
                .storeName("Tech Store")
                .ownerName("Jane Smith")
                .build();

        // Setup mock user
        mockUser = User.builder()
                .id(1L)
                .username("johndoe")
                .email("john@example.com")
                .password("encoded_password")
                .role(Role.CUSTOMER)
                .build();
    }

    @Test
    @DisplayName("Should successfully register a customer")
    void testRegisterCustomer_Success() {
        // Arrange
        when(userRepository.existsByUsername(customerRequest.getUsername())).thenReturn(false);
        when(userRepository.existsByEmail(customerRequest.getEmail())).thenReturn(false);
        when(customerRepository.existsByTaxId(customerRequest.getTaxId())).thenReturn(false);
        when(storeRepository.existsByTaxId(customerRequest.getTaxId())).thenReturn(false);
        when(passwordEncoder.encode(customerRequest.getPassword())).thenReturn("encoded_password");
        when(userRepository.save(any(User.class))).thenReturn(mockUser);
        when(customerRepository.save(any(Customer.class))).thenReturn(Customer.builder().id(1L).build());

        // Act
        User result = userService.registerUser(customerRequest);

        // Assert
        assertNotNull(result);
        assertEquals("johndoe", result.getUsername());
        assertEquals("john@example.com", result.getEmail());
        assertEquals(Role.CUSTOMER, result.getRole());

        verify(userRepository).save(any(User.class));
        verify(customerRepository).save(any(Customer.class));
        verify(shoppingCartRepository).save(any());
        verify(storeRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should successfully register a store")
    void testRegisterStore_Success() {
        // Arrange
        User mockStoreUser = User.builder()
                .id(2L)
                .username("techstore")
                .email("tech@store.com")
                .password("encoded_password")
                .role(Role.STORE)
                .build();

        when(userRepository.existsByUsername(storeRequest.getUsername())).thenReturn(false);
        when(userRepository.existsByEmail(storeRequest.getEmail())).thenReturn(false);
        when(customerRepository.existsByTaxId(storeRequest.getTaxId())).thenReturn(false);
        when(storeRepository.existsByTaxId(storeRequest.getTaxId())).thenReturn(false);
        when(passwordEncoder.encode(storeRequest.getPassword())).thenReturn("encoded_password");
        when(userRepository.save(any(User.class))).thenReturn(mockStoreUser);
        when(storeRepository.save(any(Store.class))).thenReturn(Store.builder().id(1L).build());

        // Act
        User result = userService.registerUser(storeRequest);

        // Assert
        assertNotNull(result);
        assertEquals("techstore", result.getUsername());
        assertEquals(Role.STORE, result.getRole());

        verify(userRepository).save(any(User.class));
        verify(storeRepository).save(any(Store.class));
        verify(customerRepository, never()).save(any());
        verify(shoppingCartRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw exception when username already exists")
    void testRegisterUser_UsernameExists() {
        // Arrange
        when(userRepository.existsByUsername(customerRequest.getUsername())).thenReturn(true);

        // Act & Assert
        ConflictException exception = assertThrows(ConflictException.class,
            () -> userService.registerUser(customerRequest));
        
        assertEquals("Username already exists", exception.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw exception when email already exists")
    void testRegisterUser_EmailExists() {
        // Arrange
        when(userRepository.existsByUsername(customerRequest.getUsername())).thenReturn(false);
        when(userRepository.existsByEmail(customerRequest.getEmail())).thenReturn(true);

        // Act & Assert
        ConflictException exception = assertThrows(ConflictException.class,
            () -> userService.registerUser(customerRequest));
        
        assertEquals("Email already exists", exception.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw exception when tax ID already exists for customer")
    void testRegisterUser_TaxIdExistsForCustomer() {
        // Arrange
        when(userRepository.existsByUsername(customerRequest.getUsername())).thenReturn(false);
        when(userRepository.existsByEmail(customerRequest.getEmail())).thenReturn(false);
        when(customerRepository.existsByTaxId(customerRequest.getTaxId())).thenReturn(true);

        // Act & Assert
        ConflictException exception = assertThrows(ConflictException.class,
            () -> userService.registerUser(customerRequest));
        
        assertEquals("Tax ID already exists", exception.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw exception when tax ID already exists for store")
    void testRegisterUser_TaxIdExistsForStore() {
        // Arrange
        when(userRepository.existsByUsername(customerRequest.getUsername())).thenReturn(false);
        when(userRepository.existsByEmail(customerRequest.getEmail())).thenReturn(false);
        when(customerRepository.existsByTaxId(customerRequest.getTaxId())).thenReturn(false);
        when(storeRepository.existsByTaxId(customerRequest.getTaxId())).thenReturn(true);

        // Act & Assert
        ConflictException exception = assertThrows(ConflictException.class,
            () -> userService.registerUser(customerRequest));
        
        assertEquals("Tax ID already exists", exception.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw exception when customer registration missing tax ID")
    void testRegisterCustomer_MissingTaxId() {
        // Arrange
        customerRequest.setTaxId(null);
        when(userRepository.existsByUsername(customerRequest.getUsername())).thenReturn(false);
        when(userRepository.existsByEmail(customerRequest.getEmail())).thenReturn(false);

        // Act & Assert
        BadRequestException exception = assertThrows(BadRequestException.class,
            () -> userService.registerUser(customerRequest));
        
        assertEquals("Tax ID is required for customer registration", exception.getMessage());
    }

    @Test
    @DisplayName("Should throw exception when customer registration missing first name")
    void testRegisterCustomer_MissingFirstName() {
        // Arrange
        customerRequest.setFirstName(null);
        when(userRepository.existsByUsername(customerRequest.getUsername())).thenReturn(false);
        when(userRepository.existsByEmail(customerRequest.getEmail())).thenReturn(false);
        when(customerRepository.existsByTaxId(customerRequest.getTaxId())).thenReturn(false);
        when(storeRepository.existsByTaxId(customerRequest.getTaxId())).thenReturn(false);

        // Act & Assert
        BadRequestException exception = assertThrows(BadRequestException.class,
            () -> userService.registerUser(customerRequest));
        
        assertEquals("First name is required for customer registration", exception.getMessage());
    }

    @Test
    @DisplayName("Should throw exception when store registration missing store name")
    void testRegisterStore_MissingStoreName() {
        // Arrange
        storeRequest.setStoreName(null);
        when(userRepository.existsByUsername(storeRequest.getUsername())).thenReturn(false);
        when(userRepository.existsByEmail(storeRequest.getEmail())).thenReturn(false);
        when(customerRepository.existsByTaxId(storeRequest.getTaxId())).thenReturn(false);
        when(storeRepository.existsByTaxId(storeRequest.getTaxId())).thenReturn(false);

        // Act & Assert
        BadRequestException exception = assertThrows(BadRequestException.class,
            () -> userService.registerUser(storeRequest));
        
        assertEquals("Store name is required for store registration", exception.getMessage());
    }

    @Test
    @DisplayName("Should load user by username")
    void testLoadUserByUsername_Success() {
        // Arrange
        when(userRepository.findByUsername("johndoe")).thenReturn(Optional.of(mockUser));

        // Act
        var result = userService.loadUserByUsername("johndoe");

        // Assert
        assertNotNull(result);
        assertEquals("johndoe", result.getUsername());
        verify(userRepository).findByUsername("johndoe");
    }

    @Test
    @DisplayName("Should throw exception when username not found")
    void testLoadUserByUsername_NotFound() {
        // Arrange
        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(org.springframework.security.core.userdetails.UsernameNotFoundException.class, 
            () -> userService.loadUserByUsername("nonexistent"));
    }
}