package com.research.project.vo;

import lombok.Data;
import java.util.List;

/**
 * 流程节点VO
 */
@Data
public class WorkflowNodeVO {
    
    private String id;
    
    private String name;
    
    private String type;
    
    private String typeText;
    
    private Integer positionX;
    
    private Integer positionY;
    
    private List<Long> roleIds;
    
    private List<String> roleNames;
    
    private List<Long> userIds;
    
    private List<String> userNames;
    
    private String formKey;
    
    private String condition;
    
    private Integer timeout;
    
    private String timeoutAction;
}
