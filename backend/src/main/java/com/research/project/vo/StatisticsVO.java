package com.research.project.vo;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * 统计视图对象
 */
@Data
public class StatisticsVO {
    
    /**
     * 项目总数
     */
    private Integer totalProjects;
    
    /**
     * 进行中项目数
     */
    private Integer inProgressProjects;
    
    /**
     * 已完成项目数
     */
    private Integer completedProjects;
    
    /**
     * 待审核项目数
     */
    private Integer pendingProjects;
    
    /**
     * 总预算
     */
    private BigDecimal totalBudget;
    
    /**
     * 已使用预算
     */
    private BigDecimal usedBudget;
    
    /**
     * 机构总数
     */
    private Integer totalInstitutions;
    
    /**
     * 专家总数
     */
    private Integer totalExperts;
    
    /**
     * 成果总数
     */
    private Integer totalAchievements;
    
    /**
     * 资源总数
     */
    private Integer totalResources;
    
    /**
     * 按类型统计
     */
    private List<Map<String, Object>> byType;
    
    /**
     * 按状态统计
     */
    private List<Map<String, Object>> byStatus;
    
    /**
     * 按月份统计
     */
    private List<Map<String, Object>> byMonth;
    
    /**
     * 按机构统计
     */
    private List<Map<String, Object>> byInstitution;
}
