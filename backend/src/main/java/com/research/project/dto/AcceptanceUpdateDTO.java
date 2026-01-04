package com.research.project.dto;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 更新验收申请DTO
 */
@Data
public class AcceptanceUpdateDTO {
    private String completionDesc;
    private String indicatorCompletion;
    private String achievements;
    private BigDecimal usedBudget;
    private String budgetUsage;
    private String benefits;
    private String problems;
    private String attachments;
}
