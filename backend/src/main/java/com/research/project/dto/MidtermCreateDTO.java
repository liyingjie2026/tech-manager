package com.research.project.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

/**
 * 创建中期检查DTO
 */
@Data
public class MidtermCreateDTO {
    @NotNull(message = "项目ID不能为空")
    private Long projectId;
    
    private String checkYear;
    private Integer planProgress;
    private Integer actualProgress;
    private BigDecimal usedBudget;
    private String progressDesc;
    private String problems;
    private String nextPlan;
    private String achievements;
    private String attachments;
}
