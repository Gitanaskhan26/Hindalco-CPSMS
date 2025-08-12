package com.hindalco.cpsms.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class PermitDto {
    
    private Long id;
    
    private String permitNumber;
    
    @NotBlank(message = "Permit type is required")
    private String permitType;
    
    private String status;
    
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    @NotBlank(message = "Work location is required")
    @Size(max = 200, message = "Work location must not exceed 200 characters")
    private String workLocation;
    
    @NotNull(message = "Start date is required")
    private LocalDateTime startDate;
    
    @NotNull(message = "End date is required")
    private LocalDateTime endDate;
    
    private String riskLevel;
    private String riskAssessmentDetails;
    private String safetyMeasures;
    private String requiredPpe;
    
    // User information
    @NotNull(message = "Applicant ID is required")
    private Long applicantId;
    private String applicantName;
    private String applicantEmployeeId;
    
    private Long approvedById;
    private String approvedByName;
    private LocalDateTime approvedAt;
    private Long rejectedById;
    private String rejectedByName;
    private LocalDateTime rejectedAt;
    private String rejectionReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime submittedAt;

    // Constructors
    public PermitDto() {}

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPermitNumber() {
        return permitNumber;
    }

    public void setPermitNumber(String permitNumber) {
        this.permitNumber = permitNumber;
    }

    public String getPermitType() {
        return permitType;
    }

    public void setPermitType(String permitType) {
        this.permitType = permitType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getWorkLocation() {
        return workLocation;
    }

    public void setWorkLocation(String workLocation) {
        this.workLocation = workLocation;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public String getRiskAssessmentDetails() {
        return riskAssessmentDetails;
    }

    public void setRiskAssessmentDetails(String riskAssessmentDetails) {
        this.riskAssessmentDetails = riskAssessmentDetails;
    }

    public String getSafetyMeasures() {
        return safetyMeasures;
    }

    public void setSafetyMeasures(String safetyMeasures) {
        this.safetyMeasures = safetyMeasures;
    }

    public String getRequiredPpe() {
        return requiredPpe;
    }

    public void setRequiredPpe(String requiredPpe) {
        this.requiredPpe = requiredPpe;
    }

    public Long getApplicantId() {
        return applicantId;
    }

    public void setApplicantId(Long applicantId) {
        this.applicantId = applicantId;
    }

    public String getApplicantName() {
        return applicantName;
    }

    public void setApplicantName(String applicantName) {
        this.applicantName = applicantName;
    }

    public String getApplicantEmployeeId() {
        return applicantEmployeeId;
    }

    public void setApplicantEmployeeId(String applicantEmployeeId) {
        this.applicantEmployeeId = applicantEmployeeId;
    }

    public Long getApprovedById() {
        return approvedById;
    }

    public void setApprovedById(Long approvedById) {
        this.approvedById = approvedById;
    }

    public String getApprovedByName() {
        return approvedByName;
    }

    public void setApprovedByName(String approvedByName) {
        this.approvedByName = approvedByName;
    }

    public LocalDateTime getApprovedAt() {
        return approvedAt;
    }

    public void setApprovedAt(LocalDateTime approvedAt) {
        this.approvedAt = approvedAt;
    }

    public Long getRejectedById() {
        return rejectedById;
    }

    public void setRejectedById(Long rejectedById) {
        this.rejectedById = rejectedById;
    }

    public String getRejectedByName() {
        return rejectedByName;
    }

    public void setRejectedByName(String rejectedByName) {
        this.rejectedByName = rejectedByName;
    }

    public LocalDateTime getRejectedAt() {
        return rejectedAt;
    }

    public void setRejectedAt(LocalDateTime rejectedAt) {
        this.rejectedAt = rejectedAt;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }
}