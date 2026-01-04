package com.research.project.dto;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 经费列表DTO
 */
@Data
public class BudgetListDTO {
    
    private Long id;
    
    private String projectNo;
    
    private String projectName;
    
    private BigDecimal totalBudget;
    
    private BigDecimal provincialFunds;
    
    private BigDecimal selfFunds;
    
    private BigDecimal usedAmount;
    
    private BigDecimal remainingAmount;
    
    private String usageRate;
}
