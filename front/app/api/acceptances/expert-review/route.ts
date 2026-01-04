import { type NextRequest, NextResponse } from "next/server"
import { projects } from "@/lib/db"
import { PROJECT_STATUS } from "@/lib/constants/project-workflow"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, expertId, expertName, score, opinion, comment } = body

    // 查找项目
    const project = projects.find((p) => p.id === projectId)
    if (!project) {
      return NextResponse.json({ code: 404, message: "项目不存在", data: null }, { status: 404 })
    }

    // 检查项目状态
    if (project.status !== PROJECT_STATUS.ACCEPTANCE_REVIEWING) {
      return NextResponse.json({ code: 400, message: "项目不在验收评审阶段", data: null }, { status: 400 })
    }

    // 添加验收评审意见
    const index = projects.findIndex((p) => p.id === projectId)
    const acceptanceReviews = [
      ...(project.reviewComments || []),
      {
        id: `acceptance-review-${Date.now()}`,
        projectId,
        expertId,
        expertName,
        score,
        comment,
        opinion,
        createdAt: new Date().toISOString(),
      },
    ]

    // 计算平均分
    const avgScore = acceptanceReviews.reduce((sum, r: any) => sum + r.score, 0) / acceptanceReviews.length

    // 检查是否所有专家都已评审（这里简化为3个专家）
    const isAllReviewed = acceptanceReviews.length >= 3
    const newStatus = isAllReviewed
      ? avgScore >= 75
        ? PROJECT_STATUS.COMPLETED
        : PROJECT_STATUS.EXECUTING
      : project.status

    projects[index] = {
      ...project,
      reviewComments: acceptanceReviews,
      reviewScore: avgScore,
      status: newStatus as any,
      statusName: isAllReviewed ? (avgScore >= 75 ? "已完成" : "验收未通过") : "验收评审中",
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      code: 200,
      message: "验收评审提交成功",
      data: {
        project: projects[index],
        isAllReviewed,
        avgScore,
      },
    })
  } catch (error) {
    console.error("[v0] 验收评审失败:", error)
    return NextResponse.json({ code: 500, message: "服务器错误", data: null }, { status: 500 })
  }
}
