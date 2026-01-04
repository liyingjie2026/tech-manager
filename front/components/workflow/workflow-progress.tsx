"use client"

import { Check, Circle, Clock, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type WorkflowStage =
  | "demand" // 需求征集
  | "market" // 检查市场
  | "config" // 配置管理
  | "application" // 项目申报
  | "review" // 批次设置
  | "expert_review" // 立项评审（专家评审）
  | "taskbook_sign" // 任务书签订
  | "taskbook_wbs" // 任务书WBS
  | "research" // 在研管理
  | "midterm" // 中期检查
  | "annual" // 年度检查
  | "target_change" // 项目变更
  | "acceptance" // 验收评审
  | "achievement" // 项目验收
  | "sharing" // 成果资源共享

export type StageStatus = "completed" | "inProgress" | "pending" | "rejected"

interface WorkflowStageInfo {
  id: WorkflowStage
  label: string
  description: string
  category: "preparation" | "application" | "execution" | "completion"
}

const WORKFLOW_STAGES: WorkflowStageInfo[] = [
  { id: "demand", label: "需求征集", description: "收集研究需求", category: "preparation" },
  { id: "market", label: "检查市场", description: "市场调研分析", category: "preparation" },
  { id: "config", label: "配置管理", description: "配置项目资源", category: "preparation" },
  { id: "application", label: "项目申报", description: "提交项目申请", category: "application" },
  { id: "review", label: "批次设置", description: "设置审批批次", category: "application" },
  { id: "expert_review", label: "立项评审", description: "专家评审论证", category: "application" },
  { id: "taskbook_sign", label: "任务书签订", description: "签署研究任务书", category: "execution" },
  { id: "taskbook_wbs", label: "任务书WBS", description: "任务工作分解", category: "execution" },
  { id: "research", label: "在研管理", description: "项目执行管理", category: "execution" },
  { id: "midterm", label: "中期检查", description: "中期进展检查", category: "execution" },
  { id: "annual", label: "年度检查", description: "年度工作检查", category: "execution" },
  { id: "target_change", label: "项目变更", description: "目标变更申请", category: "execution" },
  { id: "acceptance", label: "验收评审", description: "专家验收评审", category: "completion" },
  { id: "achievement", label: "项目验收", description: "最终项目验收", category: "completion" },
  { id: "sharing", label: "成果共享", description: "资源共享发布", category: "completion" },
]

interface WorkflowProgressProps {
  currentStage: WorkflowStage
  stageStatuses: Partial<Record<WorkflowStage, StageStatus>>
  onStageClick?: (stage: WorkflowStage) => void
  compact?: boolean
}

export function WorkflowProgress({
  currentStage,
  stageStatuses,
  onStageClick,
  compact = false,
}: WorkflowProgressProps) {
  const currentIndex = WORKFLOW_STAGES.findIndex((s) => s.id === currentStage)

  const getStageStatus = (stage: WorkflowStage, index: number): StageStatus => {
    if (stageStatuses[stage]) return stageStatuses[stage]!
    if (index < currentIndex) return "completed"
    if (index === currentIndex) return "inProgress"
    return "pending"
  }

  const getStatusIcon = (status: StageStatus) => {
    switch (status) {
      case "completed":
        return <Check className="w-4 h-4 text-white" />
      case "inProgress":
        return <Clock className="w-4 h-4 text-white" />
      case "rejected":
        return <AlertCircle className="w-4 h-4 text-white" />
      default:
        return <Circle className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: StageStatus) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "inProgress":
        return "bg-blue-500"
      case "rejected":
        return "bg-red-500"
      default:
        return "bg-gray-300"
    }
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {WORKFLOW_STAGES.map((stage, index) => {
          const status = getStageStatus(stage.id, index)
          return (
            <div key={stage.id} className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onStageClick?.(stage.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors",
                  status === "completed" && "bg-green-50 text-green-700 hover:bg-green-100",
                  status === "inProgress" && "bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium",
                  status === "rejected" && "bg-red-50 text-red-700 hover:bg-red-100",
                  status === "pending" && "bg-gray-50 text-gray-500 hover:bg-gray-100",
                )}
              >
                <div className={cn("w-5 h-5 rounded-full flex items-center justify-center", getStatusColor(status))}>
                  {getStatusIcon(status)}
                </div>
                {stage.label}
              </button>
              {index < WORKFLOW_STAGES.length - 1 && <div className="w-8 h-0.5 bg-gray-200" />}
            </div>
          )
        })}
      </div>
    )
  }

  const categories = ["preparation", "application", "execution", "completion"] as const
  const categoryLabels = {
    preparation: "前期准备",
    application: "申报审批",
    execution: "执行管理",
    completion: "验收结项",
  }

  return (
    <div className="space-y-6">
      {categories.map((category) => {
        const categoryStages = WORKFLOW_STAGES.filter((s) => s.category === category)
        return (
          <div key={category}>
            <h3 className="text-sm font-medium text-gray-700 mb-3">{categoryLabels[category]}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categoryStages.map((stage, index) => {
                const globalIndex = WORKFLOW_STAGES.findIndex((s) => s.id === stage.id)
                const status = getStageStatus(stage.id, globalIndex)
                return (
                  <Card
                    key={stage.id}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md",
                      status === "completed" && "border-green-200 bg-green-50/50",
                      status === "inProgress" && "border-blue-500 bg-blue-50 shadow-sm",
                      status === "rejected" && "border-red-200 bg-red-50/50",
                      status === "pending" && "border-gray-200 opacity-60",
                    )}
                    onClick={() => onStageClick?.(stage.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                            getStatusColor(status),
                          )}
                        >
                          {getStatusIcon(status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4
                            className={cn(
                              "font-medium text-sm mb-1",
                              status === "inProgress" && "text-blue-900",
                              status === "completed" && "text-green-900",
                              status === "rejected" && "text-red-900",
                              status === "pending" && "text-gray-600",
                            )}
                          >
                            {stage.label}
                          </h4>
                          <p className="text-xs text-gray-500 line-clamp-2">{stage.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
