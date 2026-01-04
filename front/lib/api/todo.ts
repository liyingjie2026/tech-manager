import { backendGet, backendPost } from "./client"

export interface TodoItem {
  id: number
  title: string
  description: string
  type: string
  typeName: string
  businessNo: string
  businessType: string
  priority: string
  priorityName: string
  status: string
  statusName: string
  deadline: string
  linkUrl: string
  createTime: string
  isOverdue: boolean
  daysRemaining: number
}

export interface TodoStatistics {
  totalCount: number
  pendingCount: number
  processingCount: number
  completedCount: number
  urgentCount: number
  overdueCount: number
  todayCount: number
  weekCount: number
}

export const todoApi = {
  // 分页查询待办事项
  list: (params: {
    page?: number
    size?: number
    role?: string
    type?: string
    status?: string
    keyword?: string
  }) => backendGet<{ records: TodoItem[]; total: number }>("/todos", params),

  // 获取待办统计
  getStatistics: (role?: string) => backendGet<TodoStatistics>("/todos/statistics", { role }),

  // 获取待办详情
  getById: (id: number) => backendGet<TodoItem>(`/todos/${id}`),

  // 完成待办
  complete: (id: number) => backendPost(`/todos/${id}/complete`),

  // 取消待办
  cancel: (id: number) => backendPost(`/todos/${id}/cancel`),

  // 获取未完成待办数量（用于角标）
  getUncompletedCount: () => backendGet<number>("/todos/uncompleted-count"),
}
