// 项目工作流操作对话框组件
"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { projectLifecycleStore } from "@/lib/project-lifecycle-store"

interface ProjectWorkflowDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  actionType:
    | "preliminary_approve"
    | "preliminary_reject"
    | "draw_experts"
    | "expert_review"
    | "issue_task"
    | "upload_taskbook"
    | "review_taskbook_institution"
    | "review_taskbook_supervisor"
    | "submit_midterm"
    | "review_midterm"
    | "submit_annual"
    | "review_annual"
    | "apply_acceptance"
    | "approve_acceptance"
    | "draw_acceptance_experts"
    | "acceptance_expert_review"
  onSuccess?: () => void
}

export function ProjectWorkflowDialog({
  open,
  onOpenChange,
  projectId,
  actionType,
  onSuccess,
}: ProjectWorkflowDialogProps) {
  const { toast } = useToast()
  const [comments, setComments] = useState("")
  const [score, setScore] = useState(85)
  const [materials, setMaterials] = useState("")
  const [taskBookContent, setTaskBookContent] = useState("")

  const getDialogConfig = () => {
    switch (actionType) {
      case "preliminary_approve":
        return {
          title: "初审通过",
          description: "确认通过初审？可填写审批意见（选填）",
          showComments: true,
          requireComments: false,
        }
      case "preliminary_reject":
        return {
          title: "初审驳回",
          description: "请填写驳回原因",
          showComments: true,
          requireComments: true,
        }
      case "draw_experts":
        return {
          title: "抽取专家",
          description: "系统将随机抽取3位专家进行评审",
          showComments: false,
          requireComments: false,
        }
      case "expert_review":
        return {
          title: "专家评审",
          description: "请填写评审意见和评分",
          showComments: true,
          showScore: true,
          requireComments: true,
        }
      case "issue_task":
        return {
          title: "下发任务",
          description: "确认向科研机构下发项目任务？",
          showComments: false,
          requireComments: false,
        }
      case "upload_taskbook":
        return {
          title: "上传任务书",
          description: "请填写任务书内容",
          showTaskBookContent: true,
          requireComments: true,
        }
      case "review_taskbook_institution":
      case "review_taskbook_supervisor":
        return {
          title: "审核任务书",
          description: "请审核任务书并填写审核意见",
          showComments: true,
          requireComments: false,
        }
      case "submit_midterm":
        return {
          title: "提交中期检查",
          description: "请上传中期检查材料",
          showMaterials: true,
          requireComments: true,
        }
      case "review_midterm":
        return {
          title: "审查中期检查",
          description: "请填写审查意见",
          showComments: true,
          requireComments: true,
        }
      case "submit_annual":
        return {
          title: "提交年度检查",
          description: "请上传年度检查材料",
          showMaterials: true,
          requireComments: true,
        }
      case "review_annual":
        return {
          title: "审查年度检查",
          description: "请填写审查意见",
          showComments: true,
          requireComments: true,
        }
      case "apply_acceptance":
        return {
          title: "申请验收",
          description: "确认提交验收申请？",
          showComments: false,
          requireComments: false,
        }
      case "approve_acceptance":
        return {
          title: "批准验收申请",
          description: "确认批准验收申请？",
          showComments: false,
          requireComments: false,
        }
      case "draw_acceptance_experts":
        return {
          title: "抽取验收专家",
          description: "系统将随机抽取5位专家进行验收评审",
          showComments: false,
          requireComments: false,
        }
      case "acceptance_expert_review":
        return {
          title: "验收评审",
          description: "请填写验收评审意见和评分",
          showComments: true,
          showScore: true,
          requireComments: true,
        }
      default:
        return {
          title: "操作确认",
          description: "确认执行此操作？",
          showComments: false,
          requireComments: false,
        }
    }
  }

  const config = getDialogConfig()

  const handleConfirm = () => {
    if (config.requireComments && !comments.trim() && !materials.trim() && !taskBookContent.trim()) {
      toast({
        title: "操作失败",
        description: "请填写必填项",
        variant: "destructive",
      })
      return
    }

    try {
      const currentUser = "当前用户" // In real app, get from auth context

      switch (actionType) {
        case "preliminary_approve":
          projectLifecycleStore.preliminaryApprove(projectId, currentUser, comments)
          break
        case "preliminary_reject":
          projectLifecycleStore.preliminaryReject(projectId, currentUser, comments)
          break
        case "draw_experts":
          projectLifecycleStore.drawExperts(projectId, 3)
          break
        case "expert_review":
          projectLifecycleStore.submitExpertReview(
            projectId,
            "expert-1", // In real app, get from auth context
            currentUser,
            score,
            comments,
            score >= 60 ? "approved" : "rejected",
          )
          break
        case "issue_task":
          projectLifecycleStore.issueTask(projectId)
          break
        case "upload_taskbook":
          projectLifecycleStore.uploadTaskBook(projectId, taskBookContent)
          break
        case "review_taskbook_institution":
          projectLifecycleStore.reviewTaskBookByInstitution(
            projectId,
            currentUser,
            comments.includes("通过") || comments.includes("同意"),
          )
          break
        case "review_taskbook_supervisor":
          projectLifecycleStore.reviewTaskBookBySupervisor(
            projectId,
            currentUser,
            comments.includes("通过") || comments.includes("同意"),
          )
          break
        case "submit_midterm":
          projectLifecycleStore.submitMidtermCheck(projectId, materials.split("\n").filter(Boolean))
          break
        case "review_midterm":
          projectLifecycleStore.reviewMidtermCheck(
            projectId,
            "midterm-1", // In real app, get from project
            currentUser,
            comments.includes("通过") || comments.includes("同意"),
            comments,
          )
          break
        case "submit_annual":
          projectLifecycleStore.submitAnnualCheck(projectId, materials.split("\n").filter(Boolean))
          break
        case "review_annual":
          projectLifecycleStore.reviewAnnualCheck(
            projectId,
            "annual-1", // In real app, get from project
            currentUser,
            comments.includes("通过") || comments.includes("同意"),
            comments,
          )
          break
        case "apply_acceptance":
          projectLifecycleStore.applyForAcceptance(projectId)
          break
        case "approve_acceptance":
          projectLifecycleStore.approveAcceptanceApplication(projectId)
          break
        case "draw_acceptance_experts":
          projectLifecycleStore.drawAcceptanceExperts(projectId, 5)
          break
        case "acceptance_expert_review":
          projectLifecycleStore.submitAcceptanceExpertReview(
            projectId,
            "expert-1", // In real app, get from auth context
            currentUser,
            score,
            comments,
            score >= 60 ? "approved" : "rejected",
          )
          break
      }

      toast({
        title: "操作成功",
        description: "操作已完成",
      })

      onOpenChange(false)
      onSuccess?.()

      // Reset form
      setComments("")
      setScore(85)
      setMaterials("")
      setTaskBookContent("")
    } catch (error) {
      toast({
        title: "操作失败",
        description: "操作执行失败，请重试",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {config.showScore && (
            <div className="space-y-2">
              <Label>评分 (0-100分)</Label>
              <input
                type="number"
                min="0"
                max="100"
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          )}

          {config.showComments && (
            <div className="space-y-2">
              <Label>{config.requireComments ? "意见（必填）" : "意见（选填）"}</Label>
              <Textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="请输入意见..."
                rows={5}
              />
            </div>
          )}

          {config.showMaterials && (
            <div className="space-y-2">
              <Label>材料清单（每行一个文件名）</Label>
              <Textarea
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
                placeholder="例如：&#10;中期检查报告.pdf&#10;项目进展说明.docx&#10;相关附件.zip"
                rows={5}
              />
            </div>
          )}

          {config.showTaskBookContent && (
            <div className="space-y-2">
              <Label>任务书内容</Label>
              <Textarea
                value={taskBookContent}
                onChange={(e) => setTaskBookContent(e.target.value)}
                placeholder="请输入任务书内容..."
                rows={8}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleConfirm}>确认</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
