import { get, post, put, del } from "./client"
import type { ApiResponse } from "./config"

export const permissionApi = {
  // 获取权限树
  getTree: (): Promise<ApiResponse<any[]>> => {
    return get("/api/permissions/tree")
  },

  // 获取页面列表
  getPages: (): Promise<ApiResponse<any[]>> => {
    return get("/api/permissions/pages")
  },

  // 获取页面按钮权限
  getPageButtons: (pageId: number): Promise<ApiResponse<any[]>> => {
    return get(`/api/permissions/pages/${pageId}/buttons`)
  },

  // 获取角色权限配置
  getRolePermissions: (roleId: number): Promise<ApiResponse<any>> => {
    return get(`/api/permissions/roles/${roleId}`)
  },

  // 保存角色权限配置
  saveRolePermissions: (roleId: number, data: any): Promise<ApiResponse<void>> => {
    return post(`/api/permissions/roles/${roleId}`, data)
  },

  // 新增页面权限
  createPage: (data: any): Promise<ApiResponse<number>> => {
    return post("/api/permissions/pages", data)
  },

  // 新增按钮权限
  createButton: (pageId: number, data: any): Promise<ApiResponse<number>> => {
    return post(`/api/permissions/pages/${pageId}/buttons`, data)
  },

  // 更新按钮权限
  updateButton: (buttonId: number, data: any): Promise<ApiResponse<void>> => {
    return put(`/api/permissions/buttons/${buttonId}`, data)
  },

  // 删除按钮权限
  deleteButton: (buttonId: number): Promise<ApiResponse<void>> => {
    return del(`/api/permissions/buttons/${buttonId}`)
  },

  // 检查当前用户权限
  checkPermission: (pageCode: string, buttonCode: string): Promise<ApiResponse<boolean>> => {
    return get("/api/permissions/check", { params: { pageCode, buttonCode } })
  },

  // 获取当前用户所有权限
  getMyPermissions: (): Promise<ApiResponse<any>> => {
    return get("/api/permissions/my")
  },
}
