package com.hindalco.cpsms.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hindalco.cpsms.dto.UserDto;
import com.hindalco.cpsms.entity.Department;
import com.hindalco.cpsms.entity.Role;
import com.hindalco.cpsms.entity.User;
import com.hindalco.cpsms.exception.BadRequestException;
import com.hindalco.cpsms.exception.ResourceNotFoundException;
import com.hindalco.cpsms.repository.DepartmentRepository;
import com.hindalco.cpsms.repository.RoleRepository;
import com.hindalco.cpsms.repository.UserRepository;
import com.hindalco.cpsms.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final DepartmentRepository departmentRepository;

    public UserServiceImpl(UserRepository userRepository,
                          RoleRepository roleRepository,
                          PasswordEncoder passwordEncoder,
                          DepartmentRepository departmentRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.departmentRepository = departmentRepository;
    }

    @Override
    @Transactional
    public UserDto createUser(UserDto userDto) {
        // Validate input
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new BadRequestException("Email already exists");
        }
        
        if (userRepository.existsByEmployeeId(userDto.getEmployeeId())) {
            throw new BadRequestException("Employee ID already exists");
        }

        // Get role
        Role role = roleRepository.findById(userDto.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Role", "id", userDto.getRoleId()));

        // Create user
        User user = new User();
        user.setEmployeeId(userDto.getEmployeeId());
        user.setEmail(userDto.getEmail());
        user.setPasswordHash(passwordEncoder.encode(userDto.getPassword()));
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        // Find or create department
        Department dept = departmentRepository.findByName(userDto.getDepartment());
        if (dept == null) {
            dept = new com.hindalco.cpsms.entity.Department();
            dept.setName(userDto.getDepartment());
            dept = departmentRepository.save(dept);
        }
        user.setDepartment(dept);
        user.setPosition(userDto.getPosition());
        user.setPhone(userDto.getPhone());
        user.setRole(role);
        user.setStatus("ACTIVE");

        User savedUser = userRepository.save(user);
        return convertToDto(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return convertToDto(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getUserByEmployeeId(String employeeId) {
        User user = userRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "employeeId", employeeId));
        return convertToDto(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers(int page, int size, String status, String department) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users;

        // Apply filters based on provided parameters
        if (status != null && department != null) {
            users = userRepository.findByStatusAndDepartmentName(status, department, pageable);
        } else if (status != null) {
            users = userRepository.findByStatus(status, pageable);
        } else if (department != null) {
            users = userRepository.findByDepartmentName(department, pageable);
        } else {
            users = userRepository.findAll(pageable);
        }

        return users.getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> getUsersByRole(Long roleId) {
        List<User> users = userRepository.findByRoleId(roleId);
        return users.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> getUsersByDepartment(String department) {
        List<User> users = userRepository.findByDepartmentName(department);
        return users.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> searchUsers(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = userRepository.searchUsers(query, pageable);
        return users.getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserDto updateUser(Long id, UserDto userDto) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        // Update fields
        existingUser.setFirstName(userDto.getFirstName());
        existingUser.setLastName(userDto.getLastName());
        // Find or create department
        Department dept = departmentRepository.findByName(userDto.getDepartment());
        if (dept == null) {
            dept = new com.hindalco.cpsms.entity.Department();
            dept.setName(userDto.getDepartment());
            dept = departmentRepository.save(dept);
        }
        existingUser.setDepartment(dept);
        existingUser.setPosition(userDto.getPosition());
        existingUser.setPhone(userDto.getPhone());

        if (userDto.getRoleId() != null) {
            Role role = roleRepository.findById(userDto.getRoleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Role", "id", userDto.getRoleId()));
            existingUser.setRole(role);
        }

        User savedUser = userRepository.save(existingUser);
        return convertToDto(savedUser);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        userRepository.delete(user);
    }

    @Override
    @Transactional
    public UserDto activateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        
        user.setStatus("ACTIVE");
        User savedUser = userRepository.save(user);
        return convertToDto(savedUser);
    }

    @Override
    @Transactional
    public UserDto deactivateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        
        user.setStatus("INACTIVE");
        User savedUser = userRepository.save(user);
        return convertToDto(savedUser);
    }

    // Helper method
    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setEmployeeId(user.getEmployeeId());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setDepartment(user.getDepartment() != null ? user.getDepartment().getName() : null);
        dto.setPosition(user.getPosition());
        dto.setPhone(user.getPhone());
        dto.setStatus(user.getStatus());
        dto.setRoleId(user.getRole().getId());
        dto.setRoleName(user.getRole().getName());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }
}
