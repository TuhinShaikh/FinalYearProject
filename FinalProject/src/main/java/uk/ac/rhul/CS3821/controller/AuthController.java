package uk.ac.rhul.CS3821.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uk.ac.rhul.CS3821.model.User;
import uk.ac.rhul.CS3821.service.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {
