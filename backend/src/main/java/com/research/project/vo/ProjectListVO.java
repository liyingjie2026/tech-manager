package com.research.project.vo;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 项目列表VO（简化版）
 */
@Data
public class ProjectListVO {
    
    private Long id;
    
    private String projectNo;
    
    private String projectName;
    
    private String projectType;
    
    private String projectTypeText;
    
    private String institutionName;
    
    private String leaderName;
    
    private LocalDate startDate;
    
    private LocalDate endDate;
    
    private BigDecimal totalBudget;
    
    private String status;
    
    private String statusText;
    
    private Integer progress;
    
    private LocalDateTime submitTime;
    
    private LocalDateTime createTime;
}
