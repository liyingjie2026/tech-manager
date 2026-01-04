import { apiClient } from "./client"

export const budgetApi = {
  list: (params: { page: number; size: number; keyword?: string }) => apiClient.get("/api/budgets", { params }),

  getChangeRecords: (params: { page: number; size: number; keyword?: string }) =>
    apiClient.get("/api/budgets/change-records", { params }),

  getDetail: (id: number) => apiClient.get(`/api/budgets/${id}`),

  applyChange: (data: any) => apiClient.post("/api/budgets/change", data),
}
