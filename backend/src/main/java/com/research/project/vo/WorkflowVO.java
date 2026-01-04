package com.research.project.vo;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 流程视图对象
 */
@Data
public class WorkflowVO {
    
    private Long id;
    
    private String name;
    
    private String code;
    
    private String type;
    
    private String typeText;
    
    private String category;
    
    private String categoryText;
    
    private String description;
    
    private List<WorkflowNodeVO> nodes;
    
    private List<WorkflowEdgeVO> edges;
    
    private Integer version;
    
    private Integer status;
    
    private String statusText;
    
    private Long createBy;
    
    private String creatorName;
    
    private LocalDateTime createTime;
    
    private LocalDateTime updateTime;
}
