import { type NextRequest, NextResponse } from "next/server"
import { projects } from "@/lib/db"
import { PROJECT_STATUS } from "@/lib/constants/project-workflow"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, issuerId, issuerName, taskDescription } = body

    // 查找项目
    const project = projects.find((p) => p.id === projectId)
    if (!project) {
      return NextResponse.json({ code: 404, message: "项目不存在", data: null }, { status: 404 })
    }

    // 检查项目状态
    if (project.status !== PROJECT_STATUS.APPROVED) {
      return NextResponse.json({ code: 400, message: "只有立项批准的项目可以下发任务", data: null }, { status: 400 })
    }

    // 更新项目状态
    const index = projects.findIndex((p) => p.id === projectId)
    projects[index] = {
      ...project,
      status: PROJECT_STATUS.TASK_ISSUED as any,
      statusName: "任务已下发",
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      code: 200,
      message: "任务下发成功",
      data: projects[index],
    })
  } catch (error) {
    console.error("[v0] 任务下发失败:", error)
    return NextResponse.json({ code: 500, message: "服务器错误", data: null }, { status: 500 })
  }
}
