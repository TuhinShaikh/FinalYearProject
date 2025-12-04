package uk.ac.rhul.CS3821.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uk.ac.rhul.CS3821.dto.AccessTokenResponse;
import uk.ac.rhul.CS3821.dto.LoginRequest;
import uk.ac.rhul.CS3821.dto.RegisterRequest;
import uk.ac.rhul.CS3821.service.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AccessTokenResponse> register(@RequestBody RegisterRequest request) {
        AccessTokenResponse token = authService.register(request);
        return ResponseEntity.ok(token);
    }

    @PostMapping("/login")
    public ResponseEntity<AccessTokenResponse> login(@RequestBody LoginRequest request) {
        AccessTokenResponse token = authService.login(request);
        return ResponseEntity.ok(token);
    }
}