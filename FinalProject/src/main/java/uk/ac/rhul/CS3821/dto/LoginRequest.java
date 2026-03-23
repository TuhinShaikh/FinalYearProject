package uk.ac.rhul.CS3821.dto;

/**
 * Payload used to authenticate a user.
 */
public class LoginRequest {
    private String email;
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
