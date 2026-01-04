import { get, post, put, del } from "./client"
import type { ApiResponse, PageResponse } from "./config"

export const noticeApi = {
  // 分页查询通知列表
  list: (params: {
    page: number
    size: number
    keyword?: string
    type?: string
    status?: string
  }): Promise<ApiResponse<PageResponse<any>>> => {
    return get("/api/notices", { params })
  },

  // 获取通知详情
  getById: (id: number): Promise<ApiResponse<any>> => {
    return get(`/api/notices/${id}`)
  },

  // 创建通知
  create: (data: any): Promise<ApiResponse<number>> => {
    return post("/api/notices", data)
  },

  // 更新通知
  update: (id: number, data: any): Promise<ApiResponse<void>> => {
    return put(`/api/notices/${id}`, data)
  },

  // 删除通知
  delete: (id: number): Promise<ApiResponse<void>> => {
    return del(`/api/notices/${id}`)
  },

  // 发布通知
  publish: (id: number): Promise<ApiResponse<void>> => {
    return post(`/api/notices/${id}/publish`)
  },

  // 撤回通知
  withdraw: (id: number): Promise<ApiResponse<void>> => {
    return post(`/api/notices/${id}/withdraw`)
  },

  // 获取已发布通知列表
  listPublished: (limit = 10): Promise<ApiResponse<any[]>> => {
    return get("/api/notices/published", { params: { limit } })
  },

  // 标记通知已读
  markAsRead: (id: number): Promise<ApiResponse<void>> => {
    return post(`/api/notices/${id}/read`)
  },

  // 获取未读通知数量
  getUnreadCount: (): Promise<ApiResponse<number>> => {
    return get("/api/notices/unread/count")
  },
}
