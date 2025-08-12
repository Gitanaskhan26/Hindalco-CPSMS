package com.hindalco.cpsms.service;

import org.springframework.stereotype.Service;

import com.hindalco.cpsms.dto.PermitDto;

@Service
public class GoogleAiService {

    public String assessRisk(PermitDto permitDto) {
        // Simple rule-based risk assessment (no AI integration yet)
        String permitType = permitDto.getPermitType();
        String workLocation = permitDto.getWorkLocation();
        String description = permitDto.getDescription();
        
        String riskLevel = determineRiskLevel(permitType, workLocation, description);
        return generateRiskAssessmentReport(permitType, riskLevel, description, workLocation);
    }
    
    private String determineRiskLevel(String permitType, String workLocation, String description) {
        if (permitType == null) return "MEDIUM";
        
        // Base risk level from permit type
        String baseRisk = getBaseRiskFromPermitType(permitType);
        
        // Adjust risk based on work location
        String adjustedRisk = adjustRiskForLocation(baseRisk, workLocation);
        
        // Further adjust based on description keywords
        return adjustRiskForDescription(adjustedRisk, description);
    }
    
    private String getBaseRiskFromPermitType(String permitType) {
        switch (permitType.toUpperCase()) {
            case "HOT_WORK":
            case "CONFINED_SPACE":
            case "HEIGHT_WORK":
                return "HIGH";
            case "ELECTRICAL_WORK":
            case "CHEMICAL_WORK":
                return "MEDIUM";
            case "GENERAL_WORK":
            default:
                return "LOW";
        }
    }
    
    private String adjustRiskForLocation(String baseRisk, String workLocation) {
        if (workLocation == null) return baseRisk;
        
        String location = workLocation.toLowerCase();
        
        // High-risk locations
        if (location.contains("chemical plant") || location.contains("reactor") || 
            location.contains("storage tank") || location.contains("furnace") ||
            location.contains("high voltage") || location.contains("roof")) {
            return "HIGH";
        }
        
        // Medium-risk locations
        if (location.contains("workshop") || location.contains("machinery") ||
            location.contains("basement") || location.contains("electrical room")) {
            if ("LOW".equals(baseRisk)) {
                return "MEDIUM";
            }
        }
        
        return baseRisk;
    }
    
    private String adjustRiskForDescription(String currentRisk, String description) {
        if (description == null) return currentRisk;
        
        String desc = description.toLowerCase();
        
        // High-risk keywords
        if (desc.contains("toxic") || desc.contains("explosive") || 
            desc.contains("high pressure") || desc.contains("radioactive") ||
            desc.contains("hazardous") || desc.contains("flammable")) {
            return "HIGH";
        }
        
        // Medium-risk keywords
        if (desc.contains("heavy machinery") || desc.contains("overhead work") ||
            desc.contains("electrical") || desc.contains("chemical")) {
            if ("LOW".equals(currentRisk)) {
                return "MEDIUM";
            }
        }
        
        return currentRisk;
    }
    
    private String generateRiskAssessmentReport(String permitType, String riskLevel, String description, String workLocation) {
        StringBuilder report = new StringBuilder();
        report.append("Risk Assessment Report\n");
        report.append("======================\n");
        report.append("Permit Type: ").append(permitType).append("\n");
        report.append("Work Location: ").append(workLocation != null ? workLocation : "Not specified").append("\n");
        report.append("Risk Level: ").append(riskLevel).append("\n");
        report.append("Assessment: ");
        
        switch (riskLevel) {
            case "HIGH":
                report.append("This work involves high-risk activities. ");
                report.append("Strict safety protocols must be followed. ");
                report.append("Supervisor approval and safety briefing required. ");
                report.append("Emergency procedures must be in place.");
                break;
            case "MEDIUM":
                report.append("This work involves moderate risk. ");
                report.append("Standard safety measures should be implemented. ");
                report.append("Safety equipment verification required. ");
                report.append("Regular safety checks recommended.");
                break;
            case "LOW":
            default:
                report.append("This work involves low risk. ");
                report.append("Basic safety measures are sufficient. ");
                report.append("Standard PPE requirements apply.");
                break;
        }
        
        if (description != null && !description.trim().isEmpty()) {
            report.append("\n\nWork Description: ").append(description);
        }
        
        // Add location-specific recommendations
        if (workLocation != null) {
            report.append("\n\nLocation-specific considerations: ");
            addLocationSpecificRecommendations(report, workLocation.toLowerCase());
        }
        
        return report.toString();
    }
    
    private void addLocationSpecificRecommendations(StringBuilder report, String location) {
        if (location.contains("chemical") || location.contains("reactor")) {
            report.append("Chemical exposure protocols required. ");
        }
        if (location.contains("height") || location.contains("roof")) {
            report.append("Fall protection equipment mandatory. ");
        }
        if (location.contains("confined") || location.contains("tank")) {
            report.append("Atmospheric testing and ventilation required. ");
        }
        if (location.contains("electrical")) {
            report.append("Lockout/tagout procedures must be followed. ");
        }
    }
}