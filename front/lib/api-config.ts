// URL validation helper
function normalizeBaseUrl(url: string): string {
  let normalized = url.trim()

  // Add protocol if missing
  if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
    normalized = `http://${normalized}`
  }

  // Add default port for localhost/127.0.0.1 if missing
  if ((normalized.includes("localhost") || normalized.includes("127.0.0.1")) && !normalized.match(/:\d+$/)) {
    normalized = `${normalized}:3001`
  }

  // Remove trailing slash
  normalized = normalized.replace(/\/$/, "")

  return normalized
}

const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001"
const normalizedBaseUrl = normalizeBaseUrl(rawBaseUrl)

console.log("[v0] API Config - Raw BASE_URL:", rawBaseUrl)
console.log("[v0] API Config - Normalized BASE_URL:", normalizedBaseUrl)

export const API_CONFIG = {
  BASE_URL: normalizedBaseUrl,
  TIMEOUT: 30000,
  HEADERS: {
    "Content-Type": "application/json",
  },
}

export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    LOGIN: "/auth/login",
    LOGIN_SMS: "/auth/login/sms",
    SEND_SMS: "/auth/sms/send",
    REGISTER: "/auth/register",
    REGISTER_INSTITUTION: "/auth/register/institution",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    CHANGE_PASSWORD: "/auth/password/change",
    RESET_PASSWORD: "/auth/password/reset",
    REFRESH_TOKEN: "/auth/token/refresh",
  },
  // 项目相关
  PROJECTS: {
    LIST: "/projects",
    MY: "/projects/my",
    DETAIL: (id: string) => `/projects/${id}`,
    DRAFT: "/projects/draft",
    UPDATE_DRAFT: (id: string) => `/projects/${id}/draft`,
    SUBMIT: (id: string) => `/projects/${id}/submit`,
    WITHDRAW: (id: string) => `/projects/${id}/withdraw`,
    DELETE: (id: string) => `/projects/${id}`,
    APPROVE: (id: string) => `/projects/${id}/approve`,
    REJECT: (id: string) => `/projects/${id}/reject`,
    RETURN: (id: string) => `/projects/${id}/return`,
    BATCH_APPROVE: "/projects/batch/approve",
    BATCH_REJECT: "/projects/batch/reject",
    MEMBERS: (id: string) => `/projects/${id}/members`,
    MEMBER: (id: string, memberId: string) => `/projects/${id}/members/${memberId}`,
    BUDGET: (id: string) => `/projects/${id}/budget`,
    ATTACHMENTS: (id: string) => `/projects/${id}/attachments`,
    ATTACHMENT: (id: string, attachmentId: string) => `/projects/${id}/attachments/${attachmentId}`,
    DOWNLOAD: (id: string, attachmentId: string) => `/projects/${id}/attachments/${attachmentId}/download`,
    SCHEDULE: (id: string) => `/projects/${id}/schedule`,
    SCHEDULE_ITEM: (id: string) => `/projects/${id}/schedule/item`,
    PERFORMANCE: (id: string) => `/projects/${id}/performance`,
    EXPORT_PDF: (id: string) => `/projects/${id}/export/pdf`,
    EXPORT_WORD: (id: string) => `/projects/${id}/export/word`,
    EXPORT_EXCEL: "/projects/export/excel",
    DUPLICATE_CHECK: (id: string) => `/projects/${id}/duplicate-check`,
    STATISTICS: "/projects/statistics",
  },
  // 验收相关
  ACCEPTANCE: {
    LIST: "/acceptances",
    DETAIL: (id: string) => `/acceptances/${id}`,
    STATISTICS: "/acceptances/statistics",
    CREATE: "/acceptances",
    UPDATE: (id: string) => `/acceptances/${id}`,
    SUBMIT: (id: string) => `/acceptances/${id}/submit`,
    WITHDRAW: (id: string) => `/acceptances/${id}/withdraw`,
    APPROVE: (id: string) => `/acceptances/${id}/approve`,
    REJECT: (id: string) => `/acceptances/${id}/reject`,
    START_REVIEW: (id: string) => `/acceptances/${id}/start-review`,
    ATTACHMENTS: (id: string) => `/acceptances/${id}/attachments`,
    EXPORT: (id: string) => `/acceptances/${id}/export`,
  },
}

// HTTP工具函数
export async function fetchAPI<T = any>(url: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  console.log("[v0] API Request:", { url, method: options.method || "GET" })

  const headers: HeadersInit = {
    ...API_CONFIG.HEADERS,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const fullUrl = `${API_CONFIG.BASE_URL}${url}`
  console.log("[v0] Full URL:", fullUrl)

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers,
    })

    console.log("[v0] Response status:", response.status)

    // Check content type
    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text()
      console.error("[v0] Non-JSON response:", text.substring(0, 200))
      throw new Error("服务器返回了非JSON响应")
    }

    const data = await response.json()
    console.log("[v0] Response data:", data)

    if (data.code !== 200) {
      throw new Error(data.message || "请求失败")
    }

    return data.data
  } catch (error) {
    console.error("[v0] API Error:", error)
    throw error
  }
}
