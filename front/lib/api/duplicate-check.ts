import { backendGet, backendPost } from "./client"
import type { ApiResponse } from "../types"

export interface DuplicateCheckResultDTO {
  id: number
  projectId: number
  projectName: string
  projectCode: string
  checkType: string
  duplicateRate: number
  similarity: number
  status: string
  applicant: string
  applicantName: string
  checkTime: string
  createTime: string
  similarProjects?: Array<{
    name: string
    similarity: number
    code: string
    projectNo: string
  }>
}

export interface PageResult<T> {
  records: T[]
  total: number
  current: number
  size: number
}

export interface DuplicateCheckParams {
  page?: number
  size?: number
  current?: number
  pageSize?: number
  keyword?: string
  projectName?: string
  projectCode?: string
  applicant?: string
  checkType?: string
  status?: string
}

export const duplicateCheckApi = {
  // 执行项目查重
  async check(projectId: number): Promise<ApiResponse<DuplicateCheckResultDTO>> {
    return backendPost<DuplicateCheckResultDTO>(`/projects/${projectId}/duplicate-check`, {})
  },

  // 获取单个项目的查重结果
  async getResult(projectId: number): Promise<ApiResponse<DuplicateCheckResultDTO>> {
    return backendGet<DuplicateCheckResultDTO>(`/projects/${projectId}/duplicate-check`)
  },

  // 获取查重记录列表（通过项目列表接口过滤）
  async getList(params: DuplicateCheckParams): Promise<ApiResponse<PageResult<DuplicateCheckResultDTO>>> {
    const normalizedParams = {
      current: params.current || params.page || 1,
      size: params.pageSize || params.size || 10,
      keyword: params.keyword,
      projectName: params.projectName,
      projectCode: params.projectCode,
      applicant: params.applicant,
    }

    return backendGet<PageResult<DuplicateCheckResultDTO>>("/projects", normalizedParams)
  },

  // 批量查重
  async batchCheck(projectIds: number[]): Promise<ApiResponse<void>> {
    return backendPost<void>("/projects/batch/duplicate-check", { ids: projectIds })
  },
}
