// 专家评审 API
import { backendGet, backendPost } from "./client"
import type { ApiResponse, PageParams, PageResult } from "../types"

// 评审项目接口
export interface ReviewProject {
  id: number
  projectId: string
  projectName: string
  projectType: string
  institution: string
  deadline: string
  status: "pending" | "reviewing" | "completed"
  reviewType: string
  description?: string
  budget?: number
  leaderName?: string
  leaderPhone?: string
  createdTime?: string
}

// 评审详情接口
export interface ReviewDetail extends ReviewProject {
  projectContent?: string
  expectedResults?: string
  researchPlan?: string
  budgetDetails?: any
  teamMembers?: any[]
}

// 评审结果提交接口
export interface ReviewSubmit {
  score: number
  opinion: string
  suggestion?: string
  isApproved: boolean
}

export const expertReviewApi = {
  // 获取专家待评审项目列表 - 调用 GET /expert-reviews
  async getList(
    params: PageParams & {
      keyword?: string
      status?: string
      reviewType?: string
      expertId?: number // 添加expertId参数，用于查询特定专家的评审任务
    },
  ): Promise<ApiResponse<PageResult<ReviewProject>>> {
    return backendGet<PageResult<ReviewProject>>("/expert-reviews", params)
  },

  // 获取评审项目详情 - 调用 GET /expert-reviews/{id}
  async getById(id: number): Promise<ApiResponse<ReviewDetail>> {
    return backendGet<ReviewDetail>(`/expert-reviews/${id}`)
  },

  // 提交评审结果 - 调用 POST /expert-reviews/{id}/submit
  async submitReview(id: number, data: ReviewSubmit & { status: string }): Promise<ApiResponse<void>> {
    return backendPost<void>(`/expert-reviews/${id}/submit`, data)
  },

  // 保存评审草稿 - 调用 POST /expert-reviews/{id}/draft
  async saveDraft(id: number, data: Partial<ReviewSubmit>): Promise<ApiResponse<void>> {
    return backendPost<void>(`/expert-reviews/${id}/draft`, data)
  },

  // 获取评审统计 - 调用 GET /expert-reviews/statistics
  async getStatistics(): Promise<
    ApiResponse<{
      pending: number
      reviewing: number
      completed: number
      overdue: number
    }>
  > {
    return backendGet("/expert-reviews/statistics")
  },

  async createReview(data: {
    projectId: number
    reviewType: string
    expertIds: number[]
    reviewDate?: string
    reviewRequirement?: string
  }): Promise<ApiResponse<number>> {
    return backendPost<number>("/expert-reviews", data)
  },

  // 获取投票数据的方法
  async getVoteData(projectId: number): Promise<
    ApiResponse<{
      projectName: string
      experts: Array<{
        expertId: number
        expertName: string
        institution: string
        title: string
        voteCount: number
        isMe: boolean
      }>
      hasVoted: boolean
      votedExpertId?: number
    }>
  > {
    return backendGet(`/expert-reviews/${projectId}/vote-data`)
  },

  // 投票方法
  async voteForLeader(data: {
    projectId: number
    expertId: number
  }): Promise<ApiResponse<void>> {
    return backendPost("/expert-reviews/vote-leader", data)
  },

  // 获取组长待处理项目的方法
  async getLeaderProjects(): Promise<
    ApiResponse<
      Array<{
        id: number
        projectId: string
        projectName: string
        projectType: string
        institution: string
        completedCount: number
        totalCount: number
        averageScore: number
        reviewStatus: string
      }>
    >
  > {
    return backendGet("/expert-reviews/leader-projects")
  },

  // 提交组长结论的方法
  async submitLeaderConclusion(data: {
    projectId: number
    conclusion: string
    recommendation: "approve" | "reject"
  }): Promise<ApiResponse<void>> {
    return backendPost("/expert-reviews/leader-conclusion", data)
  },

  // 获取项目所有专家评审意见的方法
  async getProjectReviews(projectId: number): Promise<
    ApiResponse<
      Array<{
        expertId: number
        expertName: string
        institution: string
        title: string
        score: number
        opinion: string
        suggestion?: string
        isApproved: boolean
        submittedAt: string
      }>
    >
  > {
    return backendGet(`/expert-reviews/${projectId}/all-reviews`)
  },
}
