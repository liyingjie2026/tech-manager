/**
 * 状态映射工具函数
 * 将后端英文状态值映射为中文显示文本
 * 根据页面状态说明文档和实际使用情况完整更新
 */

// 项目状态映射（科研机构端 - 项目一览）
export const projectStatusMap: Record<string, string> = {
  // 基础状态
  draft: "草稿",
  submitted: "已提交",
  under_review: "评审中",
  approved: "已通过",
  rejected: "已驳回",
  in_progress: "进行中",
  ongoing: "进行中",
  completed: "已完成",
  cancelled: "已取消",
  archived: "已归档",

  // 项目申报流程状态
  pending: "待审核",
  preliminary_approved: "初审通过",
  preliminary_review_pending: "待立项评审",
  preliminary_review_passed: "立项评审通过",
  preliminary_review_failed: "立项评审未通过",

  // 中文状态兼容
  草稿: "草稿",
  已提交: "已提交",
  评审中: "评审中",
  已通过: "已通过",
  已驳回: "已驳回",
  进行中: "进行中",
  已完成: "已完成",
  待审核: "待审核",
  初审通过: "初审通过",
  待立项评审: "待立项评审",
}

// 项目变更流程状态映射
export const changeFlowStatusMap: Record<string, string> = {
  draft: "未提交",
  submitted: "审批中",
  in_progress: "审批中",
  approved: "已审批",
  completed: "已审批",
  rejected: "已驳回",


  // 中文状态
  未提交: "未提交",
  审批中: "审批中",
  已审批: "已审批",
  已驳回: "已驳回",
}

// 中期/年度检查状态映射
export const checkStatusMap: Record<string, string> = {
  draft: "待提交",
  pending: "待提交",
  submitted: "审批中",
  in_progress: "审批中",
  approved: "已通过",
  passed: "已通过",
  rejected: "已驳回",

  // 监管端审核状态
  pending_institution: "待审核",

  // 中文状态
  待提交: "待提交",
  审批中: "审批中",
  已通过: "已通过",
  已驳回: "已驳回",
  待检查: "待检查",
  检查中: "检查中",
  已完成: "已完成",
}

// 项目验收状态映射
export const acceptanceStatusMap: Record<string, string> = {
  pending: "待组织",
  completed: "已验收",
  in_progress: "评审中",
  

  // 中文状态
  待组织: "待组织",
  已提交: "已提交",
  评审中: "评审中",
  已通过: "已通过",
  已驳回: "已驳回",
  通过: "通过",
  未通过: "未通过",
 
}

// 监管端 - 申报管理项目状态
export const applicationStatusMap: Record<string, string> = {
  pending: "待初审",
  submitted: "待初审",
  in_progress: "审批中",
  under_review: "审批中",
  approved: "已通过",
  rejected: "已驳回",
  completed: "已完成",
  preliminary_approved: "初审通过",
  preliminary_review_pending: "待立项评审",
  preliminary_review_passed: "立项评审通过",
  preliminary_review_failed: "立项评审未通过",

  // 中文状态
  待初审: "待初审",
  初审通过: "初审通过",
  审批中: "审批中",
  已通过: "已通过",
}

// 监管端 - 立项评审状态
export const reviewStatusMap: Record<string, string> = {
  pending: "待评审",
  preliminary_review_pending: "待评审",
  preliminary_approved:"初审通过",
  reviewing: "评审中",
  in_progress: "评审中",
  preliminary_review_passed: "评审通过",
  passed: "评审通过",
  preliminary_review_failed: "评审未通过",
  failed: "评审未通过",

  // 中文状态
  待评审: "待评审",
  评审中: "评审中",
  评审通过: "评审通过",
  评审未通过: "评审未通过",
}

// 专家评审状态映射
export const expertReviewStatusMap: Record<string, string> = {
  pending: "待审核",
  reviewing: "评审中",
  reviewed: "已评审",
  completed: "已完成",

  // 中文状态
  待审核: "待审核",
  已通过: "已通过",
  已驳回: "已驳回",
}

// 评审类型映射
export const reviewTypeMap: Record<string, string> = {
  preliminary: "立项评审",
  midterm: "中期评审",
  annual: "年度评审",
  acceptance: "验收评审",
  application: "申报评审",

  // 中文
  立项评审: "立项评审",
  中期评审: "中期评审",
  年度评审: "年度评审",
  验收评审: "验收评审",
  申报评审: "申报评审",
}

// 任务书状态映射
export const taskBookStatusMap: Record<string, string> = {
  draft: "草稿",
  pending: "待签订",
  pending_institution: "待审核",
  in_progress: "流程中",
  approved: "已签订",
  signed: "已签订",
  rejected: "已驳回",

  // 审核状态
  to_submit: "待提交",
  processing: "进行中",

  // 中文状态
  待签订: "待签订",
  已签订: "已签订",
  流程中: "流程中",
}

// 用户状态映射
export const userStatusMap: Record<number | string, string> = {
  0: "禁用",
  1: "启用",
  inactive: "禁用",
  active: "启用",
  禁用: "禁用",
  启用: "启用",
}

// 通用审核状态映射
export const auditStatusMap: Record<string, string> = {
  pending: "待审核",
  reviewing: "审核中",
  approved: "已通过",
  passed: "已通过",
  rejected: "已驳回",
  returned: "已退回",

  // 中文状态
  待审核: "待审核",
  审核中: "审核中",
  已通过: "已通过",
  已驳回: "已驳回",
}

// 成果转化审核状态
export const transformationStatusMap: Record<string, string> = {
  draft: "待提交",
  pending: "待审核",
  approved: "已通过",
  rejected: "已驳回",

  // 中文状态
  待提交: "待提交",
  待审核: "待审核",
  已通过: "已通过",
  已驳回: "已驳回",
}

// 资质审核状态
export const qualificationStatusMap: Record<string, string> = {
  pending: "待审核",
  approved: "已通过",
  rejected: "已驳回",

  // 中文状态
  待审核: "待审核",
  已通过: "已通过",
}

// 需求状态
export const demandStatusMap: Record<string, string> = {
  pending: "未审核",
  approved: "已审核",

  // 中文状态
  未审核: "未审核",
  已审核: "已审核",
  全部: "全部",
}

// 资源状态
export const resourceStatusMap: Record<string, string> = {
  normal: "正常",
  available: "可借阅",
  borrowed: "借阅中",
  maintenance: "维护中",

  // 中文状态
  正常: "正常",
  可借阅: "可借阅",
  借阅中: "借阅中",
}

// 成果鉴定状态
export const appraisalStatusMap: Record<string, string> = {
  pending: "待鉴定",
  "in-progress": "鉴定中",
  completed: "已完成",

  // 中文状态
  待鉴定: "待鉴定",
  鉴定中: "鉴定中",
  已完成: "已完成",
}

// 结论上传状态
export const conclusionStatusMap: Record<string, string> = {
  pending: "待上传",
  uploaded: "已上传",

  // 中文状态
  待上传: "待上传",
  已上传: "已上传",
}

// 申报批次状态
export const batchStatusMap: Record<string, string> = {
  active: "进行中",
  finished: "已结束",

  // 中文状态
  进行中: "进行中",
  已结束: "已结束",
}

// 工作流状态
export const workflowStatusMap: Record<string, string> = {
  enabled: "启用",
  disabled: "禁用",

  // 中文状态
  启用: "启用",
  禁用: "禁用",
}

// 项目状态（用于筛选和显示）
export const projectFilterStatusMap: Record<string, string> = {
  all: "全部",
  draft: "草稿",
  submitted: "已提交",
  under_review: "评审中",
  approved: "已通过",
  in_progress: "进行中",
  completed: "已完成",

  // 中文
  全部: "全部",
}

export const projectTypeMap: Record<string, string> = {
  basic_research: "基础研究",
  applied_research: "应用研究",
  experimental_development: "试验发展",

  // 中文状态
  基础研究: "基础研究",
  应用研究: "应用研究",
  试验发展: "试验发展",
}

export const projectCategoryMap: Record<string, string> = {
  national: "国家级",
  provincial: "省级",
  municipal: "市级",
  enterprise: "企业",

  // 中文状态
  国家级: "国家级",
  省级: "省级",
  市级: "市级",
  企业: "企业",
}

export const researchFieldMap: Record<string, string> = {
  computer_science: "计算机科学",
  artificial_intelligence: "人工智能",
  biology: "生物学",
  chemistry: "化学",
  physics: "物理学",
  environmental: "环境科学",
  automation: "自动化",
  materials: "材料科学",

  // 中文状态
  计算机科学: "计算机科学",
  人工智能: "人工智能",
  生物学: "生物学",
  化学: "化学",
  物理学: "物理学",
  环境科学: "环境科学",
  自动化: "自动化",
  材料科学: "材料科学",
}

export const changeTypeMap: Record<string, string> = {
  // 英文变更类型
  leader: "负责人变更",
  member: "成员变更",
  duration: "时间调整",
  time: "时间调整",
  schedule: "进度调整",
  budget: "预算调整",
  content: "内容调整",
  institution: "单位变更",
  other: "其他变更",

  // 中文变更类型
  负责人变更: "负责人变更",
  成员变更: "成员变更",
  时间调整: "时间调整",
  进度调整: "进度调整",
  预算调整: "预算调整",
  内容调整: "内容调整",
  单位变更: "单位变更",
  其他变更: "其他变更",
}

export function getStatusText(
  status: string | number | undefined | null,
  type:
    | "project"
    | "change"
    | "prjChange"
    | "midterm"
    | "annual"
    | "check"
    | "acceptance"
    | "application"
    | "review"
    | "expert"
    | "audit"
    | "user"
    | "taskbook"
    | "taskbook_sign"
    | "taskbook_audit"
    | "transformation"
    | "qualification"
    | "demand"
    | "resource"
    | "appraisal"
    | "conclusion"
    | "batch"
    | "workflow" = "project"
   
): string {
  if (status === undefined || status === null) return "-"

  const maps = {
    project: projectStatusMap,
    change: changeFlowStatusMap,
    prjChange:changeTypeMap,
    midterm: checkStatusMap,
    annual: checkStatusMap,
    check: checkStatusMap,
    acceptance: acceptanceStatusMap,
    application: applicationStatusMap,
    review: reviewStatusMap,
    expert: expertReviewStatusMap,
    audit: auditStatusMap,
    user: userStatusMap,
    taskbook: taskBookStatusMap,
    taskbook_sign: taskBookStatusMap,
    taskbook_audit: taskBookStatusMap,
    transformation: transformationStatusMap,
    qualification: qualificationStatusMap,
    demand: demandStatusMap,
    resource: resourceStatusMap,
    appraisal: appraisalStatusMap,
    conclusion: conclusionStatusMap,
    batch: batchStatusMap,
    workflow: workflowStatusMap,
  }

  const statusStr = String(status)
  return maps[type][statusStr] || maps[type][statusStr.toLowerCase()] || statusStr
}

export function getReviewTypeText(type: string | undefined | null): string {
  if (!type) return "-"
  const typeStr = String(type)
  return reviewTypeMap[typeStr] || reviewTypeMap[typeStr.toLowerCase()] || typeStr
}

export function getStatusColor(status: string | undefined | null): string {
  if (!status) return "bg-gray-100 text-gray-700"

  const statusStr = String(status).toLowerCase()

  // 待处理/草稿状态 - 黄色
  if (
    statusStr.includes("draft") ||
    statusStr.includes("pending") ||
    statusStr.includes("草稿") ||
    statusStr.includes("待")
  ) {
    return "bg-amber-100 text-amber-700"
  }

  // 进行中/审核中状态 - 蓝色
  if (
    statusStr.includes("submit") ||
    statusStr.includes("review") ||
    statusStr.includes("progress") ||
    statusStr.includes("已提交") ||
    statusStr.includes("审批中") ||
    statusStr.includes("评审中") ||
    statusStr.includes("审核中") ||
    statusStr.includes("进行中") ||
    statusStr.includes("检查中")
  ) {
    return "bg-blue-100 text-blue-700"
  }

  // 成功/通过状态 - 绿色
  if (
    statusStr.includes("approv") ||
    statusStr.includes("pass") ||
    statusStr.includes("complet") ||
    statusStr.includes("active") ||
    statusStr.includes("signed") ||
    statusStr === "1" ||
    statusStr.includes("已通过") ||
    statusStr.includes("已完成") ||
    statusStr.includes("已审批") ||
    statusStr.includes("启用") ||
    statusStr.includes("正常") ||
    statusStr.includes("通过")
  ) {
    return "bg-green-100 text-green-700"
  }

  // 失败/驳回状态 - 红色
  if (
    statusStr.includes("reject") ||
    statusStr.includes("fail") ||
    statusStr.includes("cancel") ||
    statusStr.includes("inactive") ||
    statusStr === "0" ||
    statusStr.includes("已驳回") ||
    statusStr.includes("未通过") ||
    statusStr.includes("禁用")
  ) {
    return "bg-red-100 text-red-700"
  }

  // 归档/其他状态 - 灰色
  return "bg-gray-100 text-gray-700"
}

export function getStatusVariant(
  status: string | undefined | null,
): "default" | "secondary" | "destructive" | "outline" {
  if (!status) return "secondary"

  const statusStr = String(status).toLowerCase()

  // 成功状态
  if (
    statusStr.includes("approv") ||
    statusStr.includes("pass") ||
    statusStr.includes("complet") ||
    statusStr.includes("已通过") ||
    statusStr.includes("已完成")
  ) {
    return "default"
  }

  // 失败状态
  if (
    statusStr.includes("reject") ||
    statusStr.includes("fail") ||
    statusStr.includes("已驳回") ||
    statusStr.includes("未通过")
  ) {
    return "destructive"
  }

  // 进行中状态
  if (
    statusStr.includes("progress") ||
    statusStr.includes("review") ||
    statusStr.includes("进行中") ||
    statusStr.includes("审核中")
  ) {
    return "outline"
  }

  // 默认状态
  return "secondary"
}

export function getProjectTypeText(type: string | undefined | null): string {
  if (!type) return "-"
  const typeStr = String(type)
  return projectTypeMap[typeStr] || projectTypeMap[typeStr.toLowerCase()] || typeStr
}

export function getProjectCategoryText(category: string | undefined | null): string {
  if (!category) return "-"
  const categoryStr = String(category)
  return projectCategoryMap[categoryStr] || projectCategoryMap[categoryStr.toLowerCase()] || categoryStr
}

export function getResearchFieldText(field: string | undefined | null): string {
  if (!field) return "-"
  const fieldStr = String(field)
  return researchFieldMap[fieldStr] || researchFieldMap[fieldStr.toLowerCase()] || fieldStr
}
