package com.research.project.dto;

import lombok.Data;
import java.io.Serializable;

/**
 * Workflow stage update DTO
 */
@Data
public class WorkflowStageUpdateDTO implements Serializable {
    private String stage;
    private String comment;
}
