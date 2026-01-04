import { type NextRequest, NextResponse } from "next/server"

// 获取用户列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const role = searchParams.get("role") || "all"

    const mockUsers = [
      {
        id: "USR001",
        username: "admin",
        name: "管理员",
        email: "admin@example.com",
        role: "supervisor",
        institution: "监管部门",
        status: "active",
        createdAt: "2024-01-01",
      },
      {
        id: "USR002",
        username: "inst001",
        name: "张主任",
        email: "zhang@institution.com",
        role: "institution",
        institution: "湖南省第三测绘院",
        status: "active",
        createdAt: "2024-01-15",
      },
    ]

    let filtered = mockUsers
    if (role !== "all") {
      filtered = mockUsers.filter((item) => item.role === role)
    }

    return NextResponse.json({
      success: true,
      data: filtered,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "获取用户列表失败" }, { status: 500 })
  }
}

// 创建用户
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    return NextResponse.json({
      success: true,
      data: {
        id: `USR${Date.now()}`,
        ...body,
        status: "active",
        createdAt: new Date().toISOString(),
      },
      message: "用户创建成功",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "用户创建失败" }, { status: 500 })
  }
}
