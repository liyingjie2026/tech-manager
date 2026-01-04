// API客户端配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"

// 请求拦截器：添加JWT token
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }

  const result = await response.json()
  return result.data || result
}

// 导出API方法
export const api = {
  // 认证相关
  auth: {
    login: (data: { username: string; password: string }) =>
      apiRequest("/auth/login", { method: "POST", body: JSON.stringify(data) }),
    register: (data: any) => apiRequest("/auth/register", { method: "POST", body: JSON.stringify(data) }),
    getCurrentUser: () => apiRequest("/auth/current"),
  },

  // 项目相关
  projects: {
    list: (params?: any) => apiRequest(`/projects?${new URLSearchParams(params)}`),
    myProjects: (params?: any) => apiRequest(`/projects/my?${new URLSearchParams(params)}`),
    get: (id: string) => apiRequest(`/projects/${id}`),
    create: (data: any) => apiRequest("/projects/draft", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      apiRequest(`/projects/${id}/draft`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => apiRequest(`/projects/${id}`, { method: "DELETE" }),
    submit: (id: string) => apiRequest(`/projects/${id}/submit`, { method: "POST" }),
    withdraw: (id: string) => apiRequest(`/projects/${id}/withdraw`, { method: "POST" }),
    approve: (id: string, comment: string) =>
      apiRequest(`/projects/${id}/approve`, { method: "POST", body: JSON.stringify({ comment }) }),
    reject: (id: string, data: { reason: string }) =>
      apiRequest(`/projects/${id}/reject`, { method: "POST", body: JSON.stringify(data) }),
    returnForModification: (id: string, data: { reason: string }) =>
      apiRequest(`/projects/${id}/return`, { method: "POST", body: JSON.stringify(data) }),
    batchApprove: (ids: string[]) =>
      apiRequest("/projects/batch/approve", { method: "POST", body: JSON.stringify(ids) }),
    batchReject: (data: { ids: string[]; reason: string }) =>
      apiRequest("/projects/batch/reject", { method: "POST", body: JSON.stringify(data) }),
    // 成员管理
    addMember: (id: string, data: any) =>
      apiRequest(`/projects/${id}/members`, { method: "POST", body: JSON.stringify(data) }),
    updateMember: (id: string, memberId: string, data: any) =>
      apiRequest(`/projects/${id}/members/${memberId}`, { method: "PUT", body: JSON.stringify(data) }),
    removeMember: (id: string, memberId: string) =>
      apiRequest(`/projects/${id}/members/${memberId}`, { method: "DELETE" }),
    // 预算管理
    getBudget: (id: string) => apiRequest(`/projects/${id}/budget`),
    saveBudget: (id: string, data: any) =>
      apiRequest(`/projects/${id}/budget`, { method: "POST", body: JSON.stringify(data) }),
    // 附件管理
    uploadAttachment: (id: string, file: File, type: string) => {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", type)
      return fetch(`${API_BASE_URL}/projects/${id}/attachments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      }).then((res) => res.json())
    },
    deleteAttachment: (id: string, attachmentId: string) =>
      apiRequest(`/projects/${id}/attachments/${attachmentId}`, { method: "DELETE" }),
    downloadAttachment: (id: string, attachmentId: string) =>
      apiRequest(`/projects/${id}/attachments/${attachmentId}/download`),
    // 进度计划
    saveSchedule: (id: string, data: any) =>
      apiRequest(`/projects/${id}/schedule`, { method: "POST", body: JSON.stringify(data) }),
    addScheduleItem: (id: string, data: any) =>
      apiRequest(`/projects/${id}/schedule/item`, { method: "POST", body: JSON.stringify(data) }),
    deleteScheduleItem: (id: string, scheduleId: string) =>
      apiRequest(`/projects/${id}/schedule/${scheduleId}`, { method: "DELETE" }),
    // 绩效指标
    savePerformance: (id: string, data: any) =>
      apiRequest(`/projects/${id}/performance`, { method: "POST", body: JSON.stringify(data) }),
    // 导出
    exportPdf: (id: string) => apiRequest(`/projects/${id}/export/pdf`),
    exportWord: (id: string) => apiRequest(`/projects/${id}/export/word`),
    exportExcel: (params?: any) => apiRequest(`/projects/export/excel?${new URLSearchParams(params)}`),
    // 查重
    duplicateCheck: (id: string) => apiRequest(`/projects/${id}/duplicate-check`, { method: "POST" }),
    getDuplicateCheckResult: (id: string) => apiRequest(`/projects/${id}/duplicate-check`),
    // 统计
    getStatistics: () => apiRequest("/projects/statistics"),
  },

  // 需求相关
  demands: {
    list: (params?: any) => apiRequest(`/demands?${new URLSearchParams(params)}`),
    get: (id: string) => apiRequest(`/demands/${id}`),
    create: (data: any) => apiRequest("/demands", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiRequest(`/demands/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => apiRequest(`/demands/${id}`, { method: "DELETE" }),
    submit: (id: string) => apiRequest(`/demands/${id}/submit`, { method: "POST" }),
  },

  // 专家相关
  experts: {
    list: (params?: any) => apiRequest(`/experts?${new URLSearchParams(params)}`),
    get: (id: string) => apiRequest(`/experts/${id}`),
    create: (data: any) => apiRequest("/experts", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiRequest(`/experts/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => apiRequest(`/experts/${id}`, { method: "DELETE" }),
    random: (params: any) => apiRequest(`/experts/random?${new URLSearchParams(params)}`),
    batchImport: (file: File) => {
      const formData = new FormData()
      formData.append("file", file)
      return fetch(`${API_BASE_URL}/experts/import`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      }).then((res) => res.json())
    },
  },

  // 任务书相关
  taskBooks: {
    get: (projectId: string) => apiRequest(`/task-books/${projectId}`),
    create: (data: any) => apiRequest("/task-books", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiRequest(`/task-books/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    submit: (id: string) => apiRequest(`/task-books/${id}/submit`, { method: "POST" }),
    approve: (id: string, data: any) =>
      apiRequest(`/task-books/${id}/approve`, { method: "POST", body: JSON.stringify(data) }),
    sign: (id: string) => apiRequest(`/task-books/${id}/sign`, { method: "POST" }),
  },

  // 变更相关
  changes: {
    list: (params?: any) => apiRequest(`/changes?${new URLSearchParams(params)}`),
    get: (id: string) => apiRequest(`/changes/${id}`),
    create: (data: any) => apiRequest("/changes", { method: "POST", body: JSON.stringify(data) }),
    submit: (id: string) => apiRequest(`/changes/${id}/submit`, { method: "POST" }),
    approve: (id: string, data: any) =>
      apiRequest(`/changes/${id}/approve`, { method: "POST", body: JSON.stringify(data) }),
    reject: (id: string, data: any) =>
      apiRequest(`/changes/${id}/reject`, { method: "POST", body: JSON.stringify(data) }),
  },

  // 中期检查
  midterm: {
    list: (params?: any) => apiRequest(`/midterm?${new URLSearchParams(params)}`),
    get: (id: string) => apiRequest(`/midterm/${id}`),
    create: (data: any) => apiRequest("/midterm", { method: "POST", body: JSON.stringify(data) }),
    submit: (id: string, data: any) =>
      apiRequest(`/midterm/${id}/submit`, { method: "POST", body: JSON.stringify(data) }),
    approve: (id: string, data: any) =>
      apiRequest(`/midterm/${id}/approve`, { method: "POST", body: JSON.stringify(data) }),
  },

  // 年度检查
  annual: {
    list: (params?: any) => apiRequest(`/annual?${new URLSearchParams(params)}`),
    get: (id: string) => apiRequest(`/annual/${id}`),
    create: (data: any) => apiRequest("/annual", { method: "POST", body: JSON.stringify(data) }),
    submit: (id: string, data: any) =>
      apiRequest(`/annual/${id}/submit`, { method: "POST", body: JSON.stringify(data) }),
    approve: (id: string, data: any) =>
      apiRequest(`/annual/${id}/approve`, { method: "POST", body: JSON.stringify(data) }),
  },

  // 验收相关
  acceptance: {
    list: (params?: any) => apiRequest(`/acceptance?${new URLSearchParams(params)}`),
    get: (id: string) => apiRequest(`/acceptance/${id}`),
    create: (data: any) => apiRequest("/acceptance", { method: "POST", body: JSON.stringify(data) }),
    submit: (id: string, data: any) =>
      apiRequest(`/acceptance/${id}/submit`, { method: "POST", body: JSON.stringify(data) }),
    approve: (id: string, data: any) =>
      apiRequest(`/acceptance/${id}/approve`, { method: "POST", body: JSON.stringify(data) }),
    reject: (id: string, data: any) =>
      apiRequest(`/acceptance/${id}/reject`, { method: "POST", body: JSON.stringify(data) }),
    startReview: (id: string, data: any) =>
      apiRequest(`/acceptance/${id}/start-review`, { method: "POST", body: JSON.stringify(data) }),
  },

  // 成果相关
  achievements: {
    list: (params?: any) => apiRequest(`/achievements?${new URLSearchParams(params)}`),
    get: (id: string) => apiRequest(`/achievements/${id}`),
    create: (data: any) => apiRequest("/achievements", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiRequest(`/achievements/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => apiRequest(`/achievements/${id}`, { method: "DELETE" }),
    submit: (id: string) => apiRequest(`/achievements/${id}/submit`, { method: "POST" }),
    transform: (id: string, data: any) =>
      apiRequest(`/achievements/${id}/transform`, { method: "POST", body: JSON.stringify(data) }),
    publish: (id: string) => apiRequest(`/achievements/${id}/publish`, { method: "POST" }),
  },

  // 统计相关
  statistics: {
    overview: () => apiRequest("/statistics/overview"),
    projects: () => apiRequest("/statistics/projects"),
    budget: () => apiRequest("/statistics/budget"),
    achievements: () => apiRequest("/statistics/achievements"),
    experts: () => apiRequest("/statistics/experts"),
  },

  // 机构相关
  institutions: {
    list: (params?: any) => apiRequest(`/institutions?${new URLSearchParams(params)}`),
    get: (id: string) => apiRequest(`/institutions/${id}`),
    create: (data: any) => apiRequest("/institutions", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiRequest(`/institutions/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  },

  // 用户相关
  users: {
    list: (params?: any) => apiRequest(`/users?${new URLSearchParams(params)}`),
    get: (id: string) => apiRequest(`/users/${id}`),
    create: (data: any) => apiRequest("/users", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiRequest(`/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => apiRequest(`/users/${id}`, { method: "DELETE" }),
    resetPassword: (id: string, data: any) =>
      apiRequest(`/users/${id}/reset-password`, { method: "POST", body: JSON.stringify(data) }),
  },

  // 角色权限相关
  roles: {
    list: () => apiRequest("/roles"),
    get: (id: string) => apiRequest(`/roles/${id}`),
    create: (data: any) => apiRequest("/roles", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiRequest(`/roles/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => apiRequest(`/roles/${id}`, { method: "DELETE" }),
  },

  permissions: {
    list: () => apiRequest("/permissions"),
    getByRole: (roleId: string) => apiRequest(`/permissions/role/${roleId}`),
    saveRolePermissions: (roleId: string, data: any) =>
      apiRequest(`/permissions/role/${roleId}`, { method: "POST", body: JSON.stringify(data) }),
  },

  // 通知公告相关
  notices: {
    list: (params?: any) => apiRequest(`/notices?${new URLSearchParams(params)}`),
    get: (id: string) => apiRequest(`/notices/${id}`),
    create: (data: any) => apiRequest("/notices", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiRequest(`/notices/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => apiRequest(`/notices/${id}`, { method: "DELETE" }),
    publish: (id: string) => apiRequest(`/notices/${id}/publish`, { method: "POST" }),
  },

  // 文件管理相关
  files: {
    upload: (file: File) => {
      const formData = new FormData()
      formData.append("file", file)
      return fetch(`${API_BASE_URL}/files/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      }).then((res) => res.json())
    },
    download: (id: string) => apiRequest(`/files/${id}/download`),
    delete: (id: string) => apiRequest(`/files/${id}`, { method: "DELETE" }),
  },
}
