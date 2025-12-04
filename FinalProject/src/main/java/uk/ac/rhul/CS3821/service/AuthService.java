package uk.ac.rhul.CS3821.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import uk.ac.rhul.CS3821.dto.AccessTokenResponse;
import uk.ac.rhul.CS3821.dto.LoginRequest;
import uk.ac.rhul.CS3821.dto.RegisterRequest;
import uk.ac.rhul.CS3821.model.User;
import uk.ac.rhul.CS3821.repository.UserRepository;
import uk.ac.rhul.CS3821.security.JwtUtil;

import java.time.Instant;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    public AccessTokenResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("A user with this email already exists.");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        String[] names = splitName(request.getName());
        String firstName = names[0].isBlank() ? request.getEmail() : names[0];
        user.setFirstName(firstName);
        user.setLastName(names[1]);

        User saved = userRepository.save(user);
        String token = jwtUtil.generateToken(saved.getUserId().toString());
        return new AccessTokenResponse(token);
    }

    public AccessTokenResponse login(LoginRequest request) {
        User existing = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), existing.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        existing.setLastLogin(Instant.now());
        userRepository.save(existing);

        String token = jwtUtil.generateToken(existing.getUserId().toString());
        return new AccessTokenResponse(token);
    }

    private static String[] splitName(String fullName) {
        if (fullName == null || fullName.isBlank()) {
            return new String[]{"", ""};
        }

        String trimmed = fullName.trim();
        if (trimmed.isEmpty()) {
            return new String[]{"", ""};
        }

        String[] parts = trimmed.split("\\s+", 2);
        String firstName = parts[0];
        String lastName = parts.length > 1 ? parts[1] : "";
        return new String[]{firstName, lastName};
    }
}
