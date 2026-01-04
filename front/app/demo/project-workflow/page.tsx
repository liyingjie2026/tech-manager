// 项目全生命周期工作流演示页面
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { projectLifecycleStore } from "@/lib/project-lifecycle-store"
import { ProjectLifecycleTimeline } from "@/components/project/project-lifecycle-timeline"
import { ProjectWorkflowDialog } from "@/components/project/project-workflow-dialog"
import { useToast } from "@/hooks/use-toast"
import { FileText, Users, CheckCircle, XCircle, Upload, Send, Eye } from "lucide-react"

export default function ProjectWorkflowDemoPage() {
  const { toast } = useToast()
  const [projects, setProjects] = useState<any[]>([])
  const [selectedProject, setSelectedProject] = useState<any | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogAction, setDialogAction] = useState<any>(null)
  const [activeView, setActiveView] = useState<"institution" | "supervisor" | "expert">("institution")

  // 加载项目数据
  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = () => {
    const allProjects = projectLifecycleStore.getAllProjects()
    setProjects(allProjects)
    if (allProjects.length > 0 && !selectedProject) {
      setSelectedProject(allProjects[0])
    }
  }

  const handleAction = (actionType: string, project: any) => {
    setSelectedProject(project)
    setDialogAction(actionType)
    setDialogOpen(true)
  }

  const handleActionSuccess = () => {
    loadProjects()
    const updatedProject = projectLifecycleStore.getProject(selectedProject?.id)
    setSelectedProject(updatedProject)
    toast({
      title: "操作成功",
      description: "项目状态已更新",
    })
  }

  // 科研机构端视图
  const InstitutionView = () => {
    const institutionProjects = projectLifecycleStore.getProjectsByInstitution("湖南省第三测绘院")

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>我的项目</CardTitle>
            <CardDescription>管理您的项目申报和执行</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {institutionProjects.map((project) => (
                <Card key={project.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold">{project.name}</h4>
                        <Badge variant="outline">{project.type}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>项目编号：{project.code}</span>
                        <span>预算：{project.budget}万元</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">状态：</span>
                        <Badge className={getStatusColor(project.status)}>{getStatusLabel(project.status)}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {project.status === "draft" && (
                        <Button size="sm" onClick={() => handleAction("submit", project)}>
                          <Send className="h-4 w-4 mr-1" />
                          提交申报
                        </Button>
                      )}
                      {project.status === "task_issued" && (
                        <Button size="sm" onClick={() => handleAction("upload_taskbook", project)}>
                          <Upload className="h-4 w-4 mr-1" />
                          上传任务书
                        </Button>
                      )}
                      {project.status === "in_progress" && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleAction("submit_midterm", project)}>
                            中期检查
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleAction("submit_annual", project)}>
                            年度检查
                          </Button>
                        </>
                      )}
                      {project.status === "project_ended" && (
                        <Button size="sm" onClick={() => handleAction("apply_acceptance", project)}>
                          申请验收
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => setSelectedProject(project)}>
                        <Eye className="h-4 w-4 mr-1" />
                        查看
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 监管端视图
  const SupervisorView = () => {
    const submittedProjects = projectLifecycleStore.getProjectsByStatus("submitted")
    const preliminaryApprovedProjects = projectLifecycleStore.getProjectsByStatus("preliminary_approved")
    const expertApprovedProjects = projectLifecycleStore.getProjectsByStatus("expert_approved")

    return (
      <div className="space-y-4">
        <Tabs defaultValue="preliminary">
          <TabsList>
            <TabsTrigger value="preliminary">初审管理</TabsTrigger>
            <TabsTrigger value="expert">专家评审</TabsTrigger>
            <TabsTrigger value="task">任务管理</TabsTrigger>
          </TabsList>

          <TabsContent value="preliminary" className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle>待初审项目</CardTitle>
              </CardHeader>
              <CardContent>
                {submittedProjects.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">暂无待初审项目</p>
                ) : (
                  <div className="space-y-3">
                    {submittedProjects.map((project) => (
                      <Card key={project.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <h4 className="font-semibold">{project.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {project.institution} · {project.leader}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleAction("preliminary_approve", project)}>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              通过
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleAction("preliminary_reject", project)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              驳回
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expert" className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle>专家评审管理</CardTitle>
              </CardHeader>
              <CardContent>
                {preliminaryApprovedProjects.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">暂无需要抽取专家的项目</p>
                ) : (
                  <div className="space-y-3">
                    {preliminaryApprovedProjects.map((project) => (
                      <Card key={project.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <h4 className="font-semibold">{project.name}</h4>
                            <p className="text-sm text-muted-foreground">初审已通过，待抽取专家</p>
                          </div>
                          <Button size="sm" onClick={() => handleAction("draw_experts", project)}>
                            <Users className="h-4 w-4 mr-1" />
                            抽取专家
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="task" className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle>任务下发</CardTitle>
              </CardHeader>
              <CardContent>
                {expertApprovedProjects.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">暂无需要下发任务的项目</p>
                ) : (
                  <div className="space-y-3">
                    {expertApprovedProjects.map((project) => (
                      <Card key={project.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <h4 className="font-semibold">{project.name}</h4>
                            <p className="text-sm text-muted-foreground">专家评审已通过，可以下发任务</p>
                          </div>
                          <Button size="sm" onClick={() => handleAction("issue_task", project)}>
                            <Send className="h-4 w-4 mr-1" />
                            下发任务
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  // 专家端视图
  const ExpertView = () => {
    const expertProjects = projectLifecycleStore.getProjectsForExpert("expert-1")

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>待评审项目</CardTitle>
            <CardDescription>查看并完成分配给您的评审任务</CardDescription>
          </CardHeader>
          <CardContent>
            {expertProjects.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">暂无待评审项目</p>
            ) : (
              <div className="space-y-3">
                {expertProjects.map((project) => (
                  <Card key={project.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold">{project.name}</h4>
                          <Badge>{project.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {project.institution} · {project.leader}
                        </p>
                        <p className="text-sm">预算：{project.budget}万元</p>
                      </div>
                      <div className="flex gap-2">
                        {project.status === "expert_review" && (
                          <Button size="sm" onClick={() => handleAction("expert_review", project)}>
                            开始评审
                          </Button>
                        )}
                        {project.status === "acceptance_expert_review" && (
                          <Button size="sm" onClick={() => handleAction("acceptance_expert_review", project)}>
                            验收评审
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div>
          <h1 className="text-3xl font-bold">项目全生命周期工作流演示</h1>
          <p className="text-muted-foreground mt-2">模拟科研机构端、监管端和专家端的完整项目管理流程</p>
        </div>

        {/* 视图切换 */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Button
                variant={activeView === "institution" ? "default" : "outline"}
                onClick={() => setActiveView("institution")}
              >
                <FileText className="h-4 w-4 mr-2" />
                科研机构端
              </Button>
              <Button
                variant={activeView === "supervisor" ? "default" : "outline"}
                onClick={() => setActiveView("supervisor")}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                监管端
              </Button>
              <Button variant={activeView === "expert" ? "default" : "outline"} onClick={() => setActiveView("expert")}>
                <Users className="h-4 w-4 mr-2" />
                专家端
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 主视图 */}
          <div className="lg:col-span-2">
            {activeView === "institution" && <InstitutionView />}
            {activeView === "supervisor" && <SupervisorView />}
            {activeView === "expert" && <ExpertView />}
          </div>

          {/* 项目详情和时间轴 */}
          <div className="space-y-4">
            {selectedProject && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>项目详情</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground">项目名称</h4>
                      <p>{selectedProject.name}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground">项目编号</h4>
                      <p className="font-mono">{selectedProject.code}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground">当前状态</h4>
                      <Badge className={getStatusColor(selectedProject.status)}>
                        {getStatusLabel(selectedProject.status)}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground">承担单位</h4>
                      <p>{selectedProject.institution}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground">项目负责人</h4>
                      <p>{selectedProject.leader}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground">项目预算</h4>
                      <p>{selectedProject.budget}万元</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>项目进度</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProjectLifecycleTimeline
                      currentStatus={mapToProjectStatus(selectedProject.status)}
                      events={selectedProject.approvalRecords?.map((record: any) => ({
                        status: mapToProjectStatus(selectedProject.status),
                        timestamp: new Date(record.timestamp).toLocaleDateString(),
                        description: `${record.approver} ${record.action === "approved" ? "通过" : "驳回"}`,
                      }))}
                    />
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 工作流对话框 */}
      {dialogOpen && selectedProject && dialogAction && (
        <ProjectWorkflowDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          projectId={selectedProject.id}
          actionType={mapActionType(dialogAction)}
          onSuccess={handleActionSuccess}
        />
      )}
    </div>
  )
}

// 辅助函数
function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    draft: "草稿",
    submitted: "已提交",
    preliminary_approved: "初审通过",
    preliminary_rejected: "初审驳回",
    expert_review: "专家评审中",
    expert_approved: "专家评审通过",
    task_issued: "任务已下发",
    taskbook_uploaded: "任务书已上传",
    in_progress: "项目执行中",
    project_ended: "项目结束",
    acceptance_applied: "验收申请已提交",
    acceptance_expert_review: "验收专家评审中",
    completed: "项目完结",
  }
  return labels[status] || status
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-700",
    submitted: "bg-blue-100 text-blue-700",
    preliminary_approved: "bg-green-100 text-green-700",
    preliminary_rejected: "bg-red-100 text-red-700",
    expert_review: "bg-purple-100 text-purple-700",
    expert_approved: "bg-green-100 text-green-700",
    task_issued: "bg-cyan-100 text-cyan-700",
    in_progress: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-200 text-green-800",
  }
  return colors[status] || "bg-gray-100 text-gray-700"
}

function mapToProjectStatus(status: string): any {
  // Map our custom status to the PROJECT_STATUS enum
  const statusMap: Record<string, string> = {
    draft: "DRAFT",
    submitted: "SUBMITTED",
    preliminary_approved: "PRELIMINARY_APPROVED",
    expert_review: "EXPERT_REVIEWING",
    expert_approved: "APPROVED",
    task_issued: "TASK_ISSUED",
    in_progress: "EXECUTING",
    acceptance_applied: "ACCEPTANCE_APPLYING",
    completed: "COMPLETED",
  }
  return statusMap[status] || "DRAFT"
}

function mapActionType(action: string): any {
  const actionMap: Record<string, string> = {
    submit: "preliminary_approve", // Simplified for demo
    preliminary_approve: "preliminary_approve",
    preliminary_reject: "preliminary_reject",
    draw_experts: "draw_experts",
    expert_review: "expert_review",
    issue_task: "issue_task",
    upload_taskbook: "upload_taskbook",
    submit_midterm: "submit_midterm",
    submit_annual: "submit_annual",
    apply_acceptance: "apply_acceptance",
    acceptance_expert_review: "acceptance_expert_review",
  }
  return actionMap[action] || action
}
