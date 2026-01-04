import { get, post, put, del } from "./client"
import type { ApiResponse, PageResponse } from "./config"

export const awardApi = {
  // 分页查询获奖列表
  list: (params: {
    page: number
    size: number
    keyword?: string
    level?: string
    status?: string
  }): Promise<ApiResponse<PageResponse<any>>> => {
    return get("/api/awards", { params })
  },

  // 获取获奖详情
  getById: (id: number): Promise<ApiResponse<any>> => {
    return get(`/api/awards/${id}`)
  },

  // 获取项目获奖列表
  getByProject: (projectId: number): Promise<ApiResponse<any[]>> => {
    return get(`/api/awards/project/${projectId}`)
  },

  // 创建获奖记录
  create: (data: any): Promise<ApiResponse<number>> => {
    return post("/api/awards", data)
  },

  // 更新获奖记录
  update: (id: number, data: any): Promise<ApiResponse<void>> => {
    return put(`/api/awards/${id}`, data)
  },

  // 删除获奖记录
  delete: (id: number): Promise<ApiResponse<void>> => {
    return del(`/api/awards/${id}`)
  },

  // 提交获奖审核
  submit: (id: number): Promise<ApiResponse<void>> => {
    return post(`/api/awards/${id}/submit`)
  },

  // 审核获奖
  audit: (id: number, data: { status: string; comment: string }): Promise<ApiResponse<void>> => {
    return post(`/api/awards/${id}/audit`, data)
  },

  // 上传获奖证书
  uploadCertificate: (id: number, file: File): Promise<ApiResponse<string>> => {
    const formData = new FormData()
    formData.append("file", file)
    return post(`/api/awards/${id}/certificate`, formData)
  },
}
