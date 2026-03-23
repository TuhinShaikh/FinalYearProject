package uk.ac.rhul.CS3821.exception;

/**
 * Thrown when authentication credentials are invalid.
 */
public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException(String message) {
        super(message);
    }
}
