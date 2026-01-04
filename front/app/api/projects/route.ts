import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")
    const { searchParams } = new URL(request.url)

    const params = new URLSearchParams()
    searchParams.forEach((value, key) => {
      params.append(key, value)
    })

    const response = await fetch(`${BACKEND_URL}/api/projects?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Projects API error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "查询项目列表失败",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")
    const projectData = await request.json()

    const response = await fetch(`${BACKEND_URL}/api/projects/draft`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
      body: JSON.stringify(projectData),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Create project error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "创建项目失败",
      },
      { status: 500 },
    )
  }
}
