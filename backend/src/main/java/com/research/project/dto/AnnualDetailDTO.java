package com.research.project.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 年度检查详情DTO
 */
@Data
public class AnnualDetailDTO {
    private Long id;
    private String annualNo;
    private Long projectId;
    private String projectNo;
    private String projectName;
    private String institutionName;
    private String projectLeader;
    private String checkYear;
    
    private String year;
    
    private String yearTarget;
    private String yearCompletion;
    
    private String executionProgress;
    
    private Integer planProgress;
    private Integer actualProgress;
    private BigDecimal yearBudget;
    private BigDecimal usedBudget;
    private String budgetDesc;
    private String achievements;
    private String problems;
    private String nextPlan;
    private List<AttachmentDTO> attachments;
    private String status;
    private String auditComment;
    private LocalDateTime auditTime;
    private String auditBy;
    private LocalDateTime submitTime;
    
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private Long createBy;
    private Long updateBy;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
