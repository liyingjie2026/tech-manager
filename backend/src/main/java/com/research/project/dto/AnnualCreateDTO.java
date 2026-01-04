package com.research.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

/**
 * 创建年度检查DTO
 */
@Data
public class AnnualCreateDTO {
    @NotNull(message = "项目ID不能为空")
    private Long projectId;
    
    @NotBlank(message = "检查年度不能为空")
    private String checkYear;
    
    private String yearTarget;
    private String yearCompletion;
    private Integer planProgress;
    private Integer actualProgress;
    private BigDecimal yearBudget;
    private BigDecimal usedBudget;
    private String budgetDesc;
    private String achievements;
    private String problems;
    private String nextPlan;
    private String attachments;

    private String workProgress;
    private String year;
}
