package com.research.project.dto;

import lombok.Data;

@Data
public class TodoStatisticsDTO {
    private Integer totalCount;          // 总数
    private Integer pendingCount;        // 待处理
    private Integer processingCount;     // 处理中
    private Integer completedCount;      // 已完成
    private Integer urgentCount;         // 紧急待办
    private Integer overdueCount;        // 逾期待办
    private Integer todayCount;          // 今日到期
    private Integer weekCount;           // 本周到期
}
