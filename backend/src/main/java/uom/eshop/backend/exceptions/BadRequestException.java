package uom.eshop.backend.exceptions;

public class BadRequestException extends EshopException {

    public BadRequestException(String message) {
        super(message);
    }

    public BadRequestException(String code, String message) {
        super(code, message);
    }
}

