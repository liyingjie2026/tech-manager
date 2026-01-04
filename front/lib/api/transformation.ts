import { get, post, put } from "./client"
import type { ApiResponse, PageResponse } from "./config"

// 成果转化API（在AchievementController中）
export const transformationApi = {
  // 获取成果转化列表
  list: (params: {
    page: number
    size: number
    keyword?: string
    type?: string
    status?: string
  }): Promise<ApiResponse<PageResponse<any>>> => {
    return get("/api/achievements/transformation", { params })
  },

  // 创建成果转化记录
  create: (achievementId: number, data: any): Promise<ApiResponse<number>> => {
    return post(`/api/achievements/${achievementId}/transformation`, data)
  },

  // 更新成果转化记录
  update: (transformationId: number, data: any): Promise<ApiResponse<void>> => {
    return put(`/api/achievements/transformation/${transformationId}`, data)
  },

  // 提交成果转化审核
  submit: (transformationId: number): Promise<ApiResponse<void>> => {
    return post(`/api/achievements/transformation/${transformationId}/submit`)
  },

  // 审核成果转化
  audit: (transformationId: number, data: { status: string; comment: string }): Promise<ApiResponse<void>> => {
    return post(`/api/achievements/transformation/${transformationId}/audit`, data)
  },
}
