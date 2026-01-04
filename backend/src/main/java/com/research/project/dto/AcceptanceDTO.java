package com.research.project.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 验收数据传输对象 - 完全匹配Acceptance实体
 */
@Data
public class AcceptanceDTO {
    
    private Long id;
    
    private String acceptanceNo;
    
    @NotNull(message = "项目ID不能为空")
    private Long projectId;
    
    private String projectNo;
    
    private String projectName;
    
    private String institutionName;
    
    private String projectLeader;
    
    private String startDate;
    
    private String endDate;
    
    private BigDecimal totalBudget;
    
    private BigDecimal usedBudget;
    
    private String completionDesc;
    
    private String indicatorCompletion;
    
    private String achievements;
    
    private String budgetUsage;
    
    private String benefits;
    
    private String problems;
    
    private String attachments;
    
    private String acceptanceMethod;
    
    private String conclusion;
    
    private String acceptanceComment;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime acceptanceTime;
    
    private String expertGroup;
    
    private String status;
    
    private String auditComment;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime auditTime;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime submitTime;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime createTime;
    
    private LocalDateTime updateTime;
    
    private Long createBy;
    
    private Long updateBy;
    
    private Integer deleted;
}
