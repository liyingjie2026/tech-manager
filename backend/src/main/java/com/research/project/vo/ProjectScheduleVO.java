package com.research.project.vo;

import lombok.Data;
import java.time.LocalDate;

/**
 * 项目进度VO
 */
@Data
public class ProjectScheduleVO {
    
    private Long id;
    
    private Long projectId;
    
    private String stageName;
    
    private LocalDate startDate;
    
    private LocalDate endDate;
    
    private String content;
    
    private String milestone;
    
    private String deliverables;
    
    private String responsible;
    
    private Integer progress;
    
    private String status;
    
    private String statusText;
    
    private Integer sort;
}
