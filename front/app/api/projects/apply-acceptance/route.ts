import { type NextRequest, NextResponse } from "next/server"
import { projects } from "@/lib/db"
import { PROJECT_STATUS } from "@/lib/constants/project-workflow"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, acceptanceData } = body

    // 查找项目
    const project = projects.find((p) => p.id === projectId)
    if (!project) {
      return NextResponse.json({ code: 404, message: "项目不存在", data: null }, { status: 404 })
    }

    // 检查项目状态 - 只有执行中的项目可以申请验收
    if (project.status !== PROJECT_STATUS.EXECUTING) {
      return NextResponse.json({ code: 400, message: "只有执行中的项目可以申请验收", data: null }, { status: 400 })
    }

    // 更新项目状态
    const index = projects.findIndex((p) => p.id === projectId)
    projects[index] = {
      ...project,
      status: PROJECT_STATUS.ACCEPTANCE_APPLYING as any,
      statusName: "申请验收中",
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      code: 200,
      message: "验收申请提交成功",
      data: projects[index],
    })
  } catch (error) {
    console.error("[v0] 验收申请失败:", error)
    return NextResponse.json({ code: 500, message: "服务器错误", data: null }, { status: 500 })
  }
}
