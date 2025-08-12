package com.hindalco.cpsms.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hindalco.cpsms.entity.Department;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    Department findByName(String name);
}
