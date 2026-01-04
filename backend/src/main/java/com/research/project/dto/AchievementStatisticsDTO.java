package com.research.project.dto;

import lombok.Data;
import java.util.Map;

/**
 * 成果统计DTO
 */
@Data
public class AchievementStatisticsDTO {
    /**
     * 论文总数
     */
    private Long paperCount;
    
    /**
     * 专利总数
     */
    private Long patentCount;
    
    /**
     * 软著总数
     */
    private Long softwareCopyrightCount;
    
    /**
     * 获奖总数
     */
    private Long awardCount;
    
    /**
     * 其他成果数
     */
    private Long otherCount;
    
    /**
     * 成果总数
     */
    private Long totalCount;
    
    /**
     * 类型分布
     */
    private Map<String, Integer> typeDistribution;
    
    /**
     * 设置类型分布
     */
    public void setTypeDistribution(Map<String, Integer> distribution) {
        this.typeDistribution = distribution;
    }
}
