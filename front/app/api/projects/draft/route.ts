import { NextResponse } from "next"
import type { NextRequest } from "next"
import { generateProjectCode } from "@/lib/utils/random"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080"

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")
    const body = await request.json()

    if (!body.code) {
      body.code = generateProjectCode()
    }

    const response = await fetch(`${BACKEND_URL}/api/projects/draft`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Draft API Error:", error)
    return NextResponse.json({ success: false, message: "保存草稿失败" }, { status: 500 })
  }
}
