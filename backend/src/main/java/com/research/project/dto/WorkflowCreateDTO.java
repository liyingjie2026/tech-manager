package com.research.project.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 创建工作流DTO
 */
@Data
public class WorkflowCreateDTO {
    @NotBlank(message = "工作流名称不能为空")
    private String workflowName;
    
    @NotBlank(message = "工作流类型不能为空")
    private String workflowType;
    
    private String description;
}
