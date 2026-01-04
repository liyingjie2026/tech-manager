// 检查管理 API
import { get, post, put, del, upload } from "./client"
import type { Inspection, PageParams, PageResult, ApiResponse } from "../types"

export const inspectionApi = {
  // 获取检查列表
  async getList(
    params: PageParams & {
      projectId?: string
      type?: string
      status?: string
      year?: number
    },
  ): Promise<ApiResponse<PageResult<Inspection>>> {
    return get<PageResult<Inspection>>("/inspections", params)
  },

  // 获取检查详情
  async getById(id: string): Promise<ApiResponse<Inspection>> {
    return get<Inspection>(`/inspections/${id}`)
  },

  // 获取项目的检查记录
  async getByProjectId(projectId: string): Promise<ApiResponse<Inspection[]>> {
    return get<Inspection[]>(`/inspections/project/${projectId}`)
  },

  // 创建检查记录
  async create(data: Partial<Inspection>): Promise<ApiResponse<Inspection>> {
    return post<Inspection>("/inspections", data)
  },

  // 更新检查记录
  async update(id: string, data: Partial<Inspection>): Promise<ApiResponse<Inspection>> {
    return put<Inspection>(`/inspections/${id}`, data)
  },

  // 删除检查记录
  async delete(id: string): Promise<ApiResponse<void>> {
    return del<void>(`/inspections/${id}`)
  },

  // 提交检查
  async submit(id: string): Promise<ApiResponse<void>> {
    return post<void>(`/inspections/${id}/submit`)
  },

  // 审核检查
  async review(id: string, passed: boolean, comment?: string): Promise<ApiResponse<void>> {
    return post<void>(`/inspections/${id}/review`, { passed, comment })
  },

  // 上传检查附件
  async uploadAttachment(id: string, file: File, type: string): Promise<ApiResponse<{ url: string }>> {
    return upload<{ url: string }>(`/inspections/${id}/attachments`, file, "file", { type })
  },

  // 获取检查统计
  async getStatistics(type: "midterm" | "annual"): Promise<
    ApiResponse<{
      total: number
      pending: number
      submitted: number
      passed: number
      failed: number
    }>
  > {
    return get("/inspections/statistics", { type })
  },
}
