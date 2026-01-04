package com.research.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;

/**
 * 项目预算实体类
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("prj_project_budget")
public class ProjectBudget extends BaseEntity {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long projectId;
    private String category;
    private String subcategory;
    private String itemName;
    private BigDecimal amount;
    private BigDecimal applyAmount;
    private BigDecimal selfAmount;
    private String description;
    private Integer sort;
}
