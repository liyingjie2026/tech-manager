// 年度检查 API
import { get, post } from "./client"
import type { Annual, PageParams, PageResult, ApiResponse } from "./types"

export const annualApi = {
  async getList(
    params: PageParams & {
      projectNo?: string // 改为 projectNo
      projectName?: string
      status?: string // 改为 status (不是 reviewStatus)
      pageNum?: number
      pageSize?: number
    },
  ): Promise<ApiResponse<PageResult<Annual>>> {
    const normalizedParams = {
      ...params,
      page: params.pageNum || params.page || 1,
      size: params.pageSize || params.size || 10,
    }
    delete (normalizedParams as any).pageNum
    delete (normalizedParams as any).pageSize

    return get<PageResult<Annual>>("/annuals", normalizedParams)
  },

  async getById(id: number): Promise<ApiResponse<Annual>> {
    return get<Annual>(`/annuals/${id}`)
  },

  async create(data: Partial<Annual>): Promise<ApiResponse<Annual>> {
    return post<Annual>("/annuals", data)
  },

  async submit(id: number): Promise<ApiResponse<void>> {
    return post<void>(`/annuals/${id}/submit`)
  },

  async approve(id: number, comment?: string): Promise<ApiResponse<void>> {
    return post<void>(`/annuals/${id}/approve`, { comment })
  },

  async reject(id: number, reason: string): Promise<ApiResponse<void>> {
    return post<void>(`/annuals/${id}/reject`, { reason })
  },

  async getStatistics(): Promise<
    ApiResponse<{
      total: number
      pending: number
      approved: number
      rejected: number
    }>
  > {
    return get("/annuals/statistics")
  },
}
