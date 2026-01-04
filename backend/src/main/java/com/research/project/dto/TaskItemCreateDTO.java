package com.research.project.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 创建任务项DTO
 */
@Data
public class TaskItemCreateDTO {
    @NotBlank(message = "任务名称不能为空")
    private String taskName;
    
    private String taskContent;
    private String deliverable;
    private String startDate;
    private String endDate;
    private String responsible;
}
