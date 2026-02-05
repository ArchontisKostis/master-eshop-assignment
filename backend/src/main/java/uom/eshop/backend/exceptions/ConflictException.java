package uom.eshop.backend.exceptions;

public class ConflictException extends EshopException {

    public ConflictException(String message) {
        super(message);
    }

    public ConflictException(String code, String message) {
        super(code, message);
    }
}

