package uom.eshop.backend.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration class to hold JWT (JSON Web Token) related properties.
 * These properties will be loaded from the application's configuration file (e.g., application.properties or application.yml).
 */
@Configuration
@ConfigurationProperties(prefix = "jwt")
@Data
public class JwtProperties {
    
    private String secret;
    private long expiration;
}