package com.research.project.vo;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 项目预算VO
 */
@Data
public class ProjectBudgetVO {
    
    private Long id;
    
    private Long projectId;
    
    private String category;
    
    private String categoryText;
    
    private String item;
    
    private BigDecimal totalAmount;
    
    private BigDecimal applyAmount;
    
    private BigDecimal selfAmount;
    
    private BigDecimal usedAmount;
    
    private String description;
    
    private Integer sort;
}
