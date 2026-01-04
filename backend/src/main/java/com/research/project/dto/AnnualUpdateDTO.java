package com.research.project.dto;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 更新年度检查DTO
 */
@Data
public class AnnualUpdateDTO {
    private String yearTarget;
    private String yearCompletion;
    
    private String workProgress;
    
    private Integer planProgress;
    private Integer actualProgress;
    private BigDecimal yearBudget;
    private BigDecimal usedBudget;
    private String budgetDesc;
    private String achievements;
    private String problems;
    private String nextPlan;
    private String attachments;
}
