package com.research.project.dto;

import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Workflow history DTO
 */
@Data
public class WorkflowHistoryDTO implements Serializable {
    private Long id;
    private String stage;
    private String stageName;
    private String action;
    private String comment;
    private String operatorName;
    private LocalDateTime operateTime;
}
