package uk.ac.rhul.CS3821.config;

import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class SecurityConfigTest {

    @Test
    void passwordEncoderBeanIsCreated() {
        SecurityConfig config = new SecurityConfig();
        BCryptPasswordEncoder encoder = config.passwordEncoder();

        assertThat(encoder).isNotNull();
        assertThat(encoder.matches("pw", encoder.encode("pw"))).isTrue();
    }

    @Test
    void authenticationManagerComesFromConfiguration() throws Exception {
        SecurityConfig config = new SecurityConfig();
        AuthenticationConfiguration authenticationConfiguration = mock(AuthenticationConfiguration.class);
        AuthenticationManager manager = mock(AuthenticationManager.class);
        when(authenticationConfiguration.getAuthenticationManager()).thenReturn(manager);

        AuthenticationManager actual = config.authenticationManager(authenticationConfiguration);

        assertThat(actual).isSameAs(manager);
    }
}
