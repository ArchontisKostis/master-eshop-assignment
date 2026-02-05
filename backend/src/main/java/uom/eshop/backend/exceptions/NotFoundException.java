package uom.eshop.backend.exceptions;

public class NotFoundException extends EshopException {

    public NotFoundException(String message) {
        super(message);
    }

    public NotFoundException(String code, String message) {
        super(code, message);
    }
}

