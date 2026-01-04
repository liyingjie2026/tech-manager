package com.research.project.vo;

import lombok.Data;

/**
 * 流程连线VO
 */
@Data
public class WorkflowEdgeVO {
    
    private String id;
    
    private String sourceNodeId;
    
    private String targetNodeId;
    
    private String condition;
    
    private String label;
}
