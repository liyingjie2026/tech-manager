package com.research.project.controller;

import com.research.project.common.Result;
import com.research.project.dto.*;
import com.research.project.service.StatisticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 统计分析控制器
 * 页面：监测监管端 - 统计分析
 */
@Tag(name = "统计分析", description = "项目统计、费用统计等接口")
@RestController
@RequestMapping("/statistics")
@RequiredArgsConstructor
public class StatisticsController {

    private final StatisticsService statisticsService;

    /**
     * 获取首页仪表板数据
     * 页面：首页 - Dashboard
     */
    @Operation(summary = "获取首页仪表板数据")
    @GetMapping("/dashboard")
    public Result<DashboardDTO> getDashboard(@RequestParam String userType) {
        return Result.success(statisticsService.getDashboard(userType));
    }

    /**
     * 获取项目总览统计
     * 按钮：项目总览页面 - 加载数据
     */
    @Operation(summary = "获取项目总览统计")
    @GetMapping("/overview")
    public Result<OverviewStatisticsDTO> getOverview() {
        return Result.success(statisticsService.getOverview());
    }

    /**
     * 获取项目类型分布统计
     * 按钮：统计分析页面 - 项目类型分布图表
     */
    @Operation(summary = "获取项目类型分布统计")
    @GetMapping("/project-type-distribution")
    public Result<List<TypeDistributionDTO>> getProjectTypeDistribution(
            @RequestParam(required = false) String year) {
        return Result.success(statisticsService.getProjectTypeDistribution(year));
    }

    /**
     * 获取项目状态分布统计
     * 按钮：统计分析页面 - 项目状态分布图表
     */
    @Operation(summary = "获取项目状态分布统计")
    @GetMapping("/project-status-distribution")
    public Result<List<StatusDistributionDTO>> getProjectStatusDistribution(
            @RequestParam(required = false) String year) {
        return Result.success(statisticsService.getProjectStatusDistribution(year));
    }

    /**
     * 获取历年项目申报趋势
     * 按钮：统计分析页面 - 历年申报趋势图表
     */
    @Operation(summary = "获取历年项目申报趋势")
    @GetMapping("/yearly-trend")
    public Result<List<YearlyTrendDTO>> getYearlyTrend(
            @RequestParam(defaultValue = "5") Integer years) {
        return Result.success(statisticsService.getYearlyTrend(years));
    }

    /**
     * 获取机构项目统计
     * 按钮：统计分析页面 - 机构项目统计图表
     */
    @Operation(summary = "获取机构项目统计")
    @GetMapping("/institution-statistics")
    public Result<List<InstitutionStatisticsDTO>> getInstitutionStatistics(
            @RequestParam(required = false) String year,
            @RequestParam(defaultValue = "10") Integer top) {
        return Result.success(statisticsService.getInstitutionStatistics(year, top));
    }

    /**
     * 获取费用统计
     * 按钮：费用管理页面 - 加载数据
     */
    @Operation(summary = "获取费用统计")
    @GetMapping("/budget")
    public Result<BudgetStatisticsDTO> getBudgetStatistics(
            @RequestParam(required = false) String year) {
        return Result.success(statisticsService.getBudgetStatistics(year));
    }

    /**
     * 获取费用明细
     * 按钮：费用管理页面 - 查询按钮
     */
    @Operation(summary = "获取费用明细")
    @GetMapping("/budget/details")
    public Result<List<BudgetDetailDTO>> getBudgetDetails(
            @RequestParam(required = false) String year,
            @RequestParam(required = false) Long institutionId,
            @RequestParam(required = false) Long projectId) {
        return Result.success(statisticsService.getBudgetDetails(year, institutionId, projectId));
    }

    /**
     * 获取成果统计
     * 按钮：统计分析页面 - 成果统计图表
     */
    @Operation(summary = "获取成果统计")
    @GetMapping("/achievement")
    public Result<AchievementStatisticsDTO> getAchievementStatistics(
            @RequestParam(required = false) String year) {
        return Result.success(statisticsService.getAchievementStatistics(year));
    }

    /**
     * 获取专家评审统计
     * 按钮：统计分析页面 - 专家评审统计图表
     */
    @Operation(summary = "获取专家评审统计")
    @GetMapping("/expert-review")
    public Result<ExpertReviewStatisticsDTO> getExpertReviewStatistics(
            @RequestParam(required = false) String year) {
        return Result.success(statisticsService.getExpertReviewStatistics(year));
    }

    /**
     * 导出统计报表
     * 按钮：统计分析页面 - 导出报表按钮
     */
    @Operation(summary = "导出统计报表")
    @GetMapping("/export")
    public Result<String> exportReport(
            @RequestParam String reportType,
            @RequestParam(required = false) String year) {
        return Result.success(statisticsService.exportReport(reportType, year));
    }
}
