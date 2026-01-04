// 用户管理 API
import { get, post, put, del } from "./client"
import type { User, Role, Permission, PageParams, PageResult, ApiResponse } from "./types"

export const userApi = {
  // 获取用户列表
  async getList(
    params: PageParams & {
      institutionId?: string
      roleId?: string
      status?: string
      pageNum?: number
      pageSize?: number
    },
  ): Promise<ApiResponse<PageResult<User>>> {
    const normalizedParams = {
      ...params,
      page: params.pageNum || params.page || 1,
      size: params.pageSize || params.size || 10,
    }
    // 删除冗余参数
    delete (normalizedParams as any).pageNum
    delete (normalizedParams as any).pageSize

    return get<PageResult<User>>("/users", normalizedParams)
  },

  // 获取用户详情
  async getById(id: string): Promise<ApiResponse<User>> {
    return get<User>(`/users/${id}`)
  },

  // 创建用户
  async create(data: Partial<User>): Promise<ApiResponse<User>> {
    return post<User>("/users", data)
  },

  // 更新用户
  async update(id: string, data: Partial<User>): Promise<ApiResponse<User>> {
    return put<User>(`/users/${id}`, data)
  },

  // 删除用户
  async delete(id: string): Promise<ApiResponse<void>> {
    return del<void>(`/users/${id}`)
  },

  // 批量删除用户
  async batchDelete(ids: string[]): Promise<ApiResponse<void>> {
    return post<void>("/users/batch-delete", { ids })
  },

  // 启用/禁用用户
  async updateStatus(id: string, status: string): Promise<ApiResponse<void>> {
    return put<void>(`/users/${id}/status`, { status })
  },

  // 重置用户密码
  async resetPassword(id: string): Promise<ApiResponse<{ newPassword: string }>> {
    return post<{ newPassword: string }>(`/users/${id}/reset-password`)
  },

  // 分配角色
  async assignRoles(id: string, roleIds: string[]): Promise<ApiResponse<void>> {
    return put<void>(`/users/${id}/roles`, { roleIds })
  },

  // ==================== 角色管理 ====================

  // 获取角色列表
  async getRoles(params?: PageParams): Promise<ApiResponse<PageResult<Role>>> {
    return get<PageResult<Role>>("/roles", params)
  },

  // 获取所有角色（不分页）
  async getAllRoles(): Promise<ApiResponse<Role[]>> {
    return get<Role[]>("/roles/all")
  },

  // 获取角色详情
  async getRoleById(id: string): Promise<ApiResponse<Role>> {
    return get<Role>(`/roles/${id}`)
  },

  // 创建角色
  async createRole(data: Partial<Role>): Promise<ApiResponse<Role>> {
    return post<Role>("/roles", data)
  },

  // 更新角色
  async updateRole(id: string, data: Partial<Role>): Promise<ApiResponse<Role>> {
    return put<Role>(`/roles/${id}`, data)
  },

  // 删除角色
  async deleteRole(id: string): Promise<ApiResponse<void>> {
    return del<void>(`/roles/${id}`)
  },

  // 分配权限
  async assignPermissions(roleId: string, permissionIds: string[]): Promise<ApiResponse<void>> {
    return put<void>(`/roles/${roleId}/permissions`, { permissionIds })
  },

  // ==================== 权限管理 ====================

  // 获取权限树
  async getPermissionTree(): Promise<ApiResponse<Permission[]>> {
    return get<Permission[]>("/permissions/tree")
  },

  // 获取权限列表
  async getPermissions(): Promise<ApiResponse<Permission[]>> {
    return get<Permission[]>("/permissions")
  },

  // 创建权限
  async createPermission(data: Partial<Permission>): Promise<ApiResponse<Permission>> {
    return post<Permission>("/permissions", data)
  },

  // 更新权限
  async updatePermission(id: string, data: Partial<Permission>): Promise<ApiResponse<Permission>> {
    return put<Permission>(`/permissions/${id}`, data)
  },

  // 删除权限
  async deletePermission(id: string): Promise<ApiResponse<void>> {
    return del<void>(`/permissions/${id}`)
  },
}
