package uk.ac.rhul.CS3821.exception;

/**
 * Thrown when registration is attempted with an email that already exists.
 */
public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String message) {
        super(message);
    }
}
