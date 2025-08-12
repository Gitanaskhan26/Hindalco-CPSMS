package com.hindalco.cpsms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.hindalco.cpsms.entity.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    
    Optional<Role> findByName(String name);
    boolean existsByName(String name);
    
    // Additional useful methods
    List<Role> findByNameContainingIgnoreCase(String name);
    
    @Query("SELECT r FROM Role r WHERE r.name IN :names")
    List<Role> findByNames(List<String> names);
    
    // Count methods
    long countByName(String name);
}