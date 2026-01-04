package com.research.project.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 创建工作流节点DTO
 */
@Data
public class WorkflowNodeCreateDTO {
    @NotBlank(message = "节点名称不能为空")
    private String nodeName;
    
    @NotBlank(message = "节点类型不能为空")
    private String nodeType;
    
    private String approvers;
    private String config;
}
