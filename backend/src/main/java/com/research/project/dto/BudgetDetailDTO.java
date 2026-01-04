package com.research.project.dto;

import lombok.Data;

/**
 * 费用明细DTO
 */
@Data
public class BudgetDetailDTO {
    /**
     * 项目ID
     */
    private Long projectId;
    
    /**
     * 项目名称
     */
    private String projectName;
    
    /**
     * 机构名称
     */
    private String institutionName;
    
    /**
     * 预算金额（万元）
     */
    private Double budgetAmount;
    
    /**
     * 已拨付金额（万元）
     */
    private Double allocatedAmount;
    
    /**
     * 已使用金额（万元）
     */
    private Double usedAmount;
    
    /**
     * 剩余金额（万元）
     */
    private Double remainingAmount;
}
