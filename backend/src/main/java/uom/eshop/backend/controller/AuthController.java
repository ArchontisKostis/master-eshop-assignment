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

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

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