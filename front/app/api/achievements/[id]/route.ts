import { type NextRequest, NextResponse } from "next/server"

// 获取成果详情
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const achievement = {
      id: params.id,
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
      technicalFeatures: "采用人工智能算法进行风险评估",
      applicationScope: "适用于山区地质灾害监测",
      economicBenefit: "预计可减少灾害损失30%以上",
      attachments: [],
    }

    return NextResponse.json({
      success: true,
      data: achievement,
    })
  } catch (error) {
    console.error("[v0] Get achievement detail error:", error)
    return NextResponse.json({ success: false, message: "获取成果详情失败" }, { status: 500 })
  }
}

// 更新成果
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    return NextResponse.json({
      success: true,
      data: { id: params.id, ...body, updatedAt: new Date().toISOString() },
      message: "成果更新成功",
    })
  } catch (error) {
    console.error("[v0] Update achievement error:", error)
    return NextResponse.json({ success: false, message: "成果更新失败" }, { status: 500 })
  }
}

// 删除成果
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    return NextResponse.json({
      success: true,
      message: "成果删除成功",
    })
  } catch (error) {
    console.error("[v0] Delete achievement error:", error)
    return NextResponse.json({ success: false, message: "成果删除失败" }, { status: 500 })
  }
}
