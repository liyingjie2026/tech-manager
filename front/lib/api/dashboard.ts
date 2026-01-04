import { apiClient } from "./client"

export interface DashboardData {
  projectStats: {
    total: number // 已立项项目数
    inProgress: number // 申报中项目数
    completed: number // 已完成项目数
    accepted: number // 已验收项目数
    totalBudget: number // 总预算金额（万元）
  }
  todoItems: Array<{
    id: number
    title: string
    description: string
    type: string
    typeName: string
    priority: string
    priorityName: string
    status: string
    statusName: string
    deadline: string
    daysRemaining: number
    isOverdue: boolean
    linkUrl: string
  }>
  notifications: Array<{
    id: number
    title: string
    type: string
    date: string
  }>
  recentProjects: Array<{
    id: number
    projectNo: string
    name: string
    status: string
    progress: number
  }>
}

export const dashboardApi = {
  /**
   * 获取工作台数据
   * 根据当前用户权限返回统计数据
   */
  getDashboard: () => {
    return apiClient.get<DashboardData>("/dashboard")
  },
}
