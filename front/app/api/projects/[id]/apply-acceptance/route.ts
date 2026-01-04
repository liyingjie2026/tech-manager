import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id

    // TODO: 实现验收申请逻辑
    // 1. 验证项目执行状态
    // 2. 检查必要的检查是否完成（年度检查等）
    // 3. 创建验收申请记录
    // 4. 更新项目状态
    // 5. 通知监管端进行验收审批

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/${projectId}/apply-acceptance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Apply acceptance failed")
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Apply acceptance error:", error)
    return NextResponse.json({ error: "Failed to apply for acceptance" }, { status: 500 })
  }
}
