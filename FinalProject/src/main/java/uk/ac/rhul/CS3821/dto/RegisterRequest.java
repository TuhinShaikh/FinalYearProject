package uk.ac.rhul.CS3821.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Payload used to register a new user account.
 */
public class RegisterRequest {
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 120, message = "Name must be between 2 and 120 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    /**
     * Default constructor for JSON deserialization.
     */
    public RegisterRequest() {
    }

    /**
     * Creates a registration payload.
     *
     * @param name user's display name
     * @param email user's unique email address
     * @param password raw password provided by the client
     */
    public RegisterRequest(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    /**
     * @return user's display name
     */
    public String getName() {
        return name;
    }

    /**
     * @param name user's display name
     */
    public void setName(String name) {
        this.name = name;
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
     * @return raw password from the request payload
     */
    public String getPassword() {
        return password;
    }

    /**
     * @param password raw password from the request payload
     */
    public void setPassword(String password) {
        this.password = password;
    }
}
