package uk.ac.rhul.CS3821.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.ac.rhul.CS3821.model.User;
import uk.ac.rhul.CS3821.repository.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * CRUD operations for users; transactions ensure replace/save happens within a consistent boundary.
 */
@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Persists a new user entity into the database and returns the managed instance.
     */
    public User createUser(User user) {
        return userRepository.save(user);
    }

    /**
     * Fetches a user by their identifier, using Optional to signal absence.
     */
    public Optional<User> getUserById(UUID userId) {
        return userRepository.findById(userId);
    }

    /**
     * Lists every registered user; useful for admin views or diagnostics.
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Updates an existing record by reusing save semantics with an attached entity.
     */
    public User updateUser(User user) {
        return userRepository.save(user);
    }

    /**
     * Removes a user by id; throws if the id is unknown.
     */
    public void deleteUser(UUID userId) {
        userRepository.deleteById(userId);
    }
}