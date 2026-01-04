import { type NextRequest, NextResponse } from "next/server"
import { projects } from "@/lib/db"
import { getWorkflowStage, getStatusProgress } from "@/lib/constants/project-workflow"

// 获取项目工作流状态信息
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const projectId = searchParams.get("projectId")

    if (!projectId) {
      return NextResponse.json({ code: 400, message: "缺少项目ID", data: null }, { status: 400 })
    }

    // 查找项目
    const project = projects.find((p) => p.id === projectId)
    if (!project) {
      return NextResponse.json({ code: 404, message: "项目不存在", data: null }, { status: 404 })
    }

    // 获取工作流信息
    const workflowStage = getWorkflowStage(project.status as any)
    const progress = getStatusProgress(project.status as any)

    return NextResponse.json({
      code: 200,
      message: "获取成功",
      data: {
        projectId: project.id,
        projectName: project.name,
        currentStatus: project.status,
        currentStatusName: project.statusName,
        workflowStage,
        progress,
        submittedAt: project.submittedAt,
        approvedAt: project.approvedAt,
        updatedAt: project.updatedAt,
      },
    })
  } catch (error) {
    console.error("[v0] 获取项目工作流状态失败:", error)
    return NextResponse.json({ code: 500, message: "服务器错误", data: null }, { status: 500 })
  }
}
