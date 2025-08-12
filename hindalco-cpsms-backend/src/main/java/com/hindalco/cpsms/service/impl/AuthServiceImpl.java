package com.hindalco.cpsms.service.impl;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hindalco.cpsms.dto.AuthRequestDto;
import com.hindalco.cpsms.dto.AuthResponseDto;
import com.hindalco.cpsms.entity.Department;
import com.hindalco.cpsms.entity.Role;
import com.hindalco.cpsms.entity.User;
import com.hindalco.cpsms.exception.BadRequestException;
import com.hindalco.cpsms.exception.ResourceNotFoundException;
import com.hindalco.cpsms.repository.DepartmentRepository;
import com.hindalco.cpsms.repository.RoleRepository;
import com.hindalco.cpsms.repository.UserRepository;
import com.hindalco.cpsms.security.JwtService;
import com.hindalco.cpsms.service.AuthService;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final DepartmentRepository departmentRepository;

    public AuthServiceImpl(UserRepository userRepository,
                          RoleRepository roleRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService,
                          AuthenticationManager authenticationManager,
                          DepartmentRepository departmentRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.departmentRepository = departmentRepository;
    }

    @Override
    public AuthResponseDto login(AuthRequestDto authRequest) {
        // Authenticate user
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                authRequest.getEmail(),
                authRequest.getPassword()
            )
        );

        // Get user details
        User user = userRepository.findByEmail(authRequest.getEmail())
            .orElseThrow(() -> new ResourceNotFoundException("User", "email", authRequest.getEmail()));

        // Generate JWT token
        String jwt = jwtService.generateToken(user.getEmail());

        return new AuthResponseDto(
            jwt,
            user.getId(),
            user.getEmployeeId(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getRole().getName(),
            "Login successful"
        );
    }

    @Override
    public AuthResponseDto register(AuthRequestDto authRequest) {
        // Validate input
        if (authRequest.getEmail() == null || authRequest.getEmail().trim().isEmpty()) {
            throw new BadRequestException("Email is required");
        }
        
        if (authRequest.getPassword() == null || authRequest.getPassword().trim().isEmpty()) {
            throw new BadRequestException("Password is required");
        }
        
        if (authRequest.getEmployeeId() == null || authRequest.getEmployeeId().trim().isEmpty()) {
            throw new BadRequestException("Employee ID is required");
        }

        // Check if user already exists
        if (userRepository.existsByEmail(authRequest.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        if (userRepository.existsByEmployeeId(authRequest.getEmployeeId())) {
            throw new BadRequestException("Employee ID already registered");
        }

        // Get default role (EMPLOYEE)
        Role defaultRole = roleRepository.findByName("EMPLOYEE")
            .orElseThrow(() -> new ResourceNotFoundException("Role", "name", "EMPLOYEE"));

        // Create new user
        User user = new User();
        user.setEmployeeId(authRequest.getEmployeeId());
        user.setEmail(authRequest.getEmail());
        user.setPasswordHash(passwordEncoder.encode(authRequest.getPassword()));
        user.setFirstName(authRequest.getFirstName());
        user.setLastName(authRequest.getLastName());
        // Find or create department
        Department dept = departmentRepository.findByName(authRequest.getDepartment());
        if (dept == null) {
            dept = new com.hindalco.cpsms.entity.Department();
            dept.setName(authRequest.getDepartment());
            dept = departmentRepository.save(dept);
        }
        user.setDepartment(dept);
        user.setPosition(authRequest.getPosition());
        user.setPhone(authRequest.getPhone());
        user.setRole(defaultRole);
        user.setStatus("ACTIVE");

        // Save user
        User savedUser = userRepository.save(user);

        // Generate JWT token
        String jwt = jwtService.generateToken(savedUser.getEmail());

        return new AuthResponseDto(
            jwt,
            savedUser.getId(),
            savedUser.getEmployeeId(),
            savedUser.getEmail(),
            savedUser.getFirstName(),
            savedUser.getLastName(),
            savedUser.getRole().getName(),
            "Registration successful"
        );
    }

    @Override
    public void logout(String token) {
        // TODO: Implement token blacklisting
        // For now, just validate the token
        if (token == null || token.trim().isEmpty()) {
            throw new BadRequestException("Token is required");
        }
        
        // In a real implementation, you might add the token to a blacklist
        // or use Redis to store invalidated tokens
    }

    @Override
    public AuthResponseDto refreshToken(String refreshToken) {
        // TODO: Implement refresh token logic
        if (refreshToken == null || refreshToken.trim().isEmpty()) {
            throw new BadRequestException("Refresh token is required");
        }
        
        // For now, throw an exception as this feature is not implemented
        throw new BadRequestException("Refresh token functionality not yet implemented");
    }

    @Override
    public boolean validateToken(String token) {
        try {
            if (token == null || token.trim().isEmpty()) {
                return false;
            }
            
            String username = jwtService.extractUsername(token);
            return username != null && userRepository.existsByEmail(username);
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public void resetPassword(String email) {
        // Validate input
        if (email == null || email.trim().isEmpty()) {
            throw new BadRequestException("Email is required");
        }

        // Check if user exists (throws exception if not found)
        userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        // TODO: Implement actual password reset logic
        // This would typically involve:
        // 1. Generate a reset token
        // 2. Store it with expiration
        // 3. Send email with reset link
        
        // For now, just validate that the user exists
        // In a real implementation, you would send an email
    }

    @Override
    public void changePassword(String email, String oldPassword, String newPassword) {
        // Validate input
        if (email == null || email.trim().isEmpty()) {
            throw new BadRequestException("Email is required");
        }
        
        if (oldPassword == null || oldPassword.trim().isEmpty()) {
            throw new BadRequestException("Old password is required");
        }
        
        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new BadRequestException("New password is required");
        }

        // Get user
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        // Verify old password
        if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
            throw new BadRequestException("Invalid old password");
        }

        // Update password
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
