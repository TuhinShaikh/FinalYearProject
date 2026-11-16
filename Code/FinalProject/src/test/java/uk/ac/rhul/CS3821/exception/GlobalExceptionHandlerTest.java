package uk.ac.rhul.CS3821.exception;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Unit tests for global exception-to-response translation behavior.
 */
class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void handleUserAlreadyExistsReturnsConflict() {
        ResponseEntity<Map<String, String>> response = handler.handleUserAlreadyExists(
                new UserAlreadyExistsException("A user with this email already exists.")
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
        assertThat(response.getBody()).containsEntry("message", "A user with this email already exists.");
    }

    @Test
    void handleUserNotFoundReturnsNotFound() {
        ResponseEntity<Map<String, String>> response = handler.handleUserNotFound(
                new UserNotFoundException("User not found")
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody()).containsEntry("message", "User not found");
    }

    @Test
    void handleInvalidCredentialsReturnsUnauthorized() {
        ResponseEntity<Map<String, String>> response = handler.handleInvalidCredentials(
                new InvalidCredentialsException("Invalid credentials")
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(response.getBody()).containsEntry("message", "Invalid credentials");
    }

    @Test
    void handleValidationReturnsErrorMap() {
        MethodArgumentNotValidException ex = mock(MethodArgumentNotValidException.class);
        BindingResult bindingResult = mock(BindingResult.class);

        // Two field errors verify that the map is populated per field.
        List<FieldError> fieldErrors = List.of(
                new FieldError("request", "email", "must be a well-formed email address"),
                new FieldError("request", "password", "must not be blank")
        );

        when(ex.getBindingResult()).thenReturn(bindingResult);
        when(bindingResult.getFieldErrors()).thenReturn(fieldErrors);

        ResponseEntity<Map<String, Object>> response = handler.handleValidation(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).containsEntry("message", "Validation failed");

        @SuppressWarnings("unchecked")
        Map<String, String> errors = (Map<String, String>) response.getBody().get("errors");
        assertThat(errors).containsEntry("email", "must be a well-formed email address");
        assertThat(errors).containsEntry("password", "must not be blank");
    }

    @Test
    void handleAccessDeniedReturnsForbidden() {
        ResponseEntity<Map<String, String>> response = handler.handleAccessDenied(
                new AccessDeniedException("Access denied: admin role required")
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        assertThat(response.getBody()).containsEntry("message", "Access denied: admin role required");
    }

    @Test
    void handleIllegalArgumentReturnsBadRequest() {
        ResponseEntity<Map<String, String>> response = handler.handleIllegalArgument(
                new IllegalArgumentException("Section is required")
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).containsEntry("message", "Section is required");
    }
}
