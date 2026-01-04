package com.research.project.dto;

import lombok.Data;

/**
 * 验收统计DTO
 */
@Data
public class AcceptanceStatisticsDTO {
    private Long totalCount;
    private Long total;
    private Long pendingCount;
    private Long pending;
    private Long acceptedCount;
    private Long accepted;
    private Long rejectedCount;
    private Long rejected;
    private Long excellent;
    private Long qualified;
    private Long unqualified;
}
