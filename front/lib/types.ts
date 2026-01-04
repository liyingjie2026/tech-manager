// ==================== 基础类型定义 ====================

// 通用响应结构
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp?: number
}

// 分页请求参数
export interface PageParams {
  page: number
  pageSize: number
  keyword?: string
  sortField?: string
  sortOrder?: "asc" | "desc"
}

// 分页响应结构
export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ==================== 用户与权限 ====================

// 用户状态
export type UserStatus = "active" | "inactive" | "locked"

// 用户类型
export type UserType = "admin" | "supervisor" | "researcher" | "expert"

// 用户信息
export interface User {
  id: string
  username: string
  realName: string
  email: string
  phone: string
  avatar?: string
  userType: UserType
  status: UserStatus
  institutionId: string
  institutionName: string
  departmentId?: string
  departmentName?: string
  roleIds: string[]
  roles: Role[]
  lastLoginTime?: string
  createdAt: string
  updatedAt: string
}

// 角色
export interface Role {
  id: string
  code: string
  name: string
  description: string
  permissions: string[]
  status: "active" | "inactive"
  createdAt: string
}

// 权限
export interface Permission {
  id: string
  code: string
  name: string
  type: "menu" | "button" | "api"
  parentId?: string
  path?: string
  icon?: string
  sort: number
  children?: Permission[]
}

// 登录请求
export interface LoginRequest {
  username: string
  password: string
  captcha?: string
}

// 登录响应
export interface LoginResponse {
  token: string
  refreshToken: string
  expiresIn: number
  user: User
}

// ==================== 机构管理 ====================

// 机构类型
export type InstitutionType = "internal" | "external" | "university" | "research" | "enterprise"

// 机构状态
export type InstitutionStatus = "active" | "inactive" | "pending" | "rejected"

// 机构信息
export interface Institution {
  id: string
  code: string
  name: string
  shortName?: string
  type: InstitutionType
  level?: string
  parentId?: string
  address: string
  city: string
  district: string
  legalPerson: string
  legalPersonId: string
  contactPerson: string
  contactPhone: string
  contactEmail: string
  creditCode: string
  registrationDate: string
  businessLicense?: string
  qualifications: Qualification[]
  status: InstitutionStatus
  createdAt: string
  updatedAt: string
}

// 资质信息
export interface Qualification {
  id: string
  institutionId: string
  name: string
  level: string
  issueDate: string
  expiryDate: string
  certificateNo: string
  attachmentUrl: string
  status: "valid" | "expired" | "pending"
}

// ==================== 需求管理 ====================

// 需求状态
export type DemandStatus =
  | "draft"
  | "submitted"
  | "reviewing"
  | "approved"
  | "rejected"
  | "published"
  | "matched"
  | "closed"

// 需求信息
export interface Demand {
  id: string
  code: string
  title: string
  field: string
  expectedLevel: string
  breakthroughTypes: string[]
  currentMaturityLevel: string
  targetMaturityLevel: string
  totalInvestment: number
  suggestedFunding: number
  projectType: string
  duration: string
  background: string
  keyProblems: string
  expectedResults: string
  expectedBenefits: string
  technicalAnalysis: string
  institutionId: string
  institutionName: string
  contactPerson: string
  contactPhone: string
  contactIdCard: string
  city: string
  status: DemandStatus
  reviewComment?: string
  reviewerId?: string
  reviewerName?: string
  reviewTime?: string
  submittedAt?: string
  createdAt: string
  updatedAt: string
}

// ==================== 项目管理 ====================

// 项目状态
export type ProjectStatus =
  | "draft"
  | "submitted"
  | "reviewing"
  | "approved"
  | "rejected"
  | "signed"
  | "in_progress"
  | "midterm"
  | "completed"
  | "accepted"
  | "terminated"

// 项目类型
export type ProjectType = "youth" | "major" | "application" | "subsidy" | "key_research"

// 项目信息
export interface Project {
  id: string
  code: string
  name: string
  type: ProjectType
  typeName: string
  field: string
  expectedLevel: string
  breakthroughTypes: string[]
  status: ProjectStatus
  statusName: string

  // 经费信息
  totalBudget: number
  govFunding: number
  selfFunding: number

  // 时间信息
  startDate: string
  endDate: string
  duration: number
  submittedAt?: string
  approvedAt?: string

  // 承担单位
  leadInstitutionId: string
  leadInstitutionName: string
  participatingInstitutions: ParticipatingInstitution[]

  // 项目负责人
  leaderId: string
  leaderName: string
  leaderTitle: string
  leaderPhone: string
  leaderEmail: string
  leaderIdCard: string

  // 项目成员
  members: ProjectMember[]

  // 研究内容
  background: string
  objectives: string
  content: string
  methodology: string
  expectedResults: string
  keyIndicators: string[]

  // 预算明细
  budgetDetails: BudgetItem[]

  // 进度计划
  milestones: Milestone[]

  // 附件
  attachments: Attachment[]

  // 查重率
  duplicateRate?: number
  duplicateReportUrl?: string

  // 评审信息
  reviewScore?: number
  reviewComments?: ReviewComment[]

  // 任务书信息
  taskBookId?: string
  taskBookStatus?: TaskBookStatus

  // 检查配置
  hasMidtermCheck: boolean
  midtermCheckDate?: string
  hasAnnualCheck: boolean
  annualCheckDate?: string

  createdAt: string
  updatedAt: string
}

// 参与单位
export interface ParticipatingInstitution {
  id: string
  projectId: string
  institutionId: string
  institutionName: string
  role: string
  funding: number
  contactPerson: string
  contactPhone: string
}

// 项目成员
export interface ProjectMember {
  id: string
  projectId: string
  userId?: string
  name: string
  gender: string
  birthDate: string
  title: string
  education: string
  major: string
  institutionId: string
  institutionName: string
  role: string
  workMonths: number
  phone: string
  email: string
  idCard: string
}

// 预算项
export interface BudgetItem {
  id: string
  projectId: string
  category: string
  subCategory?: string
  description: string
  amount: number
  govAmount: number
  selfAmount: number
  year: number
}

// 里程碑
export interface Milestone {
  id: string
  projectId: string
  name: string
  description: string
  startDate: string
  endDate: string
  deliverables: string
  responsiblePerson: string
  status: "pending" | "in_progress" | "completed" | "delayed"
  completedAt?: string
}

// 附件
export interface Attachment {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploadedAt: string
  uploadedBy: string
}

// 评审意见
export interface ReviewComment {
  id: string
  projectId: string
  expertId: string
  expertName: string
  score: number
  comment: string
  strengths: string
  weaknesses: string
  suggestions: string
  createdAt: string
}

// ==================== 任务书管理 ====================

// 任务书状态
export type TaskBookStatus =
  | "pending"
  | "drafting"
  | "submitted"
  | "reviewing"
  | "approved"
  | "signed"
  | "executing"
  | "completed"

// 任务书
export interface TaskBook {
  id: string
  projectId: string
  projectCode: string
  projectName: string
  version: number

  // 基本信息（可与项目不同）
  startDate: string
  endDate: string
  totalBudget: number
  govFunding: number
  selfFunding: number

  // 承担单位信息
  leadInstitutionId: string
  leadInstitutionName: string

  // 项目经理
  managerId: string
  managerName: string

  // 研究内容
  researchContent: string
  expectedResults: string

  // 任务分解
  tasks: TaskItem[]

  // 检查配置
  hasMidtermCheck: boolean
  midtermCheckDate?: string
  hasAnnualCheck: boolean
  annualCheckDate?: string

  // 签订信息
  signedDocumentUrl?: string
  signedAt?: string

  status: TaskBookStatus
  statusName: string
  reviewComment?: string
  submittedAt?: string
  approvedAt?: string
  createdAt: string
  updatedAt: string
}

// 任务项
export interface TaskItem {
  id: string
  taskBookId: string
  projectName: string
  taskCode: string
  taskType: "milestone" | "subtask" | "other"
  taskTypeName: string
  taskName: string
  taskDescription: string
  responsibleInstitutionId: string
  responsibleInstitutionName: string
  responsiblePerson: string
  startDate: string
  endDate: string
  deliverables: string
  budget: number
  status: "pending" | "in_progress" | "completed"
}

// ==================== 变更管理 ====================

// 变更类型
export type ChangeType = "leader" | "member" | "duration" | "budget" | "content" | "institution" | "other"

// 变更状态
export type ChangeStatus = "draft" | "submitted" | "reviewing" | "approved" | "rejected"

// 变更申请
export interface ChangeRequest {
  id: string
  projectId: string
  projectCode: string
  projectName: string
  changeType: ChangeType
  changeTypeName: string
  changeReason: string
  originalContent: string
  newContent: string
  attachments: Attachment[]
  status: ChangeStatus
  statusName: string
  reviewComment?: string
  reviewerId?: string
  reviewerName?: string
  reviewTime?: string
  submittedAt?: string
  createdAt: string
  updatedAt: string
}

// ==================== 检查管理 ====================

// 检查类型
export type InspectionType = "midterm" | "annual"

// 检查状态
export type InspectionStatus = "pending" | "submitted" | "reviewing" | "passed" | "failed" | "rectifying"

// 检查记录
export interface Inspection {
  id: string
  projectId: string
  projectCode: string
  projectName: string
  type: InspectionType
  typeName: string
  year?: number

  // 进度情况
  progressSummary: string
  completedTasks: string
  ongoingTasks: string
  delayedTasks: string

  // 经费使用
  budgetUsed: number
  budgetRemaining: number
  fundingDetails: string

  // 成果情况
  achievements: string
  papers: number
  patents: number
  awards: number

  // 问题与计划
  problemsEncountered: string
  solutions: string
  nextPlan: string

  // 附件
  attachments: Attachment[]

  status: InspectionStatus
  statusName: string
  reviewComment?: string
  reviewerId?: string
  reviewerName?: string
  reviewTime?: string
  submittedAt?: string
  createdAt: string
  updatedAt: string
}

// ==================== 验收管理 ====================

// 验收状态
export type AcceptanceStatus =
  | "pending"
  | "submitted"
  | "reviewing"
  | "expert_review"
  | "passed"
  | "failed"
  | "deferred"

// 验收记录
export interface Acceptance {
  id: string
  projectId: string
  projectCode: string
  projectName: string

  // 完成情况
  completionSummary: string
  objectivesAchieved: string
  indicatorsCompleted: string

  // 经费决算
  totalExpenditure: number
  expenditureDetails: BudgetItem[]

  // 成果清单
  achievements: AchievementSummary[]

  // 附件
  technicalReport: Attachment
  financialReport: Attachment
  otherAttachments: Attachment[]

  // 专家评审
  expertReviews: AcceptanceReview[]
  finalScore?: number

  status: AcceptanceStatus
  statusName: string
  reviewComment?: string
  acceptedAt?: string
  submittedAt?: string
  createdAt: string
  updatedAt: string
}

// 成果摘要
export interface AchievementSummary {
  type: string
  name: string
  description: string
  attachmentUrl?: string
}

// 验收评审
export interface AcceptanceReview {
  id: string
  acceptanceId: string
  expertId: string
  expertName: string
  score: number
  opinion: "pass" | "fail" | "defer"
  comment: string
  createdAt: string
}

// ==================== 专家管理 ====================

// 专家状态
export type ExpertStatus = "active" | "inactive" | "blacklisted"

// 专家信息
export interface Expert {
  id: string
  userId?: string
  name: string
  gender: string
  birthDate: string
  idCard: string
  phone: string
  email: string

  // 职业信息
  institutionId: string
  institutionName: string
  department: string
  title: string
  education: string
  degree: string

  // 专业领域
  researchFields: string[]
  keywords: string[]

  // 简历
  biography: string
  achievements: string

  // 证件照
  photoUrl?: string

  // 银行信息（用于评审费发放）
  bankName?: string
  bankAccount?: string

  // 统计信息
  reviewCount: number
  averageScore: number

  status: ExpertStatus
  createdAt: string
  updatedAt: string
}

// 专家抽取记录
export interface ExpertSelection {
  id: string
  projectId: string
  projectName: string
  purpose: "application_review" | "midterm_review" | "acceptance_review"
  requiredCount: number
  selectedExperts: Expert[]
  excludedExperts: string[]
  selectionRules: string
  selectedAt: string
  selectedBy: string
}

// ==================== 成果管理 ====================

// 成果类型
export type AchievementType = "paper" | "patent" | "software" | "standard" | "award" | "book" | "report" | "other"

// 成果状态
export type AchievementStatus = "draft" | "submitted" | "reviewing" | "approved" | "rejected" | "published"

// 成果信息
export interface Achievement {
  id: string
  projectId?: string
  projectCode?: string
  projectName?: string

  type: AchievementType
  typeName: string
  name: string
  description: string

  // 作者/完成人
  authors: string[]
  firstAuthor: string
  correspondingAuthor?: string

  // 所属单位
  institutionId: string
  institutionName: string

  // 具体信息（根据类型不同）
  // 论文
  journalName?: string
  journalLevel?: string
  publishDate?: string
  doi?: string

  // 专利
  patentType?: string
  patentNo?: string
  applicationDate?: string
  grantDate?: string

  // 软著
  registrationNo?: string
  registrationDate?: string

  // 标准
  standardNo?: string
  standardLevel?: string
  implementDate?: string

  // 获奖
  awardLevel?: string
  awardOrg?: string
  awardDate?: string
  awardRank?: string

  // 附件
  attachments: Attachment[]

  // 转化信息
  isTransformed: boolean
  transformationInfo?: AchievementTransformation

  status: AchievementStatus
  statusName: string
  reviewComment?: string
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

// 成果转化
export interface AchievementTransformation {
  id: string
  achievementId: string
  transformationType: string
  cooperationUnit: string
  contractAmount: number
  economicBenefit: number
  socialBenefit: string
  transformationDate: string
  description: string
  attachments: Attachment[]
}

// ==================== 共享资源 ====================

// 资源类型
export type ResourceType = "equipment" | "data" | "software"

// 资源状态
export type ResourceStatus = "available" | "borrowed" | "maintenance" | "unavailable"

// 科研仪器
export interface Equipment {
  id: string
  name: string
  model: string
  manufacturer: string
  category: string
  field: string
  specifications: string
  purchaseDate: string
  purchasePrice: number
  location: string
  institutionId: string
  institutionName: string
  contactPerson: string
  contactPhone: string
  isShared: boolean
  usagePrice?: number
  usageUnit?: string
  imageUrl?: string
  status: ResourceStatus
  borrowCount: number
  createdAt: string
  updatedAt: string
}

// 基础数据
export interface DataResource {
  id: string
  name: string
  category: string
  field: string
  description: string
  dataFormat: string
  dataSize: string
  updateFrequency: string
  coverage: string
  institutionId: string
  institutionName: string
  contactPerson: string
  contactPhone: string
  isShared: boolean
  accessLevel: "public" | "internal" | "restricted"
  previewUrl?: string
  downloadCount: number
  status: ResourceStatus
  createdAt: string
  updatedAt: string
}

// 专业软件
export interface Software {
  id: string
  name: string
  version: string
  category: string
  developer: string
  description: string
  features: string[]
  systemRequirements: string
  licenseType: string
  licenseCount: number
  licenseExpiry: string
  institutionId: string
  institutionName: string
  contactPerson: string
  contactPhone: string
  isShared: boolean
  usagePrice?: number
  iconUrl?: string
  status: ResourceStatus
  borrowCount: number
  createdAt: string
  updatedAt: string
}

// 资源借用申请
export interface ResourceBorrowRequest {
  id: string
  resourceType: ResourceType
  resourceId: string
  resourceName: string
  applicantId: string
  applicantName: string
  institutionId: string
  institutionName: string
  purpose: string
  startDate: string
  endDate: string
  status: "pending" | "approved" | "rejected" | "returned"
  reviewComment?: string
  reviewerId?: string
  reviewerName?: string
  reviewTime?: string
  createdAt: string
}

// ==================== 流程引擎 ====================

// 流程定义
export interface WorkflowDefinition {
  id: string
  code: string
  name: string
  businessType: string
  description: string
  version: number
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// 流程节点
export interface WorkflowNode {
  id: string
  type: "start" | "end" | "task" | "gateway" | "subprocess"
  name: string
  assigneeType: "role" | "user" | "department"
  assigneeId: string
  assigneeName: string
  formKey?: string
  dueHours?: number
  actions: string[]
  position: { x: number; y: number }
}

// 流程连线
export interface WorkflowEdge {
  id: string
  sourceNodeId: string
  targetNodeId: string
  condition?: string
  label?: string
}

// 流程实例
export interface WorkflowInstance {
  id: string
  definitionId: string
  definitionName: string
  businessId: string
  businessType: string
  businessName: string
  currentNodeId: string
  currentNodeName: string
  status: "running" | "completed" | "terminated" | "suspended"
  startedAt: string
  completedAt?: string
  startedBy: string
  startedByName: string
}

// 流程任务
export interface WorkflowTask {
  id: string
  instanceId: string
  nodeId: string
  nodeName: string
  businessId: string
  businessType: string
  businessName: string
  assigneeId: string
  assigneeName: string
  status: "pending" | "completed" | "rejected"
  action?: string
  comment?: string
  createdAt: string
  completedAt?: string
}

// ==================== 统计分析 ====================

// 项目统计
export interface ProjectStatistics {
  total: number
  byStatus: { status: string; count: number }[]
  byType: { type: string; count: number }[]
  byYear: { year: number; count: number }[]
  byInstitution: { institution: string; count: number }[]
  totalBudget: number
  totalGovFunding: number
  averageBudget: number
}

// 成果统计
export interface AchievementStatistics {
  total: number
  byType: { type: string; count: number }[]
  byYear: { year: number; count: number }[]
  papers: number
  patents: number
  awards: number
  transformations: number
}

// 专家统计
export interface ExpertStatistics {
  total: number
  byField: { field: string; count: number }[]
  byTitle: { title: string; count: number }[]
  averageReviewCount: number
}

// ==================== 通知与消息 ====================

// 通知类型
export type NotificationType = "system" | "workflow" | "reminder" | "announcement"

// 通知
export interface Notification {
  id: string
  type: NotificationType
  title: string
  content: string
  link?: string
  isRead: boolean
  receiverId: string
  senderId?: string
  senderName?: string
  createdAt: string
}

// ==================== 系统配置 ====================

// 字典项
export interface DictItem {
  id: string
  dictCode: string
  dictName: string
  itemCode: string
  itemName: string
  itemValue: string
  sort: number
  status: "active" | "inactive"
  remark?: string
}

// 系统配置
export interface SystemConfig {
  key: string
  value: string
  description: string
  type: "string" | "number" | "boolean" | "json"
}
