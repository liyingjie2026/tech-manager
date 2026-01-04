import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id
    const body = await request.json()
    const { expertIds } = body

    // TODO: 实现专家抽取逻辑
    // 1. 验证专家资格
    // 2. 检查专家回避规则
    // 3. 创建评审任务
    // 4. 通知专家进行评审
    // 5. 更新项目状态为专家评审中

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/${projectId}/draw-experts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expertIds }),
    })

    if (!response.ok) {
      throw new Error("Expert drawing failed")
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Expert drawing error:", error)
    return NextResponse.json({ error: "Failed to draw experts" }, { status: 500 })
  }
}
