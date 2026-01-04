import { type NextRequest, NextResponse } from "next/server"

// 获取机构列表
export async function GET() {
  try {
    const mockInstitutions = [
      {
        id: "INST001",
        name: "湖南省第三测绘院",
        code: "HN003",
        type: "research",
        address: "湖南省长沙市",
        contactPerson: "张主任",
        contactPhone: "0731-12345678",
        email: "contact@hn003.com",
        status: "active",
        qualification: "甲级测绘资质",
      },
      {
        id: "INST002",
        name: "湖南大学",
        code: "HNU",
        type: "university",
        address: "湖南省长沙市岳麓区",
        contactPerson: "李院长",
        contactPhone: "0731-88822222",
        email: "contact@hnu.edu.cn",
        status: "active",
        qualification: "985/211高校",
      },
    ]

    return NextResponse.json({
      success: true,
      data: mockInstitutions,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "获取机构列表失败" }, { status: 500 })
  }
}

// 创建机构
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    return NextResponse.json({
      success: true,
      data: {
        id: `INST${Date.now()}`,
        ...body,
        status: "active",
      },
      message: "机构创建成功",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "机构创建失败" }, { status: 500 })
  }
}
