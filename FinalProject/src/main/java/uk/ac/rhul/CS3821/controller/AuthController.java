package uk.ac.rhul.CS3821.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uk.ac.rhul.CS3821.dto.AccessTokenResponse;
import uk.ac.rhul.CS3821.dto.LoginRequest;
import uk.ac.rhul.CS3821.dto.RegisterRequest;
import uk.ac.rhul.CS3821.service.AuthService;

// I keep auth endpoints here so registration/login stays simple for the frontend.
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // I return a fresh token after registration so the user can continue as an authenticated session.
    @PostMapping("/register")
    public ResponseEntity<AccessTokenResponse> register(@RequestBody RegisterRequest request) {
        AccessTokenResponse token = authService.register(request);
        return ResponseEntity.ok(token);
    }

    // I validate credentials here and return a token for follow-up API calls.
    @PostMapping("/login")
    public ResponseEntity<AccessTokenResponse> login(@RequestBody LoginRequest request) {
        AccessTokenResponse token = authService.login(request);
        return ResponseEntity.ok(token);
    }
}