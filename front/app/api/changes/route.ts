import { type NextRequest, NextResponse } from "next/server"

// 获取变更申请列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "20")
    const status = searchParams.get("status") || "all"

    const mockChanges = [
      {
        id: "BG202501001",
        projectId: "KJ202502001",
        projectName: "地质灾害防治综合技术研究",
        changeType: "member",
        changeReason: "项目成员工作调整",
        changeContent: "增加1名研究人员",
        applicant: "张教授",
        institution: "湖南省第三测绘院",
        applyDate: "2025-03-15",
        status: "pending",
        currentReviewer: "管理员",
        attachments: [],
      },
      {
        id: "BG202501002",
        projectId: "KJ202502003",
        projectName: "自然资源数字化管理系统",
        changeType: "schedule",
        changeReason: "项目进度需要调整",
        changeContent: "延期3个月完成",
        applicant: "王教授",
        institution: "湖南师范大学",
        applyDate: "2025-03-10",
        status: "approved",
        currentReviewer: "管理员",
        reviewDate: "2025-03-12",
        reviewComment: "同意延期",
        attachments: [],
      },
    ]

    let filtered = mockChanges
    if (status !== "all") {
      filtered = mockChanges.filter((item) => item.status === status)
    }

    return NextResponse.json({
      success: true,
      data: filtered,
      pagination: {
        page,
        pageSize,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / pageSize),
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "获取变更列表失败" }, { status: 500 })
  }
}

// 提交变更申请
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    return NextResponse.json({
      success: true,
      data: {
        id: `BG${Date.now()}`,
        ...body,
        status: "pending",
        applyDate: new Date().toISOString(),
      },
      message: "变更申请提交成功",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "变更申请失败" }, { status: 500 })
  }
}
