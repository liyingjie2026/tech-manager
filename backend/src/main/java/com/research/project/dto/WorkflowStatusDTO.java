package com.research.project.dto;

import lombok.Data;
import java.io.Serializable;
import java.util.List;

/**
 * Workflow status DTO
 */
@Data
public class WorkflowStatusDTO implements Serializable {
    private Long projectId;
    private String projectName;
    private String currentStage;
    private String status;
    private List<String> completedStages;
    private String nextStage;
    private Boolean canProceed;
    private String blockingReason;
}
