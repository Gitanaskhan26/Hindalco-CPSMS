package com.hindalco.cpsms.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hindalco.cpsms.entity.Permit;

@Repository
public interface PermitRepository extends JpaRepository<Permit, Long> {
    
    Optional<Permit> findByPermitNumber(String permitNumber);
    List<Permit> findByStatus(String status);
    List<Permit> findByApplicantId(Long applicantId);
    List<Permit> findByPermitType(String permitType);
    List<Permit> findByRiskLevel(String riskLevel);
    
    // Pagination methods
    Page<Permit> findByStatus(String status, Pageable pageable);
    Page<Permit> findByPermitType(String permitType, Pageable pageable);
    Page<Permit> findByRiskLevel(String riskLevel, Pageable pageable);
    Page<Permit> findByApplicantId(Long applicantId, Pageable pageable);
    
    // Combined filters
    Page<Permit> findByStatusAndPermitTypeAndRiskLevel(String status, String permitType, String riskLevel, Pageable pageable);
    Page<Permit> findByStatusAndPermitType(String status, String permitType, Pageable pageable);
    Page<Permit> findByStatusAndRiskLevel(String status, String riskLevel, Pageable pageable);
    Page<Permit> findByPermitTypeAndRiskLevel(String permitType, String riskLevel, Pageable pageable);
    
    // Search methods
    @Query("SELECT p FROM Permit p WHERE " +
           "LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.workLocation) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Permit> searchPermits(@Param("query") String query, Pageable pageable);
    
    // Date range queries
    List<Permit> findByStartDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<Permit> findByEndDateBefore(LocalDateTime date);
    
    // Status and date combinations
    List<Permit> findByStatusAndStartDateAfter(String status, LocalDateTime date);
    List<Permit> findByStatusAndEndDateBefore(String status, LocalDateTime date);
    
    // Count methods
    long countByStatus(String status);
    long countByPermitType(String permitType);
    long countByRiskLevel(String riskLevel);
    long countByApplicantId(Long applicantId);

    // New method with nullable parameters
    @Query("SELECT p FROM Permit p WHERE " +
           "(:status IS NULL OR p.status = :status) AND " +
           "(:riskLevel IS NULL OR p.riskLevel = :riskLevel) AND " +
           "(:permitType IS NULL OR p.permitType = :permitType)")
    Page<Permit> findPermitsWithFilters(@Param("status") String status, 
                                       @Param("riskLevel") String riskLevel, 
                                       @Param("permitType") String permitType, 
                                       Pageable pageable);
}