package uk.ac.rhul.CS3821.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uk.ac.rhul.CS3821.dto.AccessTokenResponse;
import uk.ac.rhul.CS3821.dto.LoginRequest;
import uk.ac.rhul.CS3821.dto.RegisterRequest;
import uk.ac.rhul.CS3821.service.AuthService;

// Exposes authentication endpoints so the frontend can register or log in a user and receive an access token
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Register a new user and return a fresh JWT so the UI can proceed as an authenticated session
    @PostMapping("/register")
    public ResponseEntity<AccessTokenResponse> register(@RequestBody RegisterRequest request) {
        AccessTokenResponse token = authService.register(request);
        return ResponseEntity.ok(token);
    }

    // Validate credentials and hand back an access token to reuse on subsequent API calls
    @PostMapping("/login")
    public ResponseEntity<AccessTokenResponse> login(@RequestBody LoginRequest request) {
        AccessTokenResponse token = authService.login(request);
        return ResponseEntity.ok(token);
    }
}