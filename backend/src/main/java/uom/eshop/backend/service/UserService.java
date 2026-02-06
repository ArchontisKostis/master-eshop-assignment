package uom.eshop.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uom.eshop.backend.dto.RegisterRequest;
import uom.eshop.backend.exceptions.BadRequestException;
import uom.eshop.backend.exceptions.ConflictException;
import uom.eshop.backend.model.*;
import uom.eshop.backend.repository.*;

import java.math.BigDecimal;

/**
 * Service responsible for handling user-related business logic.
 * It provides methods for user registration and loading user details for authentication.
 * The service ensures that all necessary validations are performed during registration, including uniqueness of username, email, and tax ID.
 * It also creates the appropriate profile (customer or store) based on the user's role and initializes a shopping cart for customers.
 */
@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final StoreRepository storeRepository;
    private final ShoppingCartRepository shoppingCartRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }

    @Transactional
    public User registerUser(RegisterRequest request) {
        // Validate basic fields
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ConflictException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email already exists");
        }

        // Validate tax ID uniqueness across both customers and stores
        if (request.getTaxId() != null && !request.getTaxId().isBlank()) {
            if (customerRepository.existsByTaxId(request.getTaxId())) {
                throw new ConflictException("Tax ID already exists");
            }
            if (storeRepository.existsByTaxId(request.getTaxId())) {
                throw new ConflictException("Tax ID already exists");
            }
        }

        // Validate role-specific required fields
        switch (request.getRole()) {
            case CUSTOMER:
                validateCustomerFields(request);
                break;
            case STORE:
                validateStoreFields(request);
                break;
        }

        // Create User entity
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();

        user = userRepository.save(user);

        // Create role-specific entity
        switch (request.getRole()) {
            case CUSTOMER:
                createCustomerProfile(user, request);
                break;
            case STORE:
                createStoreProfile(user, request);
                break;
        }

        return user;
    }

    private void validateCustomerFields(RegisterRequest request) {
        if (request.getTaxId() == null || request.getTaxId().isBlank()) {
            throw new BadRequestException("Tax ID is required for customer registration");
        }
        if (request.getFirstName() == null || request.getFirstName().isBlank()) {
            throw new BadRequestException("First name is required for customer registration");
        }
        if (request.getLastName() == null || request.getLastName().isBlank()) {
            throw new BadRequestException("Last name is required for customer registration");
        }
    }

    private void validateStoreFields(RegisterRequest request) {
        if (request.getTaxId() == null || request.getTaxId().isBlank()) {
            throw new BadRequestException("Tax ID is required for store registration");
        }
        if (request.getStoreName() == null || request.getStoreName().isBlank()) {
            throw new BadRequestException("Store name is required for store registration");
        }
        if (request.getOwnerName() == null || request.getOwnerName().isBlank()) {
            throw new BadRequestException("Owner name is required for store registration");
        }
    }

    private void createCustomerProfile(User user, RegisterRequest request) {
        Customer customer = Customer.builder()
                .taxId(request.getTaxId())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .user(user)
                .build();

        customer = customerRepository.save(customer);

        // Automatically create shopping cart for customer
        ShoppingCart cart = ShoppingCart.builder()
                .customer(customer)
                .totalPrice(BigDecimal.ZERO)
                .build();

        shoppingCartRepository.save(cart);
    }

    private void createStoreProfile(User user, RegisterRequest request) {
        Store store = Store.builder()
                .taxId(request.getTaxId())
                .name(request.getStoreName())
                .owner(request.getOwnerName())
                .user(user)
                .build();

        storeRepository.save(store);
    }
}