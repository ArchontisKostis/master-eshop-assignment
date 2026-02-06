package uom.eshop.backend.exceptions;

/**
 * Custom exception class for handling "not found" scenarios in the e-shop application.
 * This exception is thrown when a requested resource (such as a product, store, or user) cannot be found in the system.
 * It extends the base EshopException class, allowing for consistent error handling across the application.
 */
public class NotFoundException extends EshopException {

    public NotFoundException(String message) {
        super(message);
    }

    public NotFoundException(String code, String message) {
        super(code, message);
    }
}

