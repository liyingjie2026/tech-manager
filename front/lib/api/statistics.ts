import { backendGet } from "./client"
import type { ApiResponse } from "../types"

export const statisticsApi = {
  async getOverview(): Promise<
    ApiResponse<{
      totalProjects: number
      executingProjects: number
      completedProjects: number
      pendingProjects: number
      totalInstitutions: number
      totalExperts: number
    }>
  > {
    return backendGet("/statistics/overview")
  },

  async getProjectTypeDistribution(params?: {
    year?: string
  }): Promise<ApiResponse<Array<{ type: string; count: number }>>> {
    return backendGet("/statistics/project-type-distribution", params)
  },

  async getProjectStatusDistribution(params?: {
    year?: string
  }): Promise<ApiResponse<Array<{ status: string; count: number }>>> {
    return backendGet("/statistics/project-status-distribution", params)
  },

  async getYearlyTrend(params?: {
    years?: number
  }): Promise<ApiResponse<Array<{ year: string; count: number }>>> {
    return backendGet("/statistics/yearly-trend", params)
  },

  async getInstitutionStatistics(params?: {
    year?: string
    top?: number
  }): Promise<
    ApiResponse<
      Array<{
        institutionId: number
        institutionName: string
        projectCount: number
        totalBudget: number
        completedCount: number
      }>
    >
  > {
    return backendGet("/statistics/institution-statistics", params)
  },

  async getBudgetStatistics(params?: {
    year?: string
  }): Promise<
    ApiResponse<{
      totalBudget: number
      usedBudget: number
      remainingBudget: number
    }>
  > {
    return backendGet("/statistics/budget", params)
  },

  async getBudgetDetails(params?: {
    year?: string
    institutionId?: number
    projectId?: number
  }): Promise<ApiResponse<Array<any>>> {
    return backendGet("/statistics/budget/details", params)
  },

  async getAchievementStatistics(params?: {
    year?: string
  }): Promise<
    ApiResponse<{
      totalCount: number
      typeDistribution: Record<string, number>
    }>
  > {
    return backendGet("/statistics/achievement", params)
  },

  async getExpertReviewStatistics(params?: {
    year?: string
  }): Promise<
    ApiResponse<{
      totalReviews: number
      completedReviews: number
      pendingReviews: number
    }>
  > {
    return backendGet("/statistics/expert-review", params)
  },

  async exportReport(params: {
    reportType: string
    year?: string
  }): Promise<ApiResponse<string>> {
    return backendGet("/statistics/export", params)
  },
}
