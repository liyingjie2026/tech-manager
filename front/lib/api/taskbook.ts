// 任务书管理 API
import { get, post, put, del, upload, download } from "./client"
import type { TaskBook, TaskItem, PageParams, PageResult, ApiResponse } from "./types"

export const taskBookApi = {
  // 获取任务书列表
  async getList(
    params: PageParams & {
      projectType?: string
      status?: string
      institutionId?: string
      pageNum?: number
      pageSize?: number
    },
  ): Promise<ApiResponse<PageResult<TaskBook>>> {
    const normalizedParams = {
      ...params,
      page: params.pageNum || params.page || 1,
      size: params.pageSize || params.size || 10,
    }
    delete (normalizedParams as any).pageNum
    delete (normalizedParams as any).pageSize

    return get<PageResult<TaskBook>>("/taskbooks", normalizedParams)
  },

  // 获取任务书详情
  async getById(id: string): Promise<ApiResponse<TaskBook>> {
    return get<TaskBook>(`/taskbooks/${id}`)
  },

  // 根据项目ID获取任务书
  async getByProjectId(projectId: string): Promise<ApiResponse<TaskBook>> {
    return get<TaskBook>(`/taskbooks/project/${projectId}`)
  },

  // 创建任务书
  async create(projectId: string, data: Partial<TaskBook>): Promise<ApiResponse<TaskBook>> {
    return post<TaskBook>("/taskbooks", { ...data, projectId })
  },

  // 更新任务书
  async update(id: string, data: Partial<TaskBook>): Promise<ApiResponse<TaskBook>> {
    return put<TaskBook>(`/taskbooks/${id}`, data)
  },

  // 删除任务书
  async delete(id: string): Promise<ApiResponse<void>> {
    return del<void>(`/taskbooks/${id}`)
  },

  // 提交任务书
  async submit(id: string): Promise<ApiResponse<void>> {
    return post<void>(`/taskbooks/${id}/submit`)
  },

  // 审核任务书
  async review(id: string, approved: boolean, comment?: string): Promise<ApiResponse<void>> {
    return post<void>(`/taskbooks/${id}/review`, { approved, comment })
  },

  // ==================== 任务项管理 ====================

  // 获取任务项列表
  async getTasks(taskBookId: string): Promise<ApiResponse<TaskItem[]>> {
    return get<TaskItem[]>(`/taskbooks/${taskBookId}/tasks`)
  },

  // 添加任务项
  async addTask(taskBookId: string, data: Partial<TaskItem>): Promise<ApiResponse<TaskItem>> {
    return post<TaskItem>(`/taskbooks/${taskBookId}/tasks`, data)
  },

  // 更新任务项
  async updateTask(taskBookId: string, taskId: string, data: Partial<TaskItem>): Promise<ApiResponse<TaskItem>> {
    return put<TaskItem>(`/taskbooks/${taskBookId}/tasks/${taskId}`, data)
  },

  // 删除任务项
  async removeTask(taskBookId: string, taskId: string): Promise<ApiResponse<void>> {
    return del<void>(`/taskbooks/${taskBookId}/tasks/${taskId}`)
  },

  // 批量添加任务项
  async batchAddTasks(taskBookId: string, tasks: Partial<TaskItem>[]): Promise<ApiResponse<TaskItem[]>> {
    return post<TaskItem[]>(`/taskbooks/${taskBookId}/tasks/batch`, { tasks })
  },

  // ==================== 导出与签订 ====================

  // 导出任务书
  async export(id: string): Promise<void> {
    await download(`/taskbooks/${id}/export`, `任务书_${id}.docx`)
  },

  // 上传已签订任务书
  async uploadSigned(id: string, file: File): Promise<ApiResponse<{ url: string }>> {
    return upload<{ url: string }>(`/taskbooks/${id}/signed`, file)
  },

  // 确认签订
  async confirmSign(id: string): Promise<ApiResponse<void>> {
    return post<void>(`/taskbooks/${id}/sign`)
  },

  // ==================== 统计 ====================

  // 获取任务书统计
  async getStatistics(): Promise<
    ApiResponse<{
      pending: number
      signed: number
      executing: number
      completed: number
    }>
  > {
    return get("/taskbooks/statistics")
  },

  async withdraw(id: string): Promise<ApiResponse<void>> {
    return post<void>(`/taskbooks/${id}/withdraw`)
  },
}
