"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { projectApi } from "@/lib/api/project"
import { CheckCircle, XCircle, User, Clock, FileText, Download } from "lucide-react"
import { getStatusText } from "@/lib/utils/status-maps"
import { PageHeader } from "@/components/page-header"

export default function PreliminaryReviewDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [project, setProject] = useState<any>(null)
  const [experts, setExperts] = useState<any[]>([])
  const [leaderConclusion, setLeaderConclusion] = useState<any>(null)
  const [timeline, setTimeline] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState("")
  const [reason, setReason] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadProjectData()
  }, [params.id])

  const loadProjectData = async () => {
    try {
      setLoading(true)
      const projectResponse = await projectApi.getById(Number(params.id))

      if (!projectResponse.data) {
        toast({
          title: "项目不存在",
          description: "无法找到该项目信息，请检查项目ID是否正确",
          variant: "destructive",
        })
        setProject(null)
        setLoading(false)
        return
      }

      setProject(projectResponse.data)

      let workflowHistory: any[] = []
      try {
        const historyResponse = await projectApi.getWorkflowHistory(Number(params.id))
        if (historyResponse.data && Array.isArray(historyResponse.data)) {
          workflowHistory = historyResponse.data
          console.log(`[v0] Loaded ${workflowHistory.length} workflow history records`)
        }
      } catch (error) {
        console.log("[v0] No workflow history found")
      }

      let assignedExperts: any[] = []
      try {
        const expertReviewResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL || ""}/expert-reviews/project/${projectResponse.data.id}`,
        )

        if (expertReviewResponse.ok) {
          const expertReviewData = await expertReviewResponse.json()
          if (expertReviewData.data && expertReviewData.data.length > 0) {
            assignedExperts = expertReviewData.data
            setExperts(assignedExperts)
            console.log(`[v0] Loaded ${assignedExperts.length} expert assignments`)
          }
        }
      } catch (error) {
        console.log("[v0] No expert review data found")
      }

      let conclusion: any = null
      try {
        const conclusionResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL || ""}/expert-leaders/project/${projectResponse.data.id}`,
        )

        if (conclusionResponse.ok) {
          const conclusionData = await conclusionResponse.json()
          if (conclusionData.data && conclusionData.data.conclusionStatus === "uploaded") {
            conclusion = conclusionData.data
            setLeaderConclusion(conclusion)
            console.log("[v0] Loaded leader conclusion:", conclusion)
          }
        }
      } catch (error) {
        console.log("[v0] No leader conclusion found")
      }

      const timelineData = []

      // Step 1: Project submission - from workflow history or project data
      const submitRecord = workflowHistory.find((h) => h.stage === "submitted" || h.action === "submit")
      if (submitRecord) {
        timelineData.push({
          title: "项目提交",
          person: submitRecord.operatorName || projectResponse.data.leaderName || "申报单位",
          time: submitRecord.operateTime || projectResponse.data.submitTime || projectResponse.data.createTime,
          status: "completed",
          comment: submitRecord.comment || "项目已提交，等待初审",
        })
      } else if (projectResponse.data.submitTime || projectResponse.data.createTime) {
        timelineData.push({
          title: "项目提交",
          person: projectResponse.data.leaderName || "申报单位",
          time: projectResponse.data.submitTime || projectResponse.data.createTime,
          status: "completed",
          comment: "项目已提交，等待初审",
        })
      }

      // Step 2: Initial review - from workflow history or project data
      const reviewRecord = workflowHistory.find(
        (h) => h.stage === "preliminary_approved" || h.action === "preliminary_review",
      )
      if (reviewRecord) {
        timelineData.push({
          title: "初审通过",
          person: reviewRecord.operatorName || "监管部门",
          time: reviewRecord.operateTime || projectResponse.data.auditTime,
          status: "completed",
          comment: reviewRecord.comment || projectResponse.data.auditComment || "初审通过，进入专家评审阶段",
        })
      } else if (projectResponse.data.auditTime) {
        timelineData.push({
          title: "初审通过",
          person: projectResponse.data.auditBy || "监管部门",
          time: projectResponse.data.auditTime,
          status: "completed",
          comment: projectResponse.data.auditComment || "初审通过，进入专家评审阶段",
        })
      }

      // Step 3: Expert assignment
      if (assignedExperts.length > 0) {
        const assignmentTime =
          assignedExperts[0]?.createTime || assignedExperts[0]?.assignTime || new Date().toLocaleString()

        const expertList = assignedExperts.map((expert: any) => ({
          name: expert.expertName || expert.name || "-",
          title: expert.expertTitle || expert.title || expert.specialty || "-",
          major: expert.researchField || expert.major || "-",
        }))

        const drawRecord = workflowHistory.find((h) => h.action === "draw_experts")
        timelineData.push({
          title: "专家抽取完成",
          person: drawRecord?.operatorName || "系统",
          time: drawRecord?.operateTime || assignmentTime,
          status: "completed",
          comment: `已抽取${expertList.length}位专家进行评审`,
          experts: expertList,
        })
      }

      // Step 4: Expert review completion
      if (conclusion && conclusion.conclusionStatus === "uploaded") {
        timelineData.push({
          title: "专家评审完成",
          person: conclusion.expertName || "专家组长",
          time: conclusion.conclusionUploadTime || conclusion.updateTime,
          status: "completed",
          comment: conclusion.conclusionContent || "专家评审结论已上传",
          conclusion: conclusion.conclusionContent,
          conclusionFile: conclusion.conclusionFileUrl,
          expertName: conclusion.expertName,
        })
      }

      // Step 5: Final review status
      const hasExperts = assignedExperts.length > 0
      const hasConclusion = conclusion && conclusion.conclusionStatus === "uploaded"

      if (
        projectResponse.data.status === "preliminary_review_pending" ||
        projectResponse.data.status === "preliminary_review_passed" ||
        projectResponse.data.status === "preliminary_review_failed" ||
        projectResponse.data.status === "preliminary_approved"
      ) {
        let statusTitle = "立项评审中"
        let statusType = "pending"
        let statusPerson = "待审核"
        let statusComment = ""

        if (!hasExperts) {
          statusTitle = "待专家抽取"
          statusType = "pending"
          statusPerson = "监管部门"
          statusComment = "等待抽取评审专家"
        } else if (!hasConclusion) {
          statusTitle = "专家评审中"
          statusType = "pending"
          statusPerson = "专家组"
          statusComment = "等待专家组长提交评审结论"
        } else if (
          projectResponse.data.status === "preliminary_review_passed" ||
          projectResponse.data.status === "preliminary_approved"
        ) {
          statusTitle = "立项评审通过"
          statusType = "completed"
          statusPerson = projectResponse.data.auditBy || "监管部门"
          statusComment = projectResponse.data.auditComment || "立项评审通过，准备下发任务书"
        } else if (projectResponse.data.status === "preliminary_review_failed") {
          statusTitle = "立项评审未通过"
          statusType = "failed"
          statusPerson = projectResponse.data.auditBy || "监管部门"
          statusComment = projectResponse.data.rejectReason || projectResponse.data.auditComment || "立项评审未通过"
        }

        timelineData.push({
          title: statusTitle,
          person: statusPerson,
          time: statusType !== "pending" ? projectResponse.data.auditTime : null,
          status: statusType,
          comment: statusComment,
        })
      }

      setTimeline(timelineData)
    } catch (error) {
      console.error("[v0] Failed to load project:", error)
      toast({
        title: "加载失败",
        description: "系统异常，请联系管理员",
        variant: "destructive",
      })
      setProject(null)
    } finally {
      setLoading(false)
    }
  }

  const handlePass = async () => {
    if (!comment.trim()) {
      toast({
        title: "请输入评审意见",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      await projectApi.preliminaryReviewPass(Number(params.id), comment)
      toast({
        title: "评审通过",
        description: "立项评审已通过",
      })
      router.push("/supervisor/review")
    } catch (error) {
      toast({
        title: "操作失败",
        description: "立项评审通过失败",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleFail = async () => {
    if (!reason.trim()) {
      toast({
        title: "请输入未通过原因",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      await projectApi.preliminaryReviewFail(Number(params.id), reason)
      toast({
        title: "评审未通过",
        description: "立项评审已标记为未通过",
      })
      router.push("/supervisor/review")
    } catch (error) {
      toast({
        title: "操作失败",
        description: "立项评审未通过操作失败",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusText = getStatusText(status, "review")
    const color =
      status.includes("passed") || status.includes("approved")
        ? "green"
        : status.includes("failed") || status.includes("rejected")
          ? "red"
          : "yellow"

    return (
      <Badge variant="outline" className={`bg-${color}-50 text-${color}-700 border-${color}-200`}>
        {statusText}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">加载中...</div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="p-6">
        <div className="text-center py-8">项目不存在</div>
      </div>
    )
  }

  const isPending = project.status === "preliminary_review_pending"

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="立项评审详情"
        description="查看项目详情和评审信息"
        showBack
        backUrl="/supervisor/review"
        actions={getStatusBadge(project.status)}
      />

      <Card>
        <CardHeader>
          <CardTitle>项目基本信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">项目名称</Label>
              <p className="font-medium mt-1">{project.name || project.projectName || "-"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">项目编号</Label>
              <p className="font-medium mt-1">{project.projectNo || "-"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">项目类型</Label>
              <p className="font-medium mt-1">{project.projectType || "-"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">项目负责人</Label>
              <p className="font-medium mt-1">{project.leaderName || "-"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">承担单位</Label>
              <p className="font-medium mt-1">{project.institutionName || "-"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">项目周期</Label>
              <p className="font-medium mt-1">
                {project.startDate || "-"} 至 {project.endDate || "-"}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <Label className="text-muted-foreground">项目目标</Label>
            <p className="mt-1 leading-relaxed">{project.objective || project.goal || "-"}</p>
          </div>

          <div>
            <Label className="text-muted-foreground">项目内容</Label>
            <p className="mt-1 leading-relaxed">{project.content || project.description || "-"}</p>
          </div>

          <div>
            <Label className="text-muted-foreground">预期成果</Label>
            <p className="mt-1 leading-relaxed">{project.expectedResult || project.expectedResults || "-"}</p>
          </div>
        </CardContent>
      </Card>

      {leaderConclusion && leaderConclusion.conclusionStatus === "uploaded" && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              <CardTitle className="text-green-900">专家组长评审结论</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">组长</Label>
                <p className="font-medium mt-1">{leaderConclusion.expertName || "-"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">上传时间</Label>
                <p className="font-medium mt-1">{leaderConclusion.conclusionUploadTime || "-"}</p>
              </div>
            </div>

            <Separator />

            <div>
              <Label className="text-muted-foreground">评审结论</Label>
              <div className="mt-2 p-4 bg-white rounded-lg border">
                <p className="leading-relaxed whitespace-pre-wrap">{leaderConclusion.conclusionContent || "-"}</p>
              </div>
            </div>

            {leaderConclusion.conclusionFileUrl && (
              <div>
                <Label className="text-muted-foreground">附件</Label>
                <a
                  href={leaderConclusion.conclusionFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex items-center gap-2 text-primary hover:underline"
                >
                  <Download className="h-4 w-4" />
                  下载评审结论文件
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>评审流程</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {timeline.map((step, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex flex-col items-center">
                {step.status === "completed" ? (
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                ) : step.status === "failed" ? (
                  <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-yellow-500 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-yellow-500" />
                  </div>
                )}
                {index < timeline.length - 1 && <div className="w-0.5 h-12 bg-border mt-2" />}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium">{step.title}</p>
                  {step.person && (
                    <Badge variant="secondary" className="text-xs">
                      <User className="h-3 w-3 mr-1" />
                      {step.person}
                    </Badge>
                  )}
                  {step.time && (
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {step.time}
                    </Badge>
                  )}
                </div>

                {step.comment && <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{step.comment}</p>}

                {step.experts && step.experts.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-muted-foreground font-medium">抽取专家:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {step.experts.map((expert: any, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {expert.name} - {expert.title || expert.major}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {step.conclusion && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md space-y-2">
                    <p className="text-sm font-medium text-green-900">评审意见:</p>
                    <p className="text-sm leading-relaxed text-foreground">{step.conclusion}</p>
                    {step.conclusionFile && (
                      <a
                        href={step.conclusionFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        <Download className="h-3 w-3" />
                        查看评审结论文件
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {isPending && (
        <Card>
          <CardHeader>
            <CardTitle>评审决策</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>通过意见</Label>
              <Textarea
                placeholder="请输入立项评审通过意见..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>未通过原因</Label>
              <Textarea
                placeholder="请输入立项评审未通过原因..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={handlePass}
                disabled={submitting || !comment.trim()}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                评审通过
              </Button>
              <Button onClick={handleFail} disabled={submitting || !reason.trim()} variant="destructive">
                <XCircle className="h-4 w-4 mr-2" />
                评审未通过
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
