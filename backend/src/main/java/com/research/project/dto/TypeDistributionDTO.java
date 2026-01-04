package com.research.project.dto;

import lombok.Data;

/**
 * 类型分布统计DTO
 */
@Data
public class TypeDistributionDTO {
    /**
     * 类型名称
     */
    private String type;
    
    /**
     * 项目数量
     */
    private Long count;
    
    /**
     * 占比
     */
    private Double percentage;
}
