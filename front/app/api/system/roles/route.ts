import { type NextRequest, NextResponse } from "next/server"

// 获取角色列表
export async function GET() {
  try {
    const mockRoles = [
      {
        id: "ROLE001",
        name: "监管管理员",
        code: "supervisor_admin",
        description: "监管端最高权限",
        permissions: ["all"],
      },
      {
        id: "ROLE002",
        name: "机构管理员",
        code: "institution_admin",
        description: "科研机构管理员",
        permissions: ["project_manage", "task_manage"],
      },
      {
        id: "ROLE003",
        name: "专家",
        code: "expert",
        description: "评审专家",
        permissions: ["review", "evaluate"],
      },
    ]

    return NextResponse.json({
      success: true,
      data: mockRoles,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "获取角色列表失败" }, { status: 500 })
  }
}

// 创建角色
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    return NextResponse.json({
      success: true,
      data: {
        id: `ROLE${Date.now()}`,
        ...body,
      },
      message: "角色创建成功",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "角色创建失败" }, { status: 500 })
  }
}
