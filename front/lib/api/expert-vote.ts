import { apiClient } from "./client"

export const expertVoteApi = {
  // 投票选组长
  vote: (data: { projectId: number; votedExpertId: number }) => apiClient.post("/expert-votes/vote", data),

  // 获取投票结果
  getVoteResult: (projectId: number) => apiClient.get(`/expert-votes/result/${projectId}`),

  // 组长上传结论
  uploadConclusion: (data: {
    projectId: number
    expertId?: number
    conclusionContent: string
    conclusionFileUrl?: string
  }) => apiClient.post("/expert-votes/conclusion", data),

  // 获取组长待上传结论的项目列表
  getLeaderProjects: () => apiClient.get("/expert-votes/leader-projects"),
}
