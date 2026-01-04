package com.research.project.dto;

import lombok.Data;

import java.math.BigDecimal;

/**
 * 机构统计DTO
 */
@Data
public class InstitutionStatisticsDTO {
    /**
     * 机构ID
     */
    private Long institutionId;
    
    /**
     * 机构名称
     */
    private String institutionName;
    
    /**
     * 项目数量
     */
    private Long projectCount;
    
    /**
     * 总预算（万元）
     */
    private BigDecimal totalBudget;
    
    /**
     * 已完成项目数
     */
    private Long completedCount;
    
    /**
     * 完成率
     */
    private Double completionRate;
}
