package com.hindalco.cpsms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hindalco.cpsms.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Basic finders (non-paginated)
    Optional<User> findByEmail(String email);
    Optional<User> findByEmployeeId(String employeeId);
    boolean existsByEmail(String email);
    boolean existsByEmployeeId(String employeeId);
    
    List<User> findByRoleId(Long roleId);
    List<User> findByStatus(String status);
    List<User> findByDepartmentName(String departmentName);
    List<User> findByPosition(String position);
    
    // Paginated versions (add these missing methods)
    Page<User> findByRoleId(Long roleId, Pageable pageable);
    Page<User> findByStatus(String status, Pageable pageable);  // This was missing
    Page<User> findByDepartmentName(String departmentName, Pageable pageable);  // This was missing
    Page<User> findByPosition(String position, Pageable pageable);
    
    // Combined filters with pagination
    Page<User> findByStatusAndDepartmentName(String status, String departmentName, Pageable pageable);  // This was missing
    Page<User> findByRoleIdAndStatus(Long roleId, String status, Pageable pageable);
    Page<User> findByRoleIdAndDepartmentName(Long roleId, String departmentName, Pageable pageable);
    
    // Custom queries
    @Query("SELECT u FROM User u WHERE u.role.name = :roleName")
    List<User> findByRoleName(@Param("roleName") String roleName);
    
    @Query("SELECT u FROM User u WHERE u.role.name = :roleName AND u.status = 'ACTIVE'")
    List<User> findActiveUsersByRoleName(@Param("roleName") String roleName);
    
    // Search functionality with pagination
    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.employeeId) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<User> searchUsers(@Param("query") String query);
    
    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.employeeId) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<User> searchUsers(@Param("query") String query, Pageable pageable);  // This was missing
    
    // Count methods
    long countByRoleId(Long roleId);
    long countByStatus(String status);
    long countByDepartmentName(String departmentName);
}