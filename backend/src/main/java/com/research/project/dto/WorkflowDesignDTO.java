package com.research.project.dto;

import lombok.Data;
import java.util.List;

/**
 * 工作流设计DTO
 */
@Data
public class WorkflowDesignDTO {
    private List<WorkflowNodeDTO> nodes;
    private List<WorkflowEdgeDTO> edges;
}
