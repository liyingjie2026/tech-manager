// 变更管理 API
import { backendGet, backendPost, backendPut, backendDelete } from "./client"
import type { Change, PageParams, PageResult, ApiResponse } from "./types"

export const changeApi = {
  // 获取变更申请列表
  async getList(
    params: PageParams & {
      projectId?: string
      changeType?: string
      status?: string
      projectNumber?: string
      projectName?: string
    },
  ): Promise<ApiResponse<PageResult<Change>>> {
    const { pageSize, ...rest } = params
    return backendGet<PageResult<Change>>("/changes", {
      ...rest,
      size: pageSize,
    })
  },

  // 获取变更申请详情
  async getById(id: string): Promise<ApiResponse<Change>> {
    return backendGet<Change>(`/changes/${id}`)
  },

  // 获取项目的变更历史
  async getHistory(projectId: string): Promise<ApiResponse<Change[]>> {
    return backendGet<Change[]>(`/changes/project/${projectId}/history`)
  },

  // 创建变更申请
  async create(data: Partial<Change>): Promise<ApiResponse<Change>> {
    return backendPost<Change>("/changes", data)
  },

  // 更新变更申请
  async update(id: string, data: Partial<Change>): Promise<ApiResponse<Change>> {
    return backendPut<Change>(`/changes/${id}`, data)
  },

  // 删除变更申请
  async delete(id: string): Promise<ApiResponse<void>> {
    return backendDelete<void>(`/changes/${id}`)
  },

  // 提交变更申请
  async submit(id: string): Promise<ApiResponse<void>> {
    return backendPost<void>(`/changes/${id}/submit`)
  },

  // 审核通过变更申请
  async approve(id: string, comment?: string): Promise<ApiResponse<void>> {
    return backendPost<void>(`/changes/${id}/approve`, { comment })
  },

  // 审核驳回变更申请
  async reject(id: string, reason: string): Promise<ApiResponse<void>> {
    return backendPost<void>(`/changes/${id}/reject`, { reason })
  },

  // 退回变更申请修改
  async returnForModification(id: string, reason: string): Promise<ApiResponse<void>> {
    return backendPost<void>(`/changes/${id}/return`, { reason })
  },

  // 获取变更统计数据
  async getStatistics(changeType?: string, status?: string): Promise<ApiResponse<any>> {
    return backendGet<any>("/changes/statistics", { changeType, status })
  },
}
