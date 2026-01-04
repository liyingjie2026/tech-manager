import { apiClient } from "./client"

export interface Assessment {
  id: number
  year: string
  quarter: string
  institutionId: number
  institutionName: string
  projectCount: number
  completionRate: number
  score: number
  rank: string
  status: string
  evaluatorId: number
  evaluatorName: string
  evaluateTime?: string
  remark?: string
  createTime: string
  updateTime: string
}

export interface AssessmentMaterial {
  id: number
  year: string
  type: string
  fileName: string
  filePath: string
  fileSize: number
  status: string
  deadline: string
  uploadUserId: number
  uploadUserName: string
  uploadTime: string
  reviewUserId?: number
  reviewUserName?: string
  reviewTime?: string
  remark?: string
  createTime: string
  updateTime: string
}

export const assessmentApi = {
  // 获取考核列表
  list: async (params: {
    current?: number
    size?: number
    year?: string
    quarter?: string
    status?: string
  }) => {
    return apiClient.get<{ records: Assessment[]; total: number }>("/assessment/list", { params })
  },

  // 获取考核详情
  getById: async (id: number) => {
    return apiClient.get<Assessment>(`/assessment/${id}`)
  },

  // 创建考核
  create: async (data: Partial<Assessment>) => {
    return apiClient.post("/assessment", data)
  },

  // 更新考核
  update: async (data: Assessment) => {
    return apiClient.put("/assessment", data)
  },

  // 获取材料列表
  getMaterials: async (params: {
    current?: number
    size?: number
    year?: string
    type?: string
  }) => {
    return apiClient.get<{ records: AssessmentMaterial[]; total: number }>("/assessment/material/list", { params })
  },

  // 上传材料
  uploadMaterial: async (data: Partial<AssessmentMaterial>) => {
    return apiClient.post("/assessment/material", data)
  },

  // 删除材料
  deleteMaterial: async (id: number) => {
    return apiClient.delete(`/assessment/material/${id}`)
  },

  // 获取考核统计信息
  getStatistics: async (params?: {
    year?: string
    quarter?: string
  }) => {
    return apiClient.get<{
      totalCount: number
      averageScore: number
      excellentCount: number
      pendingMaterialCount: number
      currentYearCount: number
      currentQuarterCount: number
    }>("/assessment/statistics", { params })
  },
}
