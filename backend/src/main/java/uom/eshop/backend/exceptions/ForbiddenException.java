package uom.eshop.backend.exceptions;

/**
 * Custom exception class for handling forbidden access scenarios in the e-shop application.
 * This exception is thrown when a user attempts to access a resource or perform an action that they do not have permission for.
 */
public class ForbiddenException extends EshopException {

    public ForbiddenException(String message) {
        super(message);
    }

    public ForbiddenException(String code, String message) {
        super(code, message);
    }
}

