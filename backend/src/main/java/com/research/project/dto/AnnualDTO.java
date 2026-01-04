package com.research.project.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 年度检查数据传输对象 - 完全匹配Annual实体
 */
@Data
public class AnnualDTO {
    
    private Long id;
    
    private String reportNo;
    
    private String projectNo;
    
    @NotNull(message = "项目ID不能为空")
    private Long projectId;
    
    private String projectName;
    
    private String institutionName;
    
    private String projectLeader;
    
    private String projectType;
    
    private LocalDate startDate;
    
    private LocalDate endDate;
    
    @NotNull(message = "年度不能为空")
    private String checkYear;
    
    private String annualSummary;
    
    private String completedWork;
    
    private String achievedResults;
    
    private String existingProblems;
    
    private String nextYearPlan;
    
    private BigDecimal annualBudget;
    
    private BigDecimal usedBudget;
    
    private String budgetUsage;
    
    private String attachments;
    
    private Integer completionRate;
    
    private String status;
    
    private String auditStatus;
    
    private String auditComment;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime auditTime;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime submitTime;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime createTime;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime updateTime;
    
    private Long createBy;
    
    private Long updateBy;
    
    private Integer deleted;

    /** 年度预算（万元） */
    private BigDecimal yearBudget;

}
