// 共享资源管理 API
import { get, post, put, del, upload } from "./client"
import type {
  Equipment,
  DataResource,
  Software,
  ResourceBorrowRequest,
  PageParams,
  PageResult,
  ApiResponse,
} from "../types"

export const resourceApi = {
  // ==================== 科研仪器 ====================

  // 获取仪器列表
  async getEquipmentList(
    params: PageParams & {
      category?: string
      field?: string
      institutionId?: string
      status?: string
      isShared?: boolean
    },
  ): Promise<ApiResponse<PageResult<Equipment>>> {
    return get<PageResult<Equipment>>("/resources/equipment", params)
  },

  // 获取仪器详情
  async getEquipmentById(id: string): Promise<ApiResponse<Equipment>> {
    return get<Equipment>(`/resources/equipment/${id}`)
  },

  // 创建仪器
  async createEquipment(data: Partial<Equipment>): Promise<ApiResponse<Equipment>> {
    return post<Equipment>("/resources/equipment", data)
  },

  // 更新仪器
  async updateEquipment(id: string, data: Partial<Equipment>): Promise<ApiResponse<Equipment>> {
    return put<Equipment>(`/resources/equipment/${id}`, data)
  },

  // 删除仪器
  async deleteEquipment(id: string): Promise<ApiResponse<void>> {
    return del<void>(`/resources/equipment/${id}`)
  },

  // 上传仪器图片
  async uploadEquipmentImage(id: string, file: File): Promise<ApiResponse<{ url: string }>> {
    return upload<{ url: string }>(`/resources/equipment/${id}/image`, file)
  },

  // ==================== 基础数据 ====================

  // 获取数据列表
  async getDataList(
    params: PageParams & {
      category?: string
      field?: string
      institutionId?: string
      accessLevel?: string
    },
  ): Promise<ApiResponse<PageResult<DataResource>>> {
    return get<PageResult<DataResource>>("/resources/data", params)
  },

  // 获取数据详情
  async getDataById(id: string): Promise<ApiResponse<DataResource>> {
    return get<DataResource>(`/resources/data/${id}`)
  },

  // 创建数据
  async createData(data: Partial<DataResource>): Promise<ApiResponse<DataResource>> {
    return post<DataResource>("/resources/data", data)
  },

  // 更新数据
  async updateData(id: string, data: Partial<DataResource>): Promise<ApiResponse<DataResource>> {
    return put<DataResource>(`/resources/data/${id}`, data)
  },

  // 删除数据
  async deleteData(id: string): Promise<ApiResponse<void>> {
    return del<void>(`/resources/data/${id}`)
  },

  // ==================== 专业软件 ====================

  // 获取软件列表
  async getSoftwareList(
    params: PageParams & {
      category?: string
      institutionId?: string
      status?: string
      isShared?: boolean
    },
  ): Promise<ApiResponse<PageResult<Software>>> {
    return get<PageResult<Software>>("/resources/software", params)
  },

  // 获取软件详情
  async getSoftwareById(id: string): Promise<ApiResponse<Software>> {
    return get<Software>(`/resources/software/${id}`)
  },

  // 创建软件
  async createSoftware(data: Partial<Software>): Promise<ApiResponse<Software>> {
    return post<Software>("/resources/software", data)
  },

  // 更新软件
  async updateSoftware(id: string, data: Partial<Software>): Promise<ApiResponse<Software>> {
    return put<Software>(`/resources/software/${id}`, data)
  },

  // 删除软件
  async deleteSoftware(id: string): Promise<ApiResponse<void>> {
    return del<void>(`/resources/software/${id}`)
  },

  // ==================== 借用申请 ====================

  // 获取借用申请列表
  async getBorrowRequests(
    params: PageParams & {
      resourceType?: string
      status?: string
      applicantId?: string
    },
  ): Promise<ApiResponse<PageResult<ResourceBorrowRequest>>> {
    return get<PageResult<ResourceBorrowRequest>>("/resources/borrow-requests", params)
  },

  // 创建借用申请
  async createBorrowRequest(data: Partial<ResourceBorrowRequest>): Promise<ApiResponse<ResourceBorrowRequest>> {
    return post<ResourceBorrowRequest>("/resources/borrow-requests", data)
  },

  // 审核借用申请
  async reviewBorrowRequest(id: string, approved: boolean, comment?: string): Promise<ApiResponse<void>> {
    return post<void>(`/resources/borrow-requests/${id}/review`, { approved, comment })
  },

  // 归还资源
  async returnResource(id: string): Promise<ApiResponse<void>> {
    return post<void>(`/resources/borrow-requests/${id}/return`)
  },
}
