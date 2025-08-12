package com.hindalco.cpsms.service;

import com.hindalco.cpsms.dto.AuthRequestDto;
import com.hindalco.cpsms.dto.AuthResponseDto;

public interface AuthService {
    
    AuthResponseDto login(AuthRequestDto authRequest);
    AuthResponseDto register(AuthRequestDto authRequest);
    
    // Optional: Additional authentication methods
    void logout(String token);
    AuthResponseDto refreshToken(String refreshToken);
    boolean validateToken(String token);
    void resetPassword(String email);
    void changePassword(String email, String oldPassword, String newPassword);
}
