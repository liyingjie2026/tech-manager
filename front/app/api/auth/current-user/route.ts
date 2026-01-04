import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

// 模拟用户数据库（与login共享）
const users = [
  {
    id: "user-001",
    username: "admin",
    realName: "系统管理员",
    email: "admin@example.com",
    phone: "13800000001",
    userType: "admin",
    status: "active",
    institutionId: "inst-001",
    institutionName: "湖南省自然资源厅",
    roleIds: ["role-001"],
    roles: [
      {
        id: "role-001",
        code: "admin",
        name: "超级管理员",
        description: "拥有所有权限",
        permissions: ["*"],
        status: "active",
        createdAt: "2024-01-01",
      },
    ],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "user-002",
    username: "supervisor",
    realName: "监管员张三",
    email: "supervisor@example.com",
    phone: "13800000002",
    userType: "supervisor",
    status: "active",
    institutionId: "inst-001",
    institutionName: "湖南省自然资源厅",
    roleIds: ["role-002"],
    roles: [
      {
        id: "role-002",
        code: "supervisor",
        name: "监测监管员",
        description: "监测监管端管理",
        permissions: ["supervisor:*"],
        status: "active",
        createdAt: "2024-01-01",
      },
    ],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "user-003",
    username: "researcher",
    realName: "科研员李四",
    email: "researcher@example.com",
    phone: "13800000003",
    userType: "researcher",
    status: "active",
    institutionId: "inst-002",
    institutionName: "湖南省第三测绘院",
    roleIds: ["role-003"],
    roles: [
      {
        id: "role-003",
        code: "researcher",
        name: "科研机构管理员",
        description: "科研端管理",
        permissions: ["researcher:*"],
        status: "active",
        createdAt: "2024-01-01",
      },
    ],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "user-004",
    username: "expert",
    realName: "专家王五",
    email: "expert@example.com",
    phone: "13800000004",
    userType: "expert",
    status: "active",
    institutionId: "inst-003",
    institutionName: "中南大学",
    roleIds: ["role-004"],
    roles: [
      {
        id: "role-004",
        code: "expert",
        name: "评审专家",
        description: "项目评审",
        permissions: ["expert:*"],
        status: "active",
        createdAt: "2024-01-01",
      },
    ],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
]

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization")
    if (!authHeader) {
      return NextResponse.json({ code: 401, message: "未登录", data: null }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")

    // Mock user lookup based on token
    const mockUsers: Record<string, any> = {
      "leader-token": {
        id: "user-001",
        username: "leader",
        realName: "项目负责人",
        userType: "researcher",
        institutionName: "湖南省第三测绘院",
      },
      "manager-token": {
        id: "user-002",
        username: "manager",
        realName: "机构管理员",
        userType: "researcher",
        institutionName: "湖南省第三测绘院",
      },
      "supervisor-token": {
        id: "user-003",
        username: "supervisor",
        realName: "监管端管理员",
        userType: "supervisor",
        institutionName: "监管部门",
      },
    }

    const user = mockUsers[token] || users.find((u) => u.username === token.split("-")[0])
    if (!user) {
      return NextResponse.json({ code: 401, message: "无效的token", data: null }, { status: 401 })
    }

    return NextResponse.json({
      code: 200,
      message: "success",
      data: user,
    })
  } catch (error) {
    console.error("[v0] Current user error:", error)
    return NextResponse.json({ code: 500, message: "服务器错误", data: null }, { status: 500 })
  }
}
