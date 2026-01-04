import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const taskBookId = params.id

    // TODO: 实现任务书提交逻辑
    // 1. 验证任务书完整性
    // 2. 更新任务书状态
    // 3. 更新关联项目状态
    // 4. 通知审核人员

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task-books/${taskBookId}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Task book submit failed")
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Task book submit error:", error)
    return NextResponse.json({ error: "Failed to submit task book" }, { status: 500 })
  }
}
