package com.hindalco.cpsms.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

import com.hindalco.cpsms.security.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, 
                          CorsConfigurationSource corsConfigurationSource) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.corsConfigurationSource = corsConfigurationSource;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                // Public endpoints
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/health").permitAll()
                .requestMatchers("/test/**").permitAll() // For testing
                .requestMatchers("/h2-console/**").permitAll() // For testing
                
                // Admin endpoints
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/users/**").hasAnyRole("ADMIN", "SAFETY_OFFICER")
                
                // Permit endpoints
                .requestMatchers("/permits/create").hasAnyRole("EMPLOYEE", "SUPERVISOR", "SAFETY_OFFICER", "ADMIN")
                .requestMatchers("/permits/approve/**").hasAnyRole("SUPERVISOR", "SAFETY_OFFICER", "ADMIN")
                .requestMatchers("/permits/**").authenticated()
                
                // Visitor endpoints
                .requestMatchers("/visitors/requests").hasAnyRole("EMPLOYEE", "SUPERVISOR", "SAFETY_OFFICER", "ADMIN")
                .requestMatchers("/visitors/manage/**").hasAnyRole("SECURITY", "ADMIN")
                .requestMatchers("/visitors/**").authenticated()
                
                // Notification endpoints
                .requestMatchers("/notifications/**").authenticated()
                
                // All other requests require authentication
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        // For H2 console (development only)
        http.headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable()));

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}