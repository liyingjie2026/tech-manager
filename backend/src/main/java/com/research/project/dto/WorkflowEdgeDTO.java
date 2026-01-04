package com.research.project.dto;

import lombok.Data;

/**
 * 流程连线DTO
 */
@Data
public class WorkflowEdgeDTO {
    
    private String id;
    
    private String sourceNodeId;
    
    private String targetNodeId;
    
    private String condition;
    
    private String label;
}
