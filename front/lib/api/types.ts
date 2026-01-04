/**
 * 用户类型定义 - 匹配 UserDTO
 */
export interface User {
  id: number
  username: string
  password?: string
  realName: string
  phone?: string
  email?: string
  institutionId?: number
  department?: string
  position?: string
  title?: string
  education?: string
  major?: string
  idCard?: string
  avatar?: string
  roleIds?: number[]
  status?: number
  remark?: string
}

/**
 * 项目类型定义 - 匹配 Project Entity (what backend actually returns)
 * Note: Frontend receives data from Entity, not DTO
 */
export interface Project {
  id: number
  projectNo?: string
  name: string // Entity uses 'name', not 'projectName'
  projectBatch?: string
  innovationPlatform?: string
  projectType: string
  projectCategory?: string
  researchField?: string
  demandId?: number
  institutionId: number
  institutionName?: string
  leaderId?: number
  leaderName?: string
  leaderPhone?: string
  startDate: string
  endDate: string
  totalBudget: number
  applyBudget?: number // Entity uses 'applyBudget', not 'applyFunding'
  selfBudget?: number // Entity uses 'selfBudget', not 'selfFunding'
  objective?: string // Entity uses 'objective', not 'researchObjective'
  content?: string // Entity uses 'content', not 'researchContent'
  expectedResult?: string // Entity uses 'expectedResult', not 'expectedResults'
  innovationPoints?: string
  applicationProspects?: string
  status?: string
  auditStatus?: string
  workflowStage?: string
  auditComment?: string
  auditTime?: string
  auditBy?: number
  submitTime?: string
  duplicateRate?: number
  remark?: string
}

/**
 * 专家类型定义 - 匹配 ExpertDTO
 */
export interface Expert {
  id: number
  userId?: number
  name: string
  gender?: string
  birthDate?: string
  idCard?: string
  phone?: string
  email?: string
  education?: string
  degree?: string
  title?: string
  major?: string
  researchDirection?: string
  workUnit?: string
  department?: string
  position?: string
  workYears?: number
  expertise?: string
  achievements?: string
  bankName?: string
  bankAccount?: string
  photo?: string
  status?: number
  remark?: string
}

/**
 * 任务书类型定义 - 匹配 TaskBookDTO
 */
export interface TaskBook {
  id: number
  projectId: number
  taskBookNo?: string
  startDate?: string
  endDate?: string
  totalBudget?: number
  applyBudget?: number
  selfBudget?: number
  objective?: string
  content?: string
  technicalRoute?: string
  expectedResult?: string
  assessmentIndicators?: string
  hasMidtermCheck?: boolean
  midtermCheckDate?: string
  hasAnnualCheck?: boolean
  annualCheckDate?: string
  taskItems?: TaskItem[]
  signedFileUrl?: string
  remark?: string
}

/**
 * 任务项类型定义 - 匹配 TaskItemDTO
 */
export interface TaskItem {
  id?: number
  taskBookId?: number
  taskName: string
  taskContent: string
  responsiblePerson: string
  startDate: string
  endDate: string
  expectedResult: string
  remark?: string
}

/**
 * 变更申请类型定义 - 匹配 ChangeDTO
 */
export interface Change {
  id: number
  projectId: number
  changeType: string
  changeReason: string
  originalContent?: string
  changedContent: string
  impact?: string
  attachmentIds?: number[]
  remark?: string
}

/**
 * 验收类型定义 - 匹配 AcceptanceDTO
 */
export interface Acceptance {
  id: number
  projectId: number
  acceptanceType?: string
  projectSummary?: string
  completedWork?: string
  achievedResults?: string
  innovationPoints?: string
  applicationProspects?: string
  existingProblems?: string
  totalUsedBudget?: number
  budgetUsageDetail?: string
  selfEvaluation?: string
  achievementIds?: number[]
  attachmentIds?: number[]
  remark?: string
}

/**
 * 中期检查类型定义 - 匹配 MidtermDTO
 */
export interface Midterm {
  id: number
  projectId: number
  progressSummary?: string
  completedWork?: string
  achievedResults?: string
  existingProblems?: string
  nextPlan?: string
  usedBudget?: number
  budgetUsageDetail?: string
  completionRate?: number
  attachmentIds?: number[]
  remark?: string
}

/**
 * 年度检查类型定义 - 匹配 AnnualDTO
 */
export interface Annual {
  id: number
  projectId: number
  year: number
  annualSummary?: string
  completedWork?: string
  achievedResults?: string
  existingProblems?: string
  nextYearPlan?: string
  annualBudget?: number
  usedBudget?: number
  budgetUsageDetail?: string
  completionRate?: number
  attachmentIds?: number[]
  remark?: string
}

/**
 * 附件类型定义 - 匹配 AttachmentDTO
 */
export interface Attachment {
  id: number
  fileName: string
  fileUrl: string
  fileSize?: number
  fileType?: string
  uploadTime?: string
}

/**
 * 分页响应类型
 */
export interface PageResponse<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

/**
 * 通用API响应类型
 */
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}
