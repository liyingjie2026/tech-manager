package com.research.project.dto;

import lombok.Data;
import java.time.LocalDate;

/**
 * 项目进度计划DTO
 */
@Data
public class ProjectScheduleDTO {
    
    private Long id;
    
    private Long projectId;
    
    private String stageName;
    
    private LocalDate startDate;
    
    private LocalDate endDate;
    
    private String content;
    
    private String milestone;
    
    private String deliverables;
    
    private String responsible;
    
    private Integer sort;
}
