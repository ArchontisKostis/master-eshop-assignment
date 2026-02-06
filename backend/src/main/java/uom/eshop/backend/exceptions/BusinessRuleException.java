package uom.eshop.backend.exceptions;

/**
 * Custom exception class for handling business rule violations in the e-shop application.
 * This exception is thrown when a business rule is violated.
 * It extends the base EshopException class, allowing it to be used in a consistent way across the application for error handling.
 */
public class BusinessRuleException extends EshopException {

    public BusinessRuleException(String message) {
        super(message);
    }

    public BusinessRuleException(String code, String message) {
        super(code, message);
    }
}

