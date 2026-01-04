import { type NextRequest, NextResponse } from "next/server"
import { projects } from "@/lib/db"
import { PROJECT_STATUS } from "@/lib/constants/project-workflow"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, expertId, expertName, score, opinion, comment, strengths, weaknesses, suggestions } = body

    // 查找项目
    const project = projects.find((p) => p.id === projectId)
    if (!project) {
      return NextResponse.json({ code: 404, message: "项目不存在", data: null }, { status: 404 })
    }

    // 检查项目状态
    if (project.status !== PROJECT_STATUS.EXPERT_REVIEWING) {
      return NextResponse.json({ code: 400, message: "项目不在专家评审阶段", data: null }, { status: 400 })
    }

    // 添加评审意见
    const index = projects.findIndex((p) => p.id === projectId)
    const newReviewComments = [
      ...(project.reviewComments || []),
      {
        id: `review-${Date.now()}`,
        projectId,
        expertId,
        expertName,
        score,
        comment,
        strengths,
        weaknesses,
        suggestions,
        createdAt: new Date().toISOString(),
      },
    ]

    // 计算平均分
    const avgScore = newReviewComments.reduce((sum, r) => sum + r.score, 0) / newReviewComments.length

    // 检查是否所有专家都已评审（这里简化为3个专家）
    const isAllReviewed = newReviewComments.length >= 3
    const newStatus = isAllReviewed
      ? avgScore >= 75
        ? PROJECT_STATUS.APPROVED
        : PROJECT_STATUS.REJECTED
      : project.status

    projects[index] = {
      ...project,
      reviewComments: newReviewComments,
      reviewScore: avgScore,
      status: newStatus as any,
      statusName: isAllReviewed ? (avgScore >= 75 ? "立项批准" : "已驳回") : "专家评审中",
      approvedAt: isAllReviewed && avgScore >= 75 ? new Date().toISOString() : project.approvedAt,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      code: 200,
      message: "评审意见提交成功",
      data: {
        project: projects[index],
        isAllReviewed,
        avgScore,
      },
    })
  } catch (error) {
    console.error("[v0] 专家评审失败:", error)
    return NextResponse.json({ code: 500, message: "服务器错误", data: null }, { status: 500 })
  }
}
