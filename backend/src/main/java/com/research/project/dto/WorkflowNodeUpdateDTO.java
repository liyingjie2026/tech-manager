package com.research.project.dto;

import lombok.Data;

/**
 * 更新工作流节点DTO
 */
@Data
public class WorkflowNodeUpdateDTO {
    private String nodeName;
    private String approvers;
    private String config;
}
