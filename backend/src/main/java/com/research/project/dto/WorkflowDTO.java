package com.research.project.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

/**
 * 流程数据传输对象
 */
@Data
public class WorkflowDTO {
    
    private Long id;
    
    @NotBlank(message = "流程名称不能为空")
    private String name;
    
    @NotBlank(message = "流程编码不能为空")
    private String code;
    
    private String type;
    
    private String category;
    
    private String description;
    
    private List<WorkflowNodeDTO> nodes;
    
    private List<WorkflowEdgeDTO> edges;
    
    private Integer status;
    
    private String remark;
    
    public String getCode() {
        return code;
    }
}
