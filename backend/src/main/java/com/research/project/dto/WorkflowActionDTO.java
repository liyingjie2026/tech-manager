package com.research.project.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 工作流操作DTO
 */
@Data
public class WorkflowActionDTO {

    @NotNull(message = "项目ID不能为空")
    private Long projectId;

    @NotNull(message = "操作类型不能为空")
    private String action; // submit, approve, reject, request_change

    @NotNull(message = "目标阶段不能为空")
    private String toStage;

    private String comment; // 操作意见
    private String operatorRole; // institution, supervisor, expert
}
