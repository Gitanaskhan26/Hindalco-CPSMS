package com.hindalco.cpsms.controller;

import com.hindalco.cpsms.dto.UserDto;
import com.hindalco.cpsms.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody UserDto userDto) {
        UserDto createdUser = userService.createUser(userDto);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        UserDto userDto = userService.getUserById(id);
        return ResponseEntity.ok(userDto);
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String status) {
        List<UserDto> users = userService.getAllUsers(page, size, department, status);
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @Valid @RequestBody UserDto userDto) {
        UserDto updatedUser = userService.updateUser(id, userDto);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<UserDto> activateUser(@PathVariable Long id) {
        UserDto userDto = userService.activateUser(id);
        return ResponseEntity.ok(userDto);
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<UserDto> deactivateUser(@PathVariable Long id) {
        UserDto userDto = userService.deactivateUser(id);
        return ResponseEntity.ok(userDto);
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserDto>> searchUsers(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<UserDto> users = userService.searchUsers(query, page, size);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/by-department")
    public ResponseEntity<List<UserDto>> getUsersByDepartment(@RequestParam String department) {
        List<UserDto> users = userService.getUsersByDepartment(department);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/by-role/{roleId}")
    public ResponseEntity<List<UserDto>> getUsersByRole(@PathVariable Long roleId) {
        List<UserDto> users = userService.getUsersByRole(roleId);
        return ResponseEntity.ok(users);
    }
}