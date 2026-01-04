// 科研机构端角色定义和权限配置

export const INSTITUTION_ROLES = {
  PROJECT_LEADER: "project_leader", // 项目负责人
  ADMIN: "institution_admin", // 机构管理员
} as const

export type InstitutionRole = (typeof INSTITUTION_ROLES)[keyof typeof INSTITUTION_ROLES]

// 项目负责人权限
export const PROJECT_LEADER_PERMISSIONS = [
  // 项目管理
  "project:view_own", // 查看个人项目
  "project:create", // 创建项目申报
  "project:edit_own", // 编辑个人项目
  "project:submit", // 提交申报

  // 任务书管理
  "taskbook:view_own", // 查看个人项目任务书
  "taskbook:split", // 任务拆分
  "taskbook:upload", // 上传任务书
  "taskbook:submit_review", // 提交审核

  // 项目变更
  "change:create", // 创建变更申请
  "change:edit_own", // 编辑个人变更
  "change:submit", // 提交变更

  // 中期检查
  "midterm:view_own", // 查看个人项目中期检查
  "midterm:submit_materials", // 提交中期检查材料

  // 年度检查
  "annual:view_own", // 查看个人项目年度检查
  "annual:submit_materials", // 提交年度检查材料

  // 项目验收
  "acceptance:view_own", // 查看个人项目验收
  "acceptance:apply", // 申请项目验收
] as const

// 机构管理员权限
export const INSTITUTION_ADMIN_PERMISSIONS = [
  // 项目管理
  "project:view_all", // 查看所有机构项目
  "project:review", // 审核项目
  "project:report", // 上报项目

  // 任务书管理
  "taskbook:view_all", // 查看所有任务书
  "taskbook:review", // 审核任务书
  "taskbook:report", // 上报任务书

  // 变更管理
  "change:view_all", // 查看所有变更
  "change:review", // 审核变更
  "change:report", // 上报变更

  // 中期检查
  "midterm:view_all", // 查看所有中期检查
  "midterm:review", // 审核中期检查
  "midterm:report", // 上报中期检查

  // 年度检查
  "annual:view_all", // 查看所有年度检查
  "annual:review", // 审核年度检查
  "annual:report", // 上报年度检查

  // 验收管理
  "acceptance:view_all", // 查看所有验收
  "acceptance:review", // 审核验收
  "acceptance:report", // 上报验收

  // 用户管理
  "user:view", // 查看用户
  "user:create", // 创建用户
  "user:edit", // 编辑用户
  "user:delete", // 删除用户
  "user:enable", // 启用用户
  "user:disable", // 停用用户
  "user:reset_password", // 重置密码
] as const

// 角色配置
export const ROLE_CONFIG = {
  [INSTITUTION_ROLES.PROJECT_LEADER]: {
    name: "项目负责人",
    description: "负责个人项目的申报、任务书上传、变更申请、检查提交和验收申请",
    permissions: PROJECT_LEADER_PERMISSIONS,
    defaultRoute: "/dashboard", // 默认路由
  },
  [INSTITUTION_ROLES.ADMIN]: {
    name: "机构管理员",
    description: "负责机构内所有项目的审核、上报和用户管理",
    permissions: INSTITUTION_ADMIN_PERMISSIONS,
    defaultRoute: "/dashboard/admin", // 默认路由
  },
}

// 权限检查函数
export function hasPermission(userRole: InstitutionRole, permission: string): boolean {
  const roleConfig = ROLE_CONFIG[userRole]
  if (!roleConfig) return false
  return roleConfig.permissions.includes(permission as any)
}

// 判断是否可以查看所有项目
export function canViewAllProjects(userRole: InstitutionRole): boolean {
  return hasPermission(userRole, "project:view_all")
}

// 判断是否可以审核
export function canReviewSubmissions(userRole: InstitutionRole): boolean {
  return userRole === INSTITUTION_ROLES.ADMIN
}

// 判断是否可以管理用户
export function canManageUsers(userRole: InstitutionRole): boolean {
  return hasPermission(userRole, "user:view")
}
