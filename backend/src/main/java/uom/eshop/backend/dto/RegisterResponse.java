package uom.eshop.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for representing the response of a user registration operation.
 * This class contains fields for a message about the registration result, as well as the username, email, and role of the newly registered user.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterResponse {
    
    private String message;
    private String username;
    private String email;
    private String role;
}