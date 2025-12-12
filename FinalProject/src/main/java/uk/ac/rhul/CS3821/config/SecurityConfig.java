package uk.ac.rhul.CS3821.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Development security rules that disable CSRF and keep auth/API endpoints public for the UI.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Disables CSRF and allows anonymous access to the auth/api endpoints needed by the frontend.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**", "/api/**").permitAll()
                .anyRequest().authenticated()
            );
        return http.build();
    }

    /**
     * Provides a BCrypt password encoder for hashing and verifying credentials consistently.
     */
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Exposes the authentication manager so services can programmatically validate credentials when needed.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
