package uk.ac.rhul.CS3821.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;
import uk.ac.rhul.CS3821.model.User;
import uk.ac.rhul.CS3821.repository.UserRepository;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

/**
 * Unit tests for admin role enforcement checks.
 */
@ExtendWith(MockitoExtension.class)
class AdminAuthorizationServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AdminAuthorizationService service;

    @Test
    void assertAdminThrowsWhenHeaderIsMissing() {
        assertThatThrownBy(() -> service.assertAdmin(" "))
                .isInstanceOf(AccessDeniedException.class)
                .hasMessageContaining("header is required");
    }

    @Test
    void assertAdminThrowsWhenUserIsNotFound() {
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.assertAdmin("missing@example.com"))
                .isInstanceOf(AccessDeniedException.class)
                .hasMessageContaining("not found");
    }

    @Test
    void assertAdminThrowsWhenRoleIsNotAdmin() {
        User user = new User();
        user.setEmail("user@example.com");
        user.setRole("USER");
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> service.assertAdmin("user@example.com"))
                .isInstanceOf(AccessDeniedException.class)
                .hasMessageContaining("admin role required");
    }

    @Test
    void assertAdminAllowsAdminRoleCaseInsensitively() {
        User user = new User();
        user.setEmail("admin@example.com");
        user.setRole("admin");
        when(userRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(user));

        assertThatCode(() -> service.assertAdmin("admin@example.com")).doesNotThrowAnyException();
    }
}
