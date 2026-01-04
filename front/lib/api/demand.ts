// 需求管理 API
import { get, post, put, del } from "./client"
import type { Demand, PageParams, PageResult, ApiResponse } from "../types"

export const demandApi = {
  // 获取需求列表
  async getList(
    params: PageParams & {
      field?: string
      status?: string
      expectedLevel?: string
      pageNum?: number
      pageSize?: number
    },
  ): Promise<ApiResponse<PageResult<Demand>>> {
    const normalizedParams = {
      ...params,
      page: params.pageNum || params.page || 1,
      size: params.pageSize || params.size || 10,
    }
    delete (normalizedParams as any).pageNum
    delete (normalizedParams as any).pageSize

    return get<PageResult<Demand>>("/demands", normalizedParams)
  },

  // 获取需求详情
  async getById(id: string): Promise<ApiResponse<Demand>> {
    return get<Demand>(`/demands/${id}`)
  },

  // 创建需求
  async create(data: Partial<Demand>): Promise<ApiResponse<Demand>> {
    return post<Demand>("/demands", data)
  },

  // 更新需求
  async update(id: string, data: Partial<Demand>): Promise<ApiResponse<Demand>> {
    return put<Demand>(`/demands/${id}`, data)
  },

  // 删除需求
  async delete(id: string): Promise<ApiResponse<void>> {
    return del<void>(`/demands/${id}`)
  },

  // 提交需求
  async submit(id: string): Promise<ApiResponse<void>> {
    return post<void>(`/demands/${id}/submit`)
  },

  // 审核需求
  async review(id: string, approved: boolean, comment?: string): Promise<ApiResponse<void>> {
    return post<void>(`/demands/${id}/review`, { approved, comment })
  },

  // 发布需求
  async publish(id: string): Promise<ApiResponse<void>> {
    return post<void>(`/demands/${id}/publish`)
  },

  // 关闭需求
  async close(id: string, reason?: string): Promise<ApiResponse<void>> {
    return post<void>(`/demands/${id}/close`, { reason })
  },

  // 获取需求统计
  async getStatistics(): Promise<
    ApiResponse<{
      total: number
      collecting: number
      matched: number
      published: number
    }>
  > {
    return get("/demands/statistics")
  },
}
