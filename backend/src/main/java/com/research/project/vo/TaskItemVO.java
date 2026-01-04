package com.research.project.vo;

import lombok.Data;
import java.time.LocalDate;

/**
 * 任务项VO
 */
@Data
public class TaskItemVO {
    
    private Long id;
    
    private Long taskBookId;
    
    private String taskNo;
    
    private String taskName;
    
    private String taskType;
    
    private String taskTypeText;
    
    private String description;
    
    private LocalDate startDate;
    
    private LocalDate endDate;
    
    private String responsible;
    
    private Long responsibleUnitId;
    
    private String responsibleUnitName;
    
    private String deliverables;
    
    private Integer progress;
    
    private String status;
    
    private String statusText;
    
    private Integer sort;
}
