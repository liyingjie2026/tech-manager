import { type NextRequest, NextResponse } from "next/server"

// 获取字典列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get("type")

    const mockDictionaries = {
      projectType: [
        { code: "basic_research", name: "基础研究", order: 1 },
        { code: "applied_research", name: "应用研究", order: 2 },
        { code: "experimental_development", name: "试验发展", order: 3 },
      ],
      researchField: [
        { code: "gis", name: "地理信息系统", order: 1 },
        { code: "remote_sensing", name: "遥感技术", order: 2 },
        { code: "surveying", name: "测绘科学", order: 3 },
      ],
      achievementType: [
        { code: "paper", name: "论文", order: 1 },
        { code: "patent", name: "专利", order: 2 },
        { code: "software", name: "软件著作权", order: 3 },
        { code: "standard", name: "标准规范", order: 4 },
      ],
      projectStatus: [
        { code: "draft", name: "草稿", order: 1 },
        { code: "submitted", name: "已提交", order: 2 },
        { code: "in_review", name: "初审中", order: 3 },
        { code: "expert_review", name: "专家评审中", order: 4 },
        { code: "approved", name: "已立项", order: 5 },
        { code: "in_progress", name: "执行中", order: 6 },
        { code: "completed", name: "已完成", order: 7 },
        { code: "rejected", name: "已驳回", order: 8 },
      ],
    }

    if (type && mockDictionaries[type as keyof typeof mockDictionaries]) {
      return NextResponse.json({
        success: true,
        data: mockDictionaries[type as keyof typeof mockDictionaries],
      })
    }

    return NextResponse.json({
      success: true,
      data: mockDictionaries,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "获取字典失败" }, { status: 500 })
  }
}

// 创建字典项
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    return NextResponse.json({
      success: true,
      data: body,
      message: "字典项创建成功",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "字典项创建失败" }, { status: 500 })
  }
}
