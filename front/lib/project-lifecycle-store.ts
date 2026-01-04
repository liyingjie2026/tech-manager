// 项目全生命周期状态管理store
type ProjectStatus =
  | "draft" // 草稿
  | "submitted" // 已提交
  | "preliminary_review" // 初审中
  | "preliminary_approved" // 初审通过
  | "preliminary_rejected" // 初审驳回
  | "expert_selection" // 专家抽取中
  | "expert_review" // 专家评审中
  | "expert_approved" // 专家评审通过
  | "expert_rejected" // 专家评审驳回
  | "task_issued" // 任务已下发
  | "task_split" // 任务拆分中
  | "taskbook_uploaded" // 任务书已上传
  | "taskbook_institution_review" // 机构审核任务书中
  | "taskbook_supervisor_review" // 监管端审核任务书中
  | "taskbook_approved" // 任务书审核通过
  | "taskbook_rejected" // 任务书审核驳回
  | "in_progress" // 项目执行中
  | "midterm_submitted" // 中期检查已提交
  | "midterm_review" // 中期检查审查中
  | "midterm_approved" // 中期检查通过
  | "midterm_rejected" // 中期检查驳回
  | "annual_submitted" // 年度检查已提交
  | "annual_review" // 年度检查审查中
  | "annual_approved" // 年度检查通过
  | "annual_rejected" // 年度检查驳回
  | "project_ended" // 项目结束
  | "acceptance_applied" // 验收申请已提交
  | "acceptance_review" // 验收审批中
  | "acceptance_expert_selection" // 验收专家抽取中
  | "acceptance_expert_review" // 验收专家评审中
  | "acceptance_approved" // 验收通过
  | "acceptance_rejected" // 验收驳回
  | "completed" // 项目完结

interface Project {
  id: string
  code: string
  name: string
  type: string
  field: string
  institution: string
  leader: string
  budget: number
  status: ProjectStatus
  description?: string
  startDate?: string
  endDate?: string
  createdAt: string
  updatedAt: string

  // 审批记录
  approvalRecords?: ApprovalRecord[]

  // 专家信息
  selectedExperts?: string[]
  expertReviews?: ExpertReview[]

  // 任务书信息
  taskBook?: TaskBook

  // 检查信息
  midtermChecks?: Check[]
  annualChecks?: Check[]

  // 验收信息
  acceptance?: Acceptance
}

interface ApprovalRecord {
  id: string
  stage: string
  approver: string
  approverRole: "institution" | "supervisor" | "expert"
  action: "approved" | "rejected"
  reason?: string
  timestamp: string
}

interface ExpertReview {
  expertId: string
  expertName: string
  score: number
  comments: string
  result: "approved" | "rejected"
  submittedAt: string
}

interface TaskBook {
  id: string
  projectId: string
  content: string
  uploadedAt: string
  institutionReviewStatus: "pending" | "approved" | "rejected"
  supervisorReviewStatus: "pending" | "approved" | "rejected"
  institutionReviewer?: string
  supervisorReviewer?: string
}

interface Check {
  id: string
  projectId: string
  type: "midterm" | "annual"
  materials: string[]
  submittedAt: string
  reviewStatus: "pending" | "approved" | "rejected"
  reviewer?: string
  reviewComments?: string
}

interface Acceptance {
  id: string
  projectId: string
  appliedAt: string
  approvalStatus: "pending" | "approved" | "rejected"
  selectedExperts?: string[]
  expertReviews?: ExpertReview[]
  finalResult?: "approved" | "rejected"
}

// 模拟数据存储
class ProjectLifecycleStore {
  private projects: Map<string, Project> = new Map()
  private experts: Map<string, any> = new Map()

  constructor() {
    this.initializeMockData()
  }

  private initializeMockData() {
    const mockProjects: Project[] = [
      {
        id: "proj-1",
        code: "KJ202502001",
        name: "地质灾害防治综合技术研究",
        type: "重大项目",
        field: "地质灾害防治",
        institution: "湖南省第三测绘院",
        leader: "张教授",
        budget: 100.0,
        status: "draft",
        description: "研究地质灾害防治的综合技术方案",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        approvalRecords: [],
      },
      {
        id: "proj-2",
        code: "KJ202502002",
        name: "自然资源数字化管理系统",
        type: "应用技术类",
        field: "信息化建设",
        institution: "湖南师范大学",
        leader: "王教授",
        budget: 80.0,
        status: "submitted",
        description: "建设自然资源数字化管理平台",
        startDate: "2025-02-02",
        endDate: "2026-02-02",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        approvalRecords: [],
      },
      {
        id: "proj-3",
        code: "KJ202502003",
        name: "矿产资源勘查技术创新",
        type: "重大项目",
        field: "矿产资源",
        institution: "湖南科技大学",
        leader: "赵教授",
        budget: 120.0,
        status: "preliminary_approved",
        description: "创新矿产资源勘查技术方法",
        startDate: "2025-02-02",
        endDate: "2027-02-02",
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        approvalRecords: [
          {
            id: "approval-1",
            stage: "preliminary_review",
            approver: "监管员",
            approverRole: "supervisor",
            action: "approved",
            timestamp: new Date(Date.now() - 86400000).toISOString(),
          },
        ],
      },
    ]

    mockProjects.forEach((project) => {
      this.projects.set(project.id, project)
    })

    // Initialize mock experts
    const mockExperts = [
      { id: "expert-1", name: "李专家", field: "地质灾害", email: "expert1@example.com", phone: "13800138001" },
      { id: "expert-2", name: "刘专家", field: "信息化", email: "expert2@example.com", phone: "13800138002" },
      { id: "expert-3", name: "陈专家", field: "矿产资源", email: "expert3@example.com", phone: "13800138003" },
      { id: "expert-4", name: "孙专家", field: "地质灾害", email: "expert4@example.com", phone: "13800138004" },
      { id: "expert-5", name: "周专家", field: "信息化", email: "expert5@example.com", phone: "13800138005" },
    ]

    mockExperts.forEach((expert) => {
      this.experts.set(expert.id, expert)
    })
  }

  // Get all projects
  getAllProjects(): Project[] {
    return Array.from(this.projects.values())
  }

  // Get projects by status
  getProjectsByStatus(status: ProjectStatus): Project[] {
    return this.getAllProjects().filter((p) => p.status === status)
  }

  // Get projects by institution
  getProjectsByInstitution(institution: string): Project[] {
    return this.getAllProjects().filter((p) => p.institution === institution)
  }

  // Get project by ID
  getProject(id: string): Project | undefined {
    return this.projects.get(id)
  }

  // Update project
  updateProject(id: string, updates: Partial<Project>): void {
    const project = this.projects.get(id)
    if (project) {
      this.projects.set(id, {
        ...project,
        ...updates,
        updatedAt: new Date().toISOString(),
      })
    }
  }

  // Create project
  createProject(project: Omit<Project, "id" | "code" | "createdAt" | "updatedAt">): Project {
    const id = `proj-${Date.now()}`
    const code = `KJ${new Date().getFullYear()}${String(this.projects.size + 1).padStart(5, "0")}`
    const newProject: Project = {
      ...project,
      id,
      code,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.projects.set(id, newProject)
    return newProject
  }

  // Submit project (科研机构提交申报)
  submitProject(id: string): void {
    this.updateProject(id, {
      status: "submitted",
    })
  }

  // Preliminary approve (监管端初审通过)
  preliminaryApprove(id: string, approver: string, reason?: string): void {
    const project = this.projects.get(id)
    if (project) {
      const record: ApprovalRecord = {
        id: `approval-${Date.now()}`,
        stage: "preliminary_review",
        approver,
        approverRole: "supervisor",
        action: "approved",
        reason,
        timestamp: new Date().toISOString(),
      }
      this.updateProject(id, {
        status: "preliminary_approved",
        approvalRecords: [...(project.approvalRecords || []), record],
      })
    }
  }

  // Preliminary reject (监管端初审驳回)
  preliminaryReject(id: string, approver: string, reason: string): void {
    const project = this.projects.get(id)
    if (project) {
      const record: ApprovalRecord = {
        id: `approval-${Date.now()}`,
        stage: "preliminary_review",
        approver,
        approverRole: "supervisor",
        action: "rejected",
        reason,
        timestamp: new Date().toISOString(),
      }
      this.updateProject(id, {
        status: "preliminary_rejected",
        approvalRecords: [...(project.approvalRecords || []), record],
      })
    }
  }

  // Draw experts (监管端抽取专家)
  drawExperts(projectId: string, count = 3): string[] {
    const expertList = Array.from(this.experts.values())
    const selectedExperts = expertList
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
      .map((e) => e.id)

    this.updateProject(projectId, {
      status: "expert_review",
      selectedExperts,
    })

    return selectedExperts
  }

  // Get experts
  getExperts(): any[] {
    return Array.from(this.experts.values())
  }

  // Get expert by ID
  getExpert(id: string): any {
    return this.experts.get(id)
  }

  // Get projects for expert (专家端查看分配的项目)
  getProjectsForExpert(expertId: string): Project[] {
    return this.getAllProjects().filter(
      (p) =>
        p.selectedExperts?.includes(expertId) &&
        (p.status === "expert_review" || p.status === "acceptance_expert_review"),
    )
  }

  // Submit expert review (专家提交评审)
  submitExpertReview(
    projectId: string,
    expertId: string,
    expertName: string,
    score: number,
    comments: string,
    result: "approved" | "rejected",
  ): void {
    const project = this.projects.get(projectId)
    if (project) {
      const review: ExpertReview = {
        expertId,
        expertName,
        score,
        comments,
        result,
        submittedAt: new Date().toISOString(),
      }

      const expertReviews = [...(project.expertReviews || []), review]

      // Check if all experts have reviewed
      const allReviewed = expertReviews.length === (project.selectedExperts?.length || 0)
      const allApproved = expertReviews.every((r) => r.result === "approved")

      let newStatus = project.status
      if (allReviewed) {
        newStatus = allApproved ? "expert_approved" : "expert_rejected"
      }

      this.updateProject(projectId, {
        status: newStatus,
        expertReviews,
      })
    }
  }

  // Issue task (监管端下发任务)
  issueTask(projectId: string): void {
    this.updateProject(projectId, {
      status: "task_issued",
    })
  }

  // Upload task book (科研端上传任务书)
  uploadTaskBook(projectId: string, content: string): void {
    const taskBook: TaskBook = {
      id: `taskbook-${Date.now()}`,
      projectId,
      content,
      uploadedAt: new Date().toISOString(),
      institutionReviewStatus: "pending",
      supervisorReviewStatus: "pending",
    }

    this.updateProject(projectId, {
      status: "taskbook_institution_review",
      taskBook,
    })
  }

  // Institution review task book (机构审核任务书)
  reviewTaskBookByInstitution(projectId: string, reviewer: string, approved: boolean): void {
    const project = this.projects.get(projectId)
    if (project?.taskBook) {
      const taskBook = {
        ...project.taskBook,
        institutionReviewStatus: approved ? ("approved" as const) : ("rejected" as const),
        institutionReviewer: reviewer,
      }

      this.updateProject(projectId, {
        status: approved ? "taskbook_supervisor_review" : "taskbook_rejected",
        taskBook,
      })
    }
  }

  // Supervisor review task book (监管端审核任务书)
  reviewTaskBookBySupervisor(projectId: string, reviewer: string, approved: boolean): void {
    const project = this.projects.get(projectId)
    if (project?.taskBook) {
      const taskBook = {
        ...project.taskBook,
        supervisorReviewStatus: approved ? ("approved" as const) : ("rejected" as const),
        supervisorReviewer: reviewer,
      }

      this.updateProject(projectId, {
        status: approved ? "in_progress" : "taskbook_rejected",
        taskBook,
      })
    }
  }

  // Submit midterm check (科研端提交中期检查)
  submitMidtermCheck(projectId: string, materials: string[]): void {
    const project = this.projects.get(projectId)
    if (project) {
      const check: Check = {
        id: `midterm-${Date.now()}`,
        projectId,
        type: "midterm",
        materials,
        submittedAt: new Date().toISOString(),
        reviewStatus: "pending",
      }

      this.updateProject(projectId, {
        status: "midterm_review",
        midtermChecks: [...(project.midtermChecks || []), check],
      })
    }
  }

  // Review midterm check (监管端审查中期检查)
  reviewMidtermCheck(projectId: string, checkId: string, reviewer: string, approved: boolean, comments?: string): void {
    const project = this.projects.get(projectId)
    if (project) {
      const midtermChecks = project.midtermChecks?.map((c) =>
        c.id === checkId
          ? {
              ...c,
              reviewStatus: approved ? ("approved" as const) : ("rejected" as const),
              reviewer,
              reviewComments: comments,
            }
          : c,
      )

      this.updateProject(projectId, {
        status: approved ? "in_progress" : "midterm_rejected",
        midtermChecks,
      })
    }
  }

  // Submit annual check (科研端提交年度检查)
  submitAnnualCheck(projectId: string, materials: string[]): void {
    const project = this.projects.get(projectId)
    if (project) {
      const check: Check = {
        id: `annual-${Date.now()}`,
        projectId,
        type: "annual",
        materials,
        submittedAt: new Date().toISOString(),
        reviewStatus: "pending",
      }

      this.updateProject(projectId, {
        status: "annual_review",
        annualChecks: [...(project.annualChecks || []), check],
      })
    }
  }

  // Review annual check (监管端审查年度检查)
  reviewAnnualCheck(projectId: string, checkId: string, reviewer: string, approved: boolean, comments?: string): void {
    const project = this.projects.get(projectId)
    if (project) {
      const annualChecks = project.annualChecks?.map((c) =>
        c.id === checkId
          ? {
              ...c,
              reviewStatus: approved ? ("approved" as const) : ("rejected" as const),
              reviewer,
              reviewComments: comments,
            }
          : c,
      )

      this.updateProject(projectId, {
        status: approved ? "project_ended" : "annual_rejected",
        annualChecks,
      })
    }
  }

  // Apply for acceptance (科研端申请验收)
  applyForAcceptance(projectId: string): void {
    const acceptance: Acceptance = {
      id: `acceptance-${Date.now()}`,
      projectId,
      appliedAt: new Date().toISOString(),
      approvalStatus: "pending",
    }

    this.updateProject(projectId, {
      status: "acceptance_applied",
      acceptance,
    })
  }

  // Approve acceptance application (监管端批准验收申请)
  approveAcceptanceApplication(projectId: string): void {
    this.updateProject(projectId, {
      status: "acceptance_expert_selection",
    })
  }

  // Draw acceptance experts (监管端抽取验收专家)
  drawAcceptanceExperts(projectId: string, count = 5): string[] {
    const expertList = Array.from(this.experts.values())
    const selectedExperts = expertList
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
      .map((e) => e.id)

    const project = this.projects.get(projectId)
    if (project?.acceptance) {
      const acceptance = {
        ...project.acceptance,
        selectedExperts,
      }

      this.updateProject(projectId, {
        status: "acceptance_expert_review",
        acceptance,
      })
    }

    return selectedExperts
  }

  // Submit acceptance expert review (专家提交验收评审)
  submitAcceptanceExpertReview(
    projectId: string,
    expertId: string,
    expertName: string,
    score: number,
    comments: string,
    result: "approved" | "rejected",
  ): void {
    const project = this.projects.get(projectId)
    if (project?.acceptance) {
      const review: ExpertReview = {
        expertId,
        expertName,
        score,
        comments,
        result,
        submittedAt: new Date().toISOString(),
      }

      const expertReviews = [...(project.acceptance.expertReviews || []), review]

      // Check if all experts have reviewed
      const allReviewed = expertReviews.length === (project.acceptance.selectedExperts?.length || 0)
      const allApproved = expertReviews.every((r) => r.result === "approved")

      let newStatus = project.status
      let finalResult = project.acceptance.finalResult

      if (allReviewed) {
        newStatus = allApproved ? "completed" : "acceptance_rejected"
        finalResult = allApproved ? "approved" : "rejected"
      }

      const acceptance = {
        ...project.acceptance,
        expertReviews,
        finalResult,
      }

      this.updateProject(projectId, {
        status: newStatus,
        acceptance,
      })
    }
  }
}

// Export singleton instance
export const projectLifecycleStore = new ProjectLifecycleStore()
