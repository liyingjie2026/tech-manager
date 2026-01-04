package com.research.project.dto;

import lombok.Data;
import java.time.LocalDate;

/**
 * 任务项DTO
 */
@Data
public class TaskItemDTO {
    
    private Long id;
    
    private Long taskBookId;
    
    private String taskNo;
    
    private String taskName;
    
    private String taskType;
    
    private String description;
    
    private LocalDate startDate;
    
    private LocalDate endDate;
    
    private String responsible;
    
    private Long responsibleUnitId;
    
    private String deliverables;
    
    private Integer sort;
}
