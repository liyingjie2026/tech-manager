package com.research.project.dto;

import lombok.Data;

/**
 * 年度趋势统计DTO
 */
@Data
public class YearlyTrendDTO {
    /**
     * 年份
     */
    private String year;
    
    /**
     * 申报项目数
     */
    private Long appliedCount;
    
    /**
     * 立项项目数
     */
    private Long approvedCount;
    
    /**
     * 结题项目数
     */
    private Long completedCount;
    
    /**
     * 总预算（万元）
     */
    private Double totalBudget;
    
    /**
     * 设置项目数量（兼容方法）
     */
    public void setCount(int count) {
        this.appliedCount = (long) count;
    }
    
    public void setCount(Long count) {
        this.appliedCount = count;
    }
}
