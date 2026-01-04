package com.research.project.dto;

import lombok.Data;

/**
 * 年度检查统计DTO
 */
@Data
public class AnnualStatisticsDTO {
    private Integer total;
    private Integer pending;
    private Integer approved;
    private Integer rejected;
    private Integer draft;
    private Double passRate;
}
