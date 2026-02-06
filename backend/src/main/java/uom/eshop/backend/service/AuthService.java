package uom.eshop.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import uom.eshop.backend.dto.LoginRequest;
import uom.eshop.backend.dto.LoginResponse;
import uom.eshop.backend.model.User;
import uom.eshop.backend.security.JwtTokenProvider;

/**
 * Service responsible for handling authentication logic.
 * It uses the AuthenticationManager to authenticate user credentials and the JwtTokenProvider to generate JWT tokens.
 */
@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = (User) authentication.getPrincipal();
        String jwt = tokenProvider.generateToken(authentication);

        return LoginResponse.builder()
                .id(user.getId())
                .token(jwt)
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}
