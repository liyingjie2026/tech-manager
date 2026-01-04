package com.research.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;

/**
 * 项目绩效指标实体类
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("prj_project_performance")
public class ProjectPerformance extends BaseEntity {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long projectId;
    
    private String paperTarget;
    private Integer paperCount;
    private String patentTarget;
    private Integer patentCount;
    private String softwareTarget;
    private Integer softwareCount;
    private String standardTarget;
    private Integer standardCount;
    private String socialBenefit;
    private String transformationPlan;
    private Integer talentCount;
    private String otherResult;
    private String indicators;
    private BigDecimal duplicateRate;
}
