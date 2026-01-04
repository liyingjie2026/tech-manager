import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id

    // TODO: 实现任务下发逻辑
    // 1. 验证专家评审通过
    // 2. 生成任务下发通知
    // 3. 更新项目状态
    // 4. 通知项目负责人编制任务书

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/${projectId}/issue-task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Task issuing failed")
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Task issuing error:", error)
    return NextResponse.json({ error: "Failed to issue task" }, { status: 500 })
  }
}
