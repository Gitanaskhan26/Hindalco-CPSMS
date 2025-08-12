package com.hindalco.cpsms.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "permits")
public class Permit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "permit_number", unique = true, nullable = false)
    private String permitNumber;

    @Column(name = "permit_type", nullable = false)
    private String permitType;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "work_location")
    private String workLocation;

    // Location relationship - for structured location data
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id")
    private Location location;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "risk_level")
    private String riskLevel;

    @Column(name = "risk_assessment_details", columnDefinition = "TEXT")
    private String riskAssessmentDetails;

    @Column(name = "safety_measures", columnDefinition = "TEXT")
    private String safetyMeasures;

    @Column(name = "required_ppe", columnDefinition = "TEXT")
    private String requiredPpe;

    @Column(name = "status", nullable = false)
    private String status;

    // Applicant relationship
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "applicant_id", nullable = false)
    private User applicant;

    // Approval workflow fields
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by_id")
    private User approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    // Rejection workflow fields
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rejected_by_id")
    private User rejectedBy;

    @Column(name = "rejected_at")
    private LocalDateTime rejectedAt;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    // Submission tracking
    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    // Audit fields
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public Permit() {}

    // JPA lifecycle methods
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

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

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public User getApplicant() {
        return applicant;
    }

    public void setApplicant(User applicant) {
        this.applicant = applicant;
    }

    // Approval workflow getters and setters
    public User getApprovedBy() {
        return approvedBy;
    }

    public void setApprovedBy(User approvedBy) {
        this.approvedBy = approvedBy;
    }

    public LocalDateTime getApprovedAt() {
        return approvedAt;
    }

    public void setApprovedAt(LocalDateTime approvedAt) {
        this.approvedAt = approvedAt;
    }

    // Rejection workflow getters and setters
    public User getRejectedBy() {
        return rejectedBy;
    }

    public void setRejectedBy(User rejectedBy) {
        this.rejectedBy = rejectedBy;
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

    // Submission tracking getters and setters
    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    // Audit field getters and setters
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

    @Override
    public String toString() {
        return "Permit{" +
                "id=" + id +
                ", permitNumber='" + permitNumber + '\'' +
                ", title='" + title + '\'' +
                ", status='" + status + '\'' +
                ", riskLevel='" + riskLevel + '\'' +
                '}';
    }
}