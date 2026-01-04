// 数据库模拟层 - 完整版本用于本地测试
// 生产环境将连接真实MySQL数据库

import type {
  User,
  Institution,
  Role,
  Project,
  Demand,
  TaskBook,
  ChangeRequest,
  Inspection,
  Acceptance,
  Expert,
} from "../types"

// =====================================================
// 基础数据
// =====================================================

// 机构数据
export const institutions: Institution[] = [
  {
    id: "inst-001",
    code: "HNZRZY",
    name: "湖南省自然资源厅",
    shortName: "湖南自然资源厅",
    type: "internal",
    level: "省级",
    parentId: undefined,
    address: "湖南省长沙市雨花区万家丽中路199号",
    city: "长沙市",
    district: "雨花区",
    legalPerson: "李厅长",
    legalPersonId: "430102195001011234",
    contactPerson: "王主任",
    contactPhone: "0731-88888888",
    contactEmail: "contact@hnzrzy.gov.cn",
    creditCode: "11430000MB0U12345X",
    registrationDate: "2020-01-01",
    qualifications: [],
    status: "active",
    createdAt: "2024-01-01 09:00:00",
    updatedAt: "2024-01-01 09:00:00",
  },
  {
    id: "inst-002",
    code: "HNDSCH",
    name: "湖南省第三测绘院",
    shortName: "湖南三测院",
    type: "institution",
    level: "省级",
    parentId: "inst-001",
    address: "湖南省长沙市岳麓区岳麓大道233号",
    city: "长沙市",
    district: "岳麓区",
    legalPerson: "张院长",
    legalPersonId: "430104196501015678",
    contactPerson: "李主任",
    contactPhone: "0731-88886666",
    contactEmail: "contact@hndsch.com",
    creditCode: "91430000MA4L12346Y",
    registrationDate: "2018-06-15",
    qualifications: [
      {
        id: "qual-001",
        institutionId: "inst-002",
        name: "测绘资质甲级",
        level: "甲级",
        issueDate: "2020-01-01",
        expiryDate: "2025-12-31",
        certificateNo: "甲测资字1234567",
        attachmentUrl: "/uploads/qual-001.pdf",
        status: "valid",
      },
    ],
    status: "active",
    createdAt: "2024-01-01 09:00:00",
    updatedAt: "2024-01-01 09:00:00",
  },
]

// 角色数据
export const roles: Role[] = [
  {
    id: "role-001",
    code: "super_admin",
    name: "超级管理员",
    description: "系统最高权限管理员",
    permissions: ["*"],
    status: "active",
    createdAt: "2024-01-01 09:00:00",
  },
  {
    id: "role-004",
    code: "institution_admin",
    name: "机构管理员",
    description: "机构内部管理员",
    permissions: ["project:*", "user:view", "report:*"],
    status: "active",
    createdAt: "2024-01-01 09:00:00",
  },
  {
    id: "role-006",
    code: "project_leader",
    name: "项目负责人",
    description: "项目负责人",
    permissions: ["project:create", "project:edit", "project:view"],
    status: "active",
    createdAt: "2024-01-01 09:00:00",
  },
]

// 用户数据
export const users: User[] = [
  {
    id: "user-001",
    username: "admin",
    realName: "系统管理员",
    email: "admin@system.com",
    phone: "13800000001",
    avatar: "/avatars/admin.png",
    userType: "admin",
    status: "active",
    institutionId: "inst-001",
    institutionName: "湖南省自然资源厅",
    roleIds: ["role-001"],
    roles: [roles[0]],
    lastLoginTime: "2025-01-01 09:00:00",
    createdAt: "2024-01-01 09:00:00",
    updatedAt: "2024-01-01 09:00:00",
  },
  {
    id: "user-002",
    username: "supervisor",
    realName: "张监管",
    email: "supervisor@hnzrzy.gov.cn",
    phone: "13800000002",
    userType: "supervisor",
    status: "active",
    institutionId: "inst-001",
    institutionName: "湖南省自然资源厅",
    roleIds: ["role-001"],
    roles: [roles[0]],
    lastLoginTime: "2025-01-10 08:30:00",
    createdAt: "2024-01-01 09:00:00",
    updatedAt: "2024-01-01 09:00:00",
  },
  {
    id: "user-003",
    username: "manager",
    realName: "李机构",
    email: "manager@hndsch.com",
    phone: "13111929202",
    userType: "researcher",
    status: "active",
    institutionId: "inst-002",
    institutionName: "湖南省第三测绘院",
    roleIds: ["role-004"],
    roles: [roles[1]],
    lastLoginTime: "2025-01-15 09:00:00",
    createdAt: "2024-01-01 09:00:00",
    updatedAt: "2024-01-01 09:00:00",
  },
  {
    id: "user-004",
    username: "leader",
    realName: "王项目",
    email: "leader@hndsch.com",
    phone: "13800000004",
    userType: "researcher",
    status: "active",
    institutionId: "inst-002",
    institutionName: "湖南省第三测绘院",
    roleIds: ["role-006"],
    roles: [roles[2]],
    lastLoginTime: "2025-01-20 10:00:00",
    createdAt: "2024-01-01 09:00:00",
    updatedAt: "2024-01-01 09:00:00",
  },
  {
    id: "user-005",
    username: "expert",
    realName: "赵专家",
    email: "expert@university.edu.cn",
    phone: "13800000005",
    userType: "expert",
    status: "active",
    institutionId: "inst-003",
    institutionName: "湖南大学",
    roleIds: [],
    roles: [],
    lastLoginTime: "2025-01-18 14:00:00",
    createdAt: "2024-01-01 09:00:00",
    updatedAt: "2024-01-01 09:00:00",
  },
]

// 项目数据 - 内存存储
export const projects: Project[] = [
  {
    id: "proj-2025001",
    code: "HN2025-ZD-001",
    name: "基于北斗高精度定位的城市地下管网智能探测技术研究",
    type: "major",
    typeName: "重大项目",
    field: "测绘地理信息",
    expectedLevel: "国际先进",
    breakthroughTypes: ["理论创新", "技术突破"],
    status: "in_progress",
    statusName: "执行中",
    totalBudget: 5000000,
    govFunding: 4000000,
    selfFunding: 1000000,
    startDate: "2025-03-01",
    endDate: "2028-02-29",
    duration: 36,
    submittedAt: "2024-12-15 09:30:00",
    approvedAt: "2025-01-05 10:00:00",
    leadInstitutionId: "inst-002",
    leadInstitutionName: "湖南省第三测绘院",
    participatingInstitutions: [],
    leaderId: "user-004",
    leaderName: "王项目",
    leaderTitle: "高级工程师",
    leaderPhone: "13800000004",
    leaderEmail: "leader@hndsch.com",
    leaderIdCard: "430104197501016789",
    members: [],
    background: "城市地下管网是城市生命线工程的重要组成部分...",
    objectives: "建立基于北斗高精度定位的地下管网探测技术体系...",
    content: "研究北斗高精度定位与地下管网探测结合的关键技术...",
    methodology: "采用理论研究、技术开发、实验验证相结合的方法...",
    expectedResults: "形成完整的技术体系，申请发明专利5项以上...",
    keyIndicators: ["定位精度达到厘米级", "探测深度达到10米", "识别准确率95%以上"],
    budgetDetails: [],
    milestones: [],
    attachments: [],
    hasMidtermCheck: true,
    midtermCheckDate: "2026-09-01",
    hasAnnualCheck: true,
    annualCheckDate: "2026-03-01",
    createdAt: "2024-12-15 09:30:00",
    updatedAt: "2025-01-05 10:00:00",
  },
  {
    id: "proj-2025002",
    code: "HN2025-QN-002",
    name: "无人机倾斜摄影测量在乡村规划中的应用研究",
    type: "youth",
    typeName: "青年项目",
    field: "测绘地理信息",
    expectedLevel: "国内领先",
    breakthroughTypes: ["应用创新"],
    status: "in_progress",
    statusName: "执行中",
    totalBudget: 800000,
    govFunding: 600000,
    selfFunding: 200000,
    startDate: "2025-03-15",
    endDate: "2027-03-14",
    duration: 24,
    submittedAt: "2024-12-20 14:20:00",
    approvedAt: "2025-01-08 11:00:00",
    leadInstitutionId: "inst-002",
    leadInstitutionName: "湖南省第三测绘院",
    participatingInstitutions: [],
    leaderId: "user-004",
    leaderName: "王项目",
    leaderTitle: "工程师",
    leaderPhone: "13800000004",
    leaderEmail: "leader@hndsch.com",
    leaderIdCard: "430104197501016789",
    members: [],
    background: "乡村振兴战略背景下，乡村规划需求日益增加...",
    objectives: "建立无人机倾斜摄影测量在乡村规划中的应用技术规范...",
    content: "研究无人机数据采集、处理和乡村规划应用的关键技术...",
    methodology: "理论研究与实地应用相结合...",
    expectedResults: "形成技术规范1项，示范应用3个...",
    keyIndicators: ["数据精度达到1:500", "处理效率提升50%", "规划应用覆盖率80%"],
    budgetDetails: [],
    milestones: [],
    attachments: [],
    hasMidtermCheck: true,
    midtermCheckDate: "2026-03-01",
    hasAnnualCheck: false,
    createdAt: "2024-12-20 14:20:00",
    updatedAt: "2025-01-08 11:00:00",
  },
  {
    id: "proj-2025003",
    code: "HN2025-ZD-003",
    name: "智慧城市时空大数据平台关键技术研究",
    type: "major",
    typeName: "重大项目",
    field: "测绘地理信息",
    expectedLevel: "国际领先",
    breakthroughTypes: ["理论创新", "技术突破", "平台建设"],
    status: "approval_pending",
    statusName: "立项申请",
    totalBudget: 8000000,
    govFunding: 6500000,
    selfFunding: 1500000,
    startDate: "2025-01-01",
    endDate: "2027-12-31",
    duration: 36,
    submittedAt: "2025-01-10 10:30:00",
    leadInstitutionId: "inst-002",
    leadInstitutionName: "湖南省第三测绘院",
    participatingInstitutions: [],
    leaderId: "user-004",
    leaderName: "王项目",
    leaderTitle: "高级工程师",
    leaderPhone: "13800000004",
    leaderEmail: "leader@hndsch.com",
    leaderIdCard: "430104197501016789",
    members: [],
    background: "智慧城市建设是新型城镇化的重要方向，时空大数据平台是智慧城市的基础设施...",
    objectives: "突破时空大数据融合、分析、服务等关键技术，构建新一代智慧城市时空大数据平台...",
    content: "研究多源异构时空数据融合技术、时空大数据智能分析技术、时空信息服务技术等...",
    methodology: "采用产学研结合的方式，理论研究与平台开发并重...",
    expectedResults: "建成示范平台1个，申请发明专利8项，发表高水平论文10篇以上...",
    keyIndicators: ["数据融合精度达到米级", "数据处理速度提升3倍", "服务响应时间小于1秒", "平台并发用户数10000+"],
    budgetDetails: [],
    milestones: [],
    attachments: [],
    hasMidtermCheck: true,
    midtermCheckDate: "2026-06-30",
    hasAnnualCheck: true,
    annualCheckDate: "2026-01-31",
    createdAt: "2025-01-10 10:30:00",
    updatedAt: "2025-01-10 10:30:00",
  },
  {
    id: "proj-2025004",
    code: "HN2025-YB-004",
    name: "农村不动产确权登记数据质量检测技术研究",
    type: "application",
    typeName: "一般项目",
    field: "测绘地理信息",
    expectedLevel: "国内先进",
    breakthroughTypes: ["方法创新"],
    status: "approval_pending",
    statusName: "立项申请",
    totalBudget: 1200000,
    govFunding: 1000000,
    selfFunding: 200000,
    startDate: "2025-02-01",
    endDate: "2026-12-31",
    duration: 24,
    submittedAt: "2025-01-12 09:00:00",
    leadInstitutionId: "inst-002",
    leadInstitutionName: "湖南省第三测绘院",
    participatingInstitutions: [],
    leaderId: "user-004",
    leaderName: "王项目",
    leaderTitle: "工程师",
    leaderPhone: "13800000004",
    leaderEmail: "leader@hndsch.com",
    leaderIdCard: "430104197501016789",
    members: [],
    background: "农村不动产确权登记是保障农民权益的重要工作，数据质量直接影响登记效果...",
    objectives: "建立农村不动产确权登记数据质量检测技术方法体系...",
    content: "研究数据采集质量检测、数据处理质量检测、成果质量检测等技术...",
    methodology: "实地调研与技术研发相结合...",
    expectedResults: "形成质量检测技术规范1项，开发质量检测软件1套...",
    keyIndicators: ["检测准确率98%以上", "检测效率提升80%", "应用覆盖率90%"],
    budgetDetails: [],
    milestones: [],
    attachments: [],
    hasMidtermCheck: false,
    hasAnnualCheck: true,
    annualCheckDate: "2026-01-31",
    createdAt: "2025-01-12 09:00:00",
    updatedAt: "2025-01-12 09:00:00",
  },
  {
    id: "proj-2025005",
    code: "HN2025-QN-005",
    name: "三维实景模型在文物保护中的应用研究",
    type: "youth",
    typeName: "青年项目",
    field: "文化遗产保护",
    expectedLevel: "国内先进",
    breakthroughTypes: ["应用创新", "方法创新"],
    status: "approval_pending",
    statusName: "立项申请",
    totalBudget: 600000,
    govFunding: 500000,
    selfFunding: 100000,
    startDate: "2025-03-01",
    endDate: "2026-12-31",
    duration: 22,
    submittedAt: "2025-01-15 14:30:00",
    leadInstitutionId: "inst-002",
    leadInstitutionName: "湖南省第三测绘院",
    participatingInstitutions: [],
    leaderId: "user-004",
    leaderName: "王项目",
    leaderTitle: "助理工程师",
    leaderPhone: "13800000004",
    leaderEmail: "leader@hndsch.com",
    leaderIdCard: "430104197501016789",
    members: [],
    background: "文物保护是传承中华优秀传统文化的重要工作，三维实景建模技术为文物数字化保护提供了新手段...",
    objectives: "建立三维实景模型在文物保护中的应用技术体系...",
    content: "研究文物三维数据采集、模型构建、数字化保护等关键技术...",
    methodology: "技术研发与文物保护实践相结合...",
    expectedResults: "完成文物数字化保护案例5个，形成技术指南1项...",
    keyIndicators: ["模型精度达到毫米级", "纹理还原度95%以上", "保护效果显著"],
    budgetDetails: [],
    milestones: [],
    attachments: [],
    hasMidtermCheck: false,
    hasAnnualCheck: false,
    createdAt: "2025-01-15 14:30:00",
    updatedAt: "2025-01-15 14:30:00",
  },
]

// 审核历史
export const reviewHistory: Array<{
  id: string
  projectId: string
  reviewerId: string
  reviewerName: string
  action: "approve" | "reject"
  comment: string
  createdAt: string
}> = []

// 需求数据
export const demands: Demand[] = []

// 任务书数据
export const taskBooks: TaskBook[] = []

// 变更申请数据
export const changeRequests: ChangeRequest[] = []

// 检查记录数据
export const inspections: Inspection[] = []

// 中期检查记录
export const midtermChecks: Inspection[] = []

// 年度检查记录
export const annualChecks: Inspection[] = []

// 验收记录数据
export const acceptances: Acceptance[] = []

// 专家数据
export const experts: Expert[] = []

// =====================================================
// 数据操作函数
// =====================================================

// 获取项目列表
export function getProjects(filters?: {
  status?: string
  institutionId?: string
  leaderId?: string
  leaderName?: string
  year?: string
  keyword?: string
}) {
  let result = [...projects]

  if (filters?.status) {
    result = result.filter((p) => p.status === filters.status)
  }

  if (filters?.institutionId) {
    result = result.filter((p) => p.leadInstitutionId === filters.institutionId)
  }

  if (filters?.leaderId) {
    result = result.filter((p) => p.leaderId === filters.leaderId)
  }

  if (filters?.leaderName) {
    result = result.filter((p) => p.leaderName.includes(filters.leaderName!))
  }

  if (filters?.year) {
    result = result.filter((p) => p.startDate.startsWith(filters.year!))
  }

  if (filters?.keyword) {
    const keyword = filters.keyword.toLowerCase()
    result = result.filter((p) => p.name.toLowerCase().includes(keyword) || p.code.toLowerCase().includes(keyword))
  }

  return result
}

// 创建项目
export function createProject(data: Partial<Project>): Project {
  const timestamp = Date.now()
  const newProject: Project = {
    id: `proj-${timestamp}`,
    code: data.code || `HN2025-${timestamp}`,
    name: data.name || "新项目",
    type: data.type || "application",
    typeName: data.typeName || "一般项目",
    field: data.field || "",
    expectedLevel: data.expectedLevel || "",
    breakthroughTypes: data.breakthroughTypes || [],
    status: data.status || "draft",
    statusName: data.statusName || "草稿",
    totalBudget: data.totalBudget || 0,
    govFunding: data.govFunding || 0,
    selfFunding: data.selfFunding || 0,
    startDate: data.startDate || "",
    endDate: data.endDate || "",
    duration: data.duration || 0,
    leadInstitutionId: data.leadInstitutionId || "",
    leadInstitutionName: data.leadInstitutionName || "",
    participatingInstitutions: data.participatingInstitutions || [],
    leaderId: data.leaderId || "",
    leaderName: data.leaderName || "",
    leaderTitle: data.leaderTitle || "",
    leaderPhone: data.leaderPhone || "",
    leaderEmail: data.leaderEmail || "",
    leaderIdCard: data.leaderIdCard || "",
    members: data.members || [],
    background: data.background || "",
    objectives: data.objectives || "",
    content: data.content || "",
    methodology: data.methodology || "",
    expectedResults: data.expectedResults || "",
    keyIndicators: data.keyIndicators || [],
    budgetDetails: data.budgetDetails || [],
    milestones: data.milestones || [],
    attachments: data.attachments || [],
    hasMidtermCheck: data.hasMidtermCheck || false,
    hasAnnualCheck: data.hasAnnualCheck || false,
    submittedAt: data.submittedAt,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  projects.push(newProject)
  return newProject
}

// 更新项目
export function updateProject(id: string, data: Partial<Project>): Project | null {
  const index = projects.findIndex((p) => p.id === id)
  if (index === -1) return null

  projects[index] = {
    ...projects[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  return projects[index]
}

// 删除项目
export function deleteProject(id: string): boolean {
  const index = projects.findIndex((p) => p.id === id)
  if (index === -1) return false

  projects.splice(index, 1)
  return true
}

// 获取单个项目
export function getProjectById(id: string): Project | null {
  return projects.find((p) => p.id === id) || null
}

// 审核项目
export function reviewProject(
  projectId: string,
  reviewerId: string,
  action: "approve" | "reject",
  comment: string,
): boolean {
  const project = getProjectById(projectId)
  if (!project) return false

  const user = users.find((u) => u.id === reviewerId)
  if (!user) return false

  // 更新项目状态
  const newStatus = action === "approve" ? "approved" : "rejected"
  const newStatusName = action === "approve" ? "审核通过" : "已驳回"

  updateProject(projectId, {
    status: newStatus,
    statusName: newStatusName,
    approvedAt: action === "approve" ? new Date().toISOString() : undefined,
  })

  // 添加审核历史
  reviewHistory.push({
    id: `review-${Date.now()}`,
    projectId,
    reviewerId,
    reviewerName: user.realName,
    action,
    comment,
    createdAt: new Date().toISOString(),
  })

  return true
}

// 获取审核历史
export function getReviewHistory(projectId: string) {
  return reviewHistory.filter((r) => r.projectId === projectId)
}

// db对象作为命名导出，包含所有数据和函数
export const db = {
  // 基础数据
  institutions,
  roles,
  users,
  projects,
  reviewHistory,
  demands,
  taskBooks,
  changeRequests,
  inspections,
  midtermChecks,
  annualChecks,
  acceptances,
  experts,

  // 操作函数
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectById,
  reviewProject,
  getReviewHistory,
}
