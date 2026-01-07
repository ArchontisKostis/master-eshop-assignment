package uom.eshop.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uom.eshop.backend.model.Role;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {
    
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;
    
    @NotBlank(message = "Email is required")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    @Email(message = "Email must be valid")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
    private String password;
    
    @NotNull(message = "Role is required")
    private Role role;
    
    // Customer-specific fields (required if role is CUSTOMER)
    @Size(min = 9, max = 12, message = "Tax ID must be between 9 and 12 characters")
    private String taxId;
    
    @Size(max = 100, message = "First name must not exceed 100 characters")
    private String firstName;
    
    @Size(max = 100, message = "Last name must not exceed 100 characters")
    private String lastName;
    
    // Store-specific fields (required if role is STORE)
    @Size(max = 200, message = "Store name must not exceed 200 characters")
    private String storeName;
    
    @Size(max = 200, message = "Owner name must not exceed 200 characters")
    private String ownerName;
}