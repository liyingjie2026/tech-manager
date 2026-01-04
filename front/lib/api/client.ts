// API 客户端基础配置
import type { ApiResponse } from "../types"

// API 基础URL - 可通过环境变量配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api"

// Backend API URL - 使用统一的环境变量配置
const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"

// 获取存储的 token
function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth_token")
}

// 设置 token
export function setToken(token: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem("auth_token", token)
}

// 清除 token
export function clearToken(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("auth_token")
  localStorage.removeItem("refresh_token")
  localStorage.removeItem("user_info")
}

// 请求配置
interface RequestConfig extends RequestInit {
  params?: Record<string, any>
  timeout?: number
}

// 统一请求方法
export async function request<T = any>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
  const { params, timeout = 30000, ...fetchConfig } = config

  // 构建 URL
  let url = `${API_BASE_URL}${endpoint}`
  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value))
      }
    })
    const queryString = searchParams.toString()
    if (queryString) {
      url += `?${queryString}`
    }
  }

  // 设置默认 headers
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...fetchConfig.headers,
  }

  // 添加 token
  const token = getToken()
  if (token) {
    ;(headers as Record<string, string>)["Authorization"] = `Bearer ${token}`
  }

  // 创建 AbortController 用于超时控制
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...fetchConfig,
      headers,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    // 处理 401 未授权
    if (response.status === 401) {
      clearToken()
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
      throw new Error("登录已过期，请重新登录")
    }

    // 处理其他错误状态
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `请求失败: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error: any) {
    clearTimeout(timeoutId)

    if (error.name === "AbortError") {
      throw new Error("请求超时")
    }

    throw error
  }
}

// GET 请求
export async function get<T = any>(
  endpoint: string,
  params?: Record<string, any>,
  config?: RequestConfig,
): Promise<ApiResponse<T>> {
  return request<T>(endpoint, {
    ...config,
    method: "GET",
    params,
  })
}

// POST 请求
export async function post<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
  return request<T>(endpoint, {
    ...config,
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  })
}

// PUT 请求
export async function put<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
  return request<T>(endpoint, {
    ...config,
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  })
}

// DELETE 请求
export async function del<T = any>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
  return request<T>(endpoint, {
    ...config,
    method: "DELETE",
  })
}

// 上传文件
export async function upload<T = any>(
  endpoint: string,
  file: File,
  fieldName = "file",
  extraData?: Record<string, any>,
): Promise<ApiResponse<T>> {
  const formData = new FormData()
  formData.append(fieldName, file)

  if (extraData) {
    Object.entries(extraData).forEach(([key, value]) => {
      formData.append(key, String(value))
    })
  }

  const token = getToken()
  const headers: HeadersInit = {}
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers,
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || "上传失败")
  }

  return response.json()
}

// 下载文件
export async function download(endpoint: string, filename?: string): Promise<void> {
  const token = getToken()
  const headers: HeadersInit = {}
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
    headers,
  })

  if (!response.ok) {
    throw new Error("下载失败")
  }

  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename || "download"
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}

export async function backendRequest<T = any>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
  const { params, timeout = 30000, ...fetchConfig } = config

  // 构建 URL - 直接指向 Java 后端
  let url = `${BACKEND_API_URL}${endpoint}`
  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value))
      }
    })
    const queryString = searchParams.toString()
    if (queryString) {
      url += `?${queryString}`
    }
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...fetchConfig.headers,
  }

  const token = getToken()

  if (token) {
    // Strategy 1: Standard Bearer token
    ;(headers as Record<string, string>)["Authorization"] = `Bearer ${token}`
    // Strategy 2: Custom token header (common in Java backends)
    ;(headers as Record<string, string>)["X-Auth-Token"] = token
    // Strategy 3: Simple token header
    ;(headers as Record<string, string>)["token"] = token
    // Strategy 4: Token without Bearer prefix
    ;(headers as Record<string, string>)["Authentication"] = token
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...fetchConfig,
      headers,
      signal: controller.signal,
      credentials: "include",
      mode: "cors",
    })

    clearTimeout(timeoutId)

    if (response.status === 403) {
      throw new Error("403 访问被拒绝，请检查登录状态或权限")
    }

    if (response.status === 401) {
      clearToken()
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
      throw new Error("登录已过期，请重新登录")
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `请求失败: ${response.status}`)
    }

    const data = await response.json()

    // Backend format: { code: 200, message: "...", data: {...} }
    // Frontend format: { success: boolean, data: any, message?: string }
    if (data && typeof data === "object" && "code" in data) {
      return {
        success: data.code === 200,
        data: data.data,
        message: data.message,
      }
    }

    // If already in correct format, return as is
    return data
  } catch (error: any) {
    clearTimeout(timeoutId)

    if (error.name === "AbortError") {
      throw new Error("请求超时")
    }

    throw error
  }
}

// 直接调用后端的便捷方法
export async function backendGet<T = any>(
  endpoint: string,
  params?: Record<string, any>,
  config?: RequestConfig,
): Promise<ApiResponse<T>> {
  return backendRequest<T>(endpoint, {
    ...config,
    method: "GET",
    params,
  })
}

export async function backendPost<T = any>(
  endpoint: string,
  data?: any,
  config?: RequestConfig,
): Promise<ApiResponse<T>> {
  return backendRequest<T>(endpoint, {
    ...config,
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  })
}

export async function backendPut<T = any>(
  endpoint: string,
  data?: any,
  config?: RequestConfig,
): Promise<ApiResponse<T>> {
  return backendRequest<T>(endpoint, {
    ...config,
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  })
}

export async function backendDelete<T = any>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
  return backendRequest<T>(endpoint, {
    ...config,
    method: "DELETE",
  })
}

export const apiClient = {
  get: backendGet,
  post: backendPost,
  put: backendPut,
  delete: backendDelete,
  request: backendRequest,
  upload,
  download,
}
