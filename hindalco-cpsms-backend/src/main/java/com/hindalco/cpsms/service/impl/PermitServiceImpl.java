package com.hindalco.cpsms.service.impl;

import com.hindalco.cpsms.dto.PermitDto;
import com.hindalco.cpsms.entity.Permit;
import com.hindalco.cpsms.entity.User;
import com.hindalco.cpsms.exception.ResourceNotFoundException;
import com.hindalco.cpsms.repository.PermitRepository;
import com.hindalco.cpsms.repository.UserRepository;
import com.hindalco.cpsms.service.GoogleAiService;
import com.hindalco.cpsms.service.PermitService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PermitServiceImpl implements PermitService {

    private final PermitRepository permitRepository;
    private final GoogleAiService googleAiService;
    private final UserRepository userRepository;

    public PermitServiceImpl(PermitRepository permitRepository,
                            GoogleAiService googleAiService,
                            UserRepository userRepository) {
        this.permitRepository = permitRepository;
        this.googleAiService = googleAiService;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public PermitDto createPermit(PermitDto permitDto) {
        // Get the applicant user
        User applicant = userRepository.findById(permitDto.getApplicantId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", permitDto.getApplicantId()));

        // Call Google AI service for risk assessment
        String riskAssessment = googleAiService.assessRisk(permitDto);

        // Create new Permit entity
        Permit newPermit = new Permit();
        newPermit.setPermitType(permitDto.getPermitType());
        newPermit.setTitle(permitDto.getTitle());
        newPermit.setDescription(permitDto.getDescription());
        newPermit.setWorkLocation(permitDto.getWorkLocation());
        newPermit.setStartDate(permitDto.getStartDate());
        newPermit.setEndDate(permitDto.getEndDate());
        newPermit.setRiskAssessmentDetails(riskAssessment);
        newPermit.setSafetyMeasures(permitDto.getSafetyMeasures());
        newPermit.setRequiredPpe(permitDto.getRequiredPpe());
        newPermit.setApplicant(applicant);
        newPermit.setStatus("DRAFT");

        // Generate permit number
        newPermit.setPermitNumber(generatePermitNumber());

        // Determine risk level from assessment
        if (riskAssessment.contains("HIGH")) {
            newPermit.setRiskLevel("HIGH");
        } else if (riskAssessment.contains("MEDIUM")) {
            newPermit.setRiskLevel("MEDIUM");
        } else {
            newPermit.setRiskLevel("LOW");
        }

        // Save the permit
        Permit savedPermit = permitRepository.save(newPermit);
        
        return convertToDto(savedPermit);
    }

    @Override
    @Transactional(readOnly = true)
    public PermitDto getPermitById(Long id) {
        Permit permit = permitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permit", "id", id));
        return convertToDto(permit);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PermitDto> getAllPermits() {
        return permitRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PermitDto> getAllPermits(int page, int size, String status, String riskLevel, String permitType) {
        Pageable pageable = PageRequest.of(page, size);
        
        // Use the flexible query method for filters
        Page<Permit> permits = permitRepository.findPermitsWithFilters(status, riskLevel, permitType, pageable);
        
        return permits.getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PermitDto updatePermit(Long id, PermitDto permitDto) {
        Permit existingPermit = permitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permit", "id", id));

        // Update fields
        existingPermit.setTitle(permitDto.getTitle());
        existingPermit.setDescription(permitDto.getDescription());
        existingPermit.setWorkLocation(permitDto.getWorkLocation());
        existingPermit.setStartDate(permitDto.getStartDate());
        existingPermit.setEndDate(permitDto.getEndDate());
        existingPermit.setSafetyMeasures(permitDto.getSafetyMeasures());
        existingPermit.setRequiredPpe(permitDto.getRequiredPpe());

        Permit savedPermit = permitRepository.save(existingPermit);
        return convertToDto(savedPermit);
    }

    @Override
    @Transactional
    public void deletePermit(Long id) {
        Permit permit = permitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permit", "id", id));
        permitRepository.delete(permit);
    }

    @Override
    @Transactional
    public PermitDto approvePermit(Long id, Long approverId) {
        Permit permit = permitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permit", "id", id));
        
        User approver = userRepository.findById(approverId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", approverId));

        permit.setStatus("APPROVED");
        permit.setApprovedBy(approver);
        permit.setApprovedAt(LocalDateTime.now());

        Permit savedPermit = permitRepository.save(permit);
        return convertToDto(savedPermit);
    }

    @Override
    @Transactional
    public PermitDto rejectPermit(Long id, Long rejectedById, String rejectionReason) {
        Permit permit = permitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permit", "id", id));
        
        User rejector = userRepository.findById(rejectedById)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", rejectedById));

        permit.setStatus("REJECTED");
        permit.setRejectedBy(rejector);
        permit.setRejectedAt(LocalDateTime.now());
        permit.setRejectionReason(rejectionReason);
        Permit savedPermit = permitRepository.save(permit);
        return convertToDto(savedPermit);
    }

    @Override
    @Transactional
    public PermitDto submitPermit(Long id) {
        Permit permit = permitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permit", "id", id));

        permit.setStatus("SUBMITTED");
        permit.setSubmittedAt(LocalDateTime.now());

        Permit savedPermit = permitRepository.save(permit);
        return convertToDto(savedPermit);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PermitDto> getPermitsByUser(Long userId) {
        List<Permit> permits = permitRepository.findByApplicantId(userId);
        return permits.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PermitDto> getPermitsByStatus(String status) {
        List<Permit> permits = permitRepository.findByStatus(status);
        return permits.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PermitDto> searchPermits(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Permit> permits = permitRepository.searchPermits(query, pageable);
        return permits.getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getPermitHistory(Long id) {
        Permit permit = permitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permit", "id", id));

        List<String> history = new ArrayList<>();
        
        if (permit.getCreatedAt() != null) {
            history.add("Permit created on " + permit.getCreatedAt());
        }
        
        history.add("Current status: " + permit.getStatus());

        if (permit.getSubmittedAt() != null) {
            history.add("Submitted on " + permit.getSubmittedAt());
        }

        if (permit.getApprovedAt() != null && permit.getApprovedBy() != null) {
            history.add("Approved on " + permit.getApprovedAt() + " by " + 
                       permit.getApprovedBy().getFirstName() + " " + permit.getApprovedBy().getLastName());
        }

        if (permit.getRejectedAt() != null && permit.getRejectedBy() != null) {
            history.add("Rejected on " + permit.getRejectedAt() + " by " + 
                       permit.getRejectedBy().getFirstName() + " " + permit.getRejectedBy().getLastName());
            if (permit.getRejectionReason() != null) {
                history.add("Rejection reason: " + permit.getRejectionReason());
            }
        }

        return history;
    }

    // Helper methods
    private PermitDto convertToDto(Permit permit) {
        PermitDto dto = new PermitDto();
        dto.setId(permit.getId());
        dto.setPermitNumber(permit.getPermitNumber());
        dto.setPermitType(permit.getPermitType());
        dto.setTitle(permit.getTitle());
        dto.setDescription(permit.getDescription());
        dto.setWorkLocation(permit.getWorkLocation());
        dto.setStartDate(permit.getStartDate());
        dto.setEndDate(permit.getEndDate());
        dto.setRiskLevel(permit.getRiskLevel());
        dto.setRiskAssessmentDetails(permit.getRiskAssessmentDetails());
        dto.setSafetyMeasures(permit.getSafetyMeasures());
        dto.setRequiredPpe(permit.getRequiredPpe());
        dto.setStatus(permit.getStatus());
        dto.setApplicantId(permit.getApplicant().getId());
        dto.setApplicantName(permit.getApplicant().getFirstName() + " " + permit.getApplicant().getLastName());
        dto.setCreatedAt(permit.getCreatedAt());
        dto.setUpdatedAt(permit.getUpdatedAt());
        
        if (permit.getApprovedBy() != null) {
            dto.setApprovedById(permit.getApprovedBy().getId());
            dto.setApprovedByName(permit.getApprovedBy().getFirstName() + " " + permit.getApprovedBy().getLastName());
            dto.setApprovedAt(permit.getApprovedAt());
        }
        
        if (permit.getRejectedBy() != null) {
            dto.setRejectedById(permit.getRejectedBy().getId());
            dto.setRejectedByName(permit.getRejectedBy().getFirstName() + " " + permit.getRejectedBy().getLastName());
            dto.setRejectedAt(permit.getRejectedAt());
        }
        
        dto.setRejectionReason(permit.getRejectionReason());
        
        return dto;
    }

    private String generatePermitNumber() {
        // Simple permit number generation - you might want to make this more sophisticated
        return "PERMIT-" + System.currentTimeMillis();
    }
}
