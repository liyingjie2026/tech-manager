import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const mockStats = {
      totalProjects: 120,
      ongoingProjects: 20,
      completedProjects: 24,
      totalBudget: 11800000,
      pendingReviews: 5,
      recentActivities: [
        {
          id: "1",
          type: "project_submit",
          title: "项目申报已提交",
          projectName: "智慧城市时空大数据平台关键技术研究",
          time: "2025-01-10 10:30",
        },
        {
          id: "2",
          type: "review_approved",
          title: "项目审核通过",
          projectName: "农村不动产确权登记数据质量检测技术研究",
          time: "2025-01-09 15:20",
        },
      ],
    }

    return NextResponse.json({
      code: 200,
      message: "success",
      data: mockStats,
    })
  } catch (error) {
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
