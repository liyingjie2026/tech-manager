import { type NextRequest, NextResponse } from "next/server"

// 获取成果列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "20")
    const keyword = searchParams.get("keyword") || ""
    const type = searchParams.get("type") || "all"
    const status = searchParams.get("status") || "all"

    // 模拟成果数据
    const mockAchievements = [
      {
        id: "ACH001",
        projectId: "KJ202502001",
        projectName: "地质灾害防治综合技术研究",
        achievementName: "地质灾害监测预警系统V1.0",
        achievementType: "software",
        achievementLevel: "provincial",
        completionDate: "2024-12-15",
        institution: "湖南省第三测绘院",
        principalInvestigator: "张教授",
        teamMembers: ["张教授", "李工程师", "王研究员"],
        description: "基于GIS和大数据的地质灾害监测预警系统",
        status: "approved",
        certificationNumber: "ZZRZ-2024-001",
        attachments: [],
      },
      {
        id: "ACH002",
        projectId: "KJ202502003",
        projectName: "自然资源数字化管理系统",
        achievementName: "资源管理平台论文",
        achievementType: "paper",
        achievementLevel: "national",
        completionDate: "2024-11-20",
        institution: "湖南师范大学",
        principalInvestigator: "王教授",
        teamMembers: ["王教授", "赵教授"],
        description: "发表于《自然资源学报》的研究论文",
        status: "pending",
        journalName: "自然资源学报",
        impactFactor: "3.5",
        attachments: [],
      },
    ]

    // 过滤
    const filtered = mockAchievements.filter((item) => {
      if (keyword && !item.achievementName.includes(keyword) && !item.projectName.includes(keyword)) {
        return false
      }
      if (type !== "all" && item.achievementType !== type) {
        return false
      }
      if (status !== "all" && item.status !== status) {
        return false
      }
      return true
    })

    // 分页
    const total = filtered.length
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const data = filtered.slice(start, end)

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  } catch (error) {
    console.error("[v0] Get achievements error:", error)
    return NextResponse.json({ success: false, message: "获取成果列表失败" }, { status: 500 })
  }
}

// 创建成果
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newAchievement = {
      id: `ACH${Date.now()}`,
      ...body,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: newAchievement,
      message: "成果登记成功",
    })
  } catch (error) {
    console.error("[v0] Create achievement error:", error)
    return NextResponse.json({ success: false, message: "成果登记失败" }, { status: 500 })
  }
}
