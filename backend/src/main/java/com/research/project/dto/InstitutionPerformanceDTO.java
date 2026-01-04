package com.research.project.dto;

import lombok.Data;

/**
 * 机构绩效DTO
 */
@Data
public class InstitutionPerformanceDTO {
    private Long institutionId;
    private String institutionName;
    private Integer totalProjects;
    private Integer completedProjects;
    private Integer ongoingProjects;
    private Double completionRate;
    private Integer totalAchievements;
    private Integer patents;
    private Integer papers;
    private Integer awards;
    private String performanceLevel;
    private Integer ranking;
    
    public void setProjectCount(Integer count) {
        this.totalProjects = count;
    }
    
    public void setAchievementCount(Integer count) {
        this.totalAchievements = count;
    }
    
    public void setTotalBudget(Double budget) {
        // This field doesn't exist in the DTO, but we can ignore it
        // or add a new field if needed
    }
    
    public void setScore(Double score) {
        // Map score to performanceLevel
        if (score >= 90) {
            this.performanceLevel = "优秀";
        } else if (score >= 80) {
            this.performanceLevel = "良好";
        } else if (score >= 70) {
            this.performanceLevel = "中等";
        } else {
            this.performanceLevel = "一般";
        }
    }
}
