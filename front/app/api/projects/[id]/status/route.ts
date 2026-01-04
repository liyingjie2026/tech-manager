import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { status, reviewComment, reviewerId, reviewerName } = await request.json()

    console.log("[v0] Update project status:", id, status)

    const projectIndex = db.projects.findIndex((p) => p.id === id)

    if (projectIndex === -1) {
      return NextResponse.json(
        {
          code: 404,
          message: "项目不存在",
          data: null,
        },
        { status: 404 },
      )
    }

    // Update project status
    const statusMap: Record<string, string> = {
      approved: "已审核通过",
      rejected: "已驳回",
      application: "待审核",
    }

    db.projects[projectIndex] = {
      ...db.projects[projectIndex],
      status,
      statusName: statusMap[status] || status,
      reviewComment,
      reviewerId,
      reviewerName,
      reviewedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Add review history
    if (!db.reviewHistory) {
      db.reviewHistory = []
    }

    db.reviewHistory.push({
      id: `review-${Date.now()}`,
      projectId: id,
      reviewType: "project_approval",
      reviewerId: reviewerId || "reviewer-001",
      reviewerName: reviewerName || "审核员",
      result: status === "approved" ? "通过" : "驳回",
      comment: reviewComment || "",
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({
      code: 200,
      message: status === "approved" ? "审核通过" : "审核驳回",
      data: db.projects[projectIndex],
    })
  } catch (error) {
    console.error("[v0] Update project status error:", error)
    return NextResponse.json(
      {
        code: 500,
        message: "服务器错误",
        data: null,
      },
      { status: 500 },
    )
  }
}
