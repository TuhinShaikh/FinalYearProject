package uk.ac.rhul.CS3821.service;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import uk.ac.rhul.CS3821.model.User;
import uk.ac.rhul.CS3821.repository.UserRepository;

/**
 * Enforces role-based admin access for admin endpoints.
 */
@Service
public class AdminAuthorizationService {

    private final UserRepository userRepository;

    public AdminAuthorizationService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Validates that the supplied email belongs to an admin user.
     *
     * @param adminEmail email of the caller
     */
    public void assertAdmin(String adminEmail) {
        if (adminEmail == null || adminEmail.isBlank()) {
            throw new AccessDeniedException("Admin email header is required");
        }

        User user = userRepository.findByEmail(adminEmail.trim())
                .orElseThrow(() -> new AccessDeniedException("Admin user not found"));

        if (!"ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new AccessDeniedException("Access denied: admin role required");
        }
    }
}