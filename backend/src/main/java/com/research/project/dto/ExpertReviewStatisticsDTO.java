package com.research.project.dto;

import lombok.Data;

/**
 * 专家评审统计DTO
 */
@Data
public class ExpertReviewStatisticsDTO {
    /**
     * 评审总数
     */
    private Long totalReviews;
    
    /**
     * 进行中评审数
     */
    private Long ongoingReviews;
    
    /**
     * 已完成评审数
     */
    private Long completedReviews;
    
    /**
     * 专家总数
     */
    private Long totalExperts;
    
    /**
     * 平均评分
     */
    private Double averageScore;
    
    /**
     * 设置待评审数（兼容方法）
     */
    public void setPendingReviews(int count) {
        this.ongoingReviews = (long) count;
    }
    
    public void setPendingReviews(Long count) {
        this.ongoingReviews = count;
    }
}
