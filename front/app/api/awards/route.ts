import { type NextRequest, NextResponse } from "next/server"

// 获取获奖列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "20")

    const mockAwards = [
      {
        id: "AWD001",
        achievementId: "ACH001",
        achievementName: "地质灾害监测预警系统V1.0",
        awardName: "湖南省科技进步奖",
        awardLevel: "provincial_first",
        awardYear: "2024",
        awardDate: "2024-12-20",
        certificateNumber: "HNKJ-2024-001",
        institution: "湖南省第三测绘院",
        awardees: ["张教授", "李工程师"],
        status: "awarded",
      },
    ]

    return NextResponse.json({
      success: true,
      data: mockAwards,
      pagination: {
        page,
        pageSize,
        total: mockAwards.length,
        totalPages: 1,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "获取获奖列表失败" }, { status: 500 })
  }
}

// 申报获奖
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    return NextResponse.json({
      success: true,
      data: { id: `AWD${Date.now()}`, ...body, status: "pending" },
      message: "获奖申报成功",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "获奖申报失败" }, { status: 500 })
  }
}
