import { backendGet, backendPost, backendPut, backendDelete } from "./client"
import type { ApiResponse } from "./client"
import type { Project as ProjectType } from "./types"

// Re-export Project type from types.ts for consistency
export type { Project } from "./types"

export interface ProjectMember {
  id?: number
  projectId?: number
  userId?: number
  userName?: string
  role?: string
  institutionId?: number
  institutionName?: string
  workContent?: string
  workMonths?: number
  sortOrder?: number
  createTime?: string
  updateTime?: string
  createBy?: number
  updateBy?: number
}

export interface ProjectBudget {
  id?: number
  projectId?: number
  category?: string
  itemName?: string
  applyAmount?: number
  selfAmount?: number
  description?: string
  createTime?: string
  updateTime?: string
}

export interface ProjectSchedule {
  id?: number
  phase: string
  startMonth?: string
  endMonth?: string
  researchContent?: string
  keyTasks?: string
  deliverables?: string
  responsiblePerson?: string
}

export interface ProjectPerformance {
  paperTarget?: string
  patentTarget?: string
  softwareTarget?: string
  standardTarget?: string
  socialBenefit?: string
  transformationPlan?: string
}

export const projectApi = {
  // ==================== 项目列表查询 ====================

  async list(params: {
    current?: number
    pageNum?: number
    page?: number
    size?: number
    pageSize?: number
    keyword?: string
    projectName?: string
    projectNo?: string
    projectType?: string
    status?: string
    institutionId?: number
    leaderName?: string
    year?: string
    startDate?: string
    endDate?: string
  }): Promise<ApiResponse<any>> {
    const standardParams = {
      ...params,
      current: params.current || params.pageNum || params.page || 1,
      size: params.size || params.pageSize || 100,
    }
    delete (standardParams as any).pageNum
    delete (standardParams as any).page
    delete (standardParams as any).pageSize

    return backendGet("/projects", standardParams)
  },

  async getList(params: {
    current?: number
    size?: number
    keyword?: string
    projectName?: string
    projectNo?: string
    projectType?: string
    status?: string
    institutionId?: number
    leaderName?: string
    year?: string
    startDate?: string
    endDate?: string
  }): Promise<ApiResponse<any>> {
    return this.list(params)
  },

  async myProjects(params: {
    current?: number
    size?: number
    status?: string
  }): Promise<ApiResponse<any>> {
    return backendGet("/projects/my", params)
  },

  async getById(id: number): Promise<ApiResponse<ProjectType>> {
    return backendGet(`/projects/${id}`)
  },

  // ==================== 项目申报 ====================

  async saveDraft(data: Partial<ProjectType>): Promise<ApiResponse<number>> {
    return backendPost("/projects/draft", data)
  },

  async updateDraft(id: number, data: Partial<ProjectType>): Promise<ApiResponse<void>> {
    return backendPut(`/projects/${id}/draft`, data)
  },

  async submit(id: number): Promise<ApiResponse<void>> {
    return backendPost(`/projects/${id}/submit`)
  },

  async withdraw(id: number): Promise<ApiResponse<void>> {
    return backendPost(`/projects/${id}/withdraw`)
  },

  async delete(id: number): Promise<ApiResponse<void>> {
    return backendDelete(`/projects/${id}`)
  },

  // ==================== 项目审核 ====================

  async approve(id: number, comment?: string): Promise<ApiResponse<void>> {
    return backendPost(`/projects/${id}/approve`, { comment })
  },

  async preliminaryReviewPass(id: number, comment?: string): Promise<ApiResponse<void>> {
    return backendPost(`/projects/${id}/preliminary-review/pass`, comment)
  },

  async preliminaryReviewFail(id: number, reason: string): Promise<ApiResponse<void>> {
    return backendPost(`/projects/${id}/preliminary-review/fail`, { reason })
  },

  async reject(id: number, reason: string): Promise<ApiResponse<void>> {
    return backendPost(`/projects/${id}/reject`, { reason })
  },

  async returnForModification(id: number, reason: string): Promise<ApiResponse<void>> {
    return backendPost(`/projects/${id}/return`, { reason })
  },

  async batchApprove(ids: number[]): Promise<ApiResponse<void>> {
    return backendPost("/projects/batch/approve", ids)
  },

  async batchReject(ids: number[], reason: string): Promise<ApiResponse<void>> {
    return backendPost("/projects/batch/reject", { ids, reason })
  },

  // ==================== 项目成员管理 ====================

  async addMember(projectId: number, data: ProjectMember): Promise<ApiResponse<void>> {
    return backendPost(`/projects/${projectId}/members`, data)
  },

  async removeMember(projectId: number, memberId: number): Promise<ApiResponse<void>> {
    return backendDelete(`/projects/${projectId}/members/${memberId}`)
  },

  async updateMember(projectId: number, memberId: number, data: ProjectMember): Promise<ApiResponse<void>> {
    return backendPut(`/projects/${projectId}/members/${memberId}`, data)
  },

  // ==================== 项目预算管理 ====================

  async saveBudget(projectId: number, data: ProjectBudget): Promise<ApiResponse<void>> {
    return backendPost(`/projects/${projectId}/budget`, data)
  },

  async getBudget(projectId: number): Promise<ApiResponse<ProjectBudget>> {
    return backendGet(`/projects/${projectId}/budget`)
  },

  // ==================== 项目附件管理 ====================

  async uploadAttachment(projectId: number, file: File, type: string): Promise<ApiResponse<any>> {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("type", type)

    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
    return fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/projects/${projectId}/attachments`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    }).then((res) => res.json())
  },

  async deleteAttachment(projectId: number, attachmentId: number): Promise<ApiResponse<void>> {
    return backendDelete(`/projects/${projectId}/attachments/${attachmentId}`)
  },

  async downloadAttachment(projectId: number, attachmentId: number): Promise<ApiResponse<string>> {
    return backendGet(`/projects/${projectId}/attachments/${attachmentId}/download`)
  },

  // ==================== 项目进度管理 ====================

  async saveSchedule(projectId: number, schedules: ProjectSchedule[]): Promise<ApiResponse<void>> {
    return backendPost(`/projects/${projectId}/schedule`, schedules)
  },

  async addScheduleItem(projectId: number, data: ProjectSchedule): Promise<ApiResponse<number>> {
    return backendPost(`/projects/${projectId}/schedule/item`, data)
  },

  async deleteScheduleItem(projectId: number, scheduleId: number): Promise<ApiResponse<void>> {
    return backendDelete(`/projects/${projectId}/schedule/${scheduleId}`)
  },

  // ==================== 项目绩效指标 ====================

  async savePerformance(projectId: number, data: ProjectPerformance): Promise<ApiResponse<void>> {
    return backendPost(`/projects/${projectId}/performance`, data)
  },

  // ==================== 项目导出 ====================

  async exportPdf(projectId: number): Promise<ApiResponse<string>> {
    return backendGet(`/projects/${projectId}/export/pdf`)
  },

  async exportWord(projectId: number): Promise<ApiResponse<string>> {
    return backendGet(`/projects/${projectId}/export/word`)
  },

  async exportExcel(params?: {
    keyword?: string
    projectType?: string
    status?: string
  }): Promise<ApiResponse<string>> {
    return backendGet("/projects/export/excel", params)
  },

  // ==================== 项目查重 ====================

  async duplicateCheck(projectId: number): Promise<ApiResponse<any>> {
    return backendPost(`/projects/${projectId}/duplicate-check`)
  },

  async getDuplicateCheckResult(projectId: number): Promise<ApiResponse<any>> {
    return backendGet(`/projects/${projectId}/duplicate-check`)
  },

  // ==================== 项目统计 ====================

  async getStatistics(): Promise<ApiResponse<any>> {
    return backendGet("/projects/statistics")
  },

  // ==================== 项目工作流管理 ====================

  async getWorkflowStatus(projectId: number): Promise<ApiResponse<any>> {
    return backendGet(`/projects/${projectId}/workflow`)
  },

  async updateWorkflowStage(projectId: number, stage: string): Promise<ApiResponse<void>> {
    return backendPut(`/projects/${projectId}/workflow/stage`, { stage })
  },

  async getWorkflowHistory(projectId: number): Promise<ApiResponse<any[]>> {
    return backendGet(`/projects/${projectId}/workflow/history`)
  },

  // ==================== 监管端下发任务书 ====================

  async issueTaskBook(
    projectId: number,
    data?: {
      needMidterm?: number
      midtermDate?: string
      needAnnual?: number
      annualDate?: string
    },
  ): Promise<ApiResponse<void>> {
    return backendPost(`/projects/${projectId}/issue-taskbook`, data)
  },

  async update(id: number, data: Partial<ProjectType>): Promise<ApiResponse<void>> {
    return backendPut(`/projects/${id}`, data)
  },
}
