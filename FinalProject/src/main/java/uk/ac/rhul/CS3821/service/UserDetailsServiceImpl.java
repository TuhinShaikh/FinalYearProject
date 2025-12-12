package uk.ac.rhul.CS3821.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;
import uk.ac.rhul.CS3821.repository.UserRepository;

import java.util.Collections;

/**
 * Provides Spring Security with user lookup logic backed by our UserRepository.
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    /**
     * Loads credentials for the provided email so authentication mechanisms can validate them.
     */
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        uk.ac.rhul.CS3821.model.User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return new User(user.getEmail(), user.getPassword(), Collections.emptyList());
    }
}