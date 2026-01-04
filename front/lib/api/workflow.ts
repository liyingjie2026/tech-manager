// 流程引擎 API
import { get, post, put, del } from "./client"
import type { WorkflowDefinition, WorkflowInstance, WorkflowTask, PageParams, PageResult, ApiResponse } from "../types"

export const workflowApi = {
  // ==================== 流程定义 ====================

  // 获取流程定义列表
  async getDefinitions(
    params?: PageParams & {
      businessType?: string
      isActive?: boolean
    },
  ): Promise<ApiResponse<PageResult<WorkflowDefinition>>> {
    return get<PageResult<WorkflowDefinition>>("/workflows/definitions", params)
  },

  // 获取流程定义详情
  async getDefinitionById(id: string): Promise<ApiResponse<WorkflowDefinition>> {
    return get<WorkflowDefinition>(`/workflows/definitions/${id}`)
  },

  // 创建流程定义
  async createDefinition(data: Partial<WorkflowDefinition>): Promise<ApiResponse<WorkflowDefinition>> {
    return post<WorkflowDefinition>("/workflows/definitions", data)
  },

  // 更新流程定义
  async updateDefinition(id: string, data: Partial<WorkflowDefinition>): Promise<ApiResponse<WorkflowDefinition>> {
    return put<WorkflowDefinition>(`/workflows/definitions/${id}`, data)
  },

  // 删除流程定义
  async deleteDefinition(id: string): Promise<ApiResponse<void>> {
    return del<void>(`/workflows/definitions/${id}`)
  },

  // 发布流程定义
  async publishDefinition(id: string): Promise<ApiResponse<void>> {
    return post<void>(`/workflows/definitions/${id}/publish`)
  },

  // 停用流程定义
  async deactivateDefinition(id: string): Promise<ApiResponse<void>> {
    return post<void>(`/workflows/definitions/${id}/deactivate`)
  },

  // ==================== 流程实例 ====================

  // 获取流程实例列表
  async getInstances(
    params?: PageParams & {
      definitionId?: string
      businessType?: string
      status?: string
    },
  ): Promise<ApiResponse<PageResult<WorkflowInstance>>> {
    return get<PageResult<WorkflowInstance>>("/workflows/instances", params)
  },

  // 获取流程实例详情
  async getInstanceById(id: string): Promise<ApiResponse<WorkflowInstance>> {
    return get<WorkflowInstance>(`/workflows/instances/${id}`)
  },

  // 启动流程实例
  async startInstance(
    definitionId: string,
    businessId: string,
    businessName: string,
  ): Promise<ApiResponse<WorkflowInstance>> {
    return post<WorkflowInstance>("/workflows/instances", { definitionId, businessId, businessName })
  },

  // 终止流程实例
  async terminateInstance(id: string, reason?: string): Promise<ApiResponse<void>> {
    return post<void>(`/workflows/instances/${id}/terminate`, { reason })
  },

  // 挂起流程实例
  async suspendInstance(id: string): Promise<ApiResponse<void>> {
    return post<void>(`/workflows/instances/${id}/suspend`)
  },

  // 恢复流程实例
  async resumeInstance(id: string): Promise<ApiResponse<void>> {
    return post<void>(`/workflows/instances/${id}/resume`)
  },

  // ==================== 流程任务 ====================

  // 获取待办任务列表
  async getTasks(
    params?: PageParams & {
      assigneeId?: string
      status?: string
      businessType?: string
    },
  ): Promise<ApiResponse<PageResult<WorkflowTask>>> {
    return get<PageResult<WorkflowTask>>("/workflows/tasks", params)
  },

  // 获取我的待办任务
  async getMyTasks(params?: PageParams): Promise<ApiResponse<PageResult<WorkflowTask>>> {
    return get<PageResult<WorkflowTask>>("/workflows/tasks/my", params)
  },

  // 获取任务详情
  async getTaskById(id: string): Promise<ApiResponse<WorkflowTask>> {
    return get<WorkflowTask>(`/workflows/tasks/${id}`)
  },

  // 完成任务
  async completeTask(id: string, action: string, comment?: string): Promise<ApiResponse<void>> {
    return post<void>(`/workflows/tasks/${id}/complete`, { action, comment })
  },

  // 转办任务
  async transferTask(id: string, targetUserId: string, comment?: string): Promise<ApiResponse<void>> {
    return post<void>(`/workflows/tasks/${id}/transfer`, { targetUserId, comment })
  },

  // 委托任务
  async delegateTask(id: string, targetUserId: string, comment?: string): Promise<ApiResponse<void>> {
    return post<void>(`/workflows/tasks/${id}/delegate`, { targetUserId, comment })
  },

  // 获取流程历史
  async getHistory(instanceId: string): Promise<ApiResponse<WorkflowTask[]>> {
    return get<WorkflowTask[]>(`/workflows/instances/${instanceId}/history`)
  },
}
