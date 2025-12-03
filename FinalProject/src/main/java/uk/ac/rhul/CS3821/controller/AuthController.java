package uk.ac.rhul.CS3821.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import uk.ac.rhul.CS3821.dto.AccessTokenResponse;
import uk.ac.rhul.CS3821.model.User;
import uk.ac.rhul.CS3821.repository.UserRepository;
import uk.ac.rhul.CS3821.security.JwtUtil;

@Service

private final UserRepository userRepository;
private final JwtUtil jwtUtil;
private final BCryptPasswordEncoder passwordEncoder;

public AuthService(UserRepository userRepository, JwtUtil jwtUtil, BCryptPasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.jwtUtil = jwtUtil;
    this.passwordEncoder = passwordEncoder;
}
