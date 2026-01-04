// 项目生命周期时间轴组件
"use client"

import { CheckCircle, Circle, XCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  PROJECT_STATUS,
  WORKFLOW_STAGES,
  WORKFLOW_STAGE_LABELS,
  getWorkflowStage,
  type ProjectStatus,
  type WorkflowStage,
} from "@/lib/constants/project-workflow"

interface TimelineEvent {
  stage: WorkflowStage
  status: "completed" | "current" | "pending" | "rejected"
  date?: string
  description?: string
}

interface ProjectLifecycleTimelineProps {
  currentStatus: ProjectStatus
  events?: Array<{
    status: ProjectStatus
    timestamp: string
    description?: string
  }>
  className?: string
}

export function ProjectLifecycleTimeline({ currentStatus, events = [], className }: ProjectLifecycleTimelineProps) {
  const currentStage = getWorkflowStage(currentStatus)

  // 定义所有阶段
  const allStages: WorkflowStage[] = [
    WORKFLOW_STAGES.APPLICATION,
    WORKFLOW_STAGES.PRELIMINARY_REVIEW,
    WORKFLOW_STAGES.EXPERT_REVIEW,
    WORKFLOW_STAGES.TASK_ISSUING,
    WORKFLOW_STAGES.TASK_BOOK,
    WORKFLOW_STAGES.EXECUTION,
    WORKFLOW_STAGES.MIDTERM,
    WORKFLOW_STAGES.ANNUAL,
    WORKFLOW_STAGES.ACCEPTANCE,
    WORKFLOW_STAGES.COMPLETED,
  ]

  // 判断阶段状态
  const getStageStatus = (stage: WorkflowStage): "completed" | "current" | "pending" | "rejected" => {
    const currentIndex = allStages.indexOf(currentStage)
    const stageIndex = allStages.indexOf(stage)

    if (currentStatus === PROJECT_STATUS.REJECTED || currentStatus === PROJECT_STATUS.PRELIMINARY_REJECTED) {
      if (stageIndex <= currentIndex) return "rejected"
    }

    if (stageIndex < currentIndex) return "completed"
    if (stageIndex === currentIndex) return "current"
    return "pending"
  }

  // 获取阶段图标
  const getStageIcon = (status: "completed" | "current" | "pending" | "rejected") => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case "current":
        return <Clock className="h-6 w-6 text-blue-500 animate-pulse" />
      case "rejected":
        return <XCircle className="h-6 w-6 text-red-500" />
      default:
        return <Circle className="h-6 w-6 text-gray-300" />
    }
  }

  return (
    <div className={cn("relative", className)}>
      <div className="space-y-6">
        {allStages.map((stage, index) => {
          const status = getStageStatus(stage)
          const isLast = index === allStages.length - 1

          return (
            <div key={stage} className="relative flex items-start gap-4">
              {/* 垂直连接线 */}
              {!isLast && (
                <div
                  className={cn(
                    "absolute left-3 top-8 h-full w-0.5",
                    status === "completed" ? "bg-green-500" : "bg-gray-200",
                  )}
                />
              )}

              {/* 阶段图标 */}
              <div className="relative z-10 flex-shrink-0">{getStageIcon(status)}</div>

              {/* 阶段信息 */}
              <div className="flex-1 pb-6">
                <div className="flex items-center justify-between">
                  <h4
                    className={cn(
                      "font-medium",
                      status === "current" && "text-blue-600",
                      status === "completed" && "text-green-600",
                      status === "rejected" && "text-red-600",
                      status === "pending" && "text-gray-400",
                    )}
                  >
                    {WORKFLOW_STAGE_LABELS[stage]}
                  </h4>

                  {/* 状态标签 */}
                  <span
                    className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      status === "current" && "bg-blue-100 text-blue-700",
                      status === "completed" && "bg-green-100 text-green-700",
                      status === "rejected" && "bg-red-100 text-red-700",
                      status === "pending" && "bg-gray-100 text-gray-500",
                    )}
                  >
                    {status === "current" && "进行中"}
                    {status === "completed" && "已完成"}
                    {status === "rejected" && "已驳回"}
                    {status === "pending" && "待处理"}
                  </span>
                </div>

                {/* 阶段描述或事件 */}
                {events
                  .filter((event) => getWorkflowStage(event.status) === stage)
                  .map((event, eventIndex) => (
                    <div key={eventIndex} className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{event.timestamp}</span>
                        {event.description && <span className="text-gray-500">{event.description}</span>}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
