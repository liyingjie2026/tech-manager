package com.research.project.dto;

import lombok.Data;

/**
 * 专家评审统计DTO
 */
@Data
public class ReviewStatisticsDTO {
    
    /**
     * 待评审数量
     */
    private Integer pendingCount;
    
    /**
     * 评审中数量
     */
    private Integer inProgressCount;
    
    /**
     * 已完成数量
     */
    private Integer completedCount;
    
    /**
     * 总数
     */
    private Integer totalCount;
}
