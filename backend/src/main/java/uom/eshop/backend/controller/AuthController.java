package uom.eshop.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import uom.eshop.backend.dto.LoginRequest;
import uom.eshop.backend.dto.LoginResponse;
import uom.eshop.backend.dto.RegisterRequest;
import uom.eshop.backend.dto.RegisterResponse;
import uom.eshop.backend.model.User;
import uom.eshop.backend.security.JwtTokenProvider;
import uom.eshop.backend.service.AuthService;
import uom.eshop.backend.service.UserService;

/**
 * Controller for handling authentication-related endpoints such as login and registration.
 * This controller provides endpoints for user login and registration, returning appropriate responses.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    /**
     * Endpoint for user login.
     * Accepts a LoginRequest containing username and password, and returns a LoginResponse with JWT token and user details.
     *
     * @param loginRequest the login request containing username and password
     * @return ResponseEntity containing the LoginResponse with JWT token and user details
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint for user registration.
     * Accepts a RegisterRequest containing user details, registers the user, and returns a RegisterResponse with the registered user's information.
     *
     * @param registerRequest the registration request containing user details
     * @return ResponseEntity containing the RegisterResponse with the registered user's information
     */
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        User user = userService.registerUser(registerRequest);
        
        RegisterResponse response = RegisterResponse.builder()
                .message("User registered successfully")
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}