package uom.eshop.backend.exceptions;

/**
 * Custom exception class for handling cases where there is insufficient stock for a product.
 * This exception extends the BusinessRuleException, allowing it to be used in scenarios where business rules are violated due to stock limitations.
 */
public class InsufficientStockException extends BusinessRuleException {

    public InsufficientStockException(String message) {
        super(message);
    }

    public InsufficientStockException(String code, String message) {
        super(code, message);
    }
}

