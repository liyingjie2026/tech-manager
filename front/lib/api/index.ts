// API 服务层 - 统一导出
import { authApi } from "./auth"
import { userApi } from "./user"
import { institutionApi } from "./institution"
import { demandApi } from "./demand"
import { projectApi } from "./project"
import { taskBookApi } from "./taskbook"
import { changeApi } from "./change"
import { inspectionApi } from "./inspection"
import { acceptanceApi } from "./acceptance"
import { expertApi } from "./expert"
import { achievementApi } from "./achievement"
import { resourceApi } from "./resource"
import { workflowApi } from "./workflow"
import { statisticsApi } from "./statistics"
import { systemApi } from "./system"
import { annualApi } from "./annual"
import { midtermApi } from "./midterm"
import { expertVoteApi } from "./expert-vote"
import { awardApi } from "./award"
import { fileApi } from "./file"
import { noticeApi } from "./notice"
import { permissionApi } from "./permission"
import { roleApi } from "./role"
import { transformationApi } from "./transformation"
import { duplicateCheckApi } from "./duplicate-check"

export const api = {
  auth: authApi,
  user: userApi,
  institution: institutionApi,
  demand: demandApi,
  project: projectApi,
  taskBook: taskBookApi,
  change: changeApi,
  inspection: inspectionApi,
  acceptance: acceptanceApi,
  expert: expertApi,
  achievement: achievementApi,
  resource: resourceApi,
  workflow: workflowApi,
  statistics: statisticsApi,
  system: systemApi,
  annual: annualApi,
  midterm: midtermApi,
  expertVote: expertVoteApi,
  award: awardApi,
  file: fileApi,
  notice: noticeApi,
  permission: permissionApi,
  role: roleApi,
  transformation: transformationApi,
  duplicateCheck: duplicateCheckApi,
}

export * from "./auth"
export * from "./user"
export * from "./institution"
export * from "./demand"
export * from "./project"
export * from "./taskbook"
export * from "./change"
export * from "./inspection"
export * from "./acceptance"
export * from "./expert"
export * from "./achievement"
export * from "./resource"
export * from "./workflow"
export * from "./statistics"
export * from "./system"
export * from "./annual"
export * from "./midterm"
export * from "./expert-vote"
export * from "./award"
export * from "./file"
export * from "./notice"
export * from "./permission"
export * from "./role"
export * from "./transformation"
export * from "./duplicate-check"
