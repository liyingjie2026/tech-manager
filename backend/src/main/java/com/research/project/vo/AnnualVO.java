package com.research.project.vo;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 年度检查视图对象
 */
@Data
public class AnnualVO {
    
    private Long id;
    
    private String checkNo;
    
    private Long projectId;
    
    private String projectNo;
    
    private String projectName;
    
    private String projectType;
    
    private String projectTypeText;
    
    private String institutionName;
    
    private String leaderName;
    
    private Integer year;
    
    private String annualSummary;
    
    private String completedWork;
    
    private String achievedResults;
    
    private String existingProblems;
    
    private String nextYearPlan;
    
    private BigDecimal annualBudget;
    
    private BigDecimal usedBudget;
    
    private BigDecimal budgetUsageRate;
    
    private String budgetUsageDetail;
    
    private Integer completionRate;
    
    private List<FileVO> attachments;
    
    private String status;
    
    private String statusText;
    
    private String reviewResult;
    
    private String reviewOpinion;
    
    private LocalDateTime submitTime;
    
    private LocalDateTime reviewTime;
    
    private LocalDateTime createTime;
}
