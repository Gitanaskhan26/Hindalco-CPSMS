package com.hindalco.cpsms.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "permit_types")
public class PermitType {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false, length = 100)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "required_ppe", columnDefinition = "TEXT")
    private String requiredPpe;
    
    @Column(name = "risk_assessment", columnDefinition = "TEXT")
    private String riskAssessment;
    
    @Column(name = "validity_hours")
    private Integer validityHours;
    
    @Column(name = "requires_approval")
    private Boolean requiresApproval = true;
    
    @OneToMany(mappedBy = "permitType", fetch = FetchType.LAZY)
    private Set<Permit> permits;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Constructors
    public PermitType() {}
    
    public PermitType(String name, String description, String requiredPpe, Integer validityHours) {
        this.name = name;
        this.description = description;
        this.requiredPpe = requiredPpe;
        this.validityHours = validityHours;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getRequiredPpe() { return requiredPpe; }
    public void setRequiredPpe(String requiredPpe) { this.requiredPpe = requiredPpe; }
    
    public String getRiskAssessment() { return riskAssessment; }
    public void setRiskAssessment(String riskAssessment) { this.riskAssessment = riskAssessment; }
    
    public Integer getValidityHours() { return validityHours; }
    public void setValidityHours(Integer validityHours) { this.validityHours = validityHours; }
    
    public Boolean getRequiresApproval() { return requiresApproval; }
    public void setRequiresApproval(Boolean requiresApproval) { this.requiresApproval = requiresApproval; }
    
    public Set<Permit> getPermits() { return permits; }
    public void setPermits(Set<Permit> permits) { this.permits = permits; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
