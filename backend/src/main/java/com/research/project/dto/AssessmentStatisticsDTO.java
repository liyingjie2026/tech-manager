package com.research.project.dto;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 考核评价统计DTO
 */
@Data
public class AssessmentStatisticsDTO {
    private Integer totalCount;           // 总考核次数
    private BigDecimal averageScore;      // 平均分
    private Integer excellentCount;       // 优秀次数
    private Integer pendingMaterialCount; // 待上传材料数
}
