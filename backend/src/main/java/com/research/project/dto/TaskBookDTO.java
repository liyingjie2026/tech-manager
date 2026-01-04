package com.research.project.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 任务书数据传输对象
 */
@Data
public class TaskBookDTO {
    
    private Long id;
    
    @NotNull(message = "项目ID不能为空")
    private Long projectId;
    
    private String taskBookNo;
    
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
    
    private String signStatus;
    
    private String status;
    
    private Boolean taskBookUploaded;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime submitTime;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime signTime;
    
    private List<TaskItemDTO> taskItems;
    
    private String signedFileUrl;
    
    private String remark;
}
