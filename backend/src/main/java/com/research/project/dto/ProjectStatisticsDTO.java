package com.research.project.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * 项目统计DTO
 */
@Data
public class ProjectStatisticsDTO {
    private Long total;
    private Long draftCount;
    private Long pendingCount;
    private Long approvedCount;
    private Long rejectedCount;
    private Long inProgressCount;
    private Long completedCount;
    private BigDecimal totalBudget;
    private BigDecimal totalApplyBudget;
    private List<Map<String, Object>> countByType;
    private List<Map<String, Object>> countByStatus;
    private List<Map<String, Object>> countByYear;
    private List<Map<String, Object>> countByInstitution;
}
