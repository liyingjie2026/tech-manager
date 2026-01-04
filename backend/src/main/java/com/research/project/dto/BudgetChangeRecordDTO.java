package com.research.project.dto;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 经费变更记录DTO
 */
@Data
public class BudgetChangeRecordDTO {
    
    private Long id;
    
    private String projectNo;
    
    private String projectName;
    
    private String changeType;
    
    private BigDecimal changeAmount;
    
    private String changeReason;
    
    private String changeDate;
    
    private String status;
    
    private String applicant;
}
