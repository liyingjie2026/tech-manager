package com.research.project.dto;

import lombok.Data;

/**
 * 中期检查统计DTO
 */
@Data
public class MidtermStatisticsDTO {
    private Integer totalCount;
    private Integer pendingCount;
    private Integer approvedCount;
    private Integer rejectedCount;
    private Integer onTimeRate;
    private Integer delayedCount;
}
