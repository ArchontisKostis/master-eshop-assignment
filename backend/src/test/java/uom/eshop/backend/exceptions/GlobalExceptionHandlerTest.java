package uom.eshop.backend.exceptions;

import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import uom.eshop.backend.dto.ApiError;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    @DisplayName("Should map NotFoundException to 404 ApiError")
    void testHandleNotFound() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        when(request.getRequestURI()).thenReturn("/api/products/1");

        NotFoundException ex = new NotFoundException("Product not found");

        ResponseEntity<ApiError> response = handler.handleNotFound(ex, request);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        ApiError body = response.getBody();
        assertEquals("NotFoundException", body.getCode());
        assertEquals("Product not found", body.getMessage());
        assertEquals("/api/products/1", body.getPath());
    }
}

