package uk.ac.rhul.CS3821.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import uk.ac.rhul.CS3821.model.User;
import uk.ac.rhul.CS3821.repository.UserRepository;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserDetailsServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserDetailsServiceImpl service;

    @Test
    void loadUserByUsernameReturnsSpringSecurityUser() {
        User modelUser = new User();
        modelUser.setEmail("sam@example.com");
        modelUser.setPassword("encoded-pw");
        when(userRepository.findByEmail("sam@example.com")).thenReturn(Optional.of(modelUser));

        UserDetails details = service.loadUserByUsername("sam@example.com");

        assertThat(details.getUsername()).isEqualTo("sam@example.com");
        assertThat(details.getPassword()).isEqualTo("encoded-pw");
    }

    @Test
    void loadUserByUsernameThrowsWhenMissing() {
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.loadUserByUsername("missing@example.com"))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessageContaining("missing@example.com");
    }
}
