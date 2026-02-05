package uom.eshop.backend.exceptions;

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

