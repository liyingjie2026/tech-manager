package com.research.project.service;

import com.research.project.dto.*;

import java.util.List;

/**
 * 统计服务接口
 */
public interface StatisticsService {
    
    /**
     * 获取首页仪表板数据（基于用户权限）
     */
    DashboardDTO getDashboardByUser(Long userId, String userRole);
    
    /**
     * 获取首页仪表板数据（旧版本，保持兼容）
     */
    DashboardDTO getDashboard(String userType);
    
    /**
     * 获取项目总览统计
     */
    OverviewStatisticsDTO getOverview();
    
    /**
     * 获取项目类型分布统计
     */
    List<TypeDistributionDTO> getProjectTypeDistribution(String year);
    
    /**
     * 获取项目状态分布统计
     */
    List<StatusDistributionDTO> getProjectStatusDistribution(String year);
    
    /**
     * 获取历年项目申报趋势
     */
    List<YearlyTrendDTO> getYearlyTrend(Integer years);
    
    /**
     * 获取机构项目统计
     */
    List<InstitutionStatisticsDTO> getInstitutionStatistics(String year, Integer top);
    
    /**
     * 获取费用统计
     */
    BudgetStatisticsDTO getBudgetStatistics(String year);
    
    /**
     * 获取费用明细
     */
    List<BudgetDetailDTO> getBudgetDetails(String year, Long institutionId, Long projectId);
    
    /**
     * 获取成果统计
     */
    AchievementStatisticsDTO getAchievementStatistics(String year);
    
    /**
     * 获取专家评审统计
     */
    ExpertReviewStatisticsDTO getExpertReviewStatistics(String year);
    
    /**
     * 导出统计报表
     */
    String exportReport(String reportType, String year);
}
