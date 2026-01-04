package com.research.project.vo;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 验收视图对象
 */
@Data
public class AcceptanceVO {
    
    private Long id;
    
    private String acceptanceNo;
    
    private Long projectId;
    
    private String projectNo;
    
    private String projectName;
    
    private String projectType;
    
    private String projectTypeText;
    
    private String institutionName;
    
    private String leaderName;
    
    private String acceptanceType;
    
    private String acceptanceTypeText;
    
    private String projectSummary;
    
    private String completedWork;
    
    private String achievedResults;
    
    private String innovationPoints;
    
    private String applicationProspects;
    
    private String existingProblems;
    
    private BigDecimal totalBudget;
    
    private BigDecimal totalUsedBudget;
    
    private String budgetUsageDetail;
    
    private String selfEvaluation;
    
    private List<AchievementVO> achievements;
    
    private List<FileVO> attachments;
    
    private String status;
    
    private String statusText;
    
    private String acceptanceResult;
    
    private String acceptanceOpinion;
    
    private BigDecimal expertScore;
    
    private LocalDateTime submitTime;
    
    private LocalDateTime acceptanceTime;
    
    private LocalDateTime createTime;
}
