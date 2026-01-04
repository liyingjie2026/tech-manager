// 专家管理 API
import { backendGet, backendPost, backendPut, backendDelete, upload } from "./client"
import type { Expert, ExpertSelection, PageParams, PageResult, ApiResponse } from "./types"

export const expertApi = {
  // 获取专家列表 - 调用 GET /experts
  async getList(
    params: PageParams & {
      field?: string
      title?: string
      institutionId?: string
      status?: string
    },
  ): Promise<ApiResponse<PageResult<Expert>>> {
    return backendGet<PageResult<Expert>>("/experts", {
      page: params.page || params.pageNum || 1,
      size: params.pageSize || 10,
      keyword: params.keyword,
      specialty: params.field,
      title: params.title,
      status: params.status,
    })
  },

  // 获取专家详情 - 调用 GET /experts/{id}
  async getById(id: number): Promise<ApiResponse<Expert>> {
    return backendGet<Expert>(`/experts/${id}`)
  },

  // 创建专家 - 调用 POST /experts
  async create(data: Partial<Expert>): Promise<ApiResponse<Expert>> {
    return backendPost<Expert>("/experts", data)
  },

  // 更新专家 - 调用 PUT /experts/{id}
  async update(id: number, data: Partial<Expert>): Promise<ApiResponse<Expert>> {
    return backendPut<Expert>(`/experts/${id}`, data)
  },

  // 删除专家 - 调用 DELETE /experts/{id}
  async delete(id: number): Promise<ApiResponse<void>> {
    return backendDelete<void>(`/experts/${id}`)
  },

  // 启用专家 - 调用 POST /experts/{id}/enable
  async enable(id: number): Promise<ApiResponse<void>> {
    return backendPost<void>(`/experts/${id}/enable`, {})
  },

  // 禁用专家 - 调用 POST /experts/{id}/disable
  async disable(id: number): Promise<ApiResponse<void>> {
    return backendPost<void>(`/experts/${id}/disable`, {})
  },

  // 上传专家照片 - 调用 POST /experts/{id}/photo
  async uploadPhoto(id: number, file: File): Promise<ApiResponse<{ url: string }>> {
    return upload<{ url: string }>(`/experts/${id}/photo`, file)
  },

  // 批量导入专家 - 调用 POST /experts/import
  async batchImport(file: File): Promise<ApiResponse<{ success: number; failed: number; errors: string[] }>> {
    return upload(`/experts/import`, file)
  },

  // 导出专家列表 - 调用 GET /experts/export
  async export(params?: { field?: string; status?: string }): Promise<void> {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8080"
    const queryString = params ? new URLSearchParams(params as any).toString() : ""
    const response = await fetch(`${backendUrl}/experts/export?${queryString}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "专家列表.xlsx"
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  },

  // ==================== 专家抽取 ====================

  // 随机抽取专家 - 调用 POST /experts/draw
  async drawExperts(params: {
    projectId: number
    count: number
    specialtyRequirements?: Array<{
      specialty: string
      count: number
    }>
    excludeConditions?: Array<{
      type: string
      value: string
      reason: string
    }>
  }): Promise<ApiResponse<Expert[]>> {
    return backendPost<Expert[]>("/experts/draw", params)
  },

  // 随机抽取专家 - 调用 POST /experts/random-select
  async randomSelect(params: {
    projectId: number
    purpose: string
    count: number
    fields?: string[]
    excludeIds?: number[]
    excludeInstitutionIds?: number[]
  }): Promise<ApiResponse<Expert[]>> {
    return backendPost<Expert[]>("/experts/random-select", params)
  },

  // 保存专家抽取记录 - 调用 POST /experts/selections
  async saveSelection(data: Partial<ExpertSelection>): Promise<ApiResponse<ExpertSelection>> {
    return backendPost<ExpertSelection>("/experts/selections", data)
  },

  // 获取专家抽取记录 - 调用 GET /experts/selections/project/{projectId}
  async getSelections(projectId: number): Promise<ApiResponse<ExpertSelection[]>> {
    return backendGet<ExpertSelection[]>(`/experts/selections/project/${projectId}`)
  },

  // 获取专家统计 - 调用 GET /experts/statistics
  async getStatistics(): Promise<
    ApiResponse<{
      total: number
      active: number
      byField: { field: string; count: number }[]
      byTitle: { title: string; count: number }[]
    }>
  > {
    return backendGet("/experts/statistics")
  },
}
