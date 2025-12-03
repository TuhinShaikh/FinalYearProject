package uk.ac.rhul.CS3821.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import uk.ac.rhul.CS3821.dto.AccessTokenResponse;
import uk.ac.rhul.CS3821.model.User;
import uk.ac.rhul.CS3821.repository.UserRepository;
import uk.ac.rhul.CS3821.security.JwtUtil;

@Service
