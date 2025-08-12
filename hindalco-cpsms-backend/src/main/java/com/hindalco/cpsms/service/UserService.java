package com.hindalco.cpsms.service;

import java.util.List;

import com.hindalco.cpsms.dto.UserDto;

public interface UserService {
    
    // User CRUD operations
    UserDto createUser(UserDto userDto);
    UserDto getUserById(Long id);
    UserDto getUserByEmployeeId(String employeeId);
    
    // Get all users methods
    List<UserDto> getAllUsers();  // Add this line
    List<UserDto> getAllUsers(int page, int size, String status, String department);
    
    // Other methods
    List<UserDto> getUsersByRole(Long roleId);
    List<UserDto> getUsersByDepartment(String department);
    List<UserDto> searchUsers(String query, int page, int size);
    
    UserDto updateUser(Long id, UserDto userDto);
    void deleteUser(Long id);
    
    UserDto activateUser(Long id);
    UserDto deactivateUser(Long id);
}