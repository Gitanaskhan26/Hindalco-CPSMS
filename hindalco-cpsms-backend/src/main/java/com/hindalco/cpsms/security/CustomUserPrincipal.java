package com.hindalco.cpsms.security;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.hindalco.cpsms.entity.User;

public class CustomUserPrincipal implements UserDetails {
    
    private final Long id;
    private final String email;
    private final String password;
    private final Collection<? extends GrantedAuthority> authorities;
    private final boolean enabled;

    public CustomUserPrincipal(Long id, String email, String password, 
                              Collection<? extends GrantedAuthority> authorities, boolean enabled) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
        this.enabled = enabled;
    }

    public static CustomUserPrincipal create(User user) {
        Collection<GrantedAuthority> authorities = Collections.singletonList(
            new SimpleGrantedAuthority("ROLE_" + user.getRole().getName())
        );

        return new CustomUserPrincipal(
            user.getId(),
            user.getEmail(),
            user.getPasswordHash(),
            authorities,
            "ACTIVE".equals(user.getStatus())
        );
    }

    public Long getId() {
        return id;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }
}