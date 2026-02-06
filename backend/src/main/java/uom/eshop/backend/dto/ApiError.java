package uom.eshop.backend.dto;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

import java.time.Instant;

/**
 * DTO for representing API error responses.
 * This class contains fields for the error details, including timestamp, status code, error message, and request path.
 * It also includes static factory methods for creating ApiError instances based on HttpStatus and error messages.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiError {

    private Instant timestamp;
    private int status;
    private String error;
    private String code;
    private String message;
    private String path;

    public static ApiError of(HttpStatus status, String code, String message, HttpServletRequest request) {
        return ApiError.builder()
                .timestamp(Instant.now())
                .status(status.value())
                .error(status.getReasonPhrase())
                .code(code)
                .message(message)
                .path(request != null ? request.getRequestURI() : null)
                .build();
    }

    public static ApiError of(HttpStatus status, String message, HttpServletRequest request) {
        return of(status, status.name(), message, request);
    }
}

