package uom.eshop.backend.exceptions;

public class ForbiddenException extends EshopException {

    public ForbiddenException(String message) {
        super(message);
    }

    public ForbiddenException(String code, String message) {
        super(code, message);
    }
}

