/**
 * Status utility functions for the application
 */

/**
 * Get color class for status badges
 */
export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    // Project statuses
    draft: "bg-gray-100 text-gray-700",
    approval_pending: "bg-yellow-100 text-yellow-700",
    submitted: "bg-blue-100 text-blue-700",
    under_review: "bg-purple-100 text-purple-700",
    preliminary_review_pending: "bg-orange-100 text-orange-700",
    preliminary_review_passed: "bg-green-100 text-green-700",
    approved: "bg-green-100 text-green-700",
    in_progress: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    cancelled: "bg-gray-100 text-gray-700",
    archived: "bg-gray-100 text-gray-700",

    // Audit statuses
    pending: "bg-yellow-100 text-yellow-700",
    reviewing: "bg-purple-100 text-purple-700",
    passed: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
  }

  return statusColors[status] || "bg-gray-100 text-gray-700"
}

/**
 * Get text label for status
 */
export function getStatusText(status: string, type: "project" | "audit" = "project"): string {
  const projectStatusTexts: Record<string, string> = {
    draft: "草稿",
    approval_pending: "待审核",
    submitted: "已提交",
    under_review: "评审中",
    preliminary_review_pending: "初审中",
    preliminary_review_passed: "初审通过",
    approved: "已通过",
    in_progress: "进行中",
    completed: "已完成",
    rejected: "已驳回",
    cancelled: "已取消",
    archived: "已归档",
  }

  const auditStatusTexts: Record<string, string> = {
    pending: "待审核",
    reviewing: "审核中",
    passed: "已通过",
    failed: "未通过",
    approved: "已通过",
    rejected: "已驳回",
  }

  if (type === "audit") {
    return auditStatusTexts[status] || status || "-"
  }

  return projectStatusTexts[status] || status || "-"
}
