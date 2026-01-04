import { type NextRequest, NextResponse } from "next/server"
import { projects } from "@/lib/db"
import { PROJECT_STATUS } from "@/lib/constants/project-workflow"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, action, comment, reviewerId, reviewerName } = body

    // 查找项目
    const project = projects.find((p) => p.id === projectId)
    if (!project) {
      return NextResponse.json({ code: 404, message: "项目不存在", data: null }, { status: 404 })
    }

    // 检查项目状态
    if (project.status !== PROJECT_STATUS.SUBMITTED) {
      return NextResponse.json({ code: 400, message: "只有已提交的项目可以初审", data: null }, { status: 400 })
    }

    // 更新项目状态
    const index = projects.findIndex((p) => p.id === projectId)
    const newStatus = action === "approve" ? PROJECT_STATUS.PRELIMINARY_APPROVED : PROJECT_STATUS.PRELIMINARY_REJECTED

    projects[index] = {
      ...project,
      status: newStatus as any,
      statusName: action === "approve" ? "初审通过" : "初审驳回",
      reviewComments: [
        ...(project.reviewComments || []),
        {
          id: `review-${Date.now()}`,
          projectId,
          expertId: reviewerId,
          expertName: reviewerName,
          score: action === "approve" ? 85 : 0,
          comment,
          strengths: "",
          weaknesses: "",
          suggestions: "",
          createdAt: new Date().toISOString(),
        },
      ],
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      code: 200,
      message: action === "approve" ? "初审通过" : "初审驳回",
      data: projects[index],
    })
  } catch (error) {
    console.error("[v0] 初审失败:", error)
    return NextResponse.json({ code: 500, message: "服务器错误", data: null }, { status: 500 })
  }
}
