"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, CheckCircle, XCircle, FileText, UserCheck, Clock, RotateCcw, Save } from "lucide-react"
import type { WorkflowStage } from "./workflow-progress"

interface WorkflowAction {
  id: string
  label: string
  icon: React.ReactNode
  variant: "default" | "outline" | "destructive" | "secondary"
  nextStage?: WorkflowStage
  requiresConfirmation?: boolean
}

interface WorkflowActionsProps {
  currentStage: WorkflowStage
  userRole: "institution" | "supervisor" | "expert"
  projectStatus?: string
  onSubmit?: () => void
  onSaveDraft?: () => void
  onApprove?: () => void
  onReject?: () => void
  loading?: boolean
}

const STAGE_ACTIONS: Record<WorkflowStage, Record<string, WorkflowAction[]>> = {
  demand: {
    institution: [
      { id: "submit", label: "提交需求", icon: <Send className="w-4 h-4" />, variant: "default" },
      { id: "save_draft", label: "保存草稿", icon: <Save className="w-4 h-4" />, variant: "outline" },
    ],
    supervisor: [
      { id: "review", label: "审核需求", icon: <CheckCircle className="w-4 h-4" />, variant: "default" },
      { id: "reject", label: "驳回", icon: <XCircle className="w-4 h-4" />, variant: "destructive" },
    ],
    expert: [],
  },
  market: {
    institution: [],
    supervisor: [
      { id: "approve", label: "通过检查", icon: <CheckCircle className="w-4 h-4" />, variant: "default" },
      { id: "reject", label: "不予通过", icon: <XCircle className="w-4 h-4" />, variant: "destructive" },
    ],
    expert: [],
  },
  config: {
    institution: [],
    supervisor: [{ id: "configure", label: "完成配置", icon: <CheckCircle className="w-4 h-4" />, variant: "default" }],
    expert: [],
  },
  application: {
    institution: [
      {
        id: "submit",
        label: "提交申报",
        icon: <Send className="w-4 h-4" />,
        variant: "default",
        requiresConfirmation: true,
      },
      { id: "save_draft", label: "保存草稿", icon: <Save className="w-4 h-4" />, variant: "outline" },
      { id: "preview", label: "预览", icon: <FileText className="w-4 h-4" />, variant: "secondary" },
    ],
    supervisor: [],
    expert: [],
  },
  review: {
    institution: [],
    supervisor: [
      { id: "approve", label: "审核通过", icon: <CheckCircle className="w-4 h-4" />, variant: "default" },
      { id: "reject", label: "审核退回", icon: <RotateCcw className="w-4 h-4" />, variant: "destructive" },
      { id: "assign_expert", label: "分配专家", icon: <UserCheck className="w-4 h-4" />, variant: "secondary" },
    ],
    expert: [],
  },
  expert_review: {
    institution: [],
    supervisor: [{ id: "publish", label: "发布评审", icon: <Send className="w-4 h-4" />, variant: "default" }],
    expert: [
      {
        id: "submit_review",
        label: "提交评审意见",
        icon: <Send className="w-4 h-4" />,
        variant: "default",
        requiresConfirmation: true,
      },
      { id: "save_draft", label: "保存草稿", icon: <Save className="w-4 h-4" />, variant: "outline" },
    ],
  },
  taskbook_sign: {
    institution: [
      {
        id: "sign",
        label: "签署任务书",
        icon: <CheckCircle className="w-4 h-4" />,
        variant: "default",
        requiresConfirmation: true,
      },
      { id: "view_wbs", label: "查看任务分解", icon: <FileText className="w-4 h-4" />, variant: "outline" },
    ],
    supervisor: [
      { id: "approve_taskbook", label: "批准任务书", icon: <CheckCircle className="w-4 h-4" />, variant: "default" },
    ],
    expert: [],
  },
  taskbook_wbs: {
    institution: [
      { id: "submit_wbs", label: "提交WBS", icon: <Send className="w-4 h-4" />, variant: "default" },
      { id: "edit_wbs", label: "编辑WBS", icon: <FileText className="w-4 h-4" />, variant: "outline" },
    ],
    supervisor: [
      { id: "approve_wbs", label: "批准WBS", icon: <CheckCircle className="w-4 h-4" />, variant: "default" },
    ],
    expert: [],
  },
  research: {
    institution: [
      { id: "report_progress", label: "上报进展", icon: <Send className="w-4 h-4" />, variant: "default" },
      { id: "request_change", label: "申请变更", icon: <FileText className="w-4 h-4" />, variant: "outline" },
    ],
    supervisor: [
      { id: "schedule_midterm", label: "安排中期检查", icon: <Clock className="w-4 h-4" />, variant: "default" },
    ],
    expert: [],
  },
  midterm: {
    institution: [
      {
        id: "submit_report",
        label: "提交中期报告",
        icon: <Send className="w-4 h-4" />,
        variant: "default",
        requiresConfirmation: true,
      },
    ],
    supervisor: [
      { id: "approve", label: "通过检查", icon: <CheckCircle className="w-4 h-4" />, variant: "default" },
      { id: "require_improvement", label: "要求整改", icon: <RotateCcw className="w-4 h-4" />, variant: "destructive" },
    ],
    expert: [{ id: "submit_review", label: "提交评审意见", icon: <Send className="w-4 h-4" />, variant: "default" }],
  },
  annual: {
    institution: [
      {
        id: "submit_report",
        label: "提交年度报告",
        icon: <Send className="w-4 h-4" />,
        variant: "default",
        requiresConfirmation: true,
      },
    ],
    supervisor: [
      { id: "approve", label: "通过检查", icon: <CheckCircle className="w-4 h-4" />, variant: "default" },
      { id: "require_improvement", label: "要求整改", icon: <RotateCcw className="w-4 h-4" />, variant: "destructive" },
    ],
    expert: [],
  },
  target_change: {
    institution: [
      {
        id: "submit_change",
        label: "提交变更申请",
        icon: <Send className="w-4 h-4" />,
        variant: "default",
        requiresConfirmation: true,
      },
    ],
    supervisor: [
      { id: "approve_change", label: "批准变更", icon: <CheckCircle className="w-4 h-4" />, variant: "default" },
      { id: "reject_change", label: "驳回变更", icon: <XCircle className="w-4 h-4" />, variant: "destructive" },
    ],
    expert: [],
  },
  acceptance: {
    institution: [
      {
        id: "apply_acceptance",
        label: "申请验收",
        icon: <Send className="w-4 h-4" />,
        variant: "default",
        requiresConfirmation: true,
      },
    ],
    supervisor: [
      { id: "publish_acceptance", label: "发布验收评审", icon: <Send className="w-4 h-4" />, variant: "default" },
    ],
    expert: [
      {
        id: "submit_review",
        label: "提交验收意见",
        icon: <Send className="w-4 h-4" />,
        variant: "default",
        requiresConfirmation: true,
      },
    ],
  },
  achievement: {
    institution: [
      { id: "submit_materials", label: "提交验收材料", icon: <FileText className="w-4 h-4" />, variant: "default" },
    ],
    supervisor: [
      {
        id: "approve_acceptance",
        label: "通过验收",
        icon: <CheckCircle className="w-4 h-4" />,
        variant: "default",
        requiresConfirmation: true,
      },
      { id: "reject", label: "不予通过", icon: <XCircle className="w-4 h-4" />, variant: "destructive" },
    ],
    expert: [],
  },
  sharing: {
    institution: [
      { id: "upload_results", label: "上传成果", icon: <Send className="w-4 h-4" />, variant: "default" },
      { id: "view_shared", label: "查看共享资源", icon: <FileText className="w-4 h-4" />, variant: "outline" },
    ],
    supervisor: [
      { id: "publish_sharing", label: "发布共享资源", icon: <Send className="w-4 h-4" />, variant: "default" },
      { id: "approve_results", label: "审核成果", icon: <CheckCircle className="w-4 h-4" />, variant: "secondary" },
    ],
    expert: [],
  },
}

export function WorkflowActions({
  currentStage,
  userRole,
  projectStatus = "draft",
  onSubmit,
  onSaveDraft,
  onApprove,
  onReject,
  loading = false,
}: WorkflowActionsProps) {
  const actions = STAGE_ACTIONS[currentStage]?.[userRole] || []

  if (actions.length === 0) {
    return null
  }

  const handleAction = (action: WorkflowAction) => {
    if (action.id === "submit" && onSubmit) {
      onSubmit()
    } else if (action.id === "save_draft" && onSaveDraft) {
      onSaveDraft()
    } else if (action.id === "approve" && onApprove) {
      onApprove()
    } else if (action.id === "reject" && onReject) {
      onReject()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">可执行操作</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {actions.map((action) => (
            <Button
              key={action.id}
              variant={action.variant}
              onClick={() => handleAction(action)}
              disabled={loading}
              className="gap-2"
            >
              {action.icon}
              {action.label}
            </Button>
          ))}
        </div>
        {projectStatus && (
          <p className="text-sm text-muted-foreground mt-4">
            当前状态:{" "}
            <span className="font-medium">
              {projectStatus === "draft" ? "草稿" : projectStatus === "pending" ? "待审核" : "已审核"}
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  )
}
