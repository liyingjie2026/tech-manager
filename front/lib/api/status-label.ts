import { backendGet, backendPost } from "./client"

export interface StatusLabel {
  id: number
  category: string
  value: string
  label: string
  color: string | null
  sortOrder: number
  isActive: boolean
  remark: string | null
}

export const statusLabelApi = {
  getAll: () => backendGet<Record<string, StatusLabel[]>>("/status-labels/all"),

  getByCategory: (category: string) => backendGet<StatusLabel[]>(`/status-labels/category/${category}`),

  getStatusText: (category: string, value: string) =>
    backendGet<string>(`/status-labels/text?category=${category}&value=${value}`),

  getBatchStatusText: (params: Record<string, string>) =>
    backendPost<Record<string, string>>("/status-labels/batch-text", params),
}
