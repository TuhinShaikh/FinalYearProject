package uk.ac.rhul.CS3821.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.ac.rhul.CS3821.model.User;
import uk.ac.rhul.CS3821.repository.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * I keep user CRUD logic here so controllers stay thin and database work stays transactional.
 */
@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * I create and return the managed user entity in one place.
     */
    public User createUser(User user) {
        return userRepository.save(user);
    }

    /**
     * I return Optional here so callers can handle missing users safely.
     */
    public Optional<User> getUserById(UUID userId) {
        return userRepository.findById(userId);
    }

    /**
     * I expose this list for admin views and quick diagnostics.
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * I reuse save for updates so persistence behavior stays consistent.
     */
    public User updateUser(User user) {
        return userRepository.save(user);
    }

    /**
     * I delete by id directly because the repository already handles missing records correctly.
     */
    public void deleteUser(UUID userId) {
        userRepository.deleteById(userId);
    }
}