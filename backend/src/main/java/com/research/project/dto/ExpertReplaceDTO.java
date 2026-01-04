package com.research.project.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 专家替换DTO
 */
@Data
public class ExpertReplaceDTO {
    @NotNull(message = "原专家ID不能为空")
    private Long originalExpertId;
    
    @NotNull(message = "新专家ID不能为空")
    private Long newExpertId;
    
    private String reason;
    
    private String researchField;
    
    public Long getOldExpertId() {
        return this.originalExpertId;
    }
    
    public void setOldExpertId(Long oldExpertId) {
        this.originalExpertId = oldExpertId;
    }
    
    public String getSpecialty() {
        return this.researchField;
    }
    
    public void setSpecialty(String specialty) {
        this.researchField = specialty;
    }
}
