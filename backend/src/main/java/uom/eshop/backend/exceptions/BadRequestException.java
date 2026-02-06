package uom.eshop.backend.exceptions;

/**
 * Custom exception class for handling bad request errors in the e-shop application.
 * This exception can be thrown when the client sends a request that is invalid or cannot be processed by the server.
 */
public class BadRequestException extends EshopException {

    public BadRequestException(String message) {
        super(message);
    }

    public BadRequestException(String code, String message) {
        super(code, message);
    }
}

