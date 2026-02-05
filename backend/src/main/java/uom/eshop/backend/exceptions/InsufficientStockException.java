package uom.eshop.backend.exceptions;

public class InsufficientStockException extends BusinessRuleException {

    public InsufficientStockException(String message) {
        super(message);
    }

    public InsufficientStockException(String code, String message) {
        super(code, message);
    }
}

