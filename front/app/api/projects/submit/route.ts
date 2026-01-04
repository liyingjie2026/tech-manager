import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080"

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")
    const body = await request.json()
    const { projectId } = body

    if (!projectId) {
      return NextResponse.json({ success: false, message: "缺少项目ID" }, { status: 400 })
    }

    const response = await fetch(`${BACKEND_URL}/api/projects/${projectId}/submit`, {
      method: "POST",
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
    console.error("[v0] Project submit error:", error)
    return NextResponse.json({ success: false, message: "项目提交失败" }, { status: 500 })
  }
}
