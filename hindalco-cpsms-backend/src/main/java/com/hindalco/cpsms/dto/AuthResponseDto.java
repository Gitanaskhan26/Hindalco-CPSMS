package com.hindalco.cpsms.dto;

import java.time.LocalDateTime;

public class AuthResponseDto {
    
    private String token;
    private String tokenType = "Bearer";
    private Long userId;
    private String employeeId;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private String message;
    private LocalDateTime expiresAt;

    // Constructors
    public AuthResponseDto() {}

    public AuthResponseDto(String token, Long userId, String employeeId, String email, 
                          String firstName, String lastName, String role, String message) {
        this.token = token;
        this.userId = userId;
        this.employeeId = employeeId;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.message = message;
        // Set expiration time (24 hours from now)
        this.expiresAt = LocalDateTime.now().plusHours(24);
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    // Helper methods
    public String getFullName() {
        return firstName + " " + lastName;
    }

    public boolean isTokenExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }
}