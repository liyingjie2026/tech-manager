package com.research.project.dto;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 费用统计DTO
 */
@Data
public class BudgetStatisticsDTO {
    /**
     * 总预算（万元）
     */
    private Double totalBudget;
    
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
    
    /**
     * 预算执行率
     */
    private Double executionRate;
    
    /**
     * 拨付率
     */
    private Double allocationRate;
    
    /**
     * 设置总预算（支持BigDecimal）
     */
    public void setTotalBudget(BigDecimal amount) {
        this.totalBudget = amount != null ? amount.doubleValue() : null;
    }
    
    /**
     * 设置已使用金额（兼容方法）
     */
    public void setUsedBudget(BigDecimal amount) {
        this.usedAmount = amount != null ? amount.doubleValue() : null;
    }
    
    public void setUsedBudget(Double amount) {
        this.usedAmount = amount;
    }
    
    /**
     * 设置剩余金额（兼容方法）
     */
    public void setRemainingBudget(BigDecimal amount) {
        this.remainingAmount = amount != null ? amount.doubleValue() : null;
    }
    
    public void setRemainingBudget(Double amount) {
        this.remainingAmount = amount;
    }
}
