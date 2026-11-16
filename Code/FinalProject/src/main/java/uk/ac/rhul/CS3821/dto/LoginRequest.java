package uk.ac.rhul.CS3821.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Payload used to authenticate a user.
 */
public class LoginRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    /**
     * Default constructor for JSON deserialization.
     */
    public LoginRequest() {
    }

    /**
     * Creates a login payload.
     *
     * @param email user's email address
     * @param password user's raw password
     */
    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    /**
     * @return user's email address
     */
    public String getEmail() {
        return email;
    }

    /**
     * @param email user's email address
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * @return user's raw password
     */
    public String getPassword() {
        return password;
    }

    /**
     * @param password user's raw password
     */
    public void setPassword(String password) {
        this.password = password;
    }
}
