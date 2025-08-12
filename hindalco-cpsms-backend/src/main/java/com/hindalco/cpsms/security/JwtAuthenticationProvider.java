package com.hindalco.cpsms.security;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.hindalco.cpsms.entity.User;
import com.hindalco.cpsms.repository.UserRepository;

@Component
public class JwtAuthenticationProvider implements AuthenticationProvider {

    private final UserDetailsServiceImpl userDetailsService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public JwtAuthenticationProvider(UserDetailsServiceImpl userDetailsService,
                                   UserRepository userRepository,
                                   PasswordEncoder passwordEncoder) {
        this.userDetailsService = userDetailsService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String username = authentication.getName(); // This is the email
        String password = authentication.getCredentials().toString();

        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        User user = userRepository.findByEmail(username) // Changed from findByUsername
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        // Use password encoder to check password
        if (passwordEncoder.matches(password, user.getPasswordHash())) {
            return new UsernamePasswordAuthenticationToken(userDetails, password, userDetails.getAuthorities());
        } else {
            throw new BadCredentialsException("Invalid credentials");
        }
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }
}