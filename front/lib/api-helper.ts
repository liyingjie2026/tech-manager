/**
 * API请求辅助函数
 * 统一处理后端API请求、错误处理和调试日志
 */

interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp?: number
}

/**
 * 标准化后端URL
 */
function getBackendUrl(): string {
  let apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

  // Add protocol if missing
  if (!apiBaseUrl.startsWith("http://") && !apiBaseUrl.startsWith("https://")) {
    apiBaseUrl = `http://${apiBaseUrl}`
  }

  // Add default port for localhost/127.0.0.1 if missing
  if ((apiBaseUrl.includes("localhost") || apiBaseUrl.includes("127.0.0.1")) && !apiBaseUrl.match(/:\d+$/)) {
    apiBaseUrl = `${apiBaseUrl}:8080`
  }

  return apiBaseUrl
}

/**
 * 转发请求到后端API
 */
export async function forwardToBackend(
  endpoint: string,
  request: Request,
  options: {
    method?: string
    body?: any
    headers?: Record<string, string>
  } = {},
): Promise<Response> {
  const apiBaseUrl = getBackendUrl()
  const backendUrl = `${apiBaseUrl}/api${endpoint}`

  console.log("[v0] Forwarding request to backend:", {
    endpoint,
    backendUrl,
    method: options.method || request.method,
  })

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 15000)

  try {
    // Get authorization token from request
    const authHeader = request.headers.get("Authorization")

    const response = await fetch(backendUrl, {
      method: options.method || request.method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
        ...options.headers,
      },
      ...(options.body ? { body: JSON.stringify(options.body) } : {}),
      signal: controller.signal,
      cache: "no-store",
    })

    clearTimeout(timeoutId)

    console.log("[v0] Backend response:", {
      status: response.status,
      contentType: response.headers.get("content-type"),
    })

    const contentType = response.headers.get("content-type")

    // Handle non-JSON responses
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text()
      console.error("[v0] Non-JSON response:", text.substring(0, 500))

      const errorResponse: ApiResponse = {
        code: 500,
        message: `后端服务返回了非JSON响应。\n响应内容: ${text.substring(0, 200)}\n\n请检查：\n1. 后端服务是否正常运行\n2. 数据库是否已启动\n3. 后端日志是否有错误`,
        data: null,
      }

      return new Response(JSON.stringify(errorResponse), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Return the response as-is
    const data = await response.json()
    console.log("[v0] Backend data:", data)

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    clearTimeout(timeoutId)

    console.error("[v0] Backend request error:", error)

    let errorMessage = "未知错误"

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        errorMessage = `请求超时（15秒）。后端服务可能未启动或响应缓慢`
      } else if (error instanceof TypeError) {
        errorMessage = `网络错误：无法连接到后端服务 ${apiBaseUrl}`
      } else {
        errorMessage = error.message
      }
    }

    const errorResponse: ApiResponse = {
      code: 500,
      message: errorMessage,
      data: null,
    }

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
