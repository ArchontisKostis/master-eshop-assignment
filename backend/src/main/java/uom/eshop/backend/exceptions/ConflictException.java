package uom.eshop.backend.exceptions;

/**
 * Exception thrown when a conflict occurs, such as when trying to create a resource that already exists or when there is a version conflict during an update operation.
 * This exception typically corresponds to HTTP status code 409 (Conflict) in RESTful APIs.
 */
public class ConflictException extends EshopException {

    public ConflictException(String message) {
        super(message);
    }

    public ConflictException(String code, String message) {
        super(code, message);
    }
}

