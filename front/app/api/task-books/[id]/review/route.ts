import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const taskBookId = params.id
    const body = await request.json()
    const { approved, comment } = body

    // TODO: 实现任务书审核逻辑
    // 1. 验证审核权限
    // 2. 更新任务书状态
    // 3. 记录审核意见
    // 4. 更新关联项目状态
    // 5. 通知相关人员（通过或需要修改）

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task-books/${taskBookId}/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ approved, comment }),
    })

    if (!response.ok) {
      throw new Error("Task book review failed")
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Task book review error:", error)
    return NextResponse.json({ error: "Failed to review task book" }, { status: 500 })
  }
}
