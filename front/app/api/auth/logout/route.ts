import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  // In v0 preview, just return success since logout is handled client-side
  return NextResponse.json({
    code: 200,
    message: "登出成功",
    data: null,
  })
}
