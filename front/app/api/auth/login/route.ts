import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    let apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

    if (!apiBaseUrl.startsWith("http://") && !apiBaseUrl.startsWith("https://")) {
      apiBaseUrl = `http://${apiBaseUrl}`
    }

    if ((apiBaseUrl.includes("localhost") || apiBaseUrl.includes("127.0.0.1")) && !apiBaseUrl.match(/:\d+$/)) {
      apiBaseUrl = `${apiBaseUrl}:8080`
    }

    const backendUrl = `${apiBaseUrl}/api/auth/login`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    try {
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
        signal: controller.signal,
        cache: "no-store",
      })

      clearTimeout(timeoutId)

      const contentType = response.headers.get("content-type")

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()

        return NextResponse.json(
          {
            code: 500,
            message: `后端服务返回了非JSON响应。\n响应内容: ${text.substring(0, 200)}\n\n请检查：\n1. 后端服务是否正常运行在 ${apiBaseUrl}\n2. 后端端口是否为8080\n3. 后端context-path是否为/api\n4. 数据库是否已启动并配置正确`,
            data: null,
          },
          { status: 500 },
        )
      }

      const data = await response.json()

      return NextResponse.json(data, { status: response.status })
    } catch (fetchError) {
      clearTimeout(timeoutId)

      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        return NextResponse.json(
          {
            code: 500,
            message: `请求超时（15秒）。后端服务可能未启动或响应缓慢：${apiBaseUrl}`,
            data: null,
          },
          { status: 500 },
        )
      }

      if (fetchError instanceof TypeError) {
        return NextResponse.json(
          {
            code: 500,
            message: `网络错误：无法连接到后端服务 ${apiBaseUrl}。请确认：\n1. 后端服务已启动\n2. 端口8080未被占用\n3. 防火墙允许访问`,
            data: null,
          },
          { status: 500 },
        )
      }

      throw fetchError
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "未知错误"

    return NextResponse.json(
      {
        code: 500,
        message: `登录失败: ${errorMessage}`,
        data: null,
      },
      { status: 500 },
    )
  }
}
