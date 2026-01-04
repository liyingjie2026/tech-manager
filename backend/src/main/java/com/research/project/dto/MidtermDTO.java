package com.research.project.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 中期检查数据传输对象 - 完全匹配Midterm实体
 */
@Data
public class MidtermDTO {
    
    private Long id;
    
    private String midtermNo;
    
    private String projectNo;
    
    @NotNull(message = "项目ID不能为空")
    private Long projectId;
    
    private String projectName;
    
    private String institutionName;
    
    private String projectLeader;
    
    private LocalDate startDate;
    
    private LocalDate endDate;
    
    private String progressSummary;
    
    private String completedWork;
    
    private String achievedResults;
    
    private String existingProblems;
    
    private String nextPlan;
    
    private BigDecimal usedBudget;
    
    private String budgetUsageDetail;
    
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
}
