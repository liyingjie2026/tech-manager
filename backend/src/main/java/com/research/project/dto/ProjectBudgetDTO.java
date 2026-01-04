package com.research.project.dto;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 项目预算DTO - 与前端和数据库字段完全对应
 */
@Data
public class ProjectBudgetDTO {
    
    private Long id;
    private Long projectId;
    
    private String category; // 预算科目
    private String subcategory; // 明细（映射到item_name）
    private String itemName; // 数据库字段名
    private BigDecimal amount; // 前端金额（映射到apply_amount）
    private BigDecimal applyAmount; // 申请金额
    private BigDecimal selfAmount; // 自筹金额
    private String description; // 说明
    private Integer sort;
}
