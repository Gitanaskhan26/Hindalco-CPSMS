package com.hindalco.cpsms.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.hindalco.cpsms.entity.Department;
import com.hindalco.cpsms.entity.Role;
import com.hindalco.cpsms.entity.User;
import com.hindalco.cpsms.repository.DepartmentRepository;
import com.hindalco.cpsms.repository.RoleRepository;
import com.hindalco.cpsms.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final DepartmentRepository departmentRepository;

    @Autowired
    public DataInitializer(RoleRepository roleRepository, 
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          DepartmentRepository departmentRepository) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.departmentRepository = departmentRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Initialize roles if they don't exist
        initializeRoles();
        
        // Initialize a test user if no users exist
        initializeTestUser();
    }

    private void initializeRoles() {
        // Create EMPLOYEE role if it doesn't exist
        if (!roleRepository.existsByName("EMPLOYEE")) {
            Role employeeRole = new Role("EMPLOYEE", 
                "Standard employee with basic permissions", 
                "READ_PERMITS,CREATE_PERMIT_REQUEST");
            roleRepository.save(employeeRole);
            System.out.println("✓ Created EMPLOYEE role");
        }

        // Create ADMIN role if it doesn't exist
        if (!roleRepository.existsByName("ADMIN")) {
            Role adminRole = new Role("ADMIN", 
                "Administrator with full permissions", 
                "ALL_PERMISSIONS");
            roleRepository.save(adminRole);
            System.out.println("✓ Created ADMIN role");
        }

        // Create SECURITY role if it doesn't exist
        if (!roleRepository.existsByName("SECURITY")) {
            Role securityRole = new Role("SECURITY", 
                "Security personnel with permit approval permissions", 
                "READ_PERMITS,APPROVE_PERMITS,SCAN_QR");
            roleRepository.save(securityRole);
            System.out.println("✓ Created SECURITY role");
        }
    }

    private void initializeTestUser() {
        // Create a test user if no users exist
        if (userRepository.count() == 0) {
            Role employeeRole = roleRepository.findByName("EMPLOYEE")
                .orElseThrow(() -> new RuntimeException("EMPLOYEE role not found"));

            User testUser = new User();
            testUser.setEmployeeId("EMP001");
            testUser.setEmail("test@hindalco.com");
            testUser.setFirstName("Test");
            testUser.setLastName("User");
            // Find or create IT department
            Department itDept = departmentRepository.findByName("IT");
            if (itDept == null) {
                itDept = new com.hindalco.cpsms.entity.Department();
                itDept.setName("IT");
                itDept = departmentRepository.save(itDept);
            }
            testUser.setDepartment(itDept);
            testUser.setPosition("Developer");
            testUser.setPhone("+91-1234567890");
            testUser.setPasswordHash(passwordEncoder.encode("password123"));
            testUser.setRole(employeeRole);
            testUser.setStatus("ACTIVE");

            userRepository.save(testUser);
            System.out.println("✓ Created test user: test@hindalco.com / password123");
        }
    }
}
