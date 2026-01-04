package com.research.project.dto;

import lombok.Data;

/**
 * 更新任务项DTO
 */
@Data
public class TaskItemUpdateDTO {
    private String taskName;
    private String taskContent;
    private String deliverable;
    private String startDate;
    private String endDate;
    private String responsible;
}
