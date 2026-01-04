package com.research.project.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 任务书详情DTO
 */
@Data
public class TaskBookDetailDTO {
    private Long id;
    private String taskBookNo;
    private Long projectId;
    
    private String projectNo;
    private String projectName;
    private String projectType;
    private Long institutionId;
    private String institutionName;
    
    private String projectLeader;
    private String leaderPhone;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal totalBudget;
    private BigDecimal applyBudget;
    private BigDecimal selfBudget;
    
    private String objective;
    
    private String content;
    
    private String expectedResult;
    
    private String indicators;
    private String taskBookFile;
    private String sealedFile;
    private Integer needMidterm;
    private String midtermDate;
    private Integer needAnnual;
    private String annualDate;
    private String signStatus;
    private String status;
    
    private String auditComment;
    private LocalDateTime auditTime;
    private String auditBy;
    private LocalDateTime signTime;
    
    private LocalDateTime submitTime;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private Long createBy;
    private Long updateBy;
}
