package uk.ac.rhul.CS3821.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import uk.ac.rhul.CS3821.dto.AccessTokenResponse;
import uk.ac.rhul.CS3821.dto.LoginRequest;
import uk.ac.rhul.CS3821.dto.RegisterRequest;
import uk.ac.rhul.CS3821.exception.InvalidCredentialsException;
import uk.ac.rhul.CS3821.exception.UserAlreadyExistsException;
import uk.ac.rhul.CS3821.exception.UserNotFoundException;
import uk.ac.rhul.CS3821.model.User;
import uk.ac.rhul.CS3821.repository.UserRepository;
import uk.ac.rhul.CS3821.security.JwtUtil;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    @Test
    void registerThrowsWhenEmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest("Jane Doe", "jane@example.com", "secret");
        when(userRepository.existsByEmail("jane@example.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
            .isInstanceOf(UserAlreadyExistsException.class)
                .hasMessageContaining("already exists");
    }

    @Test
    void registerCreatesUserAndReturnsToken() {
        RegisterRequest request = new RegisterRequest("Jane Doe", "jane@example.com", "secret");
        UUID userId = UUID.randomUUID();

        when(userRepository.existsByEmail("jane@example.com")).thenReturn(false);
        when(passwordEncoder.encode("secret")).thenReturn("encoded-pass");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setUserId(userId);
            return user;
        });
        when(jwtUtil.generateToken(userId.toString())).thenReturn("jwt-token");

        AccessTokenResponse response = authService.register(request);

        assertThat(response.getAccessToken()).isEqualTo("jwt-token");
        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        assertThat(captor.getValue().getFirstName()).isEqualTo("Jane");
        assertThat(captor.getValue().getLastName()).isEqualTo("Doe");
        assertThat(captor.getValue().getPassword()).isEqualTo("encoded-pass");
    }

    @Test
    void loginThrowsWhenUserNotFound() {
        LoginRequest request = new LoginRequest("none@example.com", "pw");
        when(userRepository.findByEmail("none@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(request))
            .isInstanceOf(UserNotFoundException.class)
                .hasMessageContaining("User not found");
    }

    @Test
    void loginThrowsWhenPasswordMismatch() {
        LoginRequest request = new LoginRequest("jane@example.com", "wrong");
        User existing = new User();
        existing.setPassword("encoded");
        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(existing));
        when(passwordEncoder.matches("wrong", "encoded")).thenReturn(false);

        assertThatThrownBy(() -> authService.login(request))
            .isInstanceOf(InvalidCredentialsException.class)
                .hasMessageContaining("Invalid credentials");
    }

    @Test
    void loginReturnsTokenAndUpdatesLastLogin() {
        UUID userId = UUID.randomUUID();
        LoginRequest request = new LoginRequest("jane@example.com", "secret");
        User existing = new User();
        existing.setUserId(userId);
        existing.setPassword("encoded");

        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(existing));
        when(passwordEncoder.matches("secret", "encoded")).thenReturn(true);
        when(userRepository.save(existing)).thenReturn(existing);
        when(jwtUtil.generateToken(userId.toString())).thenReturn("jwt-token");

        AccessTokenResponse response = authService.login(request);

        assertThat(response.getAccessToken()).isEqualTo("jwt-token");
        assertThat(existing.getLastLogin()).isNotNull();
        verify(userRepository).save(existing);
    }

    @Test
    void registerUsesEmailAsFirstNameWhenNameIsNull() {
        RegisterRequest request = new RegisterRequest(null, "nullname@example.com", "secret");
        UUID userId = UUID.randomUUID();

        when(userRepository.existsByEmail("nullname@example.com")).thenReturn(false);
        when(passwordEncoder.encode("secret")).thenReturn("encoded-pass");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setUserId(userId);
            return user;
        });
        when(jwtUtil.generateToken(userId.toString())).thenReturn("jwt-token");

        authService.register(request);

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        assertThat(captor.getValue().getFirstName()).isEqualTo("nullname@example.com");
        assertThat(captor.getValue().getLastName()).isEqualTo("");
    }

    @Test
    void registerUsesEmailAsFirstNameWhenNameIsBlank() {
        RegisterRequest request = new RegisterRequest("   ", "blankname@example.com", "secret");
        UUID userId = UUID.randomUUID();

        when(userRepository.existsByEmail("blankname@example.com")).thenReturn(false);
        when(passwordEncoder.encode("secret")).thenReturn("encoded-pass");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setUserId(userId);
            return user;
        });
        when(jwtUtil.generateToken(userId.toString())).thenReturn("jwt-token");

        authService.register(request);

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        assertThat(captor.getValue().getFirstName()).isEqualTo("blankname@example.com");
        assertThat(captor.getValue().getLastName()).isEqualTo("");
    }
}
