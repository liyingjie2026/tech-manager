package com.research.project.dto;

import lombok.Data;

/**
 * 任务书统计DTO
 */
@Data
public class TaskBookStatisticsDTO {
    private Integer totalCount;
    private Integer draftCount;
    private Integer pendingCount;
    private Integer approvedCount;
    private Integer rejectedCount;
    private Integer submittedCount;
}
