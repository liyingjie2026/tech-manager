// 验收管理 API
import { get, post, put, del, upload } from "./client"
import type { Acceptance, PageParams, PageResult, ApiResponse } from "./types"

export interface AcceptanceReview {
  id?: number
  acceptanceId?: number
  expertId?: number
  expertName?: string
  reviewScore?: number
  reviewComment?: string
  reviewResult?: string
  reviewTime?: string
}

export const acceptanceApi = {
  // 获取验收列表
  async getList(
    params: PageParams & {
      projectId?: string
      status?: string
      year?: number
    },
  ): Promise<ApiResponse<PageResult<Acceptance>>> {
    return get<PageResult<Acceptance>>("/acceptances", params)
  },

  // 获取验收详情
  async getById(id: string): Promise<ApiResponse<Acceptance>> {
    return get<Acceptance>(`/acceptances/${id}`)
  },

  // 创建验收申请
  async create(projectId: string, data: Partial<Acceptance>): Promise<ApiResponse<Acceptance>> {
    return post<Acceptance>("/acceptances", { ...data, projectId })
  },

  // 更新验收申请
  async update(id: string, data: Partial<Acceptance>): Promise<ApiResponse<Acceptance>> {
    return put<Acceptance>(`/acceptances/${id}`, data)
  },

  // 删除验收申请
  async delete(id: string): Promise<ApiResponse<void>> {
    return del<void>(`/acceptances/${id}`)
  },

  // 提交验收申请
  async submit(id: string): Promise<ApiResponse<void>> {
    return post<void>(`/acceptances/${id}/submit`)
  },

  // 撤回验收申请
  async withdraw(id: string): Promise<ApiResponse<void>> {
    return post<void>(`/acceptances/${id}/withdraw`)
  },

  // 审核验收申请
  async review(id: string, approved: boolean, comment?: string): Promise<ApiResponse<void>> {
    return post<void>(`/acceptances/${id}/review`, { approved, comment })
  },

  // 上传验收附件
  async uploadAttachment(id: string, file: File, type: string): Promise<ApiResponse<{ url: string }>> {
    return upload<{ url: string }>(`/acceptances/${id}/attachments`, file, "file", { type })
  },

  // ==================== 专家评审 ====================

  // 获取专家评审意见
  async getReviews(id: string): Promise<ApiResponse<AcceptanceReview[]>> {
    return get<AcceptanceReview[]>(`/acceptances/${id}/reviews`)
  },

  // 提交专家评审意见
  async submitReview(id: string, data: Partial<AcceptanceReview>): Promise<ApiResponse<void>> {
    return post<void>(`/acceptances/${id}/reviews`, data)
  },

  // 完成验收（根据专家评审结果）
  async complete(id: string, result: "passed" | "failed" | "deferred", comment?: string): Promise<ApiResponse<void>> {
    return post<void>(`/acceptances/${id}/complete`, { result, comment })
  },

  // 获取验收统计
  async getStatistics(): Promise<
    ApiResponse<{
      total: number
      pending: number
      reviewing: number
      passed: number
      failed: number
    }>
  > {
    return get("/acceptances/statistics")
  },
}
