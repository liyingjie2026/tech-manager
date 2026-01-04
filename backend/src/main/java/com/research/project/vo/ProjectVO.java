package com.research.project.vo;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 项目视图对象
 */
@Data
public class ProjectVO {
    
    private Long id;
    
    private String projectNo;
    
    private String projectName;
    
    private String projectType;
    
    private String projectTypeText;
    
    private String projectCategory;
    
    private String projectCategoryText;
    
    private String projectNature;
    
    private String projectNatureText;
    
    private Long institutionId;
    
    private String institutionName;
    
    private Long leaderId;
    
    private String leaderName;
    
    private String leaderPhone;
    
    private String researchField;
    
    private String keywords;
    
    private LocalDate startDate;
    
    private LocalDate endDate;
    
    private BigDecimal totalBudget;
    
    private BigDecimal applyFunding;
    
    private BigDecimal selfFunding;
    
    private BigDecimal usedBudget;
    
    private String researchObjective;
    
    private String researchContent;
    
    private String technicalRoute;
    
    private String expectedResults;
    
    private String innovationPoints;
    
    private String status;
    
    private String statusText;
    
    private String taskBookStatus;
    
    private String taskBookStatusText;
    
    private Integer progress;
    
    private List<ProjectMemberVO> members;
    
    private List<ProjectBudgetVO> budgets;
    
    private List<ProjectScheduleVO> schedules;
    
    private List<FileVO> attachments;
    
    private LocalDateTime submitTime;
    
    private LocalDateTime approvalTime;
    
    private LocalDateTime createTime;
}
