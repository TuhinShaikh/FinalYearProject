package uk.ac.rhul.CS3821.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "users", uniqueConstraints = {
    @UniqueConstraint(columnNames = "email")
})
/**
 * Persistent user account entity used for authentication and ownership of bookings.
 */
public class User {

    @Id
    @GeneratedValue
    @Column(name = "user_id", updatable = false, nullable = false)
    private UUID userId;

    @Column(name = "email", nullable = false, unique = true, length = 255)
    // I use email as the login identifier because it is unique and easy for users to remember.
    private String email;

    @Column(name = "hashed_password", nullable = false)
    // I only store the hashed password so raw credentials are never exposed.
    private String password;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "phone_number", length = 20)
    // I keep phone optional since not every user wants to provide it.
    private String phoneNumber;

    @Column(name = "is_disabled", nullable = false)
    // I use this flag to quickly disable an account when needed.
    private boolean isDisabled = false;

    @Column(name = "role", nullable = false, length = 20)
    // I keep role on the user so admin-only capabilities can be enforced in code.
    private String role = "USER";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    @Column(name = "last_login")
    private Instant lastLogin;

    /**
     * Default constructor required by JPA.
     */
    public User() {}

    /**
     * Creates a user with essential profile and authentication fields.
     *
     * @param email unique login email
     * @param password hashed password value
     * @param firstName user's first name
     * @param lastName user's last name
     * @param phoneNumber optional phone number
     */
    public User(String email, String password, String firstName, String lastName, String phoneNumber) {
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
    }

    // I expose standard accessors because services/controllers map this entity in many places.
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public boolean isDisabled() { return isDisabled; }
    public void setDisabled(boolean disabled) { isDisabled = disabled; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    public Instant getLastLogin() { return lastLogin; }
    public void setLastLogin(Instant lastLogin) { this.lastLogin = lastLogin; }
}