package com.research.project.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 项目数据传输对象
 * Updated to match Project Entity fields exactly
 */
@Data
public class ProjectDTO {
    
    private Long id;
    
    private String projectNo;
    
    @NotBlank(message = "项目名称不能为空")
    private String name;
    
    private String projectBatch;
    
    private String innovationPlatform;
    
    @NotBlank(message = "项目类型不能为空")
    private String projectType;
    
    private String projectCategory;
    
    private String researchField;
    
    private Long demandId;
    
    @NotNull(message = "申报单位不能为空")
    private Long institutionId;
    
    private String institutionName;
    
    private Long leaderId;
    
    private String leaderName;
    
    private String leaderPhone;
    
    @NotNull(message = "开始日期不能为空")
    private LocalDate startDate;
    
    @NotNull(message = "结束日期不能为空")
    private LocalDate endDate;
    
    @NotNull(message = "总预算不能为空")
    private BigDecimal totalBudget;
    
    private BigDecimal applyBudget;
    
    private BigDecimal selfBudget;
    
    private String objective;
    
    private String content;
    
    private String expectedResult;
    
    private String innovationPoints;
    
    private String applicationProspects;
    
    private String status;
    
    private String auditStatus;
    
    private String workflowStage;
    
    private String auditComment;
    
    private LocalDateTime auditTime;
    
    private Long auditBy;
    
    private LocalDateTime submitTime;
    
    private BigDecimal duplicateRate;
    
    private String institutionNature;
    
    private String institutionCreditCode;
    
    private String institutionLegalPerson;
    
    private String institutionContactPerson;
    
    private String institutionContactPhone;
    
    private String institutionAddress;
    
    private String institutionLocation;
    
    private List<ProjectMemberDTO> members;
    
    private List<ProjectBudgetDTO> budgets;
    
    private List<ProjectScheduleDTO> schedules;
    
    private List<Long> attachmentIds;
    
    private String remark;
    
    private LocalDateTime createTime;
    
    private LocalDateTime updateTime;
    
    private Long createBy;
    
    private Long updateBy;
    
    private Integer deleted;
}
