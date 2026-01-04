package com.research.project.dto;

import lombok.Data;
import java.util.List;

/**
 * 工作流测试结果DTO
 */
@Data
public class WorkflowTestResultDTO {
    private Boolean success;
    private String message;
    private List<String> executionPath;
    private String errorNode;
    private Long executionTime;
}
