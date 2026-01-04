import { type NextRequest, NextResponse } from "next/server"
import { forwardToBackend } from "@/lib/api-helper"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const endpoint = `/demands/statistics?${searchParams.toString()}`
    return forwardToBackend(endpoint, request)
  } catch (error) {
    return NextResponse.json(
      {
        code: 500,
        message: "服务器错误",
        data: null,
      },
      { status: 500 },
    )
  }
}
