import { backendGet, backendPost, backendPut, backendDelete } from "./client"
import type { ApiResponse } from "../types"

export interface InstitutionDTO {
  id: number
  name: string
  code?: string
  shortName?: string
  type: string
  nature?: string
  creditCode?: string
  legalPerson?: string
  legalPersonIdCard?: string
  legalPersonPhone?: string
  contactPerson?: string
  contactPhone?: string
  contactEmail?: string
  province?: string
  city?: string
  district?: string
  address?: string
  postcode?: string
  description?: string
  businessLicense?: string
  qualification?: string
  researchField?: string
  auditStatus?: string
  auditComment?: string
  status: number
}

export interface PageResult<T> {
  records: T[]
  total: number
  page: number
  size: number
}

export interface InstitutionCreateDTO {
  name: string
  code?: string
  shortName?: string
  type: string
  nature?: string
  creditCode?: string
  legalPerson?: string
  legalPersonIdCard?: string
  legalPersonPhone?: string
  contactPerson?: string
  contactPhone?: string
  contactEmail?: string
  province?: string
  city?: string
  district?: string
  address?: string
  postcode?: string
  description?: string
  businessLicense?: string
  qualification?: string
  researchField?: string
}

export interface InstitutionUpdateDTO extends InstitutionCreateDTO {
  status?: number
  auditStatus?: string
  auditComment?: string
}

export interface AuditDTO {
  status: string
  comment?: string
}

export const institutionApi = {
  // 分页查询机构列表
  async getList(params: {
    page?: number
    size?: number
    pageNum?: number
    pageSize?: number
    keyword?: string
    type?: string
    status?: number
  }): Promise<ApiResponse<PageResult<InstitutionDTO>>> {
    const normalizedParams = {
      ...params,
      page: params.pageNum || params.page || 1,
      size: params.pageSize || params.size || 10,
    }
    delete (normalizedParams as any).pageNum
    delete (normalizedParams as any).pageSize

    return backendGet<PageResult<InstitutionDTO>>("/institutions", normalizedParams)
  },

  // 获取所有机构（下拉选择用）
  async getAll(): Promise<ApiResponse<InstitutionDTO[]>> {
    return backendGet<InstitutionDTO[]>("/institutions/all")
  },

  // 获取机构详情
  async getById(id: number): Promise<ApiResponse<InstitutionDTO>> {
    return backendGet<InstitutionDTO>(`/institutions/${id}`)
  },

  // 新增机构
  async create(data: InstitutionCreateDTO): Promise<ApiResponse<number>> {
    return backendPost<number>("/institutions", data)
  },

  // 更新机构
  async update(id: number, data: InstitutionUpdateDTO): Promise<ApiResponse<void>> {
    return backendPut<void>(`/institutions/${id}`, data)
  },

  // 删除机构
  async delete(id: number): Promise<ApiResponse<void>> {
    return backendDelete<void>(`/institutions/${id}`)
  },

  // 审核机构
  async audit(id: number, data: AuditDTO): Promise<ApiResponse<void>> {
    return backendPost<void>(`/institutions/${id}/audit`, data)
  },
}
