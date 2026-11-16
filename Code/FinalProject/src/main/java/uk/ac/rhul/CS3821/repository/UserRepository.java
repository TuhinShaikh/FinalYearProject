package uk.ac.rhul.CS3821.repository;

import uk.ac.rhul.CS3821.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for user persistence operations.
 */
public interface UserRepository extends JpaRepository<User, UUID> {

    /**
     * Finds a user by email address.
     *
     * @param email user's email address
     * @return matching user, if one exists
     */
    Optional<User> findByEmail(String email);

    /**
     * Checks whether a user with the email already exists.
     *
     * @param email user's email address
     * @return true when the email is already registered
     */
    boolean existsByEmail(String email);

    /**
     * Finds users by disabled flag.
     *
     * @param isDisabled desired disabled state
     * @return users matching the requested state
     */
    List<User> findByIsDisabled(boolean isDisabled);

    /**
     * Finds users by role value.
     *
     * @param role role name such as USER or ADMIN
     * @return users assigned to the role
     */
    List<User> findByRole(String role);

}