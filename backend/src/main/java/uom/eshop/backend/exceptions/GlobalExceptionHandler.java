package uom.eshop.backend.exceptions;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import uom.eshop.backend.dto.ApiError;

import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(NotFoundException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.NOT_FOUND;
        ApiError body = ApiError.of(status, ex.getCode(), ex.getMessage(), request);
        return ResponseEntity.status(status).body(body);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiError> handleBadRequest(BadRequestException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        ApiError body = ApiError.of(status, ex.getCode(), ex.getMessage(), request);
        return ResponseEntity.status(status).body(body);
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ApiError> handleConflict(ConflictException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.CONFLICT;
        ApiError body = ApiError.of(status, ex.getCode(), ex.getMessage(), request);
        return ResponseEntity.status(status).body(body);
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ApiError> handleForbidden(ForbiddenException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.FORBIDDEN;
        ApiError body = ApiError.of(status, ex.getCode(), ex.getMessage(), request);
        return ResponseEntity.status(status).body(body);
    }

    @ExceptionHandler({BusinessRuleException.class, InsufficientStockException.class})
    public ResponseEntity<ApiError> handleBusinessRule(EshopException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        ApiError body = ApiError.of(status, ex.getCode(), ex.getMessage(), request);
        return ResponseEntity.status(status).body(body);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));
        if (message.isBlank()) {
            message = "Validation failed for request.";
        }
        ApiError body = ApiError.of(status, "ValidationException", message, request);
        return ResponseEntity.status(status).body(body);
    }

    @ExceptionHandler(EshopException.class)
    public ResponseEntity<ApiError> handleEshopException(EshopException ex, HttpServletRequest request) {
        // Fallback for any EshopException not handled above; treat as bad request.
        HttpStatus status = HttpStatus.BAD_REQUEST;
        ApiError body = ApiError.of(status, ex.getCode(), ex.getMessage(), request);
        return ResponseEntity.status(status).body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGenericException(Exception ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        ApiError body = ApiError.of(status, "InternalServerError", "An unexpected error occurred.", request);
        return ResponseEntity.status(status).body(body);
    }
}
