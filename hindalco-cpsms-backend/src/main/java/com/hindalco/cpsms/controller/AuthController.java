package com.hindalco.cpsms.controller;

import com.hindalco.cpsms.dto.AuthRequestDto;
import com.hindalco.cpsms.dto.AuthResponseDto;
import com.hindalco.cpsms.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody AuthRequestDto authRequest) {
        AuthResponseDto response = authService.login(authRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(@RequestBody AuthRequestDto authRequest) {
        AuthResponseDto response = authService.register(authRequest);
        return ResponseEntity.ok(response);
    }
}