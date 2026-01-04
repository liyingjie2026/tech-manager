import { type NextRequest, NextResponse } from "next/server"
import { projects } from "@/lib/db"
import { PROJECT_STATUS } from "@/lib/constants/project-workflow"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId } = body

    // 查找项目
    const project = projects.find((p) => p.id === projectId)
    if (!project) {
      return NextResponse.json({ code: 404, message: "项目不存在", data: null }, { status: 404 })
    }

    // 检查项目状态
    if (project.status !== PROJECT_STATUS.TASK_APPROVED) {
      return NextResponse.json(
        { code: 400, message: "只有任务书已批准的项目可以启动执行", data: null },
        { status: 400 },
      )
    }

    // 更新项目状态
    const index = projects.findIndex((p) => p.id === projectId)
    projects[index] = {
      ...project,
      status: PROJECT_STATUS.EXECUTING as any,
      statusName: "执行中",
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      code: 200,
      message: "项目已启动执行",
      data: projects[index],
    })
  } catch (error) {
    console.error("[v0] 项目启动执行失败:", error)
    return NextResponse.json({ code: 500, message: "服务器错误", data: null }, { status: 500 })
  }
}
