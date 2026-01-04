import { backendGet, backendPost, backendPut, backendDelete, upload } from "./client"
import type { Achievement, AchievementTransformation, PageParams, PageResult, ApiResponse } from "../types"

export const achievementApi = {
  async getList(
    params: PageParams & {
      type?: string
      status?: string
      projectId?: number
      institutionId?: number
    },
  ): Promise<ApiResponse<PageResult<Achievement>>> {
    return backendGet<PageResult<Achievement>>("/achievements", params)
  },

  async getById(id: number): Promise<ApiResponse<Achievement>> {
    return backendGet<Achievement>(`/achievements/${id}`)
  },

  async create(data: Partial<Achievement>): Promise<ApiResponse<Achievement>> {
    return backendPost<Achievement>("/achievements", data)
  },

  async update(id: number, data: Partial<Achievement>): Promise<ApiResponse<Achievement>> {
    return backendPut<Achievement>(`/achievements/${id}`, data)
  },

  async delete(id: number): Promise<ApiResponse<void>> {
    return backendDelete<void>(`/achievements/${id}`)
  },

  async submit(id: number): Promise<ApiResponse<void>> {
    return backendPost<void>(`/achievements/${id}/submit`, {})
  },

  async review(id: number, approved: boolean, comment?: string): Promise<ApiResponse<void>> {
    return backendPost<void>(`/achievements/${id}/review`, { approved, comment })
  },

  async publish(id: number): Promise<ApiResponse<void>> {
    return backendPost<void>(`/achievements/${id}/publish`, {})
  },

  async uploadAttachment(id: number, file: File): Promise<ApiResponse<{ url: string }>> {
    return upload<{ url: string }>(`/achievements/${id}/attachments`, file)
  },

  async getTransformations(
    params: PageParams & {
      achievementName?: string
      inLibrary?: string
    },
  ): Promise<ApiResponse<PageResult<AchievementTransformation>>> {
    return backendGet<PageResult<AchievementTransformation>>("/achievements/transformation", params)
  },

  async getTransformation(achievementId: number): Promise<ApiResponse<AchievementTransformation>> {
    return backendGet<AchievementTransformation>(`/achievements/${achievementId}/transformation`)
  },

  async addTransformation(
    achievementId: number,
    data: Partial<AchievementTransformation>,
  ): Promise<ApiResponse<AchievementTransformation>> {
    return backendPost<AchievementTransformation>(`/achievements/${achievementId}/transformation`, data)
  },

  async updateTransformation(
    achievementId: number,
    data: Partial<AchievementTransformation>,
  ): Promise<ApiResponse<AchievementTransformation>> {
    return backendPut<AchievementTransformation>(`/achievements/${achievementId}/transformation`, data)
  },

  async getStatistics(): Promise<
    ApiResponse<{
      total: number
      byType: { type: string; count: number }[]
      papers: number
      patents: number
      awards: number
      transformations: number
    }>
  > {
    return backendGet("/achievements/statistics")
  },
}
