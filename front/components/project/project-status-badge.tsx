// 项目状态徽章组件
import { Badge } from "@/components/ui/badge"
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS, type ProjectStatus } from "@/lib/constants/project-workflow"
import { cn } from "@/lib/utils"

interface ProjectStatusBadgeProps {
  status: ProjectStatus
  className?: string
}

export function ProjectStatusBadge({ status, className }: ProjectStatusBadgeProps) {
  const label = PROJECT_STATUS_LABELS[status] || status
  const color = PROJECT_STATUS_COLORS[status] || "gray"

  const colorClasses = {
    gray: "bg-gray-100 text-gray-700 border-gray-300",
    blue: "bg-blue-100 text-blue-700 border-blue-300",
    green: "bg-green-100 text-green-700 border-green-300",
    red: "bg-red-100 text-red-700 border-red-300",
    yellow: "bg-yellow-100 text-yellow-700 border-yellow-300",
    purple: "bg-purple-100 text-purple-700 border-purple-300",
    orange: "bg-orange-100 text-orange-700 border-orange-300",
    cyan: "bg-cyan-100 text-cyan-700 border-cyan-300",
  }

  return (
    <Badge variant="outline" className={cn(colorClasses[color as keyof typeof colorClasses], className)}>
      {label}
    </Badge>
  )
}
