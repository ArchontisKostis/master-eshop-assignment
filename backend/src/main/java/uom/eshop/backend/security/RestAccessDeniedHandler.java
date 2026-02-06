package uom.eshop.backend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;
import uom.eshop.backend.dto.ApiError;

import java.io.IOException;

/**
 * Access denied handler that returns a JSON {@link ApiError} payload instead of
 * the default HTML/error page when a user is authenticated but not authorized.
 */
@Component
public class RestAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void handle(
            HttpServletRequest request,
            HttpServletResponse response,
            AccessDeniedException accessDeniedException
    ) throws IOException {

        HttpStatus status = HttpStatus.FORBIDDEN;
        ApiError body = ApiError.of(
                status,
                "AccessDenied",
                "You are not allowed to access this resource.",
                request
        );

        response.setStatus(status.value());
        response.setContentType("application/json");
        objectMapper.writeValue(response.getOutputStream(), body);
    }
}

