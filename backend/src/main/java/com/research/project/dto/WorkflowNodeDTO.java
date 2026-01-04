package com.research.project.dto;

import lombok.Data;
import java.util.List;

/**
 * 流程节点DTO
 */
@Data
public class WorkflowNodeDTO {
    
    private String id;
    
    private String name;
    
    private String nodeName;
    
    private String type;
    
    private String nodeType;
    
    private Integer positionX;
    
    private Integer positionY;
    
    private List<Long> roleIds;
    
    private List<Long> userIds;
    
    private String formKey;
    
    private String condition;
    
    private Integer timeout;
    
    private String timeoutAction;
}
