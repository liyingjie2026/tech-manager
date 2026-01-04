import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get("authorization")
    const projectId = params.id
    const body = await request.json()
    const { approved, comment } = body

    const endpoint = approved
      ? `${BACKEND_URL}/api/projects/${projectId}/preliminary-review/pass`
      : `${BACKEND_URL}/api/projects/${projectId}/preliminary-review/fail`

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
      body: JSON.stringify(approved ? { comment } : { reason: comment }),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(error, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Preliminary review error:", error)
    return NextResponse.json({ success: false, message: "初审操作失败" }, { status: 500 })
  }
}
