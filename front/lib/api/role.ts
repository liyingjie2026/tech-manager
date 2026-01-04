import { get, post, put, del } from "./client"
import type { ApiResponse, PageResponse } from "./config"

export const roleApi = {
  // 分页查询角色列表
  list: (params: {
    page: number
    size: number
    keyword?: string
  }): Promise<ApiResponse<PageResponse<any>>> => {
    return get("/api/roles", { params })
  },

  // 获取所有角色（下拉选择用）
  listAll: (): Promise<ApiResponse<any[]>> => {
    return get("/api/roles/all")
  },

  // 获取角色详情
  getById: (id: number): Promise<ApiResponse<any>> => {
    return get(`/api/roles/${id}`)
  },

  // 新增角色
  create: (data: any): Promise<ApiResponse<number>> => {
    return post("/api/roles", data)
  },

  // 更新角色
  update: (id: number, data: any): Promise<ApiResponse<void>> => {
    return put(`/api/roles/${id}`, data)
  },

  // 删除角色
  delete: (id: number): Promise<ApiResponse<void>> => {
    return del(`/api/roles/${id}`)
  },

  // 配置角色权限
  assignPermissions: (id: number, permissionIds: number[]): Promise<ApiResponse<void>> => {
    return post(`/api/roles/${id}/permissions`, permissionIds)
  },

  // 获取角色权限
  getPermissions: (id: number): Promise<ApiResponse<number[]>> => {
    return get(`/api/roles/${id}/permissions`)
  },
}
