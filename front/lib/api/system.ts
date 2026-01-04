// 系统管理 API
import { get, post, put, del } from "./client"
import type { DictItem, SystemConfig, Notification, PageParams, PageResult, ApiResponse } from "../types"

export const systemApi = {
  // ==================== 字典管理 ====================

  // 获取字典列表
  async getDictList(
    params?: PageParams & {
      dictCode?: string
    },
  ): Promise<ApiResponse<PageResult<DictItem>>> {
    return get<PageResult<DictItem>>("/system/dicts", params)
  },

  // 根据字典编码获取字典项
  async getDictItems(dictCode: string): Promise<ApiResponse<DictItem[]>> {
    return get<DictItem[]>(`/system/dicts/${dictCode}/items`)
  },

  // 创建字典项
  async createDictItem(data: Partial<DictItem>): Promise<ApiResponse<DictItem>> {
    return post<DictItem>("/system/dicts", data)
  },

  // 更新字典项
  async updateDictItem(id: string, data: Partial<DictItem>): Promise<ApiResponse<DictItem>> {
    return put<DictItem>(`/system/dicts/${id}`, data)
  },

  // 删除字典项
  async deleteDictItem(id: string): Promise<ApiResponse<void>> {
    return del<void>(`/system/dicts/${id}`)
  },

  // ==================== 系统配置 ====================

  // 获取系统配置
  async getConfig(key: string): Promise<ApiResponse<SystemConfig>> {
    return get<SystemConfig>(`/system/configs/${key}`)
  },

  // 获取所有配置
  async getAllConfigs(): Promise<ApiResponse<SystemConfig[]>> {
    return get<SystemConfig[]>("/system/configs")
  },

  // 更新系统配置
  async updateConfig(key: string, value: string): Promise<ApiResponse<void>> {
    return put<void>(`/system/configs/${key}`, { value })
  },

  // ==================== 通知管理 ====================

  // 获取通知列表
  async getNotifications(
    params?: PageParams & {
      type?: string
      isRead?: boolean
    },
  ): Promise<ApiResponse<PageResult<Notification>>> {
    return get<PageResult<Notification>>("/system/notifications", params)
  },

  // 获取未读通知数量
  async getUnreadCount(): Promise<ApiResponse<number>> {
    return get<number>("/system/notifications/unread-count")
  },

  // 标记通知为已读
  async markAsRead(id: string): Promise<ApiResponse<void>> {
    return post<void>(`/system/notifications/${id}/read`)
  },

  // 标记所有通知为已读
  async markAllAsRead(): Promise<ApiResponse<void>> {
    return post<void>("/system/notifications/read-all")
  },

  // 删除通知
  async deleteNotification(id: string): Promise<ApiResponse<void>> {
    return del<void>(`/system/notifications/${id}`)
  },

  // ==================== 文件上传 ====================

  // 获取上传凭证
  async getUploadToken(
    filename: string,
    contentType: string,
  ): Promise<
    ApiResponse<{
      uploadUrl: string
      fileUrl: string
    }>
  > {
    return post("/system/upload/token", { filename, contentType })
  },

  // ==================== 日志管理 ====================

  // 获取操作日志
  async getOperationLogs(
    params?: PageParams & {
      userId?: string
      module?: string
      startDate?: string
      endDate?: string
    },
  ): Promise<
    ApiResponse<
      PageResult<{
        id: string
        userId: string
        userName: string
        module: string
        action: string
        ip: string
        userAgent: string
        createdAt: string
      }>
    >
  > {
    return get("/system/logs/operations", params)
  },

  // 获取登录日志
  async getLoginLogs(
    params?: PageParams & {
      userId?: string
      status?: string
      startDate?: string
      endDate?: string
    },
  ): Promise<
    ApiResponse<
      PageResult<{
        id: string
        userId: string
        userName: string
        ip: string
        location: string
        browser: string
        os: string
        status: string
        message: string
        createdAt: string
      }>
    >
  > {
    return get("/system/logs/logins", params)
  },
}
