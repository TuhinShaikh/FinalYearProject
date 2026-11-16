package uk.ac.rhul.CS3821.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uk.ac.rhul.CS3821.dto.AccessTokenResponse;
import uk.ac.rhul.CS3821.dto.LoginRequest;
import uk.ac.rhul.CS3821.dto.RegisterRequest;
import uk.ac.rhul.CS3821.service.AuthService;

/**
 * REST controller for authentication endpoints.
 */
@RestController
@RequestMapping({"/auth", "/api/auth"})
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Registers a new user and returns an access token.
     *
     * @param request registration payload
     * @return issued access token
     */
    @PostMapping("/register")
    public ResponseEntity<AccessTokenResponse> register(@Valid @RequestBody RegisterRequest request) {
        AccessTokenResponse token = authService.register(request);
        return ResponseEntity.ok(token);
    }

    /**
     * Authenticates user credentials and returns an access token.
     *
     * @param request login payload
     * @return issued access token
     */
    @PostMapping("/login")
    public ResponseEntity<AccessTokenResponse> login(@Valid @RequestBody LoginRequest request) {
        AccessTokenResponse token = authService.login(request);
        return ResponseEntity.ok(token);
    }
}