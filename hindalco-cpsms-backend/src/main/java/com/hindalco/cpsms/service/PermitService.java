package com.hindalco.cpsms.service;

import java.util.List;

import com.hindalco.cpsms.dto.PermitDto;

public interface PermitService {
    
    PermitDto createPermit(PermitDto permitDto);
    PermitDto getPermitById(Long id);
    List<PermitDto> getAllPermits();
    List<PermitDto> getAllPermits(int page, int size, String status, String riskLevel, String permitType);
    PermitDto updatePermit(Long id, PermitDto permitDto);
    void deletePermit(Long id);
    
    // Workflow methods
    PermitDto approvePermit(Long id, Long approverId);
    PermitDto rejectPermit(Long id, Long rejectedById, String rejectionReason);
    PermitDto submitPermit(Long id);
    
    // Query methods
    List<PermitDto> getPermitsByUser(Long userId);
    List<PermitDto> getPermitsByStatus(String status);
    List<PermitDto> searchPermits(String query, int page, int size);
    List<String> getPermitHistory(Long id);
}