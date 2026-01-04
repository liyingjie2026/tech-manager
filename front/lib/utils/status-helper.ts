import { statusLabelApi, type StatusLabel } from "@/lib/api/status-label"

// 缓存所有状态标签
let cachedLabels: Record<string, StatusLabel[]> | null = null
let cachePromise: Promise<Record<string, StatusLabel[]>> | null = null

/**
 * 加载并缓存所有状态标签
 */
async function loadStatusLabels(): Promise<Record<string, StatusLabel[]>> {
  if (cachedLabels) {
    return cachedLabels
  }

  if (cachePromise) {
    return cachePromise
  }

  cachePromise = statusLabelApi.getAll().then((response) => {
    cachedLabels = response.data
    cachePromise = null
    return cachedLabels!
  })

  return cachePromise
}

/**
 * 从数据库获取状态显示文本
 */
export async function getStatusText(status: string | number | undefined | null, category: string): Promise<string> {
  if (status === undefined || status === null) return "-"

  const statusStr = String(status)
  const labels = await loadStatusLabels()

  const categoryLabels = labels[category] || []
  const label = categoryLabels.find((l) => l.value === statusStr)

  return label ? label.label : statusStr
}

/**
 * 从数据库获取状态颜色
 */
export async function getStatusColor(status: string | undefined | null, category: string): Promise<string> {
  if (!status) return "bg-gray-100 text-gray-700"

  const statusStr = String(status)
  const labels = await loadStatusLabels()

  const categoryLabels = labels[category] || []
  const label = categoryLabels.find((l) => l.value === statusStr)

  if (!label || !label.color) {
    return "bg-gray-100 text-gray-700"
  }

  // 根据颜色名称返回Tailwind类
  const colorMap: Record<string, string> = {
    amber: "bg-amber-100 text-amber-700",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    gray: "bg-gray-100 text-gray-700",
    purple: "bg-purple-100 text-purple-700",
    orange: "bg-orange-100 text-orange-700",
    teal: "bg-teal-100 text-teal-700",
    indigo: "bg-indigo-100 text-indigo-700",
    cyan: "bg-cyan-100 text-cyan-700",
  }

  return colorMap[label.color] || "bg-gray-100 text-gray-700"
}

/**
 * 同步版本：使用缓存的状态标签（用于已加载过的场景）
 */
export function getStatusTextSync(status: string | number | undefined | null, category: string): string {
  if (status === undefined || status === null) return "-"
  if (!cachedLabels) return String(status)

  const statusStr = String(status)
  const categoryLabels = cachedLabels[category] || []
  const label = categoryLabels.find((l) => l.value === statusStr)

  return label ? label.label : statusStr
}

/**
 * 预加载状态标签（在应用启动时调用）
 */
export function preloadStatusLabels(): Promise<Record<string, StatusLabel[]>> {
  return loadStatusLabels()
}
