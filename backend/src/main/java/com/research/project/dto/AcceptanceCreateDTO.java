package com.research.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

/**
 * 创建验收申请DTO
 */
@Data
public class AcceptanceCreateDTO {
    @NotNull(message = "项目ID不能为空")
    private Long projectId;
    
    private String completionDesc;
    private String indicatorCompletion;
    private String achievements;
    private BigDecimal usedBudget;
    private String budgetUsage;
    private String benefits;
    private String problems;
    private String attachments;
}
