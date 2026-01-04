// 项目状态工具函数
type ProjectStatus = string

interface StatusConfig {
  label: string
  color: string
  bgColor: string
  description: string
}

export const projectStatusConfig: Record<ProjectStatus, StatusConfig> = {
  draft: {
    label: "草稿",
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    description: "项目正在编辑中",
  },
  submitted: {
    label: "已提交",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    description: "等待初审",
  },
  preliminary_review: {
    label: "初审中",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    description: "监管端正在进行初审",
  },
  preliminary_approved: {
    label: "初审通过",
    color: "text-green-600",
    bgColor: "bg-green-100",
    description: "初审已通过，等待专家评审",
  },
  preliminary_rejected: {
    label: "初审驳回",
    color: "text-red-600",
    bgColor: "bg-red-100",
    description: "初审未通过",
  },
  expert_selection: {
    label: "专家抽取中",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    description: "正在抽取评审专家",
  },
  expert_review: {
    label: "专家评审中",
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
    description: "专家正在进行评审",
  },
  expert_approved: {
    label: "专家评审通过",
    color: "text-green-600",
    bgColor: "bg-green-100",
    description: "专家评审已通过",
  },
  expert_rejected: {
    label: "专家评审驳回",
    color: "text-red-600",
    bgColor: "bg-red-100",
    description: "专家评审未通过",
  },
  task_issued: {
    label: "任务已下发",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    description: "任务已下发到科研机构",
  },
  taskbook_uploaded: {
    label: "任务书已上传",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    description: "等待机构审核",
  },
  taskbook_institution_review: {
    label: "机构审核中",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    description: "机构正在审核任务书",
  },
  taskbook_supervisor_review: {
    label: "监管端审核中",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    description: "监管端正在审核任务书",
  },
  taskbook_approved: {
    label: "任务书审核通过",
    color: "text-green-600",
    bgColor: "bg-green-100",
    description: "任务书已通过审核",
  },
  taskbook_rejected: {
    label: "任务书驳回",
    color: "text-red-600",
    bgColor: "bg-red-100",
    description: "任务书未通过审核",
  },
  in_progress: {
    label: "项目执行中",
    color: "text-green-600",
    bgColor: "bg-green-100",
    description: "项目正在执行",
  },
  midterm_submitted: {
    label: "中期检查已提交",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    description: "等待监管端审查",
  },
  midterm_review: {
    label: "中期检查审查中",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    description: "监管端正在审查中期检查",
  },
  midterm_approved: {
    label: "中期检查通过",
    color: "text-green-600",
    bgColor: "bg-green-100",
    description: "中期检查已通过",
  },
  midterm_rejected: {
    label: "中期检查驳回",
    color: "text-red-600",
    bgColor: "bg-red-100",
    description: "中期检查未通过",
  },
  annual_submitted: {
    label: "年度检查已提交",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    description: "等待监管端审查",
  },
  annual_review: {
    label: "年度检查审查中",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    description: "监管端正在审查年度检查",
  },
  annual_approved: {
    label: "年度检查通过",
    color: "text-green-600",
    bgColor: "bg-green-100",
    description: "年度检查已通过",
  },
  annual_rejected: {
    label: "年度检查驳回",
    color: "text-red-600",
    bgColor: "bg-red-100",
    description: "年度检查未通过",
  },
  project_ended: {
    label: "项目结束",
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    description: "项目已结束，等待验收",
  },
  acceptance_applied: {
    label: "验收申请已提交",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    description: "等待监管端批准",
  },
  acceptance_review: {
    label: "验收审批中",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    description: "监管端正在审批验收申请",
  },
  acceptance_expert_selection: {
    label: "验收专家抽取中",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    description: "正在抽取验收专家",
  },
  acceptance_expert_review: {
    label: "验收专家评审中",
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
    description: "专家正在进行验收评审",
  },
  acceptance_approved: {
    label: "验收通过",
    color: "text-green-600",
    bgColor: "bg-green-100",
    description: "验收已通过",
  },
  acceptance_rejected: {
    label: "验收驳回",
    color: "text-red-600",
    bgColor: "bg-red-100",
    description: "验收未通过",
  },
  completed: {
    label: "项目完结",
    color: "text-green-700",
    bgColor: "bg-green-200",
    description: "项目已完结",
  },
}

export function getStatusConfig(status: ProjectStatus): StatusConfig {
  return (
    projectStatusConfig[status] || {
      label: status,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
      description: "",
    }
  )
}

export function canSubmitProject(status: ProjectStatus): boolean {
  return status === "draft"
}

export function canPreliminaryReview(status: ProjectStatus): boolean {
  return status === "submitted"
}

export function canDrawExperts(status: ProjectStatus): boolean {
  return status === "preliminary_approved"
}

export function canExpertReview(status: ProjectStatus): boolean {
  return status === "expert_review"
}

export function canIssueTask(status: ProjectStatus): boolean {
  return status === "expert_approved"
}

export function canUploadTaskBook(status: ProjectStatus): boolean {
  return status === "task_issued" || status === "taskbook_rejected"
}

export function canReviewTaskBook(status: ProjectStatus): boolean {
  return status === "taskbook_institution_review" || status === "taskbook_supervisor_review"
}

export function canSubmitMidtermCheck(status: ProjectStatus): boolean {
  return status === "in_progress"
}

export function canReviewMidtermCheck(status: ProjectStatus): boolean {
  return status === "midterm_review"
}

export function canSubmitAnnualCheck(status: ProjectStatus): boolean {
  return status === "in_progress" || status === "midterm_approved"
}

export function canReviewAnnualCheck(status: ProjectStatus): boolean {
  return status === "annual_review"
}

export function canApplyForAcceptance(status: ProjectStatus): boolean {
  return status === "project_ended" || status === "annual_approved"
}

export function canReviewAcceptanceApplication(status: ProjectStatus): boolean {
  return status === "acceptance_applied"
}

export function canDrawAcceptanceExperts(status: ProjectStatus): boolean {
  return status === "acceptance_expert_selection"
}

export function canAcceptanceExpertReview(status: ProjectStatus): boolean {
  return status === "acceptance_expert_review"
}
