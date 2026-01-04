package com.research.project.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 工作流详情DTO
 */
@Data
public class WorkflowDetailDTO {
    private Long id;
    private String name;
    private String code;
    private String description;
    private String category;
    private List<WorkflowNodeDTO> nodes;
    private List<WorkflowEdgeDTO> edges;
    private String status;
    private Integer version;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
