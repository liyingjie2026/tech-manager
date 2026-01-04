package com.research.project.dto;

import lombok.Data;

/**
 * 状态分布统计DTO
 */
@Data
public class StatusDistributionDTO {
    /**
     * 状态名称
     */
    private String status;
    
    /**
     * 项目数量
     */
    private Long count;
    
    /**
     * 占比
     */
    private Double percentage;
}
