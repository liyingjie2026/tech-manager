package com.research.project.dto;

import lombok.Data;

/**
 * 项目绩效指标DTO - 与前端和数据库字段完全对应
 */
@Data
public class ProjectPerformanceDTO {
    private Long projectId;
    
    private String paperTarget; // 前端字段：论文数量目标
    private Integer paperCount; // 数据库字段：论文数量
    
    private String patentTarget; // 前端字段：专利数量目标
    private Integer patentCount; // 数据库字段：专利数量
    
    private String softwareTarget; // 前端字段：软件著作权目标
    private Integer softwareCount; // 数据库字段：软件著作权数量
    
    private String standardTarget; // 前端字段：技术标准目标
    private Integer standardCount; // 数据库字段：标准数量
    
    private String socialBenefit; // 社会经济效益
    private String transformationPlan; // 成果转化计划
    
    private Integer talentCount; // 人才培养数量
    private String otherResult; // 其他成果
    private String indicators; // 综合指标
}
