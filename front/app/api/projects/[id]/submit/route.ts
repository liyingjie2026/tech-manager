import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get("authorization")
    const projectId = params.id

    const response = await fetch(`${BACKEND_URL}/api/projects/${projectId}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("[v0] Backend submit failed:", error)
      return NextResponse.json({ success: false, message: error.message || "提交失败" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Project submit error:", error)
    return NextResponse.json({ success: false, message: "项目提交失败" }, { status: 500 })
  }
}
