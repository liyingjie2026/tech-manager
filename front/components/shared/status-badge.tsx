"use client"

import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getConfig = () => {
    const configs: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      draft: { label: "草稿", variant: "outline" },
      submitted: { label: "已提交", variant: "secondary" },
      reviewing: { label: "评审中", variant: "default" },
      approved: { label: "已通过", variant: "default" },
      rejected: { label: "已拒绝", variant: "destructive" },
      pending: { label: "待处理", variant: "outline" },
      in_progress: { label: "进行中", variant: "default" },
      completed: { label: "已完成", variant: "default" },
      terminated: { label: "已终止", variant: "destructive" },
    }

    return configs[status] || { label: status, variant: "outline" }
  }

  const config = getConfig()
  return <Badge variant={config.variant}>{config.label}</Badge>
}
