export interface User {
  id?: string // 后端: String (not Long)
  username: string
  password?: string
  realName: string
  phone?: string
  email?: string
  idCard?: string
  gender?: string
  userType: string
  institutionId?: string
  institutionName?: string
  department?: string
  title?: string
  roleId?: number
  roleName?: string
  status?: number
  lastLoginTime?: string
  createTime?: string
  updateTime?: string
  createBy?: string
  updateBy?: string
  deleted?: number
}

export interface Expert {
  id?: number // 后端: Long
  userId?: number // 后端: Long
  expertCode?: string
  name?: string
  gender?: number // 后端: Integer (1-男 2-女)
  birthDate?: string
  idCard?: string
  phone?: string
  email?: string
  organization?: string
  department?: string
  position?: string
  title?: string
  education?: string
  degree?: string
  graduateSchool?: string
  major?: string
  researchField?: string
  expertType?: string
  specialty?: string
  introduction?: string
  achievements?: string
  bankAccount?: string
  bankName?: string
  reviewCount?: number // 后端: Integer
  goodRate?: number // 后端: Double
  available?: number // 后端: Integer (0-不可用 1-可用)
  auditStatus?: string // 后端: String (pending/approved/rejected)
  auditComment?: string
  status?: number // 后端: Integer (0-禁用 1-启用)
  createTime?: string
  updateTime?: string
  createBy?: string
  updateBy?: string
  deleted?: number
}

export interface Achievement {
  id?: number // 后端: Long
  achievementNo?: string
  projectId?: number // 后端: Long
  projectName?: string
  title?: string
  name?: string
  type?: string
  field?: string
  completionUnit?: string
  completionPerson?: string
  completionDate?: string
  description?: string
  detail?: string
  keywords?: string
  attachments?: string
  isPublic?: number // 后端: Integer
  isPromoted?: number // 后端: Integer
  published?: boolean
  viewCount?: number // 后端: Integer
  downloadCount?: number // 后端: Integer
  status?: string
  auditComment?: string
  auditTime?: string
  auditBy?: string
  createTime?: string
  updateTime?: string
  createBy?: string
  updateBy?: string
  deleted?: number
}

export interface Dictionary {
  id?: number // 后端: Long
  parentId?: number // 后端: Long
  typeCode?: string
  typeName?: string
  code?: string
  name?: string
  value?: string
  description?: string
  sort?: number // 后端: Integer
  status?: number // 后端: Integer
  createTime?: string
  updateTime?: string
  createBy?: string
  updateBy?: string
  deleted?: number
}

export interface Role {
  id?: number
  roleCode: string
  roleName: string
  description?: string
  status?: number
  createTime?: string
  updateTime?: string
}

export interface Permission {
  id?: number
  permissionCode: string
  permissionName: string
  parentId?: number
  type?: string
  path?: string
  icon?: string
  sortOrder?: number
  status?: number
  createTime?: string
  updateTime?: string
  children?: Permission[]
}

export interface PageParams {
  page?: number
  pageSize?: number
  size?: number
  current?: number
  keyword?: string
}

export interface PageResult<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages?: number
}

export interface ApiResponse<T = any> {
  code?: number
  message?: string
  data: T
  success: boolean
}

export interface ProjectStatistics {
  total: number
  inProgress: number
  completed: number
  accepted: number
}

export interface AchievementStatistics {
  total: number
  papers: number
  patents: number
  awards: number
}

export interface ExpertStatistics {
  total: number
  active: number
  byField: { field: string; count: number }[]
  byTitle: { title: string; count: number }[]
}

export interface ExpertSelection {
  id?: number
  projectId: number
  expertId: number
  expertName?: string
  selectionType?: string
  selectionDate?: string
  status?: string
}

export interface AchievementTransformation {
  id?: number
  achievementId: number
  transformationType?: string
  transformationDate?: string
  transformationUnit?: string
  economicBenefit?: number
  socialBenefit?: string
  status?: string
}
