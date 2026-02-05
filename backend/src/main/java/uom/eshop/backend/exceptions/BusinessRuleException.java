package uom.eshop.backend.exceptions;

public class BusinessRuleException extends EshopException {

    public BusinessRuleException(String message) {
        super(message);
    }

    public BusinessRuleException(String code, String message) {
        super(code, message);
    }
}

