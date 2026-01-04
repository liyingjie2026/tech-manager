// 中期检查 API
import { get, post } from "./client"
import type { Midterm, PageParams, PageResult, ApiResponse } from "./types"

export const midtermApi = {
  async getList(
    params: PageParams & {
      projectNo?: string // 改为 projectNo
      projectName?: string
      status?: string // 改为 status (不是 reviewStatus)
      pageNum?: number
      pageSize?: number
    },
  ): Promise<ApiResponse<PageResult<Midterm>>> {
    const normalizedParams = {
      ...params,
      page: params.pageNum || params.page || 1,
      size: params.pageSize || params.size || 10,
    }
    delete (normalizedParams as any).pageNum
    delete (normalizedParams as any).pageSize

    return get<PageResult<Midterm>>("/midterms", normalizedParams)
  },

  async getById(id: number): Promise<ApiResponse<Midterm>> {
    return get<Midterm>(`/midterms/${id}`)
  },

  async create(data: Partial<Midterm>): Promise<ApiResponse<Midterm>> {
    return post<Midterm>("/midterms", data)
  },

  async submit(id: number): Promise<ApiResponse<void>> {
    return post<void>(`/midterms/${id}/submit`)
  },

  async approve(id: number, comment?: string): Promise<ApiResponse<void>> {
    return post<void>(`/midterms/${id}/approve`, { comment })
  },

  async reject(id: number, reason: string): Promise<ApiResponse<void>> {
    return post<void>(`/midterms/${id}/reject`, { reason })
  },

  async getHistory(id: number): Promise<ApiResponse<any[]>> {
    return get(`/midterms/${id}/history`)
  },

  async getStatistics(): Promise<
    ApiResponse<{
      total: number
      pending: number
      approved: number
      rejected: number
    }>
  > {
    return get("/midterms/statistics")
  },
}
