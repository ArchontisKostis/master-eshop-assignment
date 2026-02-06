package uom.eshop.backend.exceptions;

/**
 * Base exception class for all custom exceptions in the e-shop application.
 * This class extends RuntimeException and includes a code field to provide a standardized way of identifying the type of error that occurred.
 * All specific exceptions in the application should extend this class to ensure consistency in error handling and response formatting.
 */
public abstract class EshopException extends RuntimeException {

    private final String code;

    protected EshopException(String message) {
        super(message);
        this.code = getClass().getSimpleName();
    }

    protected EshopException(String code, String message) {
        super(message);
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}

