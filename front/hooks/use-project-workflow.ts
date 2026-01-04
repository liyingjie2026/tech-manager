// 项目工作流管理Hook
"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"
import { PROJECT_STATUS, canTransitionTo, type ProjectStatus } from "@/lib/constants/project-workflow"

interface UseProjectWorkflowOptions {
  projectId: string
  currentStatus: ProjectStatus
  onStatusChange?: (newStatus: ProjectStatus) => void
}

export function useProjectWorkflow({ projectId, currentStatus, onStatusChange }: UseProjectWorkflowOptions) {
  const [isLoading, setIsLoading] = useState(false)

  const submitApplication = useCallback(async () => {
    if (!canTransitionTo(currentStatus, PROJECT_STATUS.SUBMITTED)) {
      toast.error("当前状态不允许提交申报")
      return false
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/submit`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("提交失败")

      toast.success("项目申报提交成功")
      onStatusChange?.(PROJECT_STATUS.SUBMITTED)
      return true
    } catch (error) {
      toast.error("提交失败，请重试")
      return false
    } finally {
      setIsLoading(false)
    }
  }, [projectId, currentStatus, onStatusChange])

  const preliminaryReview = useCallback(
    async (approved: boolean, comment: string) => {
      if (
        !canTransitionTo(
          currentStatus,
          approved ? PROJECT_STATUS.PRELIMINARY_APPROVED : PROJECT_STATUS.PRELIMINARY_REJECTED,
        )
      ) {
        toast.error("当前状态不允许初审")
        return false
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/projects/${projectId}/preliminary-review`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ approved, comment }),
        })

        if (!response.ok) throw new Error("初审失败")

        toast.success(approved ? "初审通过" : "初审驳回")
        onStatusChange?.(approved ? PROJECT_STATUS.PRELIMINARY_APPROVED : PROJECT_STATUS.PRELIMINARY_REJECTED)
        return true
      } catch (error) {
        toast.error("初审操作失败，请重试")
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [projectId, currentStatus, onStatusChange],
  )

  const drawExpertsAndStartReview = useCallback(
    async (expertIds: string[]) => {
      if (!canTransitionTo(currentStatus, PROJECT_STATUS.EXPERT_REVIEWING)) {
        toast.error("当前状态不允许抽取专家")
        return false
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/projects/${projectId}/draw-experts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ expertIds }),
        })

        if (!response.ok) throw new Error("专家抽取失败")

        toast.success("专家抽取成功，已开始专家评审")
        onStatusChange?.(PROJECT_STATUS.EXPERT_REVIEWING)
        return true
      } catch (error) {
        toast.error("专家抽取失败，请重试")
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [projectId, currentStatus, onStatusChange],
  )

  const issueTask = useCallback(async () => {
    if (!canTransitionTo(currentStatus, PROJECT_STATUS.TASK_ISSUED)) {
      toast.error("当前状态不允许任务下发")
      return false
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/issue-task`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("任务下发失败")

      toast.success("任务下发成功")
      onStatusChange?.(PROJECT_STATUS.TASK_ISSUED)
      return true
    } catch (error) {
      toast.error("任务下发失败，请重试")
      return false
    } finally {
      setIsLoading(false)
    }
  }, [projectId, currentStatus, onStatusChange])

  const submitTaskBook = useCallback(
    async (taskBookId: string) => {
      if (!canTransitionTo(currentStatus, PROJECT_STATUS.TASK_REVIEWING)) {
        toast.error("当前状态不允许提交任务书")
        return false
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/task-books/${taskBookId}/submit`, {
          method: "POST",
        })

        if (!response.ok) throw new Error("任务书提交失败")

        toast.success("任务书提交成功")
        onStatusChange?.(PROJECT_STATUS.TASK_REVIEWING)
        return true
      } catch (error) {
        toast.error("任务书提交失败，请重试")
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [projectId, currentStatus, onStatusChange],
  )

  const reviewTaskBook = useCallback(
    async (taskBookId: string, approved: boolean, comment: string) => {
      if (!canTransitionTo(currentStatus, approved ? PROJECT_STATUS.TASK_APPROVED : PROJECT_STATUS.TASK_DRAFTING)) {
        toast.error("当前状态不允许审核任务书")
        return false
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/task-books/${taskBookId}/review`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ approved, comment }),
        })

        if (!response.ok) throw new Error("任务书审核失败")

        toast.success(approved ? "任务书审核通过" : "任务书需要修改")
        onStatusChange?.(approved ? PROJECT_STATUS.TASK_APPROVED : PROJECT_STATUS.TASK_DRAFTING)
        return true
      } catch (error) {
        toast.error("任务书审核失败，请重试")
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [projectId, currentStatus, onStatusChange],
  )

  const startExecution = useCallback(async () => {
    if (!canTransitionTo(currentStatus, PROJECT_STATUS.EXECUTING)) {
      toast.error("当前状态不允许开始执行")
      return false
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/start-execution`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("启动项目执行失败")

      toast.success("项目正式开始执行")
      onStatusChange?.(PROJECT_STATUS.EXECUTING)
      return true
    } catch (error) {
      toast.error("启动项目执行失败，请重试")
      return false
    } finally {
      setIsLoading(false)
    }
  }, [projectId, currentStatus, onStatusChange])

  const applyAcceptance = useCallback(async () => {
    if (!canTransitionTo(currentStatus, PROJECT_STATUS.ACCEPTANCE_APPLYING)) {
      toast.error("当前状态不允许申请验收")
      return false
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/apply-acceptance`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("申请验收失败")

      toast.success("验收申请提交成功")
      onStatusChange?.(PROJECT_STATUS.ACCEPTANCE_APPLYING)
      return true
    } catch (error) {
      toast.error("申请验收失败，请重试")
      return false
    } finally {
      setIsLoading(false)
    }
  }, [projectId, currentStatus, onStatusChange])

  return {
    isLoading,
    submitApplication,
    preliminaryReview,
    drawExpertsAndStartReview,
    issueTask,
    submitTaskBook,
    reviewTaskBook,
    startExecution,
    applyAcceptance,
  }
}
