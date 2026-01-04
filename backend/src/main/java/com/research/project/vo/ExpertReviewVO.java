package com.research.project.vo;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 专家评审视图对象
 */
@Data
public class ExpertReviewVO {
    
    private Long id;
    
    private String reviewNo;
    
    private Long projectId;
    
    private String projectNo;
    
    private String projectName;
    
    private String projectType;
    
    private String projectTypeText;
    
    private String institutionName;
    
    private String leaderName;
    
    private String reviewType;
    
    private String reviewTypeText;
    
    private String reviewMethod;
    
    private String reviewMethodText;
    
    private LocalDate reviewDeadline;
    
    private String reviewRequirements;
    
    private List<ExpertVO> experts;
    
    private Integer totalExperts;
    
    private Integer completedExperts;
    
    private BigDecimal avgScore;
    
    private String status;
    
    private String statusText;
    
    private String conclusion;
    
    private LocalDateTime createTime;
    
    private LocalDateTime completeTime;
}
