package uom.eshop.backend.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import uom.eshop.backend.model.*;
import uom.eshop.backend.repository.*;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

/**
 * Database seeder for development and demo purposes.
 * This component runs automatically when the application starts
 */
@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final StoreRepository storeRepository;
    private final ProductRepository productRepository;
    private final ShoppingCartRepository shoppingCartRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Starting database seeding...");

        // do not seed if db is not empty
        if (userRepository.count() > 0) {
            log.info("Database is not empty, skipping seeding.");
            return;
        }

        // Seed Users and Customers
        User customer1 = createCustomer("john", "john.doe@example.com", "password123", 
                "123456789", "John", "Doe");
        User customer2 = createCustomer("jane", "jane.smith@example.com", "password123",
                "987654321", "Jane", "Smith");
        User customer3 = createCustomer("bob", "bob.wilson@example.com", "password123",
                "456789123", "Bob", "Wilson");

        // Seed Users and Stores
        User store1 = createStore("tech", "public@store.com", "password123",
                "111222333", "Tech Store", "Alice Johnson");
        User store2 = createStore("fashion", "fashion@boutique.com", "password123",
                "444555666", "Fashion Boutique", "Emma Davis");
        User store3 = createStore("home", "home@depot.com", "password123",
                "777888999", "Home Depot", "Michael Brown");

        // Seed Products for Store 1 (Tech Store)
        Store techStore = storeRepository.findByUser(store1).orElseThrow();
        createProductsForStore(techStore, Arrays.asList(
                new ProductData("iPhone 15 Pro", "Electronics", "Apple", 
                        "Latest iPhone with A17 Pro chip, 48MP camera, and titanium design", 
                        new BigDecimal("999.99"), 50),
                new ProductData("MacBook Pro 16\"", "Electronics", "Apple",
                        "M3 Max chip, 16-inch Liquid Retina XDR display, 36GB unified memory",
                        new BigDecimal("3499.99"), 25),
                new ProductData("Samsung Galaxy S24", "Electronics", "Samsung",
                        "Flagship Android phone with AI features and 200MP camera",
                        new BigDecimal("899.99"), 40),
                new ProductData("Sony WH-1000XM5", "Electronics", "Sony",
                        "Premium noise-cancelling wireless headphones",
                        new BigDecimal("399.99"), 60),
                new ProductData("iPad Air", "Electronics", "Apple",
                        "10.9-inch Liquid Retina display, M2 chip, 64GB storage",
                        new BigDecimal("599.99"), 35)
        ));

        // Seed Products for Store 2 (Fashion Boutique)
        Store fashionStore = storeRepository.findByUser(store2).orElseThrow();
        createProductsForStore(fashionStore, Arrays.asList(
                new ProductData("Designer Leather Jacket", "Clothing", "Fashion Brand",
                        "Premium genuine leather jacket with modern design",
                        new BigDecimal("299.99"), 15),
                new ProductData("Silk Evening Dress", "Clothing", "Luxury Fashion",
                        "Elegant silk dress perfect for formal occasions",
                        new BigDecimal("449.99"), 10),
                new ProductData("Classic Oxford Shoes", "Footwear", "Heritage Brand",
                        "Handcrafted leather oxford shoes, timeless design",
                        new BigDecimal("199.99"), 20),
                new ProductData("Designer Handbag", "Accessories", "Luxury Brand",
                        "Premium leather handbag with gold hardware",
                        new BigDecimal("599.99"), 8),
                new ProductData("Cashmere Scarf", "Accessories", "Luxury Fashion",
                        "100% cashmere scarf, soft and warm",
                        new BigDecimal("149.99"), 25)
        ));

        // Seed Products for Store 3 (Home Depot)
        Store homeStore = storeRepository.findByUser(store3).orElseThrow();
        createProductsForStore(homeStore, Arrays.asList(
                new ProductData("Smart LED Light Bulbs (Pack of 4)", "Home & Garden", "SmartHome",
                        "WiFi-enabled LED bulbs, 16 million colors, voice control compatible",
                        new BigDecimal("49.99"), 100),
                new ProductData("Robot Vacuum Cleaner", "Home & Garden", "CleanTech",
                        "Self-charging robot vacuum with mapping technology",
                        new BigDecimal("349.99"), 30),
                new ProductData("Memory Foam Mattress", "Furniture", "ComfortSleep",
                        "Queen size memory foam mattress, medium firmness",
                        new BigDecimal("699.99"), 12),
                new ProductData("Stand Mixer", "Kitchen", "KitchenPro",
                        "5-quart stand mixer with multiple attachments",
                        new BigDecimal("399.99"), 18),
                new ProductData("Air Purifier", "Home & Garden", "AirClean",
                        "HEPA filter air purifier for rooms up to 500 sq ft",
                        new BigDecimal("249.99"), 22)
        ));

        log.info("Database seeding completed successfully!");
        log.info("Seeded data:");
        log.info("   - {} users ({} customers, {} stores)", 
                userRepository.count(), 
                customerRepository.count(), 
                storeRepository.count());
        log.info("   - {} products", productRepository.count());
        log.info("");
        log.info("Test credentials:");
        log.info("   Customers:");
        log.info("     - john / password123");
        log.info("     - jane / password123");
        log.info("     - bob / password123");
        log.info("   Stores:");
        log.info("     - tech / password123");
        log.info("     - fashion / password123");
        log.info("     - home / password123");
    }

    private User createCustomer(String username, String email, String password, 
                                String taxId, String firstName, String lastName) {
        User user = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(Role.CUSTOMER)
                .build();
        user = userRepository.save(user);

        Customer customer = Customer.builder()
                .taxId(taxId)
                .firstName(firstName)
                .lastName(lastName)
                .user(user)
                .build();
        customer = customerRepository.save(customer);

        // Create shopping cart for customer
        ShoppingCart cart = ShoppingCart.builder()
                .customer(customer)
                .totalPrice(BigDecimal.ZERO)
                .build();
        shoppingCartRepository.save(cart);

        log.debug("Created customer: {} ({})", username, email);
        return user;
    }

    private User createStore(String username, String email, String password,
                            String taxId, String storeName, String ownerName) {
        User user = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(Role.STORE)
                .build();
        user = userRepository.save(user);

        Store store = Store.builder()
                .taxId(taxId)
                .name(storeName)
                .owner(ownerName)
                .user(user)
                .build();
        storeRepository.save(store);

        log.debug("Created store: {} ({})", username, storeName);
        return user;
    }

    private void createProductsForStore(Store store, List<ProductData> productsData) {
        for (ProductData data : productsData) {
            Product product = Product.builder()
                    .title(data.title)
                    .type(data.type)
                    .brand(data.brand)
                    .description(data.description)
                    .price(data.price)
                    .stockQuantity(data.stockQuantity)
                    .store(store)
                    .build();
            productRepository.save(product);
        }
        log.debug("Created {} products for store: {}", productsData.size(), store.getName());
    }

    // Helper class for product data
    private static class ProductData {
        final String title;
        final String type;
        final String brand;
        final String description;
        final BigDecimal price;
        final Integer stockQuantity;

        ProductData(String title, String type, String brand, String description, 
                    BigDecimal price, Integer stockQuantity) {
            this.title = title;
            this.type = type;
            this.brand = brand;
            this.description = description;
            this.price = price;
            this.stockQuantity = stockQuantity;
        }
    }
}
