package com.research.project.vo;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 任务书视图对象
 */
@Data
public class TaskBookVO {
    
    private Long id;
    
    private String taskBookNo;
    
    private Long projectId;
    
    private String projectNo;
    
    private String projectName;
    
    private String projectType;
    
    private String projectTypeText;
    
    private String institutionName;
    
    private String leaderName;
    
    private LocalDate startDate;
    
    private LocalDate endDate;
    
    private BigDecimal totalBudget;
    
    private BigDecimal applyFunding;
    
    private BigDecimal selfFunding;
    
    private String researchObjective;
    
    private String researchContent;
    
    private String technicalRoute;
    
    private String expectedResults;
    
    private String assessmentIndicators;
    
    private Boolean hasMidtermCheck;
    
    private LocalDate midtermCheckDate;
    
    private Boolean hasAnnualCheck;
    
    private LocalDate annualCheckDate;
    
    private List<TaskItemVO> taskItems;
    
    private String signedFileUrl;
    
    private String signedFileName;
    
    private String status;
    
    private String statusText;
    
    private LocalDateTime signTime;
    
    private LocalDateTime approvalTime;
    
    private LocalDateTime createTime;
}
