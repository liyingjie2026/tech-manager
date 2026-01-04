package com.research.project.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

/**
 * 专家抽取DTO
 */
@Data
public class ExpertDrawDTO {
    private Long projectId;
    
    @NotNull(message = "抽取数量不能为空")
    private Integer count;
    
    private List<SpecialtyRequirement> specialtyRequirements;
    
    private List<ExcludeCondition> excludeConditions;
    
    private String researchField;
    private List<Long> excludeExpertIds;
    
    public String getSpecialty() {
        return this.researchField;
    }
    
    public void setSpecialty(String specialty) {
        this.researchField = specialty;
    }
    
    public List<Long> getExcludeIds() {
        return this.excludeExpertIds;
    }
    
    public void setExcludeIds(List<Long> excludeIds) {
        this.excludeExpertIds = excludeIds;
    }
    
    @Data
    public static class SpecialtyRequirement {
        private String specialty;
        private Integer count;
    }
    
    @Data
    public static class ExcludeCondition {
        private String type;
        private String value;
        private String reason;
    }
}
