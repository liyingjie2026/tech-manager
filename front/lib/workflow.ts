// 项目状态流转
export const projectWorkflow = {
  // 提交申报
  submitApplication(project: { id: string; status: string }) {
    if (project.status === "draft") {
      return { success: true, message: "项目申报已提交", newStatus: "submitted" }
    }
    return { success: false, message: "无法提交该项目" }
  },

  // 审核通过
  approveApplication(project: { id: string; status: string }, comments: string) {
    if (project.status === "submitted") {
      return { success: true, message: "项目已通过审核", newStatus: "approved" }
    }
    return { success: false, message: "无法审核该项目" }
  },

  // 审核拒绝
  rejectApplication(project: { id: string; status: string }, comments: string) {
    if (project.status === "submitted") {
      return { success: true, message: "项目已被拒绝", newStatus: "rejected" }
    }
    return { success: false, message: "无法拒绝该项目" }
  },

  // 签订任务书
  signTaskBook(project: { id: string; status: string }) {
    if (project.status === "approved") {
      return { success: true, message: "任务书已签订", newStatus: "task_signed" }
    }
    return { success: false, message: "无法签订任务书" }
  },

  // 开始执行
  startExecution(project: { id: string; status: string }) {
    if (project.status === "task_signed") {
      return { success: true, message: "项目已开始执行", newStatus: "in_progress" }
    }
    return { success: false, message: "无法开始执行" }
  },

  // 进入中期检查
  startMidtermReview(project: { id: string; status: string }) {
    if (project.status === "in_progress") {
      return { success: true, message: "已进入中期检查阶段", newStatus: "midterm" }
    }
    return { success: false, message: "无法进行中期检查" }
  },

  // 进入验收
  startAcceptance(project: { id: string; status: string }) {
    if (project.status === "in_progress" || project.status === "midterm") {
      return { success: true, message: "已进入验收阶段", newStatus: "acceptance" }
    }
    return { success: false, message: "无法进行验收" }
  },

  // 完成项目
  completeProject(project: { id: string; status: string }) {
    if (project.status === "acceptance") {
      return { success: true, message: "项目已完成", newStatus: "completed" }
    }
    return { success: false, message: "无法完成项目" }
  },

  // 终止项目
  terminateProject(project: { id: string; status: string }, reason: string) {
    return { success: true, message: "项目已终止", newStatus: "terminated" }
  },
}

// 获取项目可执行的操作
export function getAvailableActions(status: string) {
  const actions: Record<string, string[]> = {
    draft: ["submit", "delete"],
    submitted: ["approve", "reject"],
    approved: ["signTask"],
    task_signed: ["startExecution"],
    in_progress: ["midtermReview", "acceptance", "terminate"],
    midterm: ["continueExecution", "acceptance", "terminate"],
    acceptance: ["complete", "reject"],
    completed: ["view"],
    rejected: ["resubmit", "delete"],
    terminated: ["view"],
  }

  return actions[status] || []
}

// 获取状态流程进度
export function getWorkflowProgress(status: string): number {
  const progressMap: Record<string, number> = {
    draft: 0,
    submitted: 20,
    approved: 40,
    task_signed: 50,
    in_progress: 60,
    midterm: 70,
    acceptance: 85,
    completed: 100,
    rejected: 0,
    terminated: 0,
  }

  return progressMap[status] || 0
}
